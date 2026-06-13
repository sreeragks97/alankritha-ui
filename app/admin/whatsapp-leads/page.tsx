"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { SearchBar } from "@/components/admin/ui/SearchBar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { EmptyLeads, GenericErrorState } from "@/components/ui/states";
import { adminRepository } from "@/lib/admin/repository";
import { getLeadStatusLabel, queryLeads } from "@/lib/admin/selectors";
import type { LeadStatus, WhatsAppLead } from "@/types/admin";

export default function WhatsAppLeadsPage() {
  const [leads, setLeads] = useState<WhatsAppLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | LeadStatus>("all");

  useEffect(() => {
    void adminRepository
      .getWhatsAppLeads()
      .then(setLeads)
      .catch(() => setHasLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => queryLeads(leads, search, status), [leads, search, status]);

  if (loading) {
    return (
      <PageLoader label="Loading WhatsApp leads">
        <div className="space-y-4">
          <Shimmer className="card-luxury h-20 rounded-2xl" />
          <Shimmer className="card-luxury h-80 rounded-2xl" />
        </div>
      </PageLoader>
    );
  }

  if (hasLoadError) {
    return <GenericErrorState onRetry={() => window.location.reload()} />;
  }

  if (filtered.length === 0) {
    return <EmptyLeads />;
  }

  return (
    <div className="space-y-4">
      <section className="card-luxury rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search customer, product, or code" />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "all" | LeadStatus)}
            className="min-h-11 rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </section>

      <section className="card-luxury overflow-hidden rounded-2xl">
        <DataTable
          columns={[
            { key: "customer", title: "Customer Name", mobileTitle: "Customer", render: (item) => item.customerName },
            { key: "product", title: "Product", render: (item) => item.productName },
            { key: "code", title: "Product Code", hideOnMobile: true, render: (item) => item.productCode },
            { key: "date", title: "Inquiry Date", mobileTitle: "Date", render: (item) => new Date(item.inquiryDate).toLocaleString() },
            { key: "status", title: "WhatsApp Status", mobileTitle: "Status", render: (item) => <StatusBadge status={getLeadStatusLabel(item.status)} /> },
          ]}
          rows={filtered}
          rowKey={(row) => row.id}
          caption="WhatsApp leads list"
        />
      </section>
    </div>
  );
}
