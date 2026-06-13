import { SectionHeader } from "@/components/common/SectionHeader";
import { products } from "@/lib/data";

export default function LookbookPage() {
  return (
    <div className="container-shell py-8 sm:py-10 md:py-12">
      <SectionHeader
        title="Lookbook"
        subtitle="Editorial inspirations from bridal ceremonies, festive evenings, and everyday luxury."
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {products.slice(0, 9).map((product, index) => (
          <article key={product.id} className="card-luxury overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
            <div
              className={`aspect-[3/4] bg-cover bg-center transition-transform duration-500 hover:scale-[1.03] ${index % 2 === 0 ? "sm:aspect-[4/5]" : "sm:aspect-[3/4]"}`}
              style={{ backgroundImage: `url(${product.images[0]})` }}
            />
            <div className="p-3 sm:p-4.5">
              <p className="line-clamp-2 font-heading text-[clamp(1rem,3.8vw,1.5rem)] leading-tight">{product.name}</p>
              <p className="mt-1.5 text-xs text-[var(--brand-muted)] sm:text-sm">Style code: {product.code}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
