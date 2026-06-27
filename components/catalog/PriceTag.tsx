import { formatCurrency } from "@/utils/currency";

interface PriceTagProps {
  price: number;
  offerPrice?: number | null;
  size?: "sm" | "lg";
  className?: string;
}

const SIZES = {
  sm: { offer: "text-base sm:text-lg", regular: "text-xs sm:text-sm" },
  lg: { offer: "text-[clamp(1.5rem,6vw,1.9rem)]", regular: "text-base sm:text-lg" },
} as const;

export function PriceTag({ price, offerPrice, size = "sm", className }: PriceTagProps) {
  const styles = SIZES[size];
  const hasOffer = typeof offerPrice === "number";

  if (!hasOffer) {
    return (
      <p className={`font-semibold text-[var(--brand-gold-deep)] ${styles.offer} ${className ?? ""}`}>
        {formatCurrency(price)}
      </p>
    );
  }

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className ?? ""}`}>
      <span className={`font-semibold text-[var(--brand-gold-deep)] ${styles.offer}`}>{formatCurrency(offerPrice)}</span>
      <span className={`text-[var(--brand-muted)] line-through ${styles.regular}`}>{formatCurrency(price)}</span>
    </div>
  );
}
