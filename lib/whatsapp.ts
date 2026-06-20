import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/utils/currency";

interface WhatsAppOptions {
  productName: string;
  productCode: string;
  price: number;
  productLink: string;
  phone?: string;
}

interface LeadRedirectOptions {
  productId: string;
  productName: string;
  productCode: string;
  price: number;
  productSlug: string;
  source?: string;
  phone?: string;
}

export { formatCurrency };

export function generateWhatsAppMessage(options: WhatsAppOptions): string {
  return `Hi, I am interested in:\n\nProduct: ${options.productName}\nCode: ${options.productCode}\nPrice: ${formatCurrency(options.price)}\n\nProduct Link: ${options.productLink}`;
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

  if (options.source) {
    params.set("source", options.source);
  }

  if (options.phone) {
    params.set("phone", options.phone);
  }

  return `/api/whatsapp/redirect?${params.toString()}`;
}
