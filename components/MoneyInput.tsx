"use client";

import { useState } from "react";

const fmt = (n: number | null) => (n == null ? "" : n.toLocaleString("ja-JP"));

/** カンマ区切りで表示する金額入力。空欄は null。 */
export function MoneyInput({
  value,
  onChange,
  className = "",
  ariaLabel,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  className?: string;
  ariaLabel?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label={ariaLabel}
      className={`${className || "w-full"} rounded-md border border-line bg-surface px-2 py-1 text-right tabular-nums focus:outline-2 focus:outline-accent`}
      value={draft ?? fmt(value)}
      onFocus={() => setDraft(value == null ? "" : String(value))}
      onBlur={() => setDraft(null)}
      onChange={(e) => {
        const digits = e.target.value.replace(/[^\d]/g, "");
        setDraft(digits);
        onChange(digits === "" ? null : Number(digits));
      }}
    />
  );
}
