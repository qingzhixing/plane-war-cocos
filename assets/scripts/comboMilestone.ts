/** 与 GDD `08` 一致的连击档位（降序遍历，先匹配最高档） */
export const COMBO_MILESTONE_TIERS = [100, 50, 25, 10] as const;

/**
 * 单次击杀后是否新跨越某一档位（上一帧 `prevCombo`、本帧 `newCombo`）。
 * 若同一次击杀跨越多个档位，只返回其中**最高**档。
 */
export function crossedComboMilestone(
  prevCombo: number,
  newCombo: number,
): number | null {
  for (const m of COMBO_MILESTONE_TIERS) {
    if (prevCombo < m && newCombo >= m) {
      return m;
    }
  }
  return null;
}

/** 文案用感叹号数量（与 GDD「10! / 25!!」示例一致） */
export function comboMilestoneBangCount(m: number): number {
  if (m >= 100) {
    return 4;
  }
  if (m >= 50) {
    return 3;
  }
  if (m >= 25) {
    return 2;
  }
  return 1;
}
