"use client";

import { yen } from "@/lib/format";
import type { Wall } from "@/lib/useTaxData";
import { MoneyInput } from "./MoneyInput";

/** 現在の全体累計と、各「壁」までの残り額 */
export function WallPanel({
  current,
  walls,
  onChange,
  onAdd,
}: {
  current: number;
  walls: Wall[];
  onChange: (walls: Wall[]) => void;
  onAdd: () => void;
}) {
  
  const update = (id: string, patch: Partial<Wall>) =>
    onChange(walls.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <ul className="space-y-4">
        {walls.map((w) => {
          const rest = w.amount - current;
          const ratio = w.amount > 0 ? Math.min(current / w.amount, 1) : 0;
          return (
            <li key={w.id} className="text-sm">
              <div className="flex items-center gap-2">
                <input
                  aria-label="壁の名前"
                  className="min-w-0 flex-1 rounded border border-line bg-surface px-2 py-1"
                  value={w.label}
                  onChange={(e) => update(w.id, { label: e.target.value })}
                />
                <MoneyInput
                  ariaLabel="壁の金額"
                  className="w-32"
                  value={w.amount}
                  onChange={(v) => update(w.id, { amount: v ?? 0 })}
                />
                <button
                  aria-label={`${w.label}を削除`}
                  className="rounded px-2 py-1 text-muted hover:text-danger"
                  onClick={() => onChange(walls.filter((x) => x.id !== w.id))}
                >
                  ×
                </button>
              </div>
              <div className="mt-1 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded bg-line">
                  <div
                    className={`h-full ${rest < 0 ? "bg-danger" : "bg-accent"}`}
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
                <span className={`w-36 text-right tabular-nums ${rest < 0 ? "font-semibold text-danger" : ""}`}>
                  {rest < 0 ? `${yen(-rest)} 超過` : `残り ${yen(rest)}`}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <button className="mt-3 text-sm text-accent hover:underline" onClick={onAdd}>
        ＋ 壁を追加
      </button>
      <p className="mt-2 text-xs text-muted">
        壁の金額は制度改正で変わります。最新の制度を確認して編集してください。
      </p>
    </div>
  );
}
