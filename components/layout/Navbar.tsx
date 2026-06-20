import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { SearchBar } from "@/components/common/SearchBar";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:color-mix(in_srgb,var(--brand-gold)_22%,#fff_78%)] bg-[color:rgba(249,246,239,0.86)] backdrop-blur-xl">
      <div className="container-shell py-2.5 md:py-3">
        <div className="flex h-[var(--nav-height-mobile)] items-center gap-2 md:h-[var(--nav-height-desktop)] md:gap-5">
          <MobileMenu />

          <Link
            href="/category/bangles"
            className="min-w-0 truncate font-heading text-[clamp(1.1rem,5.2vw,1.55rem)] tracking-[0.07em] text-[var(--brand-ink)] sm:tracking-[0.09em]"
          >
            ALANKRITHA
          </Link>

          <nav className="ml-3 hidden items-center gap-5 text-sm text-[#5f5340] lg:flex">
            <Link className="gold-link" href="/category/bangles">
              Catalogue
            </Link>
            <Link className="gold-link" href="/about">
              About
            </Link>
            <Link className="gold-link" href="/contact">
              Contact
            </Link>
          </nav>

          <form action="/category/bangles" className="hidden flex-1 md:block md:pl-2 lg:pl-5">
            <SearchBar className="w-full" />
          </form>

          <div className="ml-auto md:hidden">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="touch-target inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--brand-gold)_42%,#fff_58%)] bg-white/90 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-gold-deep)] shadow-[0_8px_18px_rgba(35,29,22,0.08)]"
              aria-label="Open WhatsApp chat"
            >
              WhatsApp
            </a>
          </div>

          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="touch-target inline-flex items-center rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(176,139,70,0.3)] hover:-translate-y-0.5 hover:bg-[var(--brand-gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <form action="/category/bangles" className="pb-2 md:hidden">
          <SearchBar
            className="w-full"
            placeholder="Search by product name, code, or style"
          />
        </form>
      </div>
    </header>
  );
}
