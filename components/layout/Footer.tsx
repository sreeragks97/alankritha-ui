import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#e5dbc4] bg-[linear-gradient(180deg,#f8f2e4_0%,#fdf9f0_100%)] py-14">
      <div className="container-shell grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-heading text-2xl tracking-[0.06em]">ALANKRITHA</p>
          <p className="mt-3 max-w-xs text-sm text-[var(--brand-muted)]">
            Curated premium jewellery with heritage artistry and contemporary charm.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.15em] text-[#7f6f56]">Crafted for celebrations that become memories.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-muted)]">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link className="gold-link" href="/category/necklaces">
              Necklaces
            </Link>
            <Link className="gold-link" href="/category/bridal-sets">
              Bridal Sets
            </Link>
            <Link className="gold-link" href="/lookbook">
              Lookbook
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-muted)]">Brand</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link className="gold-link" href="/about">
              About Us
            </Link>
            <Link className="gold-link" href="/contact">
              Contact
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-muted)]">Contact</p>
          <a
            className="mt-3 inline-flex rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(176,139,70,0.28)] hover:bg-[var(--brand-gold-deep)]"
            href={`https://wa.me/${BRAND.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            Enquire on WhatsApp
          </a>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">Instagram {BRAND.instagramHandle}</p>
        </div>
      </div>
    </footer>
  );
}
