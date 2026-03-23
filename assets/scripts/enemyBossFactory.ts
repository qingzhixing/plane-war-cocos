import { Color, Graphics, Node, UITransform } from 'cc';
import { EnemyBoss } from './EnemyBoss';
import * as GameConfig from './GameConfig';

export function spawnEnemyBoss(
  playField: Node,
  wave: number,
  threatTier: number,
  isContinuationBoss: boolean,
): void {
  const n = new Node('EnemyBoss');
  const ut = n.addComponent(UITransform);
  ut.setContentSize(72, 72);
  ut.setAnchorPoint(0.5, 0.5);
  const g = n.addComponent(Graphics);
  g.lineWidth = 0;
  g.fillColor = new Color(200, 60, 80, 255);
  g.rect(-36, -36, 72, 72);
  g.fill();
  const eb = n.addComponent(EnemyBoss);
  eb.spawnWave = wave;
  eb.maxHp = GameConfig.bossMaxHpForSpawn(threatTier, isContinuationBoss);
  n.setPosition(0, GameConfig.ENEMY_SPAWN_Y, 0);
  playField.addChild(n);
}
