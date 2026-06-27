import Link from "next/link";
import { OptimizedImage } from "@/components/ui/image";
import { formatCurrency, generateLeadRedirectUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const whatsappHref = generateLeadRedirectUrl({
    productId: product.id,
    productName: product.name,
    productCode: product.code,
    price: product.price,
    productSlug: product.slug,
    source: "product-card",
  });

  return (
    <article className="card-luxury group flex h-full flex-col overflow-hidden border-[color:color-mix(in_srgb,var(--brand-gold)_24%,#fff_76%)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(22,18,12,0.16),rgba(22,18,12,0.02))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative aspect-[4/5] w-full">
          <OptimizedImage
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
            fallbackLabel={`${product.name} image unavailable`}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 font-heading text-[clamp(1rem,3.7vw,1.28rem)] leading-tight text-[#2f281d]">{product.name}</h3>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--brand-muted)]">Code: {product.code}</p>
        </div>
        <p className="text-base font-semibold text-[var(--brand-gold-deep)] sm:text-lg">{formatCurrency(product.price)}</p>
        <div className="mt-auto grid gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--brand-gold)] px-3 py-2 text-center text-xs font-semibold text-[var(--brand-gold-deep)] hover:bg-[rgba(176,139,70,0.1)] sm:text-sm"
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1FAF5D] px-3 py-2 text-center text-xs font-semibold text-white shadow-[0_10px_18px_rgba(31,175,93,0.22)] hover:bg-[#18964f] sm:text-sm"
            aria-label={`Enquire ${product.name} on WhatsApp`}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
