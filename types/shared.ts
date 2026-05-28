export interface ProductImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  avatarUrl?: string;
}
