

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-grasshopper">🦗</span>
    </span>
  );
}

export function MiniIcon({ name }: { name: "check" | "arrow" | "book" | "file" | "scale" | "clip" | "close" | "case" | "news" | "search" }) {
  const glyph = { check: "✓", arrow: "→", book: "▤", file: "▱", scale: "§", clip: "+", close: "×", case: "▦", news: "▤", search: "⌕" }[name];
  return <span className={`mini-icon mini-icon-${name}`} aria-hidden="true">{glyph}</span>;
}

