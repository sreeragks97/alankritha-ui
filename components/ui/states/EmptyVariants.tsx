import { EmptyState } from "@/components/ui/states/EmptyState";

interface EmptyVariantProps {
  onAction?: () => void;
}

export function EmptyProducts({ onAction }: EmptyVariantProps) {
  return (
    <EmptyState
      title="No products available"
      description="Add catalogue entries to showcase jewellery collections here."
      actionLabel="Add Product"
      onAction={onAction}
    />
  );
}

export function EmptyCategories({ onAction }: EmptyVariantProps) {
  return (
    <EmptyState
      title="No categories found"
      description="Create your first category to organize storefront collections."
      actionLabel="Add Category"
      onAction={onAction}
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      title="No results"
      description="Try a different search keyword or clear filters to broaden the results."
    />
  );
}

export function EmptyMedia() {
  return (
    <EmptyState
      title="No media assets"
      description="Upload product and banner assets to build your visual library."
    />
  );
}

export function EmptyLeads() {
  return (
    <EmptyState
      title="No WhatsApp leads yet"
      description="Customer enquiries will appear here once catalogue traffic starts interacting."
    />
  );
}

export function EmptyTable() {
  return (
    <EmptyState
      title="No records"
      description="There are no rows to display for the current filter selection."
      className="p-6 sm:p-8"
    />
  );
}
