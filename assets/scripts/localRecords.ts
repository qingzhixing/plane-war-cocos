import { sys } from 'cc';
import {
  computeReturnHint,
  DEFAULT_LOCAL_RECORDS,
  LOCAL_RECORDS_STORAGE_KEY,
  mergeRunIntoRecords,
  type LocalRecords,
  type ReturnHint,
} from './localRecordsCore';

export type { LocalRecords, ReturnHint } from './localRecordsCore';

const RETURN_HINT_KEY = 'plane_war_cocos_return_hint_v1';

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

function persistReturnHint(h: ReturnHint): void {
  try {
    sys.localStorage.setItem(RETURN_HINT_KEY, JSON.stringify(h));
  } catch {
    // ignore
  }
}

function clearReturnHintStorage(): void {
  try {
    sys.localStorage.removeItem(RETURN_HINT_KEY);
  } catch {
    // ignore
  }
}

/** 读取并清除一次性「刷新纪录」提示（进入主菜单时调用） */
export function consumeReturnHint(): ReturnHint | null {
  try {
    const raw = sys.localStorage.getItem(RETURN_HINT_KEY);
    if (!raw) {
      return null;
    }
    clearReturnHintStorage();
    const o = JSON.parse(raw) as Partial<ReturnHint>;
    return {
      newBestScore: !!o.newBestScore,
      newBestCombo: !!o.newBestCombo,
      newBestDps: !!o.newBestDps,
    };
  } catch {
    clearReturnHintStorage();
    return null;
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
  const hint = computeReturnHint(prev, next);
  if (hint) {
    persistReturnHint(hint);
  } else {
    clearReturnHintStorage();
  }
  return next;
}
