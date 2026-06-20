import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediaAsset } from "@/types/admin";
import type { Database } from "@/src/types/database";
import { assertNoError } from "@/src/repositories/helpers";

function parseFileName(url: string): string {
  try {
    const parsed = new URL(url);
    const segment = parsed.pathname.split("/").filter(Boolean).at(-1);

    return decodeURIComponent(segment ?? "image");
  } catch {
    return "image";
  }
}

function parseCloudinaryPublicId(url: string): string | undefined {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match?.[1];
}

function toMediaAsset(args: {
  id: string;
  url: string;
  uploadedAt: string;
  source: string;
}): MediaAsset {
  return {
    id: `${args.source}-${args.id}`,
    fileName: parseFileName(args.url),
    url: args.url,
    width: 0,
    height: 0,
    sizeKb: 0,
    type: "image",
    uploadedAt: args.uploadedAt,
    publicId: parseCloudinaryPublicId(args.url),
  };
}

export class MediaRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async getMediaAssets(): Promise<MediaAsset[]> {
    const [productImagesResult, bannersResult, categoriesResult] = await Promise.all([
      this.client.from("product_images").select("id, image_url, created_at"),
      this.client.from("banners").select("id, image_url, created_at"),
      this.client.from("categories").select("id, banner_image_url, updated_at"),
    ]);

    assertNoError(productImagesResult.error, "Failed to fetch product media", "MEDIA_PRODUCT_FETCH_FAILED");
    assertNoError(bannersResult.error, "Failed to fetch banner media", "MEDIA_BANNER_FETCH_FAILED");
    assertNoError(categoriesResult.error, "Failed to fetch category media", "MEDIA_CATEGORY_FETCH_FAILED");

    const productMedia = (productImagesResult.data ?? []).map((item) =>
      toMediaAsset({
        id: item.id,
        url: item.image_url,
        uploadedAt: item.created_at,
        source: "product",
      }),
    );

    const bannerMedia = (bannersResult.data ?? [])
      .filter((item) => item.image_url)
      .map((item) =>
        toMediaAsset({
          id: item.id,
          url: item.image_url as string,
          uploadedAt: item.created_at,
          source: "banner",
        }),
      );

    const categoryMedia = (categoriesResult.data ?? [])
      .filter((item) => item.banner_image_url)
      .map((item) =>
        toMediaAsset({
          id: item.id,
          url: item.banner_image_url as string,
          uploadedAt: item.updated_at,
          source: "category",
        }),
      );

    const dedupedByUrl = new Map<string, MediaAsset>();
    for (const asset of [...productMedia, ...bannerMedia, ...categoryMedia]) {
      const existing = dedupedByUrl.get(asset.url);
      if (!existing || new Date(asset.uploadedAt).getTime() > new Date(existing.uploadedAt).getTime()) {
        dedupedByUrl.set(asset.url, asset);
      }
    }

    return Array.from(dedupedByUrl.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  }
}
