import { sys } from 'cc';
import {
  DEFAULT_LOCAL_RECORDS,
  LOCAL_RECORDS_STORAGE_KEY,
  mergeRunIntoRecords,
  type LocalRecords,
} from './localRecordsCore';

export type { LocalRecords } from './localRecordsCore';

export function loadLocalRecords(): LocalRecords {
  try {
    const raw = sys.localStorage.getItem(LOCAL_RECORDS_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_LOCAL_RECORDS };
    }
    const o = JSON.parse(raw) as Partial<LocalRecords>;
    return {
      bestScore: Number(o.bestScore) || 0,
      bestCombo: Number(o.bestCombo) || 0,
      bestDps: Number(o.bestDps) || 0,
    };
  } catch {
    return { ...DEFAULT_LOCAL_RECORDS };
  }
}

export function saveLocalRecords(r: LocalRecords): void {
  try {
    sys.localStorage.setItem(LOCAL_RECORDS_STORAGE_KEY, JSON.stringify(r));
  } catch {
    // 配额等
  }
}

/** 与本局 `BattleRunState` 合并后写入 */
export function mergeCurrentRunAndSave(run: {
  score: number;
  maxCombo: number;
  maxDps: number;
}): LocalRecords {
  const prev = loadLocalRecords();
  const next = mergeRunIntoRecords(
    prev,
    run.score,
    run.maxCombo,
    run.maxDps,
  );
  saveLocalRecords(next);
  return next;
}
