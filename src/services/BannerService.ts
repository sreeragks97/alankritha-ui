import type { SupabaseClient } from "@supabase/supabase-js";
import { BannerRepository } from "@/src/repositories/BannerRepository";
import type { Banner, Database } from "@/src/types/database";
import { bannerSchema, bannerUpdateSchema, type BannerInput, type BannerUpdateInput } from "@/src/validators/BannerSchema";

export class BannerService {
  private readonly repository: BannerRepository;

  constructor(repository: BannerRepository) {
    this.repository = repository;
  }

  static fromClient(client: SupabaseClient<Database>) {
    return new BannerService(new BannerRepository(client));
  }

  async getActiveBanners(): Promise<Banner[]> {
    return this.repository.getActiveBanners();
  }

  async getBanners(): Promise<Banner[]> {
    return this.repository.getBanners();
  }

  async createBanner(input: BannerInput): Promise<Banner> {
    const parsed = bannerSchema.parse(input);
    return this.repository.createBanner(parsed);
  }

  async updateBanner(id: string, input: BannerUpdateInput): Promise<Banner> {
    const parsed = bannerUpdateSchema.parse(input);
    return this.repository.updateBanner(id, parsed);
  }

  async deleteBanner(id: string): Promise<void> {
    await this.repository.deleteBanner(id);
  }

  async reorderBanners(order: Array<{ id: string; sort_order: number }>): Promise<void> {
    await this.repository.reorderBanners(order);
  }
}
