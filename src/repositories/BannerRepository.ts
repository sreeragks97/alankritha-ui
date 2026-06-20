import type { SupabaseClient } from "@supabase/supabase-js";
import type { Banner, Database, TableInsert, TableUpdate } from "@/src/types/database";
import { assertNoError } from "@/src/repositories/helpers";

export class BannerRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async getActiveBanners(): Promise<Banner[]> {
    const { data, error } = await this.client
      .from("banners")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    assertNoError(error, "Failed to fetch active banners", "BANNER_LIST_FAILED");

    return data ?? [];
  }

  async getBanners(): Promise<Banner[]> {
    const { data, error } = await this.client.from("banners").select("*").order("sort_order", { ascending: true });
    assertNoError(error, "Failed to fetch banners", "BANNER_LIST_FAILED");

    return data ?? [];
  }

  async createBanner(payload: TableInsert<"banners">): Promise<Banner> {
    const { data, error } = await this.client.from("banners").insert(payload).select("*").single();
    assertNoError(error, "Failed to create banner", "BANNER_CREATE_FAILED");

    if (!data) {
      throw new Error("Failed to create banner");
    }

    return data;
  }

  async updateBanner(id: string, payload: TableUpdate<"banners">): Promise<Banner> {
    const { data, error } = await this.client.from("banners").update(payload).eq("id", id).select("*").single();
    assertNoError(error, "Failed to update banner", "BANNER_UPDATE_FAILED");

    if (!data) {
      throw new Error("Failed to update banner");
    }

    return data;
  }

  async deleteBanner(id: string): Promise<void> {
    const { error } = await this.client.from("banners").delete().eq("id", id);
    assertNoError(error, "Failed to delete banner", "BANNER_DELETE_FAILED");
  }

  async reorderBanners(order: Array<{ id: string; sort_order: number }>): Promise<void> {
    for (const item of order) {
      const { error } = await this.client.from("banners").update({ sort_order: item.sort_order }).eq("id", item.id);
      assertNoError(error, "Failed to reorder banners", "BANNER_REORDER_FAILED");
    }
  }
}
