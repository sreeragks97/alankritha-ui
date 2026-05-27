import Link from "next/link";
import { BRAND } from "@/lib/constants";
import type { Category } from "@/types/product";
import { SearchBar } from "@/components/common/SearchBar";
import { MobileMenu } from "@/components/layout/MobileMenu";

interface NavbarProps {
  categories: Category[];
}

export function Navbar({ categories }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e8dcc3] bg-[color:rgba(249,246,239,0.95)] backdrop-blur">
      <div className="container-shell flex h-[72px] items-center gap-3 py-3 md:gap-5">
        <MobileMenu categories={categories} />
        <Link href="/" className="min-w-fit font-heading text-2xl tracking-[0.06em] text-[var(--brand-ink)]">
          ALANKRITHA
        </Link>
        <form action="/category/necklaces" className="hidden flex-1 md:block">
          <SearchBar className="w-full" />
        </form>
        <div className="hidden items-center gap-3 md:flex">
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-full border border-[#d7c9ab] px-4 py-2 text-sm text-[#6c5631]">
              Categories
            </summary>
            <div className="card-luxury absolute right-0 mt-2 w-52 p-2">
              {categories.map((category) => (
                <Link key={category.id} className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f8f1e0]" href={`/category/${category.slug}`}>
                  {category.name}
                </Link>
              ))}
            </div>
          </details>
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-gold-deep)]"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
