import { getPublicEnv } from "@/src/lib/env";
import { AppError } from "@/src/utils/AppError";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  bytes?: number;
  original_filename?: string;
  format?: string;
  created_at?: string;
}

function assertUploadResult(payload: Partial<CloudinaryUploadResult>): asserts payload is CloudinaryUploadResult {
  if (!payload.secure_url || !payload.public_id) {
    throw new AppError("Cloudinary upload response is invalid", {
      code: "CLOUDINARY_UPLOAD_INVALID_RESPONSE",
      status: 502,
      cause: payload,
    });
  }
}

export class CloudinaryService {
  async uploadImage(file: File, onProgress?: (percentage: number) => void): Promise<CloudinaryUploadResult> {
    const env = getPublicEnv();

    if (!env.cloudinaryUploadPreset) {
      throw new AppError("Cloudinary upload preset is missing", {
        code: "CLOUDINARY_UPLOAD_PRESET_MISSING",
        status: 500,
      });
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", env.cloudinaryUploadPreset);

    const endpoint = `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`;

    const xhrResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", endpoint);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          onProgress(percentage);
        }
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(
            new AppError("Cloudinary upload failed", {
              code: "CLOUDINARY_UPLOAD_FAILED",
              status: xhr.status,
              cause: xhr.responseText,
            }),
          );
          return;
        }

        const parsed = JSON.parse(xhr.responseText) as Partial<CloudinaryUploadResult>;
        assertUploadResult(parsed);

        console.info("[ProductImageDebug] Cloudinary upload response", {
          secureUrl: parsed.secure_url,
          publicId: parsed.public_id,
          bytes: parsed.bytes,
        });

        resolve(parsed);
      };

      xhr.onerror = () => {
        reject(
          new AppError("Cloudinary upload failed", {
            code: "CLOUDINARY_UPLOAD_FAILED",
            status: 500,
          }),
        );
      };

      xhr.send(formData);
    });

    return xhrResult;
  }

  async deleteImage(publicId: string): Promise<void> {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new AppError("Cloudinary delete failed", {
        code: "CLOUDINARY_DELETE_FAILED",
        status: response.status,
      });
    }

    console.info("[ProductImageDebug] Cloudinary image deleted", {
      publicId,
    });
  }
}
