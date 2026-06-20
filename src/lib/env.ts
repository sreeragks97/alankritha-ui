export interface PublicEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset?: string;
}

export interface ServerEnv {
  public: PublicEnv;
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    cloudinaryCloudName: requireEnv(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    ),
    cloudinaryUploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  };
}

export function getServerEnv(): ServerEnv {
  return {
    public: getPublicEnv(),
  };
}
