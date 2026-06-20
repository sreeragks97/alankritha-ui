import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediaAsset } from "@/types/admin";
import { MediaRepository } from "@/src/repositories/MediaRepository";
import type { Database } from "@/src/types/database";
import { CloudinaryService } from "@/src/services/CloudinaryService";

export class MediaService {
  private readonly repository: MediaRepository;
  private readonly cloudinaryService: CloudinaryService;

  constructor(repository: MediaRepository, cloudinaryService?: CloudinaryService) {
    this.repository = repository;
    this.cloudinaryService = cloudinaryService ?? new CloudinaryService();
  }

  static fromClient(client: SupabaseClient<Database>) {
    return new MediaService(new MediaRepository(client));
  }

  async getMediaAssets(): Promise<MediaAsset[]> {
    return this.repository.getMediaAssets();
  }

  async uploadImage(file: File, onProgress?: (percentage: number) => void): Promise<MediaAsset> {
    const uploaded = await this.cloudinaryService.uploadImage(file, onProgress);

    return {
      id: uploaded.public_id,
      fileName: uploaded.original_filename
        ? uploaded.format
          ? `${uploaded.original_filename}.${uploaded.format}`
          : uploaded.original_filename
        : file.name,
      url: uploaded.secure_url,
      width: uploaded.width ?? 0,
      height: uploaded.height ?? 0,
      sizeKb: uploaded.bytes ? Math.round(uploaded.bytes / 1024) : 0,
      type: "image",
      uploadedAt: uploaded.created_at ?? new Date().toISOString(),
      publicId: uploaded.public_id,
    };
  }
}
