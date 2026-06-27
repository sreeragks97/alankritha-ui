"use client";

import Link from "next/link";
import { SocialLinks } from "@/components/common/SocialLinks";
import { useSiteSettings } from "@/src/hooks/useSiteSettings";

const FALLBACK_DESCRIPTION = "Curated premium jewellery with heritage artistry and contemporary charm.";
const FALLBACK_TAGLINE = "Crafted for celebrations that become memories.";

export function Footer() {
  const { data: settings } = useSiteSettings();

  const description = settings?.footer_description || FALLBACK_DESCRIPTION;
  const tagline = settings?.footer_tagline || FALLBACK_TAGLINE;

  return (
    <footer className="mt-16 border-t border-[#e5dbc4] bg-[linear-gradient(180deg,#f8f2e4_0%,#fdf9f0_100%)] py-10 sm:mt-24 sm:py-14">
      <div className="container-shell grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-heading text-2xl tracking-[0.06em]">ALANKRITHA</p>
          <p className="mt-3 max-w-xs text-sm text-[var(--brand-muted)]">{description}</p>
          <p className="mt-5 text-xs uppercase tracking-[0.15em] text-[#7f6f56]">{tagline}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-muted)]">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link className="gold-link" href="/">
              Home
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-muted)]">Connect</p>
          {settings ? <SocialLinks settings={settings} className="mt-3" /> : null}
        </div>
      </div>
    </footer>
  );
}
