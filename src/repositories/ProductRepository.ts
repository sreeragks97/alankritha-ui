import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Category,
  Database,
  PaginatedResult,
  Product,
  ProductImage,
  ProductWithRelations,
  TableInsert,
  TableUpdate,
} from "@/src/types/database";
import { assertNoError, normalizeCount } from "@/src/repositories/helpers";
import { toPaginatedResult } from "@/src/utils/pagination";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  active?: boolean;
  activeOnly?: boolean;
  featuredOnly?: boolean;
}

export interface ProductWritePayload extends Omit<TableInsert<"products">, "id" | "created_at" | "updated_at"> {
  images?: Array<Pick<TableInsert<"product_images">, "image_url" | "sort_order">>;
}

export interface ProductUpdatePayload extends Omit<TableUpdate<"products">, "created_at" | "updated_at"> {
  images?: Array<Pick<TableInsert<"product_images">, "image_url" | "sort_order">>;
}

export class ProductRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  private logDebug(message: string, payload?: Record<string, unknown>) {
    console.info("[ProductImageDebug]", message, payload ?? {});
  }

  private async getCategoriesByIds(ids: Array<string | null | undefined>): Promise<Record<string, Category>> {
    const uniqueIds = Array.from(
      new Set(
        ids
          .filter((id): id is string => typeof id === "string")
          .map((id) => id.trim())
          .filter((id) => id.length > 0),
      ),
    );
    const validIds = uniqueIds.filter(isUuid);

    if (validIds.length === 0) {
      if (uniqueIds.length > 0) {
        this.logDebug("Skipping category join due to invalid category ids", {
          invalidIds: uniqueIds,
        });
      }

      return {};
    }

    const { data, error } = await this.client.from("categories").select("*").in("id", validIds);

    if (error) {
      console.warn("[ProductImageDebug] Category join failed, continuing without categories", {
        message: error.message,
        code: error.code,
        details: error.details,
      });

      return {};
    }

    return (data ?? []).reduce<Record<string, Category>>((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});
  }

  private async getImagesByProductIds(productIds: string[]): Promise<Record<string, ProductImage[]>> {
    if (productIds.length === 0) {
      return {};
    }

    const { data, error } = await this.client
      .from("product_images")
      .select("*")
      .in("product_id", productIds)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("[ProductImageDebug] Product image join failed, continuing without images", {
        message: error.message,
        code: error.code,
        details: error.details,
      });

      return {};
    }

    this.logDebug("Fetched product_images rows", {
      productIdCount: productIds.length,
      imageRowCount: (data ?? []).length,
    });

    return (data ?? []).reduce<Record<string, ProductImage[]>>((acc, image) => {
      if (!acc[image.product_id]) {
        acc[image.product_id] = [];
      }

      acc[image.product_id].push(image);
      return acc;
    }, {});
  }

  private async hydrateProducts(products: Product[]): Promise<ProductWithRelations[]> {
    const categoryIds = Array.from(
      new Set(
        products
          .map((product) => product.category_id)
          .filter((categoryId): categoryId is string => typeof categoryId === "string"),
      ),
    );
    const productIds = products.map((product) => product.id);

    const [categoriesMap, imagesMap] = await Promise.all([
      this.getCategoriesByIds(categoryIds),
      this.getImagesByProductIds(productIds),
    ]);

    const hydrated = products.map((product) => {
      const categoryId = typeof product.category_id === "string" ? product.category_id : "";

      return {
        ...product,
        category: categoriesMap[categoryId] ?? null,
        images: imagesMap[product.id] ?? [],
      };
    });

    this.logDebug("Hydrated products with relations", {
      productCount: hydrated.length,
    });

    return hydrated;
  }

  private async syncProductImages(
    productId: string,
    images: Array<Pick<TableInsert<"product_images">, "image_url" | "sort_order">>,
  ): Promise<void> {
    const incomingRaw = images
      .map((image) => image.image_url.trim())
      .filter((imageUrl) => imageUrl.length > 0);

    const incomingUnique = incomingRaw.filter((imageUrl, index) => incomingRaw.indexOf(imageUrl) === index);
    const normalizedIncoming = incomingUnique.map((imageUrl, index) => ({
      image_url: imageUrl,
      sort_order: index,
    }));

    const { data: existingRows, error: existingError } = await this.client
      .from("product_images")
      .select("id, image_url, sort_order")
      .eq("product_id", productId);

    assertNoError(existingError, "Failed to fetch existing product images", "PRODUCT_IMAGE_FETCH_FOR_SYNC_FAILED");

    const existing = existingRows ?? [];
    const existingByUrl = new Map(existing.map((row) => [row.image_url, row]));
    const incomingUrlSet = new Set(normalizedIncoming.map((image) => image.image_url));

    const imageIdsToDelete = existing
      .filter((row) => !incomingUrlSet.has(row.image_url))
      .map((row) => row.id);

    if (imageIdsToDelete.length > 0) {
      const { error: deleteError } = await this.client.from("product_images").delete().in("id", imageIdsToDelete);
      assertNoError(deleteError, "Failed to delete removed product images", "PRODUCT_IMAGE_DELETE_REMOVED_FAILED");
    }

    const rowsToInsert = normalizedIncoming
      .filter((row) => !existingByUrl.has(row.image_url))
      .map((row) => ({
        product_id: productId,
        image_url: row.image_url,
        sort_order: row.sort_order,
      }));

    if (rowsToInsert.length > 0) {
      const { data: insertedRows, error: insertError } = await this.client
        .from("product_images")
        .insert(rowsToInsert)
        .select("id, image_url, sort_order, product_id");

      assertNoError(insertError, "Failed to insert new product images", "PRODUCT_IMAGE_INSERT_NEW_FAILED");

      this.logDebug("Supabase insert result for product_images", {
        productId,
        insertedRows,
      });
    }

    const rowsToReorder = normalizedIncoming.filter((row) => {
      const existingRow = existingByUrl.get(row.image_url);
      return Boolean(existingRow) && existingRow?.sort_order !== row.sort_order;
    });

    if (rowsToReorder.length > 0) {
      await Promise.all(
        rowsToReorder.map(async (row) => {
          const existingRow = existingByUrl.get(row.image_url);

          if (!existingRow) return;

          const { error: reorderError } = await this.client
            .from("product_images")
            .update({ sort_order: row.sort_order })
            .eq("id", existingRow.id);

          assertNoError(reorderError, "Failed to reorder product image", "PRODUCT_IMAGE_REORDER_FAILED");
        }),
      );
    }

    this.logDebug("Synced product_images for product", {
      productId,
      incomingImageCount: normalizedIncoming.length,
      deletedCount: imageIdsToDelete.length,
      insertedCount: rowsToInsert.length,
      reorderedCount: rowsToReorder.length,
    });
  }

  private async getCategoryIdBySlug(slug: string): Promise<string | null> {
    const { data, error } = await this.client
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    assertNoError(error, "Failed to find category", "CATEGORY_LOOKUP_FAILED", 404);

    return data?.id ?? null;
  }

  async getProducts(options?: ProductQueryOptions): Promise<PaginatedResult<ProductWithRelations>> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let categoryId: string | null = null;
    if (options?.categorySlug) {
      categoryId = await this.getCategoryIdBySlug(options.categorySlug);
      if (!categoryId) {
        return toPaginatedResult([], 0, page, limit);
      }
    }

    let query = this.client
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (typeof options?.active === "boolean") {
      query = query.eq("active", options.active);
    } else if (options?.activeOnly) {
      query = query.eq("active", true);
    }

    if (options?.featuredOnly) {
      query = query.eq("featured", true);
    }

    if (options?.search && options.search.trim().length > 0) {
      const q = options.search.trim();
      query = query.or(`name.ilike.%${q}%,code.ilike.%${q}%,slug.ilike.%${q}%`);
    }

    const { data, error, count } = await query;
    assertNoError(error, "Failed to fetch products", "PRODUCT_LIST_FAILED");

    this.logDebug("Product fetch result", {
      page,
      limit,
      totalCount: normalizeCount(count),
      fetchedRows: (data ?? []).length,
    });

    const hydrated = await this.hydrateProducts(data ?? []);
    return toPaginatedResult(hydrated, normalizeCount(count), page, limit);
  }

  async getProductBySlug(slug: string, options?: { activeOnly?: boolean }): Promise<ProductWithRelations | null> {
    let query = this.client.from("products").select("*").eq("slug", slug).limit(1);

    if (options?.activeOnly) {
      query = query.eq("active", true);
    }

    const { data, error } = await query.maybeSingle();
    assertNoError(error, "Failed to fetch product", "PRODUCT_FETCH_FAILED", 404);

    if (!data) {
      return null;
    }

    const hydrated = await this.hydrateProducts([data]);
    this.logDebug("Product fetch result by slug", {
      slug,
      hasProduct: Boolean(hydrated[0]),
      imageCount: hydrated[0]?.images.length ?? 0,
    });
    return hydrated[0] ?? null;
  }

  async getProductById(id: string): Promise<ProductWithRelations | null> {
    const { data, error } = await this.client.from("products").select("*").eq("id", id).maybeSingle();
    assertNoError(error, "Failed to fetch product", "PRODUCT_FETCH_FAILED", 404);

    if (!data) {
      return null;
    }

    const hydrated = await this.hydrateProducts([data]);
    this.logDebug("Product fetch result by id", {
      id,
      hasProduct: Boolean(hydrated[0]),
      imageCount: hydrated[0]?.images.length ?? 0,
    });
    return hydrated[0] ?? null;
  }

  async getFeaturedProducts(limit = 8): Promise<ProductWithRelations[]> {
    const result = await this.getProducts({
      page: 1,
      limit,
      activeOnly: true,
      featuredOnly: true,
    });

    return result.items;
  }

  async getProductsByCategory(
    categorySlug: string,
    page = 1,
    limit = 12,
  ): Promise<PaginatedResult<ProductWithRelations>> {
    return this.getProducts({
      page,
      limit,
      categorySlug,
      activeOnly: true,
    });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    let query = this.client.from("products").select("id").eq("slug", slug).limit(1);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;
    assertNoError(error, "Failed to validate product slug", "PRODUCT_SLUG_CHECK_FAILED");

    return Boolean(data?.length);
  }

  async codeExists(code: string, excludeId?: string): Promise<boolean> {
    let query = this.client.from("products").select("id").eq("code", code).limit(1);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;
    assertNoError(error, "Failed to validate product code", "PRODUCT_CODE_CHECK_FAILED");

    return Boolean(data?.length);
  }

  async createProduct(payload: ProductWritePayload): Promise<ProductWithRelations> {
    const { images = [], ...productPayload } = payload;

    const { data, error } = await this.client.from("products").insert(productPayload).select("*").single();
    assertNoError(error, "Failed to create product", "PRODUCT_CREATE_FAILED");

    if (!data) {
      throw new Error("Failed to create product");
    }

    this.logDebug("Supabase insert result for products", {
      productId: data.id,
      imageCount: images.length,
    });

    if (images.length > 0) {
      await this.syncProductImages(data.id, images);
    }

    const product = await this.getProductById(data.id);
    if (!product) {
      throw new Error("Created product could not be reloaded");
    }

    return product;
  }

  async updateProduct(id: string, payload: ProductUpdatePayload): Promise<ProductWithRelations> {
    const { images, ...productPayload } = payload;

    if (Object.keys(productPayload).length > 0) {
      const { error } = await this.client.from("products").update(productPayload).eq("id", id);
      assertNoError(error, "Failed to update product", "PRODUCT_UPDATE_FAILED");
    }

    if (images) {
      await this.syncProductImages(id, images);
    }

    const updated = await this.getProductById(id);
    if (!updated) {
      throw new Error("Updated product could not be reloaded");
    }

    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error: imageError } = await this.client.from("product_images").delete().eq("product_id", id);
    assertNoError(imageError, "Failed to delete product images", "PRODUCT_IMAGE_DELETE_FAILED");

    const { error } = await this.client.from("products").delete().eq("id", id);
    assertNoError(error, "Failed to delete product", "PRODUCT_DELETE_FAILED");
  }
}
