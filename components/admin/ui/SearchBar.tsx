interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <label className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-[#e8dcc3] bg-white px-3 py-2 shadow-[0_6px_12px_rgba(41,32,19,0.05)] focus-within:border-[#cfb27d] focus-within:ring-2 focus-within:ring-[#ead9b5]">
      <span className="text-xs uppercase tracking-[0.1em] text-[var(--brand-muted)]">Find</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className="min-w-0 w-full border-none bg-transparent text-[16px] text-[var(--brand-ink)] outline-none placeholder:text-[#b7a98f] sm:text-sm"
      />
    </label>
  );
}
