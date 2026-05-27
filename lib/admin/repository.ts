import productsData from "@/data/admin/products.json";
import categoriesData from "@/data/admin/categories.json";
import bannersData from "@/data/admin/banners.json";
import mediaData from "@/data/admin/media.json";
import leadsData from "@/data/admin/whatsapp-leads.json";
import settingsData from "@/data/admin/settings.json";
import type {
  AdminBanner,
  AdminCategory,
  AdminProduct,
  AdminSettings,
  MediaAsset,
  WhatsAppLead,
} from "@/types/admin";

export interface AdminRepository {
  getProducts(): Promise<AdminProduct[]>;
  getCategories(): Promise<AdminCategory[]>;
  getBanners(): Promise<AdminBanner[]>;
  getMediaAssets(): Promise<MediaAsset[]>;
  getWhatsAppLeads(): Promise<WhatsAppLead[]>;
  getSettings(): Promise<AdminSettings>;
}

class MockAdminRepository implements AdminRepository {
  async getProducts() {
    return productsData as AdminProduct[];
  }

  async getCategories() {
    return categoriesData as AdminCategory[];
  }

  async getBanners() {
    return bannersData as AdminBanner[];
  }

  async getMediaAssets() {
    return mediaData as MediaAsset[];
  }

  async getWhatsAppLeads() {
    return leadsData as WhatsAppLead[];
  }

  async getSettings() {
    return settingsData as AdminSettings;
  }
}

export const adminRepository: AdminRepository = new MockAdminRepository();
