export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          banner_image_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          banner_image_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          banner_image_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          code: string;
          description: string | null;
          category_id: string;
          price: number;
          offer_price: number | null;
          offer_label: string | null;
          featured: boolean;
          sold_out: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          code: string;
          description?: string | null;
          category_id: string;
          price: number;
          offer_price?: number | null;
          offer_label?: string | null;
          featured?: boolean;
          sold_out?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          code?: string;
          description?: string | null;
          category_id?: string;
          price?: number;
          offer_price?: number | null;
          offer_label?: string | null;
          featured?: boolean;
          sold_out?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          image_url: string | null;
          button_text: string | null;
          button_link: string | null;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          image_url?: string | null;
          button_text?: string | null;
          button_link?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          image_url?: string | null;
          button_text?: string | null;
          button_link?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      whatsapp_leads: {
        Row: {
          id: string;
          product_id: string | null;
          customer_name: string | null;
          phone: string | null;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          customer_name?: string | null;
          phone?: string | null;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          customer_name?: string | null;
          phone?: string | null;
          message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          phone: string | null;
          role: "admin" | "super_admin";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          phone?: string | null;
          role: "admin" | "super_admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          phone?: string | null;
          role?: "admin" | "super_admin";
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          whatsapp_number: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          email: string | null;
          about_eyebrow: string | null;
          about_heading: string | null;
          about_body: string | null;
          contact_eyebrow: string | null;
          contact_heading: string | null;
          contact_body: string | null;
          contact_phone: string | null;
          contact_address: string | null;
          catalogue_heading: string | null;
          catalogue_subheading: string | null;
          offer_badge_label: string | null;
          footer_description: string | null;
          footer_tagline: string | null;
          filter_search_enabled: boolean;
          filter_sort_enabled: boolean;
          filter_category_enabled: boolean;
          filter_price_enabled: boolean;
          filter_metal_enabled: boolean;
          filter_occasion_enabled: boolean;
          filter_tag_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          id?: number;
          whatsapp_number?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          email?: string | null;
          about_eyebrow?: string | null;
          about_heading?: string | null;
          about_body?: string | null;
          contact_eyebrow?: string | null;
          contact_heading?: string | null;
          contact_body?: string | null;
          contact_phone?: string | null;
          contact_address?: string | null;
          catalogue_heading?: string | null;
          catalogue_subheading?: string | null;
          offer_badge_label?: string | null;
          footer_description?: string | null;
          footer_tagline?: string | null;
          filter_search_enabled?: boolean;
          filter_sort_enabled?: boolean;
          filter_category_enabled?: boolean;
          filter_price_enabled?: boolean;
          filter_metal_enabled?: boolean;
          filter_occasion_enabled?: boolean;
          filter_tag_enabled?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: number;
          whatsapp_number?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          email?: string | null;
          about_eyebrow?: string | null;
          about_heading?: string | null;
          about_body?: string | null;
          contact_eyebrow?: string | null;
          contact_heading?: string | null;
          contact_body?: string | null;
          contact_phone?: string | null;
          contact_address?: string | null;
          catalogue_heading?: string | null;
          catalogue_subheading?: string | null;
          offer_badge_label?: string | null;
          footer_description?: string | null;
          footer_tagline?: string | null;
          filter_search_enabled?: boolean;
          filter_sort_enabled?: boolean;
          filter_category_enabled?: boolean;
          filter_price_enabled?: boolean;
          filter_metal_enabled?: boolean;
          filter_occasion_enabled?: boolean;
          filter_tag_enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

type TableName = keyof Database["public"]["Tables"];

export type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends TableName> = Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> = Database["public"]["Tables"][T]["Update"];

export type Category = TableRow<"categories">;
export type Product = TableRow<"products">;
export type ProductImage = TableRow<"product_images">;
export type Banner = TableRow<"banners">;
export type WhatsAppLead = TableRow<"whatsapp_leads">;
export type Profile = TableRow<"profiles">;
export type SiteSettings = TableRow<"site_settings">;

export interface ProductWithRelations extends Product {
  category: Category | null;
  images: ProductImage[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
