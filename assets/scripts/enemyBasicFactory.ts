import { Color, Graphics, Node, UITransform } from 'cc';
import { getBattleMain } from './battleAccess';
import { EnemyBasic } from './EnemyBasic';
import * as GameConfig from './GameConfig';

/** 在 PlayField 下生成一架基础敌机（占位 Graphics；`spawnWave` 供 `EnemyBasic` 做波次缩放） */
export function spawnEnemyBasic(
  playField: Node,
  spawnWave: number,
  x: number,
  y: number,
): void {
  const n = new Node('Enemy');
  const ut = n.addComponent(UITransform);
  ut.setContentSize(40, 40);
  ut.setAnchorPoint(0.5, 0.5);
  const g = n.addComponent(Graphics);
  g.lineWidth = 0;
  g.fillColor = new Color(255, 120, 80, 255);
  g.rect(-20, -20, 40, 40);
  g.fill();
  const eb = n.addComponent(EnemyBasic);
  eb.spawnWave = spawnWave;
  const tier = getBattleMain()?.getThreatTier() ?? 0;
  eb.speed =
    GameConfig.ENEMY_SPEED * GameConfig.enemyMobilityTierMult(tier);
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
