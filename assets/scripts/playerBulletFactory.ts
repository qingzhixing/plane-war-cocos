import { Color, Graphics, Node } from 'cc';
import { attachBattleSpriteOrFallback, BattleSpritePath } from './battleSprites';
import { PlayerBullet } from './PlayerBullet';

/** 在 PlayField 下生成一枚玩家子弹（像素 `bullet_player_basic` 或 Graphics 兜底） */
export function spawnPlayerBullet(
  playField: Node,
  x: number,
  y: number,
  damage: number,
  bulletSpeed: number,
): void {
  const n = new Node('PlayerBullet');
  attachBattleSpriteOrFallback(
    n,
    BattleSpritePath.bulletPlayer,
    8,
    16,
    (g) => {
      g.lineWidth = 0;
      g.fillColor = new Color(255, 255, 120, 255);
      g.rect(-4, -8, 8, 16);
      g.fill();
    },
  );
  const pb = n.addComponent(PlayerBullet);
  pb.damage = damage;
  pb.speed = bulletSpeed;
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
