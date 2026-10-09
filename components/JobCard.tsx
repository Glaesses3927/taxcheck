"use client";

import { MONTHS, type Entry, type InputMode, type Job, type Month, type MonthResult } from "@/lib/calc";
import { yen } from "@/lib/format";
import { MoneyInput } from "./MoneyInput";

const MODE_LABEL: Record<InputMode, string> = { monthly: "月額", cumulative: "累計" };

export function JobCard({
  job,
  results,
  onRename,
  onDefaultMode,
  onRemove,
  onEntry,
}: {
  job: Job;
  results: MonthResult[];
  onRename: (name: string) => void;
  onDefaultMode: (mode: InputMode) => void;
  onRemove: () => void;
  onEntry: (month: Month, entry: Entry | undefined) => void;
}) {
  const yearTotal = results[results.length - 1].cumulative;

  return (
    <section className="rounded-lg border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          aria-label="バイト先の名前"
          className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 text-lg font-semibold hover:border-line focus:border-line"
          value={job.name}
          onChange={(e) => onRename(e.target.value)}
        />
        <label className="flex items-center gap-1 text-sm text-muted">
          既定の入力方式
          <select
            className="rounded border border-line bg-surface px-1 py-0.5 text-fg"
            value={job.defaultMode}
            onChange={(e) => onDefaultMode(e.target.value as InputMode)}
          >
            <option value="monthly">月額</option>
            <option value="cumulative">累計</option>
          </select>
        </label>
        <button
          className="rounded px-2 py-1 text-sm text-danger hover:bg-danger/10"
          onClick={() => {
            if (confirm(`「${job.name}」を削除しますか？`)) onRemove();
          }}
        >
          削除
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="text-muted">
            <tr className="border-b border-line">
              <th className="py-1 text-left font-normal">月</th>
              <th className="py-1 text-left font-normal">入力方式</th>
              <th className="py-1 text-right font-normal">入力額</th>
              <th className="py-1 text-right font-normal">月額</th>
              <th className="py-1 text-right font-normal">累計</th>
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((m, i) => {
              const entry = job.entries[m];
              const mode = entry?.mode ?? job.defaultMode;
              const r = results[i];
              return (
                <tr key={m} className="border-b border-line/60 last:border-0">
                  <td className="py-1 pr-2 tabular-nums">{m}月</td>
                  <td className="py-1 pr-2">
                    <select
                      aria-label={`${m}月の入力方式`}
                      className="rounded border border-line bg-surface px-1 py-0.5"
                      value={mode}
                      onChange={(e) =>
                        onEntry(m, { mode: e.target.value as InputMode, value: entry?.value ?? null })
                      }
                    >
                      <option value="monthly">{MODE_LABEL.monthly}</option>
                      <option value="cumulative">{MODE_LABEL.cumulative}</option>
                    </select>
                  </td>
                  <td className="w-36 py-1 pr-2">
                    <MoneyInput
                      ariaLabel={`${m}月の${MODE_LABEL[mode]}`}
                      value={entry?.value ?? null}
                      onChange={(v) =>
                        onEntry(m, v == null && entry?.mode === undefined ? undefined : { mode, value: v })
                      }
                    />
                  </td>
                  <td
                    className={`py-1 pr-2 text-right tabular-nums ${r.negative ? "font-semibold text-danger" : r.entered ? "" : "text-muted"}`}
                    title={r.negative ? "前月までの累計より小さい累計額が入力されています" : undefined}
                  >
                    {r.entered ? yen(r.monthly) : "—"}
                  </td>
                  <td className="py-1 text-right tabular-nums">{yen(r.cumulative)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-right text-sm">
        年間累計 <span className="text-base font-semibold tabular-nums">{yen(yearTotal)}</span>
      </p>
    </section>
  );
}
