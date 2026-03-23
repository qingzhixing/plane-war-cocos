/**
 * 连击得分系数（击杀结算时的当前连击数，区间见 GDD `06_enemies_and_boss.md` 示例表）。
 */
export function comboScoreCoefficient(comboAfterKill: number): number {
  if (comboAfterKill <= 0) {
    return 1;
  }
  if (comboAfterKill < 10) {
    return 1.0;
  }
  if (comboAfterKill < 25) {
    return 1.2;
  }
  if (comboAfterKill < 50) {
    return 1.5;
  }
  if (comboAfterKill < 100) {
    return 2.0;
  }
  return 3.0;
}
