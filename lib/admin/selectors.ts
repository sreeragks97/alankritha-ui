import { paginate } from "@/lib/pagination";
import type { AdminProduct, ProductQuery, WhatsAppLead, LeadStatus, PaginatedResult } from "@/types/admin";

export function queryProducts(items: AdminProduct[], query: ProductQuery): PaginatedResult<AdminProduct> {
  const searched = query.search.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const matchesSearch =
      searched.length === 0 ||
      item.name.toLowerCase().includes(searched) ||
      item.code.toLowerCase().includes(searched);

    const matchesCategory = query.category === "all" || item.categoryId === query.category;
    const matchesStatus = query.status === "all" || item.status === query.status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const paginated = paginate(sorted, query.page, query.pageSize);
  return {
    items: paginated.items,
    total: paginated.meta.total,
    totalPages: paginated.meta.totalPages,
    page: paginated.meta.page,
  };
}

export function queryLeads(items: WhatsAppLead[], search: string, status: "all" | LeadStatus) {
  const q = search.trim().toLowerCase();
  return items.filter((item) => {
    const matchesSearch =
      q.length === 0 ||
      item.customerName.toLowerCase().includes(q) ||
      item.productName.toLowerCase().includes(q) ||
      item.productCode.toLowerCase().includes(q);

    const matchesStatus = status === "all" || item.status === status;

    return matchesSearch && matchesStatus;
  });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getLeadStatusLabel(status: LeadStatus) {
  if (status === "new") return "New";
  if (status === "contacted") return "Contacted";
  if (status === "quoted") return "Quoted";
  return "Closed";
}
