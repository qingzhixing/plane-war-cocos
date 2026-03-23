/** 纯数学，供擦弹判定与单测 */

export function distSq(ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  return dx * dx + dy * dy;
}

/** 目标中心 `(qx,qy)` 是否在玩家擦弹环内：`dist ≤ grazeR + extraR` */
export function inGrazeRing(
  px: number,
  py: number,
  grazeR: number,
  extraR: number,
  qx: number,
  qy: number,
): boolean {
  const maxD = grazeR + extraR;
  return distSq(px, py, qx, qy) <= maxD * maxD;
}
