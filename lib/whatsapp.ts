import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/utils/currency";

interface WhatsAppOptions {
  productName: string;
  productCode: string;
  price: number;
  offerPrice?: number | null;
  productLink: string;
  phone?: string;
}

interface LeadRedirectOptions {
  productId: string;
  productName: string;
  productCode: string;
  price: number;
  offerPrice?: number | null;
  productSlug: string;
  source?: string;
  phone?: string;
}

export { formatCurrency };

export function generateWhatsAppMessage(options: WhatsAppOptions): string {
  const onOffer = typeof options.offerPrice === "number";
  const priceLine = onOffer
    ? `Price: ${formatCurrency(options.offerPrice as number)} (was ${formatCurrency(options.price)})`
    : `Price: ${formatCurrency(options.price)}`;

  return `Hi, I am interested in:\n\nProduct: ${options.productName}\nCode: ${options.productCode}\n${priceLine}\n\nProduct Link: ${options.productLink}`;
}

export function generateWhatsAppUrl(options: WhatsAppOptions): string {
  const phone = options.phone ?? BRAND.whatsappNumber;
  const text = generateWhatsAppMessage(options);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function generateLeadRedirectUrl(options: LeadRedirectOptions): string {
  const params = new URLSearchParams();

  params.set("productId", options.productId);
  params.set("productName", options.productName);
  params.set("productCode", options.productCode);
  params.set("price", String(options.price));
  params.set("productSlug", options.productSlug);

  if (typeof options.offerPrice === "number") {
    params.set("offerPrice", String(options.offerPrice));
  }

  if (options.source) {
    params.set("source", options.source);
  }

  if (options.phone) {
    params.set("phone", options.phone);
  }

  return `/api/whatsapp/redirect?${params.toString()}`;
}
