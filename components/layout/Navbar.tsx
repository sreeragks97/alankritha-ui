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
    <header className="sticky top-0 z-30 border-b border-[color:color-mix(in_srgb,var(--brand-gold)_22%,#fff_78%)] bg-[color:rgba(249,246,239,0.86)] backdrop-blur-xl">
      <div className="container-shell flex h-[74px] items-center gap-2 py-3 md:gap-5">
        <MobileMenu categories={categories} />
        <Link href="/" className="min-w-fit font-heading text-[1.5rem] tracking-[0.09em] text-[var(--brand-ink)] sm:text-[1.6rem]">
          ALANKRITHA
        </Link>
        <nav className="ml-3 hidden items-center gap-5 text-sm text-[#5f5340] lg:flex">
          <Link className="gold-link" href="/lookbook">
            Lookbook
          </Link>
          <Link className="gold-link" href="/about">
            About
          </Link>
          <Link className="gold-link" href="/contact">
            Contact
          </Link>
        </nav>
        <form action="/category/necklaces" className="hidden flex-1 md:block md:pl-2 lg:pl-5">
          <SearchBar className="w-full" />
        </form>
        <div className="hidden items-center gap-2 md:flex lg:gap-3">
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-full border border-[color:color-mix(in_srgb,var(--brand-gold)_42%,#fff_58%)] bg-white/85 px-4 py-2 text-sm font-medium text-[#6c5631] shadow-[0_8px_20px_rgba(35,29,22,0.08)]">
              Categories
            </summary>
            <div className="card-luxury absolute right-0 mt-2 w-56 p-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  className="block rounded-lg px-3 py-2 text-sm text-[#4f4434] hover:bg-[#f8f1e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cfb57d]"
                  href={`/category/${category.slug}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </details>
          <a
            href={`https://wa.me/${BRAND.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(176,139,70,0.3)] hover:-translate-y-0.5 hover:bg-[var(--brand-gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
