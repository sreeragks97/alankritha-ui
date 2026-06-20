import { NextResponse, type NextRequest } from "next/server";
import { BRAND } from "@/lib/constants";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import { getServerServices } from "@/src/services/server";

function safeSlug(value: string | null): string {
  if (!value) {
    return "product";
  }

  return value.replace(/[^a-zA-Z0-9-]/g, "").trim() || "product";
}

function parsePrice(value: string | null): number {
  const parsed = Number(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildFallbackRedirect(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productName = searchParams.get("productName")?.trim() || "this product";
  const productCode = searchParams.get("productCode")?.trim() || "CODE";
  const productSlug = safeSlug(searchParams.get("productSlug"));
  const productLink = `${request.nextUrl.origin}/product/${productSlug}`;

  return generateWhatsAppUrl({
    productName,
    productCode,
    price: parsePrice(searchParams.get("price")),
    productLink,
    phone: searchParams.get("phone")?.trim() || BRAND.whatsappNumber,
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("productId")?.trim();
  const source = searchParams.get("source")?.trim() || "catalog";

  let redirectUrl = buildFallbackRedirect(request);

  if (!productId) {
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const { productService, leadService } = await getServerServices();
    const product = await productService.getProductById(productId);

    if (!product) {
      try {
        await leadService.createLead({
          product_id: null,
          message: `Lead redirect source: ${source}`,
        });
      } catch {
        // Redirect should not fail if lead insert is blocked by policy.
      }

      return NextResponse.redirect(redirectUrl);
    }

    const productLink = `${request.nextUrl.origin}/product/${product.slug}`;
    const whatsappMessage = leadService.buildWhatsAppMessage(product, productLink);

    redirectUrl = leadService.buildWhatsAppRedirect(
      searchParams.get("phone")?.trim() || BRAND.whatsappNumber,
      whatsappMessage,
    );

    try {
      await leadService.createLead({
        product_id: product.id,
        message: `${whatsappMessage}\n\nSource: ${source}`,
      });
    } catch {
      // Continue redirecting even if lead insertion fails.
    }

    return NextResponse.redirect(redirectUrl);
  } catch {
    return NextResponse.redirect(redirectUrl);
  }
}
