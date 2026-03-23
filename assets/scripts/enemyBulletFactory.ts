import { Color, Graphics, Node, UITransform } from 'cc';
import { EnemyBullet } from './EnemyBullet';

/** 在 PlayField 下生成一枚敌弹（占位 Graphics） */
export function spawnEnemyBullet(playField: Node, x: number, y: number): void {
  const n = new Node('EnemyBullet');
  const ut = n.addComponent(UITransform);
  ut.setContentSize(8, 16);
  ut.setAnchorPoint(0.5, 0.5);
  const g = n.addComponent(Graphics);
  g.lineWidth = 0;
  g.fillColor = new Color(255, 180, 100, 255);
  g.rect(-4, -8, 8, 16);
  g.fill();
  n.addComponent(EnemyBullet);
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
