import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductGallery } from "@/components/product/ProductGallery";
import { formatCurrency, generateWhatsAppUrl } from "@/lib/whatsapp";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const whatsappHref = generateWhatsAppUrl({
    productName: product.name,
    productCode: product.code,
    price: product.price,
    productLink: `https://example.com/product/${product.slug}`,
  });

  const related = getRelatedProducts(product);

  return (
    <div className="container-shell py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="card-luxury h-fit space-y-5 p-6 sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--brand-muted)]">{product.category.replace("-", " ")}</p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-[var(--brand-muted)]">Code: {product.code}</p>
          </div>

          <p className="text-2xl font-semibold text-[var(--brand-gold-deep)]">{formatCurrency(product.price)}</p>

          <p className="text-sm leading-7 text-[var(--brand-muted)]">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#f3e9d5] px-3 py-1 text-xs text-[#745931]">
                {tag}
              </span>
            ))}
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#1FAF5D] px-6 py-3 text-sm font-semibold text-white"
          >
            Enquire on WhatsApp
          </a>

          <div className="rounded-2xl bg-[#f9f3e6] p-4 text-sm text-[#5e503c]">
            Hi, I am interested in:
            <br />
            <br />
            Product: {product.name}
            <br />
            Code: {product.code}
            <br />
            Price: {formatCurrency(product.price)}
            <br />
            <br />
            Product Link: https://example.com/product/{product.slug}
          </div>
        </div>
      </div>

      <section className="mt-16">
        <SectionHeader title="Related Products" subtitle="You may also love these designs." />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
