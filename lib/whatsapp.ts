import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/utils/currency";

interface WhatsAppOptions {
  productName: string;
  productCode: string;
  price: number;
  productLink: string;
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
