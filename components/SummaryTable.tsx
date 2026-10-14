import { MONTHS, type Job, type MonthResult, type TotalResult } from "@/lib/calc";
import { yen } from "@/lib/format";

/** 月ごとの、バイト先別と全体の月額・累計（スマホ幅でも収まるよう、各列に月額と累計を2段で表示する） */
export function SummaryTable({
  jobs,
  perJob,
  total,
}: {
  jobs: Job[];
  perJob: MonthResult[][];
  total: TotalResult[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
      <table className="w-full table-fixed text-sm tabular-nums">
        <colgroup>
          <col className="w-10" />
        </colgroup>
        <thead className="text-xs text-muted">
          <tr className="border-b border-line">
            <th className="px-2 py-2 text-left align-bottom font-normal">月</th>
            {jobs.map((j) => (
              <th key={j.id} className="border-l border-line px-1.5 py-2 text-right align-bottom font-normal">
                <span className="block truncate">{j.name || "（無名）"}</span>
              </th>
            ))}
            <th className="border-l border-line px-1.5 py-2 text-right align-bottom font-semibold text-fg">合計</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((m, i) => (
            <tr key={m} className="border-b border-line/60 last:border-0">
              <td className="px-2 py-1">{m}月</td>
              {perJob.map((r, k) => (
                <Pair key={jobs[k].id} monthly={r[i].monthly} cumulative={r[i].cumulative} muted={!r[i].entered} />
              ))}
              <Pair monthly={total[i].monthly} cumulative={total[i].cumulative} strong />
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line px-2 py-1 text-right text-xs text-muted">上段：月額　下段：累計</p>
    </div>
  );
}

function Pair({
  monthly,
  cumulative,
  muted,
  strong,
}: {
  monthly: number;
  cumulative: number;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <td className={`border-l border-line px-1.5 py-1 text-right leading-tight whitespace-nowrap ${strong ? "font-semibold" : ""}`}>
      <div className={`text-xs ${monthly < 0 ? "text-danger" : "text-muted"} ${muted ? "opacity-60" : ""}`}>{yen(monthly)}</div>
      <div>{yen(cumulative)}</div>
    </td>
  );
}
