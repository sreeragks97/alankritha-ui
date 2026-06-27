import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductGallery } from "@/components/product/ProductGallery";
import { formatCurrency, generateLeadRedirectUrl } from "@/lib/whatsapp";
import { getServerServices } from "@/src/services/server";
import { mapProductToUiProduct } from "@/src/utils/uiMappers";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");

  const { productService } = await getServerServices();
  const productRow = await productService.getProductBySlug(slug);

  if (!productRow) {
    notFound();
  }

  const product = mapProductToUiProduct(productRow);
  const productLink = `${protocol}://${host}/product/${product.slug}`;

  const relatedRows = productRow.category?.slug
    ? await productService.getProductsByCategory(productRow.category.slug, 1, 20)
    : { items: [] };

  const related = relatedRows.items
    .filter((item) => item.id !== productRow.id)
    .slice(0, 4)
    .map(mapProductToUiProduct);

  const whatsappHref = generateLeadRedirectUrl({
    productId: product.id,
    productName: product.name,
    productCode: product.code,
    price: product.price,
    productSlug: product.slug,
    source: "product-detail",
  });

  return (
    <div className="container-shell py-8 sm:py-10 md:py-12">
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="card-luxury h-fit space-y-5 p-5 sm:p-7 md:p-8">
          <div>
            <span className="eyebrow-chip">{product.category.replace("-", " ")}</span>
            <h1 className="mt-3 font-heading text-[clamp(1.65rem,6.4vw,2.25rem)] leading-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-[var(--brand-muted)]">Code: {product.code}</p>
          </div>

          <p className="text-[clamp(1.5rem,6vw,1.9rem)] font-semibold text-[var(--brand-gold-deep)]">{formatCurrency(product.price)}</p>

          <p className="text-sm leading-6 text-[var(--brand-muted)] sm:leading-7">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#f3e9d5] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#745931]">
                {tag}
              </span>
            ))}
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#1FAF5D] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(31,175,93,0.28)] hover:bg-[#18964f]"
          >
            Enquire on WhatsApp
          </a>

          <div className="rounded-2xl border border-[#e6d8bd] bg-[#f9f3e6] p-4 text-sm leading-7 text-[#5e503c]">
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
            Product Link: {productLink}
          </div>
        </div>
      </div>

      <section className="mt-12 section-shell-tight sm:mt-16">
        <SectionHeader title="Related Products" subtitle="You may also love these designs." />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
