"use client";

import { useSyncExternalStore } from "react";
import type { Entry, InputMode, Job, Month } from "./calc";

export type Wall = { id: string; label: string; amount: number };

export type TaxData = {
  version: 1;
  /** 年 → その年のバイト先一覧 */
  years: Record<string, Job[]>;
  walls: Wall[];
};

const STORAGE_KEY = "taxcheck:v1";

// 金額は制度改正で変わるので、画面上で編集できるようにしている
const DEFAULT_WALLS: Wall[] = [
  { id: "w106", label: "106万円", amount: 1_060_000 },
  { id: "w123", label: "123万円", amount: 1_230_000 },
  { id: "w130", label: "130万円", amount: 1_300_000 },
  { id: "w150", label: "150万円", amount: 1_500_000 },
  { id: "w160", label: "160万円", amount: 1_600_000 },
];

const EMPTY: TaxData = { version: 1, years: {}, walls: DEFAULT_WALLS };

const newId = () => Math.random().toString(36).slice(2, 10);

// localStorage をデータ源とする外部ストア。サーバー側（ビルド時）は常に EMPTY を返す。
let cache: TaxData | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): TaxData {
  if (cache) return cache;
  cache = EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as TaxData) : null;
    if (parsed?.version === 1) cache = parsed;
  } catch {
    // 壊れたデータ・ストレージ不可の場合は空データで続行
  }
  return cache;
}

function setData(fn: (d: TaxData) => TaxData) {
  cache = fn(getSnapshot());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // 保存できなくても画面上の計算は続ける
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTaxData(year: number) {
  const data = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const key = String(year);
  const jobs = data.years[key] ?? [];

  const updateJobs = (fn: (jobs: Job[]) => Job[]) =>
    setData((d) => ({ ...d, years: { ...d.years, [key]: fn(d.years[key] ?? []) } }));

  return {
    jobs,
    walls: data.walls,
    addJob: (name: string) =>
      updateJobs((js) => [...js, { id: newId(), name, defaultMode: "monthly", entries: {} }]),
    renameJob: (id: string, name: string) =>
      updateJobs((js) => js.map((j) => (j.id === id ? { ...j, name } : j))),
    setDefaultMode: (id: string, defaultMode: InputMode) =>
      updateJobs((js) => js.map((j) => (j.id === id ? { ...j, defaultMode } : j))),
    removeJob: (id: string) => updateJobs((js) => js.filter((j) => j.id !== id)),
    setEntry: (id: string, month: Month, entry: Entry | undefined) =>
      updateJobs((js) =>
        js.map((j) => {
          if (j.id !== id) return j;
          const entries = { ...j.entries };
          if (entry) entries[month] = entry;
          else delete entries[month];
          return { ...j, entries };
        }),
      ),
    setWalls: (walls: Wall[]) => setData((d) => ({ ...d, walls })),
    addWall: () =>
      setData((d) => ({ ...d, walls: [...d.walls, { id: newId(), label: "新しい壁", amount: 0 }] })),
  };
}
