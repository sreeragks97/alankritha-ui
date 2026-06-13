"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/admin/ui/Modal";
import { SearchBar } from "@/components/admin/ui/SearchBar";
import { adminRepository } from "@/lib/admin/repository";
import type { MediaAsset } from "@/types/admin";

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<MediaAsset | null>(null);

  useEffect(() => {
    void adminRepository
      .getMediaAssets()
      .then(setAssets)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((asset) => q.length === 0 || asset.fileName.toLowerCase().includes(q));
  }, [assets, search]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
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
          <SearchBar value={search} onChange={setSearch} placeholder="Search media by filename" />
          <div className="flex gap-2">
            <select className="min-h-11 rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 text-sm focus:border-[#cfb27d] focus:ring-2 focus:ring-[#ead9b5]">
              <option>Filter by type</option>
              <option>Image</option>
            </select>
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-gold)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(176,139,70,0.24)] hover:bg-[var(--brand-gold-deep)]"
            >
              Upload Media
            </button>
          </div>
        </div>
      </section>

      <section className="card-luxury rounded-2xl p-4">
        <p className="mb-4 text-sm text-[var(--brand-muted)]">Selected: {selected.length}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((asset) => (
            <article key={asset.id} className="rounded-xl border border-[#ebdfca] bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(56,46,32,0.1)]">
              <button
                type="button"
                className="aspect-square w-full rounded-lg bg-[#f1e7d3] bg-cover bg-center"
                style={{ backgroundImage: `url(${asset.url})` }}
                onClick={() => setPreview(asset)}
                aria-label={`Preview ${asset.fileName}`}
              />
              <div className="mt-3 space-y-1 text-xs text-[var(--brand-muted)]">
                <p className="truncate font-medium text-[var(--brand-ink)]">{asset.fileName}</p>
                <p>{new Date(asset.uploadedAt).toLocaleDateString()}</p>
                <p>
                  {asset.width} x {asset.height}
                </p>
                <p>{asset.sizeKb} KB</p>
              </div>
              <label className="mt-3 inline-flex items-center gap-2 text-xs">
                <input type="checkbox" checked={selected.includes(asset.id)} onChange={() => toggle(asset.id)} />
                Multi-select
              </label>
            </article>
          ))}
        </div>
      </section>

      <Modal open={Boolean(preview)} title={preview?.fileName ?? "Media preview"} onClose={() => setPreview(null)}>
        {preview ? (
          <div className="space-y-3">
            <div className="aspect-video rounded-xl bg-[#f1e7d3] bg-cover bg-center" style={{ backgroundImage: `url(${preview.url})` }} />
            <div className="grid gap-2 text-sm text-[var(--brand-muted)]">
              <p>
                Dimensions: {preview.width} x {preview.height}
              </p>
              <p>Size: {preview.sizeKb} KB</p>
              <p>Uploaded: {new Date(preview.uploadedAt).toLocaleString()}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
