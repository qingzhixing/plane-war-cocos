import { isValid, type Rect, UITransform } from 'cc';
import { aabbOverlap } from './aabbMath';
import type { EnemyBulletTarget } from './EnemyBulletRegistry';

export function collectEnemyBulletsTouchingPlayer(
  playerWorldRect: Rect,
  bullets: readonly EnemyBulletTarget[],
): EnemyBulletTarget[] {
  const b = playerWorldRect;
  const out: EnemyBulletTarget[] = [];
  for (const e of bullets) {
    if (!isValid(e.node)) {
      continue;
    }
    const bu = e.node.getComponent(UITransform);
    if (!bu) {
      continue;
    }
    const bb = bu.getBoundingBoxToWorld();
    if (
      aabbOverlap(b.x, b.y, b.width, b.height, bb.x, bb.y, bb.width, bb.height)
    ) {
      out.push(e);
    }
  }
  return out;
}
