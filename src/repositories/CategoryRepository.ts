import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TableInsert, TableUpdate, Category } from "@/src/types/database";
import { assertNoError } from "@/src/repositories/helpers";

export class CategoryRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async getCategories(options?: { activeOnly?: boolean }): Promise<Category[]> {
    let query = this.client.from("categories").select("*").order("name", { ascending: true });

    if (options?.activeOnly) {
      query = query.eq("active", true);
    }

    const { data, error } = await query;
    assertNoError(error, "Failed to fetch categories", "CATEGORY_LIST_FAILED");

    return data ?? [];
  }

  async getCategoryBySlug(slug: string, options?: { activeOnly?: boolean }): Promise<Category | null> {
    let query = this.client.from("categories").select("*").eq("slug", slug).limit(1);

    if (options?.activeOnly) {
      query = query.eq("active", true);
    }

    const { data, error } = await query.maybeSingle();
    assertNoError(error, "Failed to fetch category", "CATEGORY_FETCH_FAILED", 404);

    return data;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await this.client.from("categories").select("*").eq("id", id).maybeSingle();
    assertNoError(error, "Failed to fetch category", "CATEGORY_FETCH_FAILED", 404);

    return data;
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    let query = this.client.from("categories").select("id").eq("slug", slug).limit(1);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;
    assertNoError(error, "Failed to validate category slug", "CATEGORY_SLUG_CHECK_FAILED");

    return Boolean(data?.length);
  }

  async createCategory(payload: TableInsert<"categories">): Promise<Category> {
    const { data, error } = await this.client.from("categories").insert(payload).select("*").single();
    assertNoError(error, "Failed to create category", "CATEGORY_CREATE_FAILED");

    if (!data) {
      throw new Error("Failed to create category");
    }

    return data;
  }

  async updateCategory(id: string, payload: TableUpdate<"categories">): Promise<Category> {
    const { data, error } = await this.client
      .from("categories")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    assertNoError(error, "Failed to update category", "CATEGORY_UPDATE_FAILED");

    if (!data) {
      throw new Error("Failed to update category");
    }

    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.client.from("categories").delete().eq("id", id);
    assertNoError(error, "Failed to delete category", "CATEGORY_DELETE_FAILED");
  }

  async toggleActive(id: string, active: boolean): Promise<Category> {
    return this.updateCategory(id, { active });
  }
}
