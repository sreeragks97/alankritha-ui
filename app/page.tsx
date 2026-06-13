import Link from "next/link";
import { Banner } from "@/components/common/Banner";
import { OptimizedImage } from "@/components/ui/image";
import { CategoryCard } from "@/components/common/CategoryCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductCard } from "@/components/catalog/ProductCard";
import { banners, categories, products } from "@/lib/data";

export default function Home() {
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="container-shell space-y-12 py-6 sm:space-y-16 sm:py-10 md:space-y-20">
      <section className="animate-fade-up section-shell-tight">
        <Banner
          title={banners[0].title}
          subtitle={banners[0].subtitle}
          image={banners[0].image}
          ctaText={banners[0].ctaText}
          ctaHref={banners[0].ctaHref}
          priority
        />
      </section>

      <section className="section-shell-tight">
        <SectionHeader
          title="Shop By Category"
          subtitle="Curated pieces for bridal rituals, celebrations, and everyday elegance."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="section-shell-tight">
        <SectionHeader
          title="Featured Collection"
          subtitle="Our most loved heritage-inspired selections."
          actionLabel="View All"
          actionHref="/category/necklaces"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-shell-tight">
        <SectionHeader title="New Arrivals" subtitle="Freshly curated pieces for the season." />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-shell-tight">
        <Banner
          title={banners[1].title}
          subtitle={banners[1].subtitle}
          image={banners[1].image}
          ctaText={banners[1].ctaText}
          ctaHref={banners[1].ctaHref}
        />
      </section>

      <section className="card-luxury section-shell-tight px-4 py-6 sm:px-8 sm:py-8">
        <SectionHeader
          title="Instagram Reels Preview"
          subtitle="Daily styling moments and bridal inspirations from our studio."
          actionLabel="Follow"
          actionHref="/lookbook"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {["Bridal drape styling", "Temple set spotlight", "Everyday gold edit"].map((label, index) => (
            <div key={label} className="overflow-hidden rounded-2xl bg-[#efe4cd]">
              <div className="relative aspect-[3/4]">
                <OptimizedImage
                  src={products[index].images[0]}
                  alt={label}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover object-center"
                  fallbackLabel={`${label} preview unavailable`}
                />
              </div>
              <p className="p-3 text-xs text-[var(--brand-ink)] sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-luxury flex flex-col items-center gap-4 p-6 text-center sm:p-10">
        <p className="font-heading text-[clamp(1.7rem,6vw,2.25rem)] leading-tight">Need a custom bridal recommendation?</p>
        <p className="max-w-2xl text-sm leading-6 text-[var(--brand-muted)] sm:leading-7 sm:text-base">
          Share your wedding style, saree palette, and budget on WhatsApp. Our team will suggest curated sets.
        </p>
        <Link
          href="https://wa.me/919876543210"
          target="_blank"
          className="inline-flex min-h-11 items-center rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(176,139,70,0.28)] hover:bg-[var(--brand-gold-deep)]"
        >
          Enquire on WhatsApp
        </Link>
      </section>
    </div>
  );
}
