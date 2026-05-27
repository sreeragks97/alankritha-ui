import Link from "next/link";
import type { Category } from "@/types/product";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="card-luxury group block overflow-hidden transition-transform duration-300 hover:-translate-y-1"
    >
      <div
        className="h-40 w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(23, 17, 10, 0.45), rgba(23, 17, 10, 0.1)), url(${category.image})`,
        }}
      />
      <div className="p-4">
        <h3 className="font-heading text-xl text-[var(--brand-ink)]">{category.name}</h3>
        <p className="mt-1 text-sm text-[var(--brand-muted)]">{category.description}</p>
      </div>
    </Link>
  );
}
