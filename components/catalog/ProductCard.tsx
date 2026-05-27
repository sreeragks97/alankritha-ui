import Link from "next/link";
import { formatCurrency, generateWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productLink = `https://example.com/product/${product.slug}`;
  const whatsappHref = generateWhatsAppUrl({
    productName: product.name,
    productCode: product.code,
    price: product.price,
    productLink,
  });

  return (
    <article className="card-luxury group overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <div
        className="aspect-[4/5] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${product.images[0]})` }}
      />
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-heading text-xl leading-tight">{product.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--brand-muted)]">Code: {product.code}</p>
        </div>
        <p className="text-base font-semibold text-[var(--brand-gold-deep)]">{formatCurrency(product.price)}</p>
        <div className="flex gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 rounded-full border border-[var(--brand-gold)] px-4 py-2 text-center text-sm font-semibold text-[var(--brand-gold-deep)]"
          >
            View Details
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-full bg-[#1FAF5D] px-4 py-2 text-center text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
