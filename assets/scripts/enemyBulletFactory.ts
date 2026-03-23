import { Color, Graphics, Node, UITransform } from 'cc';
import { getBattleMain } from './battleAccess';
import { EnemyBullet } from './EnemyBullet';
import * as GameConfig from './GameConfig';

export type SpawnEnemyBulletOpts = {
  /** 不传则仅竖直向下，`-enemyBulletSpeedForTier(tier)` */
  velX?: number;
  velY?: number;
};

/** 在 PlayField 下生成一枚敌弹（占位 Graphics；默认速度随当前 `threatTier`） */
export function spawnEnemyBullet(
  playField: Node,
  x: number,
  y: number,
  opts?: SpawnEnemyBulletOpts,
): void {
  const n = new Node('EnemyBullet');
  const ut = n.addComponent(UITransform);
  ut.setContentSize(8, 16);
  ut.setAnchorPoint(0.5, 0.5);
  const g = n.addComponent(Graphics);
  g.lineWidth = 0;
  g.fillColor = new Color(255, 180, 100, 255);
  g.rect(-4, -8, 8, 16);
  g.fill();
  const tier = getBattleMain()?.getThreatTier() ?? 0;
  const mag = GameConfig.enemyBulletSpeedForTier(tier);
  const bullet = n.addComponent(EnemyBullet);
  if (opts !== undefined && (opts.velX !== undefined || opts.velY !== undefined)) {
    bullet.velX = opts.velX ?? 0;
    bullet.velY = opts.velY ?? -mag;
  } else {
    bullet.velX = 0;
    bullet.velY = -mag;
  }
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
