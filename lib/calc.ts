export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type Month = (typeof MONTHS)[number];

/** monthly: その月の課税対象額 / cumulative: その月までの累計額 */
export type InputMode = "monthly" | "cumulative";

/** 1か月分の入力。value が null なら未入力（入力方式だけ選んだ状態）。 */
export type Entry = { mode: InputMode; value: number | null };

export type Job = {
  id: string;
  name: string;
  /** 新しい月に入力するときの既定の入力方式 */
  defaultMode: InputMode;
  entries: Partial<Record<Month, Entry>>;
};

export type MonthResult = {
  month: Month;
  /** その月の課税対象額（未入力なら 0） */
  monthly: number;
  /** その月までの累計額 */
  cumulative: number;
  /** 金額の入力があったか */
  entered: boolean;
  /** 累計入力が前月までの累計を下回った（差分がマイナス） */
  negative: boolean;
};

/**
 * 1つのバイト先について、全月の月額・累計を補完して求める。
 * 未入力の月は 0 円として扱うため、累計入力の月は「直前の累計との差」がその月の額になる。
 */
export function computeJob(job: Job): MonthResult[] {
  let prev = 0;
  return MONTHS.map((month) => {
    const entry = job.entries[month];
    const entered = entry?.value != null;
    let monthly = 0;
    if (entered) monthly = entry.mode === "monthly" ? entry.value! : entry.value! - prev;
    const cumulative = prev + monthly;
    prev = cumulative;
    return { month, monthly, cumulative, entered, negative: monthly < 0 };
  });
}

export type TotalResult = { month: Month; monthly: number; cumulative: number };

/** 全バイト先の月額・累計を月ごとに合算する。 */
export function computeTotal(perJob: MonthResult[][]): TotalResult[] {
  return MONTHS.map((month, i) => ({
    month,
    monthly: perJob.reduce((s, r) => s + r[i].monthly, 0),
    cumulative: perJob.reduce((s, r) => s + r[i].cumulative, 0),
  }));
}

/** 入力のある最後の月（どのバイト先にも入力がなければ null） */
export function lastEnteredMonth(perJob: MonthResult[][]): Month | null {
  for (let i = MONTHS.length - 1; i >= 0; i--) {
    if (perJob.some((r) => r[i].entered)) return MONTHS[i];
  }
  return null;
}
