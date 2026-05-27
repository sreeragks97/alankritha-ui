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
      <label className="flex h-11 items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--brand-gold)_24%,#fff_76%)] bg-white/95 px-4 text-sm text-[var(--brand-muted)] shadow-[0_8px_22px_rgba(34,29,21,0.07)] focus-within:border-[color:color-mix(in_srgb,var(--brand-gold)_62%,#fff_38%)] focus-within:shadow-[0_0_0_3px_rgba(176,139,70,0.2)]">
        <span aria-hidden>⌕</span>
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-label="Search jewellery"
          className="w-full bg-transparent text-[var(--brand-ink)] placeholder:text-[color:color-mix(in_srgb,var(--brand-muted)_72%,#fff_28%)] focus-visible:outline-none"
        />
      </label>
    </div>
  );
}
