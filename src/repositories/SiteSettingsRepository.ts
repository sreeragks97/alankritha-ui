import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SiteSettings, TableUpdate } from "@/src/types/database";
import { assertNoError } from "@/src/repositories/helpers";

const SETTINGS_ID = 1;

export class SiteSettingsRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async getSettings(): Promise<SiteSettings | null> {
    const { data, error } = await this.client
      .from("site_settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();

    assertNoError(error, "Failed to fetch site settings", "SITE_SETTINGS_FETCH_FAILED");

    return data;
  }

  async upsertSettings(payload: TableUpdate<"site_settings">): Promise<SiteSettings> {
    const { data, error } = await this.client
      .from("site_settings")
      .upsert(
        { ...payload, id: SETTINGS_ID, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      )
      .select("*")
      .single();

    assertNoError(error, "Failed to update site settings", "SITE_SETTINGS_UPDATE_FAILED");

    if (!data) {
      throw new Error("Failed to update site settings");
    }

    return data;
  }
}
