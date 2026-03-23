import { isValid, type Rect, UITransform } from 'cc';
import { aabbOverlap } from './aabbMath';
import type { EnemyHitTarget } from './EnemyRegistry';

/**
 * 收集与玩家世界矩形相交的敌机（用于撞机断连；不计入子弹命中逻辑）。
 */
export function collectEnemiesTouchingPlayer(
  playerWorldRect: Rect,
  enemies: readonly EnemyHitTarget[],
): EnemyHitTarget[] {
  const b = playerWorldRect;
  const out: EnemyHitTarget[] = [];
  for (const e of enemies) {
    if (!isValid(e.node)) {
      continue;
    }
    const eu = e.node.getComponent(UITransform);
    if (!eu) {
      continue;
    }
    const eb = eu.getBoundingBoxToWorld();
    if (
      aabbOverlap(b.x, b.y, b.width, b.height, eb.x, eb.y, eb.width, eb.height)
    ) {
      out.push(e);
    }
  }
  return out;
}
