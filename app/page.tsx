"use client";

import { useState } from "react";
import { JobCard } from "@/components/JobCard";
import { SummaryTable } from "@/components/SummaryTable";
import { WallPanel } from "@/components/WallPanel";
import { computeJob, computeTotal, lastEnteredMonth } from "@/lib/calc";
import { yen } from "@/lib/format";
import { useTaxData } from "@/lib/useTaxData";

export default function Home() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const data = useTaxData(year);
  const [newName, setNewName] = useState("");

  const perJob = data.jobs.map(computeJob);
  const total = computeTotal(perJob);
  const last = lastEnteredMonth(perJob);
  const current = last ? total[last - 1].cumulative : 0;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">TaxCheck</h1>
          <p className="mt-1 text-sm text-muted">
            各バイト先の課税対象額を入力すると、合計と累計を計算します。データはこのブラウザにだけ保存されます。
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded px-2 py-1 hover:bg-line" aria-label="前の年" onClick={() => setYear(year - 1)}>
            ‹
          </button>
          <span className="text-lg font-semibold tabular-nums">{year}年</span>
          <button className="rounded px-2 py-1 hover:bg-line" aria-label="次の年" onClick={() => setYear(year + 1)}>
            ›
          </button>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">壁までの残り</h2>
          <p className="text-sm text-muted">
            {last ? `${last}月までの全バイト累計` : "まだ入力がありません"}
            <span className="ml-2 text-2xl font-bold tabular-nums text-fg">{yen(current)}</span>
          </p>
        </div>
        <WallPanel current={current} walls={data.walls} onChange={data.setWalls} onAdd={data.addWall} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">バイト先ごとの入力</h2>
        <p className="text-sm text-muted">
          月ごとに「月額」（その月の課税対象額）か「累計」（その月までの累計額）を選んで入力します。累計で入力した月は、直前の月までの累計との差がその月の額になります。未入力の月は0円として扱います。
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {data.jobs.map((job, i) => (
            <JobCard
              key={job.id}
              job={job}
              results={perJob[i]}
              onRename={(name) => data.renameJob(job.id, name)}
              onDefaultMode={(mode) => data.setDefaultMode(job.id, mode)}
              onRemove={() => data.removeJob(job.id)}
              onEntry={(month, entry) => data.setEntry(job.id, month, entry)}
            />
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            data.addJob(newName.trim() || `バイト先${data.jobs.length + 1}`);
            setNewName("");
          }}
        >
          <input
            aria-label="追加するバイト先の名前"
            placeholder="バイト先の名前"
            className="min-w-0 flex-1 rounded border border-line bg-surface px-3 py-2"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="rounded bg-accent px-4 py-2 font-medium text-on-accent hover:opacity-90">
            バイト先を追加
          </button>
        </form>
      </section>

      {data.jobs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">月別の集計</h2>
          <SummaryTable jobs={data.jobs} perJob={perJob} total={total} />
        </section>
      )}
    </main>
  );
}
