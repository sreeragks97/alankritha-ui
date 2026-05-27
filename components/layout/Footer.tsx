import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e5dbc4] bg-[#f8f2e4] py-12">
      <div className="container-shell grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl">ALANKRITHA</p>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">Curated premium jewellery with heritage artistry and contemporary charm.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-muted)]">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/category/necklaces">Necklaces</Link>
            <Link href="/category/bridal-sets">Bridal Sets</Link>
            <Link href="/lookbook">Lookbook</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-muted)]">Contact</p>
          <a className="mt-3 block text-sm" href={`https://wa.me/${BRAND.whatsappNumber}`} target="_blank" rel="noreferrer">
            Enquire on WhatsApp
          </a>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">Instagram {BRAND.instagramHandle}</p>
        </div>
      </div>
    </footer>
  );
}
