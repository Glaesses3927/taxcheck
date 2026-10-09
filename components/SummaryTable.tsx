import { MONTHS, type Job, type MonthResult, type TotalResult } from "@/lib/calc";
import { yen } from "@/lib/format";

/** 月ごとの、バイト先別累計と全体の月額・累計 */
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
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full text-sm">
        <thead className="text-muted">
          <tr className="border-b border-line">
            <th rowSpan={2} className="px-3 py-2 text-left font-normal">月</th>
            {jobs.map((j) => (
              <th key={j.id} colSpan={2} className="border-l border-line px-3 pt-2 text-center font-normal">
                {j.name || "（無名）"}
              </th>
            ))}
            <th colSpan={2} className="border-l border-line px-3 pt-2 text-center font-semibold text-fg">
              全バイト合計
            </th>
          </tr>
          <tr className="border-b border-line">
            {[...jobs.map((j) => j.id), "total"].map((id) => (
              <th key={id} colSpan={2} className="border-l border-line p-0 font-normal">
                <div className="grid grid-cols-2">
                  <span className="px-3 py-1 text-right">月額</span>
                  <span className="px-3 py-1 text-right">累計</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((m, i) => (
            <tr key={m} className="border-b border-line/60 last:border-0">
              <td className="px-3 py-1 tabular-nums">{m}月</td>
              {perJob.map((r, k) => (
                <Pair key={jobs[k].id} monthly={r[i].monthly} cumulative={r[i].cumulative} muted={!r[i].entered} />
              ))}
              <Pair monthly={total[i].monthly} cumulative={total[i].cumulative} strong />
            </tr>
          ))}
        </tbody>
      </table>
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
    <td colSpan={2} className="border-l border-line p-0">
      <div className={`grid grid-cols-2 whitespace-nowrap tabular-nums ${strong ? "font-semibold" : ""}`}>
        <span className={`px-3 py-1 text-right ${muted ? "text-muted" : ""} ${monthly < 0 ? "text-danger" : ""}`}>
          {yen(monthly)}
        </span>
        <span className="px-3 py-1 text-right">{yen(cumulative)}</span>
      </div>
    </td>
  );
}
