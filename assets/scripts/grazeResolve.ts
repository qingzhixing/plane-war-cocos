import { isValid, type Rect, UITransform } from 'cc';
import { aabbOverlap } from './aabbMath';
import type { EnemyBulletTarget } from './EnemyBulletRegistry';
import type { EnemyHitTarget } from './EnemyRegistry';
import { inGrazeRing } from './grazeMath';
import * as GameConfig from './GameConfig';

/**
 * 敌弹：在擦弹环内且 **不与玩家受击矩形重叠**（中弹区优先，不替代受击）。
 */
export function collectGrazeableBullets(
  playerCenterX: number,
  playerCenterY: number,
  hitRect: Rect,
  bullets: readonly EnemyBulletTarget[],
): EnemyBulletTarget[] {
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
      aabbOverlap(
        hitRect.x,
        hitRect.y,
        hitRect.width,
        hitRect.height,
        bb.x,
        bb.y,
        bb.width,
        bb.height,
      )
    ) {
      continue;
    }
    const cx = bb.x + bb.width * 0.5;
    const cy = bb.y + bb.height * 0.5;
    const br = Math.max(bb.width, bb.height) * 0.5;
    if (
      !inGrazeRing(
        playerCenterX,
        playerCenterY,
        GameConfig.GRAZE_RADIUS,
        br,
        cx,
        cy,
      )
    ) {
      continue;
    }
    out.push(e);
  }
  return out;
}

/**
 * 敌机：中心进入擦弹环且 **不与玩家受击矩形重叠**（重叠则走撞机）。
 */
export function collectGrazeableEnemies(
  playerCenterX: number,
  playerCenterY: number,
  hitRect: Rect,
  enemies: readonly EnemyHitTarget[],
): EnemyHitTarget[] {
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
      aabbOverlap(
        hitRect.x,
        hitRect.y,
        hitRect.width,
        hitRect.height,
        eb.x,
        eb.y,
        eb.width,
        eb.height,
      )
    ) {
      continue;
    }
    const cx = eb.x + eb.width * 0.5;
    const cy = eb.y + eb.height * 0.5;
    const er = Math.max(eb.width, eb.height) * 0.5;
    if (
      !inGrazeRing(
        playerCenterX,
        playerCenterY,
        GameConfig.GRAZE_RADIUS,
        er,
        cx,
        cy,
      )
    ) {
      continue;
    }
    out.push(e);
  }
  return out;
}
