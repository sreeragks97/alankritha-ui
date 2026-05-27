import { SectionHeader } from "@/components/common/SectionHeader";
import { products } from "@/lib/data";

export default function LookbookPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <SectionHeader
        title="Lookbook"
        subtitle="Editorial inspirations from bridal ceremonies, festive evenings, and everyday luxury."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 9).map((product, index) => (
          <article key={product.id} className="card-luxury overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
            <div
              className={`aspect-[3/4] bg-cover bg-center transition-transform duration-500 hover:scale-[1.03] ${index % 2 === 0 ? "sm:aspect-[4/5]" : "sm:aspect-[3/4]"}`}
              style={{ backgroundImage: `url(${product.images[0]})` }}
            />
            <div className="p-4 sm:p-5">
              <p className="font-heading text-2xl leading-tight">{product.name}</p>
              <p className="mt-1.5 text-sm text-[var(--brand-muted)]">Style code: {product.code}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
