interface SearchBarProps {
  defaultValue?: string;
  name?: string;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  defaultValue,
  name = "search",
  placeholder = "Search jewellery by name, code, or tag",
  className,
}: SearchBarProps) {
  return (
    <div className={className}>
      <label className="flex h-11 items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--brand-gold)_24%,#fff_76%)] bg-white px-4 text-sm text-[var(--brand-muted)]">
        <span aria-hidden>⌕</span>
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-transparent text-[var(--brand-ink)] outline-none"
        />
      </label>
    </div>
  );
}
