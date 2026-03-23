import { Color, Graphics, Node, UITransform } from 'cc';
import { PlayerBullet } from './PlayerBullet';

/** 在 PlayField 下生成一枚玩家子弹（占位 Graphics，数值由调用方传入） */
export function spawnPlayerBullet(
  playField: Node,
  x: number,
  y: number,
  damage: number,
  bulletSpeed: number,
): void {
  const n = new Node('PlayerBullet');
  const ut = n.addComponent(UITransform);
  ut.setContentSize(8, 16);
  ut.setAnchorPoint(0.5, 0.5);
  const g = n.addComponent(Graphics);
  g.lineWidth = 0;
  g.fillColor = new Color(255, 255, 120, 255);
  g.rect(-4, -8, 8, 16);
  g.fill();
  const pb = n.addComponent(PlayerBullet);
  pb.damage = damage;
  pb.speed = bulletSpeed;
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
