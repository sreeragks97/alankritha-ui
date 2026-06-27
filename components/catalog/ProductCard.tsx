import Link from "next/link";
import { OptimizedImage } from "@/components/ui/image";
import { PriceTag } from "@/components/catalog/PriceTag";
import { generateLeadRedirectUrl } from "@/lib/whatsapp";
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
    offerPrice: product.offerPrice,
    productSlug: product.slug,
    source: "product-card",
  });

  return (
    <article className="card-luxury group flex h-full flex-col overflow-hidden border-[color:color-mix(in_srgb,var(--brand-gold)_24%,#fff_76%)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
      <div className="relative overflow-hidden">
        {product.offerLabel ? (
          <span className="absolute left-2 top-2 z-20 rounded-full bg-[var(--brand-gold)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_6px_14px_rgba(176,139,70,0.35)]">
            {product.offerLabel}
          </span>
        ) : null}
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
        <PriceTag price={product.price} offerPrice={product.offerPrice} size="sm" />
        <div className="mt-auto flex items-stretch gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[var(--brand-gold)] px-3 py-2 text-center text-xs font-semibold text-[var(--brand-gold-deep)] hover:bg-[rgba(176,139,70,0.1)] sm:text-sm"
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1FAF5D] text-white shadow-[0_10px_18px_rgba(31,175,93,0.22)] transition-colors hover:bg-[#18964f]"
            aria-label={`Enquire ${product.name} on WhatsApp`}
            title="Enquire on WhatsApp"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.21.85 5.75 2.39a8.08 8.08 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.13 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.07 8.07 0 0 1-1.24-4.29c0-4.48 3.65-8.12 8.12-8.12Zm-2.55 3.6c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.47-.4-.4-.55-.41-.14-.01-.3-.01-.46-.01Z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
