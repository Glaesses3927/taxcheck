import { MONTHS, type Job, type MonthResult, type TotalResult } from "@/lib/calc";
import { yen } from "@/lib/format";

/** これより多いバイト先があると、スマホ幅では表が収まらないので月ごとのカード表示にする */
const MAX_JOBS_IN_MOBILE_TABLE = 2;

/** 月ごとの、バイト先別と全体の月額・累計（各セルは上段が月額、下段が累計） */
export function SummaryTable({
  jobs,
  perJob,
  total,
}: {
  jobs: Job[];
  perJob: MonthResult[][];
  total: TotalResult[];
}) {
  const useCards = jobs.length > MAX_JOBS_IN_MOBILE_TABLE;

  return (
    <div className="space-y-2">
      <p className="text-right text-xs text-muted">上段：月額　下段：累計</p>

      <div className={`overflow-x-auto rounded-xl border border-line bg-surface shadow-sm ${useCards ? "hidden sm:block" : ""}`}>
        <table className="w-full whitespace-nowrap text-sm tabular-nums">
          <thead className="text-xs text-muted">
            <tr className="border-b border-line">
              <th className="w-10 px-2 py-2 text-left align-bottom font-normal">月</th>
              {jobs.map((j) => (
                <th key={j.id} className="max-w-32 border-l border-line px-1.5 py-2 text-right align-bottom font-normal">
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
                  <td key={jobs[k].id} className="border-l border-line px-1.5 py-1">
                    <Pair monthly={r[i].monthly} cumulative={r[i].cumulative} muted={!r[i].entered} />
                  </td>
                ))}
                <td className="border-l border-line px-1.5 py-1 font-semibold">
                  <Pair monthly={total[i].monthly} cumulative={total[i].cumulative} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {useCards && (
        <ul className="space-y-2 sm:hidden">
          {MONTHS.map((m, i) => (
            <li key={m} className="rounded-xl border border-line bg-surface p-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">{m}月</span>
                <div className="text-right text-sm font-semibold">
                  <span className="mr-2 align-bottom text-xs font-normal text-muted">合計</span>
                  <Pair monthly={total[i].monthly} cumulative={total[i].cumulative} inline />
                </div>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-1.5 text-sm">
                {jobs.map((j, k) => (
                  <li key={j.id} className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-bg px-2 py-1">
                    <span className="truncate text-xs text-muted">{j.name || "（無名）"}</span>
                    <Pair monthly={perJob[k][i].monthly} cumulative={perJob[k][i].cumulative} muted={!perJob[k][i].entered} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Pair({
  monthly,
  cumulative,
  muted,
  inline,
}: {
  monthly: number;
  cumulative: number;
  muted?: boolean;
  inline?: boolean;
}) {
  return (
    <div className={`${inline ? "inline-block" : ""} text-right leading-tight whitespace-nowrap tabular-nums`}>
      <div className={`text-xs ${monthly < 0 ? "text-danger" : "text-muted"} ${muted ? "opacity-60" : ""}`}>{yen(monthly)}</div>
      <div>{yen(cumulative)}</div>
    </div>
  );
}
