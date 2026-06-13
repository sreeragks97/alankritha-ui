import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
  mobileTitle?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
}

export function DataTable<T>({ columns, rows, rowKey, caption }: DataTableProps<T>) {
  const mobileColumns = columns.filter((column) => !column.hideOnMobile);

  return (
    <div>
      <div className="space-y-3 p-3 md:hidden">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-[#efe5d3] bg-[#fffcf6] p-4 text-sm text-[var(--brand-muted)]">
            No records available.
          </p>
        ) : (
          rows.map((row) => (
            <article key={rowKey(row)} className="rounded-xl border border-[#efe5d3] bg-white p-3 shadow-[0_8px_18px_rgba(40,31,18,0.05)]">
              <dl className="space-y-2">
                {mobileColumns.map((column) => (
                  <div key={column.key} className="grid grid-cols-[minmax(6.5rem,44%)_1fr] gap-2 text-sm">
                    <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand-muted)]">
                      {column.mobileTitle ?? column.title}
                    </dt>
                    <dd className="min-w-0 text-[var(--brand-ink)]">{column.render(row)}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-[#ede3d1] bg-[#fff9ef] text-left text-xs uppercase tracking-[0.13em] text-[var(--brand-muted)]">
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-3 font-semibold">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-[#f3ecdf] text-sm hover:bg-[#fffcf5]">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3.5 align-top">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
