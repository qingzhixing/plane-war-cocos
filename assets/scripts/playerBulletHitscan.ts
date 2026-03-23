import { isValid, Rect, UITransform } from 'cc';
import type { EnemyHitTarget } from './EnemyRegistry';

/**
 * 玩家子弹世界 AABB 与登记敌机列表的首次命中（与 `PlayerBullet` 原逻辑一致）。
 * 便于与 Godot 侧 AABB 判定口径对照或单测 mock `EnemyHitTarget`。
 */
export function findFirstEnemyAabbHit(
  bulletWorldRect: Rect,
  enemies: readonly EnemyHitTarget[],
): EnemyHitTarget | null {
  for (const e of enemies) {
    if (!isValid(e.node)) {
      continue;
    }
    const eu = e.node.getComponent(UITransform);
    if (!eu) {
      continue;
    }
    const eb = eu.getBoundingBoxToWorld();
    if (bulletWorldRect.intersects(eb)) {
      return e;
    }
  }
  return null;
}
