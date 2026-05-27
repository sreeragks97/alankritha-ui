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
    <article className="card-luxury group overflow-hidden border-[color:color-mix(in_srgb,var(--brand-gold)_24%,#fff_76%)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(22,18,12,0.16),rgba(22,18,12,0.02))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div
          className="aspect-[4/5] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ backgroundImage: `url(${product.images[0]})` }}
        />
        <span className="absolute left-3 top-3 z-20 rounded-full bg-[rgba(255,249,236,0.93)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.11em] text-[#705726]">
          {product.metalType}
        </span>
      </div>
      <div className="space-y-3 p-4 sm:p-4.5">
        <div className="space-y-1.5">
          <h3 className="font-heading text-[1.3rem] leading-tight text-[#2f281d]">{product.name}</h3>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--brand-muted)]">Code: {product.code}</p>
        </div>
        <p className="text-lg font-semibold text-[var(--brand-gold-deep)]">{formatCurrency(product.price)}</p>
        <div className="flex gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 rounded-full border border-[var(--brand-gold)] px-4 py-2 text-center text-sm font-semibold text-[var(--brand-gold-deep)] hover:bg-[rgba(176,139,70,0.1)]"
          >
            View Details
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-full bg-[#1FAF5D] px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_10px_18px_rgba(31,175,93,0.22)] hover:bg-[#18964f]"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
