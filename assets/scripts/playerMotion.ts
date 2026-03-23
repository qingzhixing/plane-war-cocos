import { KeyCode } from 'cc';

/** 由当前按键得到方向向量（未归一化；全 0 表示无输入） */
export function keyboardMoveDirection(pressedKeys: Set<number>): {
  dx: number;
  dy: number;
} {
  let dx = 0;
  let dy = 0;
  if (pressedKeys.has(KeyCode.KEY_W) || pressedKeys.has(KeyCode.ARROW_UP)) dy += 1;
  if (pressedKeys.has(KeyCode.KEY_S) || pressedKeys.has(KeyCode.ARROW_DOWN)) dy -= 1;
  if (pressedKeys.has(KeyCode.KEY_A) || pressedKeys.has(KeyCode.ARROW_LEFT)) dx -= 1;
  if (pressedKeys.has(KeyCode.KEY_D) || pressedKeys.has(KeyCode.ARROW_RIGHT)) dx += 1;
  return { dx, dy };
}

/** 键控本帧位移（像素），与 Godot `player.gd` 对角线归一化一致 */
export function keyboardDisplacement(
  dir: { dx: number; dy: number },
  dt: number,
  moveSpeed: number,
  keyboardMult: number,
): { dx: number; dy: number } {
  if (dir.dx === 0 && dir.dy === 0) {
    return { dx: 0, dy: 0 };
  }
  const len = Math.sqrt(dir.dx * dir.dx + dir.dy * dir.dy);
  const m = moveSpeed * keyboardMult * dt * (1 / len);
  return { dx: dir.dx * m, dy: dir.dy * m };
}

/** 限制单帧拖拽位移向量长度（与 `GameConfig.MAX_DRAG_DELTA` 配合） */
export function clampDeltaLength(
  dx: number,
  dy: number,
  maxLen: number,
): { dx: number; dy: number } {
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len <= maxLen || len === 0) {
    return { dx, dy };
  }
  const s = maxLen / len;
  return { dx: dx * s, dy: dy * s };
}

/** 可移动区域半宽/半高（设计分辨率 − 边距） */
export function playableHalfExtents(
  designW: number,
  designH: number,
  margin: number,
): { halfX: number; halfY: number } {
  return {
    halfX: designW * 0.5 - margin,
    halfY: designH * 0.5 - margin,
  };
}

export function clampToPlayableRect(
  x: number,
  y: number,
  halfX: number,
  halfY: number,
): { x: number; y: number; moved: boolean } {
  const cx = Math.min(halfX, Math.max(-halfX, x));
  const cy = Math.min(halfY, Math.max(-halfY, y));
  return { x: cx, y: cy, moved: cx !== x || cy !== y };
}

/** 多发横向偏移（居中对称） */
export function multiShotOffsets(count: number, spread: number): number[] {
  const c = Math.max(1, Math.floor(count));
  const out: number[] = [];
  for (let i = 0; i < c; i++) {
    const ox = c === 1 ? 0 : (i - (c - 1) * 0.5) * spread;
    out.push(ox);
  }
  return out;
}
