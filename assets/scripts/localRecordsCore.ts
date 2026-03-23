/** 纯逻辑与键名（无引擎依赖，供 Vitest 与 `localRecords.ts` 共用） */

export type LocalRecords = {
  bestScore: number;
  bestCombo: number;
  /** 历史最高对敌 DPS（与局内 `maxDps` 合并；局内为约 5 秒滑动窗口） */
  bestDps: number;
};

export const DEFAULT_LOCAL_RECORDS: LocalRecords = {
  bestScore: 0,
  bestCombo: 0,
  bestDps: 0,
};

export const LOCAL_RECORDS_STORAGE_KEY = 'plane_war_cocos_records_v1';

export function mergeRunIntoRecords(
  prev: LocalRecords,
  score: number,
  maxCombo: number,
  maxDps: number,
): LocalRecords {
  return {
    bestScore: Math.max(prev.bestScore, score),
    bestCombo: Math.max(prev.bestCombo, maxCombo),
    bestDps: Math.max(prev.bestDps, maxDps),
  };
}
