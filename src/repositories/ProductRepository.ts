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

  private async getCategoriesByIds(ids: string[]): Promise<Record<string, Category>> {
    if (ids.length === 0) {
      return {};
    }

    const { data, error } = await this.client.from("categories").select("*").in("id", ids);
    assertNoError(error, "Failed to fetch product categories", "PRODUCT_CATEGORY_JOIN_FAILED");

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

    assertNoError(error, "Failed to fetch product images", "PRODUCT_IMAGE_JOIN_FAILED");

    return (data ?? []).reduce<Record<string, ProductImage[]>>((acc, image) => {
      if (!acc[image.product_id]) {
        acc[image.product_id] = [];
      }

      acc[image.product_id].push(image);
      return acc;
    }, {});
  }

  private async hydrateProducts(products: Product[]): Promise<ProductWithRelations[]> {
    const categoryIds = Array.from(new Set(products.map((product) => product.category_id)));
    const productIds = products.map((product) => product.id);

    const [categoriesMap, imagesMap] = await Promise.all([
      this.getCategoriesByIds(categoryIds),
      this.getImagesByProductIds(productIds),
    ]);

    return products.map((product) => ({
      ...product,
      category: categoriesMap[product.category_id] ?? null,
      images: imagesMap[product.id] ?? [],
    }));
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
    return hydrated[0] ?? null;
  }

  async getProductById(id: string): Promise<ProductWithRelations | null> {
    const { data, error } = await this.client.from("products").select("*").eq("id", id).maybeSingle();
    assertNoError(error, "Failed to fetch product", "PRODUCT_FETCH_FAILED", 404);

    if (!data) {
      return null;
    }

    const hydrated = await this.hydrateProducts([data]);
    return hydrated[0] ?? null;
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

    if (images.length > 0) {
      const { error: imageError } = await this.client.from("product_images").insert(
        images.map((image, index) => ({
          product_id: data.id,
          image_url: image.image_url,
          sort_order: image.sort_order ?? index,
        })),
      );

      assertNoError(imageError, "Failed to save product images", "PRODUCT_IMAGE_CREATE_FAILED");
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
      const { error: clearError } = await this.client.from("product_images").delete().eq("product_id", id);
      assertNoError(clearError, "Failed to reset product images", "PRODUCT_IMAGE_RESET_FAILED");

      if (images.length > 0) {
        const { error: insertError } = await this.client.from("product_images").insert(
          images.map((image, index) => ({
            product_id: id,
            image_url: image.image_url,
            sort_order: image.sort_order ?? index,
          })),
        );

        assertNoError(insertError, "Failed to update product images", "PRODUCT_IMAGE_UPDATE_FAILED");
      }
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
