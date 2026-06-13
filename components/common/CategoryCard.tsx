import Link from "next/link";
import type { Category } from "@/types/product";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="card-luxury group block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
    >
      <div
        className="h-36 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04] sm:h-44"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(23, 17, 10, 0.5), rgba(23, 17, 10, 0.1)), url(${category.image})`,
        }}
      />
      <div className="p-3.5 sm:p-4.5">
        <h3 className="font-heading text-[clamp(1.05rem,3.8vw,1.35rem)] text-[var(--brand-ink)]">{category.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--brand-muted)] sm:text-sm sm:leading-6">{category.description}</p>
      </div>
    </Link>
  );
}
