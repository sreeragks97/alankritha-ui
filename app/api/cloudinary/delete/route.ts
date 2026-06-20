import { createHash } from "crypto";
import { NextResponse } from "next/server";

interface DeleteImageBody {
  publicId?: string;
}

function signCloudinaryDestroy(paramsToSign: string, apiSecret: string): string {
  return createHash("sha1").update(`${paramsToSign}${apiSecret}`).digest("hex");
}

export async function POST(request: Request) {
  const body = (await request.json()) as DeleteImageBody;
  const publicId = body.publicId?.trim();

  if (!publicId) {
    return NextResponse.json({ error: "publicId is required" }, { status: 400 });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error: "Cloudinary delete is not configured",
      },
      { status: 500 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
  const signature = signCloudinaryDestroy(paramsToSign, apiSecret);

  const formData = new URLSearchParams();
  formData.set("public_id", publicId);
  formData.set("timestamp", String(timestamp));
  formData.set("api_key", apiKey);
  formData.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();

    return NextResponse.json(
      {
        error: "Cloudinary delete failed",
        details: errorBody,
      },
      { status: 502 },
    );
  }

  const payload = await response.json();
  return NextResponse.json(payload);
}
