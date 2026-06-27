import { getSupabaseServerClient } from "@/src/lib/supabase-server";
import { AuthService } from "@/src/services/AuthService";
import { BannerService } from "@/src/services/BannerService";
import { CategoryService } from "@/src/services/CategoryService";
import { LeadService } from "@/src/services/LeadService";
import { ProductService } from "@/src/services/ProductService";
import { SiteSettingsService } from "@/src/services/SiteSettingsService";

export async function getServerServices() {
  const client = await getSupabaseServerClient();

  return {
    authService: AuthService.fromClient(client),
    productService: ProductService.fromClient(client),
    categoryService: CategoryService.fromClient(client),
    bannerService: BannerService.fromClient(client),
    leadService: LeadService.fromClient(client),
    siteSettingsService: SiteSettingsService.fromClient(client),
  };
}
