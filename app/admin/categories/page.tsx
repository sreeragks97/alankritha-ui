"use client";

import { useEffect, useMemo, useState } from "react";
import { ConfirmationDialog } from "@/components/admin/ui/ConfirmationDialog";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { SearchBar } from "@/components/admin/ui/SearchBar";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { adminRepository } from "@/lib/admin/repository";
import { toSlug } from "@/lib/admin/selectors";
import type { AdminCategory } from "@/types/admin";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    void adminRepository
      .getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter(
      (item) => q.length === 0 || item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q),
    );
  }, [categories, search]);

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

  const save = () => {
    if (!name.trim()) return;

    if (editing) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                name,
                slug: slug || toSlug(name),
              }
            : item,
        ),
      );
    } else {
      setCategories((prev) => [
        {
          id: `cat_${Date.now()}`,
          name,
          slug: slug || toSlug(name),
          bannerImage: "/images/admin/category-default.jpg",
          productCount: 0,
          status: "active",
        },
        ...prev,
      ]);
    }

    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="card-luxury h-20 animate-shimmer rounded-2xl" />
        <div className="card-luxury h-80 animate-shimmer rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="card-luxury rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search categories" />
          <button
            type="button"
            onClick={openAdd}
            className="rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)]"
          >
            Add Category
          </button>
        </div>
      </section>

      <section className="card-luxury overflow-hidden rounded-2xl">
        <DataTable
          columns={[
            { key: "name", title: "Name", render: (item) => item.name },
            { key: "slug", title: "Slug", render: (item) => item.slug },
            {
              key: "banner",
              title: "Banner",
              render: (item) => (
                <div className="h-10 w-20 rounded-md bg-[#f2e7d2] bg-cover bg-center" style={{ backgroundImage: `url(${item.bannerImage})` }} />
              ),
            },
            { key: "count", title: "Products", render: (item) => item.productCount },
            { key: "status", title: "Status", render: (item) => <StatusBadge status={item.status} /> },
            {
              key: "actions",
              title: "Actions",
              render: (item) => (
                <div className="flex gap-2">
                  <button type="button" className="rounded-md border border-[#e8dcc3] px-2 py-1 text-xs hover:bg-[#f8f0df]" onClick={() => openEdit(item)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-[#f2d0c8] px-2 py-1 text-xs text-[#9d3f2d]"
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
            <button type="button" className="rounded-lg border border-[#e8dcc3] px-3 py-2 text-sm" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-[var(--brand-gold)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-gold-deep)]"
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
          if (!pendingDelete) return;
          setCategories((prev) => prev.filter((item) => item.id !== pendingDelete.id));
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
