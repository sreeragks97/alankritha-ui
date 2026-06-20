"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { SearchBar } from "@/components/admin/ui/SearchBar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { EmptyLeads, GenericErrorState } from "@/components/ui/states";
import { useLeads } from "@/src/hooks/useLeads";
import type { LeadStatus } from "@/types/admin";

export default function AdminLeadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | LeadStatus>("all");

  const leadsQuery = useLeads({ page: 1, limit: 100 });

  const filtered = useMemo(() => {
    const list = leadsQuery.data?.items ?? [];
    const q = search.trim().toLowerCase();

    return list.filter((item) => {
      const statusValue: LeadStatus = "new";
      const customerName = item.customer_name ?? "Unknown";
      const productName = item.product?.name ?? "Unknown Product";
      const productCode = item.product?.code ?? "N/A";
      const matchesSearch =
        q.length === 0 ||
        customerName.toLowerCase().includes(q) ||
        productName.toLowerCase().includes(q) ||
        productCode.toLowerCase().includes(q);

      const matchesStatus = status === "all" || status === statusValue;
      return matchesSearch && matchesStatus;
    });
  }, [leadsQuery.data?.items, search, status]);

  if (leadsQuery.isLoading) {
    return (
      <PageLoader label="Loading WhatsApp leads">
        <div className="space-y-4">
          <Shimmer className="card-luxury h-20 rounded-2xl" />
          <Shimmer className="card-luxury h-80 rounded-2xl" />
        </div>
      </PageLoader>
    );
  }

  if (leadsQuery.isError) {
    return <GenericErrorState onRetry={() => leadsQuery.refetch()} />;
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
            {
              key: "customer",
              title: "Customer Name",
              mobileTitle: "Customer",
              render: (item) => item.customer_name ?? "Unknown",
            },
            {
              key: "product",
              title: "Product",
              render: (item) => item.product?.name ?? "Unknown Product",
            },
            {
              key: "code",
              title: "Product Code",
              hideOnMobile: true,
              render: (item) => item.product?.code ?? "N/A",
            },
            {
              key: "date",
              title: "Inquiry Date",
              mobileTitle: "Date",
              render: (item) => new Date(item.created_at).toLocaleString(),
            },
            {
              key: "status",
              title: "WhatsApp Status",
              mobileTitle: "Status",
              render: () => <StatusBadge status="new" />,
            },
          ]}
          rows={filtered}
          rowKey={(row) => row.id}
          caption="WhatsApp leads list"
        />
      </section>
    </div>
  );
}
