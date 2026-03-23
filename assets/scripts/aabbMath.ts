/**
 * 两轴对齐矩形是否相交（同一坐标系下；`x,y` 为矩形一角，`width/height` 为沿轴正方向的边长）。
 * 与 Cocos `Rect.intersects` 对轴对齐盒的语义一致，便于单测与对照 Godot AABB。
 */
export function aabbOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
