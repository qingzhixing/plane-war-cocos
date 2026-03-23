import { Color, Graphics, Node, UITransform } from 'cc';
import { EnemyTurret } from './EnemyTurret';

/** 在 PlayField 下生成一架炮台机（占位 Graphics；`spawnWave` 供 HP 缩放） */
export function spawnEnemyTurret(
  playField: Node,
  spawnWave: number,
  x: number,
  y: number,
): void {
  const n = new Node('EnemyTurret');
  const ut = n.addComponent(UITransform);
  ut.setContentSize(44, 44);
  ut.setAnchorPoint(0.5, 0.5);
  const g = n.addComponent(Graphics);
  g.lineWidth = 0;
  g.fillColor = new Color(100, 200, 230, 255);
  g.rect(-22, -22, 44, 44);
  g.fill();
  const t = n.addComponent(EnemyTurret);
  t.spawnWave = spawnWave;
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
