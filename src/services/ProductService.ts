import type { SupabaseClient } from "@supabase/supabase-js";
import { ProductRepository, type ProductQueryOptions } from "@/src/repositories/ProductRepository";
import type { Database, ProductWithRelations } from "@/src/types/database";
import { AppError } from "@/src/utils/AppError";
import {
  productQuerySchema,
  productSchema,
  productUpdateSchema,
  type ProductInput,
  type ProductUpdateInput,
} from "@/src/validators/ProductSchema";

export interface ProductListOptions extends ProductQueryOptions {
  category?: string;
}

export class ProductService {
  private readonly repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  static fromClient(client: SupabaseClient<Database>) {
    return new ProductService(new ProductRepository(client));
  }

  async getProducts(options?: ProductListOptions) {
    const safeLimit = typeof options?.limit === "number" ? Math.min(options.limit, 100) : undefined;

    const parsed = productQuerySchema.parse({
      page: options?.page,
      limit: safeLimit,
      search: options?.search,
      category: options?.category,
      active: options?.active,
      activeOnly: options?.activeOnly,
      featuredOnly: options?.featuredOnly,
    });

    return this.repository.getProducts({
      page: parsed.page,
      limit: parsed.limit,
      search: parsed.search,
      categorySlug: parsed.category,
      active: parsed.active,
      activeOnly: parsed.activeOnly,
      featuredOnly: parsed.featuredOnly,
    });
  }

  async getFeaturedProducts(limit = 8) {
    return this.repository.getFeaturedProducts(limit);
  }

  async getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
    return this.repository.getProductBySlug(slug, { activeOnly: true });
  }

  async getProductById(id: string): Promise<ProductWithRelations | null> {
    return this.repository.getProductById(id);
  }

  async getProductsByCategory(slug: string, page = 1, limit = 12) {
    return this.repository.getProductsByCategory(slug, page, limit);
  }

  async searchProducts(term: string, page = 1, limit = 12) {
    return this.repository.getProducts({
      page,
      limit,
      search: term,
      activeOnly: true,
    });
  }

  async createProduct(input: ProductInput) {
    const parsed = productSchema.parse(input);

    const [slugExists, codeExists] = await Promise.all([
      this.repository.slugExists(parsed.slug),
      this.repository.codeExists(parsed.code),
    ]);

    if (slugExists) {
      throw new AppError("Product slug already exists", {
        code: "PRODUCT_SLUG_EXISTS",
        status: 409,
      });
    }

    if (codeExists) {
      throw new AppError("Product code already exists", {
        code: "PRODUCT_CODE_EXISTS",
        status: 409,
      });
    }

    return this.repository.createProduct(parsed);
  }

  async updateProduct(id: string, input: ProductUpdateInput) {
    const parsed = productUpdateSchema.parse(input);

    if (parsed.slug) {
      const slugExists = await this.repository.slugExists(parsed.slug, id);
      if (slugExists) {
        throw new AppError("Product slug already exists", {
          code: "PRODUCT_SLUG_EXISTS",
          status: 409,
        });
      }
    }

    if (parsed.code) {
      const codeExists = await this.repository.codeExists(parsed.code, id);
      if (codeExists) {
        throw new AppError("Product code already exists", {
          code: "PRODUCT_CODE_EXISTS",
          status: 409,
        });
      }
    }

    return this.repository.updateProduct(id, parsed);
  }

  async deleteProduct(id: string) {
    await this.repository.deleteProduct(id);
  }

  async toggleFeatured(id: string, featured: boolean) {
    return this.repository.updateProduct(id, { featured });
  }

  async toggleActive(id: string, active: boolean) {
    return this.repository.updateProduct(id, { active });
  }

  async toggleSoldOut(id: string, soldOut: boolean) {
    return this.repository.updateProduct(id, { sold_out: soldOut });
  }
}
