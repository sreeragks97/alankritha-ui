import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TableInsert, WhatsAppLead } from "@/src/types/database";
import { assertNoError, normalizeCount } from "@/src/repositories/helpers";
import { toPaginatedResult } from "@/src/utils/pagination";

export interface LeadQueryOptions {
  page?: number;
  limit?: number;
}

export interface LeadWithProduct extends WhatsAppLead {
  product: {
    id: string;
    name: string;
    code: string;
    slug: string;
  } | null;
}

export class LeadRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async createLead(payload: TableInsert<"whatsapp_leads">): Promise<void> {
    const { error } = await this.client.from("whatsapp_leads").insert(payload);
    assertNoError(error, "Failed to create lead", "LEAD_CREATE_FAILED");
  }

  async getLeads(options?: LeadQueryOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.client
      .from("whatsapp_leads")
      .select("*, product:products(id,name,code,slug)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    assertNoError(error, "Failed to fetch leads", "LEAD_LIST_FAILED");

    return toPaginatedResult((data ?? []) as LeadWithProduct[], normalizeCount(count), page, limit);
  }
}
