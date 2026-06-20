"use client";

import { useMemo, useState } from "react";
import { ConfirmationDialog } from "@/components/admin/ui/ConfirmationDialog";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { SearchBar } from "@/components/admin/ui/SearchBar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ToastNotification } from "@/components/admin/ui/ToastNotification";
import { OptimizedImage } from "@/components/ui/image";
import { PageLoader, Shimmer } from "@/components/ui/loading";
import { EmptyCategories, GenericErrorState } from "@/components/ui/states";
import { useToast } from "@/hooks/useToast";
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/src/hooks/useCategories";
import { mapCategoryToAdminCategory } from "@/src/utils/adminMappers";
import { toSlug } from "@/utils/slug";
import type { AdminCategory } from "@/types/admin";

export default function CategoriesPage() {
  const { toasts, showToast, removeToast } = useToast();

  const categoriesQuery = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const categories = useMemo(
    () => (categoriesQuery.data ?? []).map((category) => mapCategoryToAdminCategory(category)),
    [categoriesQuery.data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter(
      (item) => q.length === 0 || item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q),
    );
  }, [categories, search]);

  const loading = categoriesQuery.isLoading && !categoriesQuery.data;
  const hasLoadError = categoriesQuery.isError;

  const openAdd = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setModalOpen(true);
  };

  const openEdit = (item: AdminCategory) => {
    setEditing(item);
    setName(item.name);
    setSlug(item.slug);
    setModalOpen(true);
  };

  const save = async () => {
    if (!name.trim()) return;

    const nextSlug = slug || toSlug(name);

    try {
      if (editing) {
        await updateCategoryMutation.mutateAsync({
          id: editing.id,
          payload: {
            name: name.trim(),
            slug: nextSlug,
            active: editing.status === "active",
          },
        });

        showToast({
          title: "Category updated",
          description: `${name.trim()} has been saved.`,
          tone: "success",
        });
      } else {
        await createCategoryMutation.mutateAsync({
          name: name.trim(),
          slug: nextSlug,
          active: true,
        });

        showToast({
          title: "Category created",
          description: `${name.trim()} has been added.`,
          tone: "success",
        });
      }

      setModalOpen(false);
    } catch (error) {
      showToast({
        title: "Unable to save category",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "error",
      });
    }
  };

  if (loading) {
    return (
      <PageLoader label="Loading categories">
        <div className="space-y-4">
          <Shimmer className="card-luxury h-20 rounded-2xl" />
          <Shimmer className="card-luxury h-80 rounded-2xl" />
        </div>
      </PageLoader>
    );
  }

  if (hasLoadError) {
    return <GenericErrorState onRetry={() => categoriesQuery.refetch()} />;
  }

  if (filtered.length === 0) {
    return <EmptyCategories onAction={openAdd} />;
  }

  return (
    <div className="space-y-4">
      <section className="card-luxury rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search categories" />
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)]"
          >
            Add Category
          </button>
        </div>
      </section>

      <section className="card-luxury overflow-hidden rounded-2xl">
        <DataTable
          columns={[
            { key: "name", title: "Name", render: (item) => item.name },
            { key: "slug", title: "Slug", hideOnMobile: true, render: (item) => item.slug },
            {
              key: "banner",
              title: "Banner",
              hideOnMobile: true,
              render: (item) => (
                <div className="relative h-10 w-20 overflow-hidden rounded-md bg-[#f2e7d2]">
                  <OptimizedImage
                    src={item.bannerImage}
                    alt={`${item.name} banner`}
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                    fallbackLabel={`${item.name} banner unavailable`}
                  />
                </div>
              ),
            },
            { key: "count", title: "Products", render: (item) => item.productCount },
            { key: "status", title: "Status", render: (item) => <StatusBadge status={item.status} /> },
            {
              key: "actions",
              title: "Actions",
              mobileTitle: "Manage",
              render: (item) => (
                <div className="flex gap-2">
                  <button type="button" className="inline-flex min-h-10 items-center rounded-md border border-[#e8dcc3] px-2 py-1 text-xs hover:bg-[#f8f0df]" onClick={() => openEdit(item)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-10 items-center rounded-md border border-[#f2d0c8] px-2 py-1 text-xs text-[#9d3f2d]"
                    onClick={() => setPendingDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={filtered}
          rowKey={(row) => row.id}
          caption="Admin categories list"
        />
      </section>

      <Modal
        open={modalOpen}
        title={editing ? "Edit Category" : "Add Category"}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="inline-flex min-h-11 items-center rounded-lg border border-[#e8dcc3] px-3 py-2 text-sm" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              className="inline-flex min-h-11 items-center rounded-lg bg-[var(--brand-gold)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-gold-deep)]"
            >
              Save
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block space-y-2 text-sm">
            <span>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Slug</span>
            <input
              value={slug}
              onChange={(event) => setSlug(toSlug(event.target.value))}
              className="w-full rounded-lg border border-[#e8dcc3] px-3 py-2 focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]"
            />
          </label>
        </div>
      </Modal>

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        title="Delete category"
        message={`Are you sure you want to remove ${pendingDelete?.name ?? "this category"}?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) {
            return;
          }

          void (async () => {
            try {
              await deleteCategoryMutation.mutateAsync(pendingDelete.id);
              showToast({
                title: "Category deleted",
                description: `${pendingDelete.name} has been removed.`,
                tone: "success",
              });
            } catch (error) {
              showToast({
                title: "Unable to delete category",
                description: error instanceof Error ? error.message : "Please try again.",
                tone: "error",
              });
            } finally {
              setPendingDelete(null);
            }
          })();
        }}
      />

      <ToastNotification items={toasts} onDismiss={removeToast} />
    </div>
  );
}
