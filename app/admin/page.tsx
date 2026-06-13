"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardCard } from "@/components/admin/ui/DashboardCard";
import { DataTable } from "@/components/admin/ui/DataTable";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { adminRepository } from "@/lib/admin/repository";
import { formatCurrency } from "@/lib/admin/selectors";
import type { AdminProduct, AdminCategory, WhatsAppLead } from "@/types/admin";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [leads, setLeads] = useState<WhatsAppLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([
      adminRepository.getProducts().then(setProducts),
      adminRepository.getCategories().then(setCategories),
      adminRepository.getWhatsAppLeads().then(setLeads),
    ]).finally(() => setLoading(false));
  }, []);

  const recentProducts = useMemo(
    () => [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [products],
  );

  const featured = products.filter((product) => product.isFeatured).length;

  if (loading) {
    return (
      <PageLoader label="Loading admin dashboard">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Shimmer key={index} className="card-luxury h-28" />
            ))}
          </div>
          <Shimmer className="card-luxury h-72" />
        </div>
      </PageLoader>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Total Products" value={products.length} trend="+6 this month" icon="PR" />
        <DashboardCard label="Categories" value={categories.length} trend="1 pending review" icon="CT" />
        <DashboardCard label="WhatsApp Enquiries" value={leads.length} trend="Response rate 94%" icon="WA" />
        <DashboardCard label="Featured Products" value={featured} trend="3 on homepage" icon="FT" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="card-luxury rounded-2xl p-5 xl:col-span-2">
          <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-heading text-3xl">Recent Activity</p>
            <Link href="/admin/products" className="gold-link inline-flex min-h-11 items-center rounded-full border border-[#d9cbaf] px-3 py-1.5 text-sm font-semibold">
              View all products
            </Link>
          </div>
          <DataTable
            columns={[
              { key: "name", title: "Product", render: (item) => item.name },
              { key: "code", title: "Code", hideOnMobile: true, render: (item) => item.code },
              { key: "price", title: "Price", render: (item) => formatCurrency(item.price) },
              { key: "updatedAt", title: "Updated", render: (item) => new Date(item.updatedAt).toLocaleDateString() },
            ]}
            rows={recentProducts}
            rowKey={(row) => row.id}
            caption="Recent product activity"
          />
        </article>

        <aside className="space-y-4">
          <article className="card-luxury rounded-2xl p-5">
            <p className="font-heading text-2xl">Quick Actions</p>
            <div className="mt-4 grid gap-2">
              <Link
                href="/admin/products/new"
                className="inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)]"
              >
                Add Product
              </Link>
              <Link href="/admin/categories" className="inline-flex min-h-11 items-center rounded-xl border border-[#dcc8a2] px-4 py-2 text-sm font-semibold hover:bg-[#f7f0df]">
                Manage Categories
              </Link>
              <Link href="/admin/banners" className="inline-flex min-h-11 items-center rounded-xl border border-[#dcc8a2] px-4 py-2 text-sm font-semibold hover:bg-[#f7f0df]">
                Update Banners
              </Link>
            </div>
          </article>

          <article className="card-luxury rounded-2xl p-5">
            <p className="font-heading text-2xl">Product Performance</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-[#fdf4e3] p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--brand-muted)]">Top viewed</p>
                <p className="mt-1 font-semibold text-[var(--brand-ink)]">Temple Lakshmi Long Necklace</p>
              </div>
              <div className="rounded-xl bg-[#f5f8ff] p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--brand-muted)]">Highest enquiry conversion</p>
                <p className="mt-1 font-semibold text-[var(--brand-ink)]">Emerald Polki Choker Set</p>
              </div>
            </div>
          </article>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="card-luxury rounded-2xl p-5">
          <p className="font-heading text-2xl">Placeholder Sales Trend</p>
          <div className="mt-4 h-52 rounded-xl bg-[linear-gradient(180deg,#fef8ec_0%,#f5ead3_100%)] p-3">
            <div className="h-full w-full rounded-lg border border-dashed border-[#d9c39a] bg-white/60" />
          </div>
        </article>
        <article className="card-luxury rounded-2xl p-5">
          <p className="font-heading text-2xl">Placeholder Enquiry Trend</p>
          <div className="mt-4 h-52 rounded-xl bg-[linear-gradient(180deg,#fcf8ff_0%,#ede4f8_100%)] p-3">
            <div className="h-full w-full rounded-lg border border-dashed border-[#c7b2e4] bg-white/70" />
          </div>
        </article>
      </section>
    </div>
  );
}
