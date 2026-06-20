import type { SupabaseClient } from "@supabase/supabase-js";
import { CategoryRepository } from "@/src/repositories/CategoryRepository";
import type { Category, Database } from "@/src/types/database";
import { AppError } from "@/src/utils/AppError";
import {
  categorySchema,
  categoryUpdateSchema,
  type CategoryInput,
  type CategoryUpdateInput,
} from "@/src/validators/CategorySchema";

export class CategoryService {
  private readonly repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  static fromClient(client: SupabaseClient<Database>) {
    return new CategoryService(new CategoryRepository(client));
  }

  async getCategories(options?: { activeOnly?: boolean }): Promise<Category[]> {
    return this.repository.getCategories({ activeOnly: options?.activeOnly ?? false });
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return this.repository.getCategoryBySlug(slug, { activeOnly: true });
  }

  async createCategory(input: CategoryInput): Promise<Category> {
    const parsed = categorySchema.parse(input);

    const exists = await this.repository.slugExists(parsed.slug);
    if (exists) {
      throw new AppError("Category slug already exists", {
        code: "CATEGORY_SLUG_EXISTS",
        status: 409,
      });
    }

    return this.repository.createCategory(parsed);
  }

  async updateCategory(id: string, input: CategoryUpdateInput): Promise<Category> {
    const parsed = categoryUpdateSchema.parse(input);

    if (parsed.slug) {
      const exists = await this.repository.slugExists(parsed.slug, id);
      if (exists) {
        throw new AppError("Category slug already exists", {
          code: "CATEGORY_SLUG_EXISTS",
          status: 409,
        });
      }
    }

    return this.repository.updateCategory(id, parsed);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.repository.deleteCategory(id);
  }

  async toggleActive(id: string, active: boolean): Promise<Category> {
    return this.repository.toggleActive(id, active);
  }
}
