import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
}

export function DataTable<T>({ columns, rows, rowKey, caption }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
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
  );
}
