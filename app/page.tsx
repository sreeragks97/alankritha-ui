import Link from "next/link";
import { Banner } from "@/components/common/Banner";
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
    <div className="container-shell space-y-14 py-8 sm:py-10">
      <section className="animate-fade-up">
        <Banner
          title={banners[0].title}
          subtitle={banners[0].subtitle}
          image={banners[0].image}
          ctaText={banners[0].ctaText}
          ctaHref={banners[0].ctaHref}
        />
      </section>

      <section>
        <SectionHeader
          title="Shop By Category"
          subtitle="Curated pieces for bridal rituals, celebrations, and everyday elegance."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Featured Collection"
          subtitle="Our most loved heritage-inspired selections."
          actionLabel="View All"
          actionHref="/category/necklaces"
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="New Arrivals" subtitle="Freshly curated pieces for the season." />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <Banner
          title={banners[1].title}
          subtitle={banners[1].subtitle}
          image={banners[1].image}
          ctaText={banners[1].ctaText}
          ctaHref={banners[1].ctaHref}
        />
      </section>

      <section className="card-luxury p-6 sm:p-8">
        <SectionHeader
          title="Instagram Reels Preview"
          subtitle="Daily styling moments and bridal inspirations from our studio."
          actionLabel="Follow"
          actionHref="/lookbook"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {["Bridal drape styling", "Temple set spotlight", "Everyday gold edit"].map((label, index) => (
            <div key={label} className="overflow-hidden rounded-2xl bg-[#efe4cd]">
              <div
                className="aspect-[3/4] bg-cover bg-center"
                style={{ backgroundImage: `url(${products[index].images[0]})` }}
              />
              <p className="p-3 text-sm text-[var(--brand-ink)]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-luxury flex flex-col items-center gap-4 p-8 text-center">
        <p className="font-heading text-3xl sm:text-4xl">Need a custom bridal recommendation?</p>
        <p className="max-w-2xl text-sm text-[var(--brand-muted)] sm:text-base">
          Share your wedding style, saree palette, and budget on WhatsApp. Our team will suggest curated sets.
        </p>
        <Link
          href="https://wa.me/919876543210"
          target="_blank"
          className="rounded-full bg-[var(--brand-gold)] px-6 py-3 text-sm font-semibold text-white"
        >
          Enquire on WhatsApp
        </Link>
      </section>
    </div>
  );
}
