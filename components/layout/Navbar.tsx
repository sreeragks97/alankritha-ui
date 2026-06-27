import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:color-mix(in_srgb,var(--brand-gold)_22%,#fff_78%)] bg-[color:rgba(249,246,239,0.86)] backdrop-blur-xl">
      <div className="container-shell py-2.5 md:py-3">
        <div className="flex h-[var(--nav-height-mobile)] items-center gap-2 md:h-[var(--nav-height-desktop)] md:gap-5">
          <MobileMenu />

          <Link
            href="/"
            className="min-w-0 truncate font-heading text-[clamp(1.1rem,5.2vw,1.55rem)] tracking-[0.07em] text-[var(--brand-ink)] sm:tracking-[0.09em]"
          >
            ALANKRITHA
          </Link>

          <nav className="ml-3 hidden items-center gap-5 text-sm text-[#5f5340] lg:flex">
            <Link className="gold-link" href="/">
              Home
            </Link>
            <Link className="gold-link" href="/about">
              About
            </Link>
            <Link className="gold-link" href="/contact">
              Contact
            </Link>
          </nav>

          <div className="ml-auto" />
        </div>

      </div>
    </header>
  );
}
