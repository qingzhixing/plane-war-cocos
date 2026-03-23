import { Color, Graphics, Node } from 'cc';
import { getBattleMain } from './battleAccess';
import { attachBattleSpriteOrFallback, BattleSpritePath } from './battleSprites';
import { EnemyBullet } from './EnemyBullet';
import * as GameConfig from './GameConfig';

export type SpawnEnemyBulletOpts = {
  /** 不传则仅竖直向下，`-enemyBulletSpeedForTier(tier)` */
  velX?: number;
  velY?: number;
  /** 追踪玩家机（需 `playerPositionAccess` 已注册） */
  homing?: boolean;
};

/** 在 PlayField 下生成一枚敌弹（占位 Graphics；默认速度随当前 `threatTier`） */
export function spawnEnemyBullet(
  playField: Node,
  x: number,
  y: number,
  opts?: SpawnEnemyBulletOpts,
): void {
  const n = new Node('EnemyBullet');
  const tier = getBattleMain()?.getThreatTier() ?? 0;
  const mag = GameConfig.enemyBulletSpeedForTier(tier);
  const homing = opts?.homing === true;
  const path = homing
    ? BattleSpritePath.bulletHoming
    : BattleSpritePath.bulletEnemy;
  attachBattleSpriteOrFallback(n, path, 8, 16, (g) => {
    g.lineWidth = 0;
    g.fillColor = homing
      ? new Color(255, 130, 210, 255)
      : new Color(255, 180, 100, 255);
    g.rect(-4, -8, 8, 16);
    g.fill();
  });
  const bullet = n.addComponent(EnemyBullet);
  const hasCustomVel =
    opts !== undefined &&
    (opts.velX !== undefined || opts.velY !== undefined);
  if (homing) {
    bullet.homing = true;
    const hm = mag * GameConfig.ENEMY_HOMING_BULLET_SPEED_MULT;
    bullet.velX = hasCustomVel ? (opts.velX ?? 0) : 0;
    bullet.velY = hasCustomVel ? (opts.velY ?? -hm) : -hm;
  } else if (hasCustomVel) {
    bullet.velX = opts!.velX ?? 0;
    bullet.velY = opts!.velY ?? -mag;
  } else {
    bullet.velX = 0;
    bullet.velY = -mag;
  }
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
