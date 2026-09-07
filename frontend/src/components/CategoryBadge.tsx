import { categoryLabel } from "../lib/category";

export function CategoryBadge({ category }: { category: string | undefined | null }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
      {categoryLabel(category)}
    </span>
  );
}
