import { Color, Graphics, Node, UITransform } from 'cc';
import { getBattleMain } from './battleAccess';
import { EnemyElite } from './EnemyElite';
import * as GameConfig from './GameConfig';

/** 在 PlayField 下生成一架精英（占位 Graphics；`spawnWave` 供 HP 缩放） */
export function spawnEnemyElite(
  playField: Node,
  spawnWave: number,
  x: number,
  y: number,
): void {
  const n = new Node('EnemyElite');
  const ut = n.addComponent(UITransform);
  ut.setContentSize(48, 48);
  ut.setAnchorPoint(0.5, 0.5);
  const g = n.addComponent(Graphics);
  g.lineWidth = 0;
  g.fillColor = new Color(180, 90, 220, 255);
  g.rect(-24, -24, 48, 48);
  g.fill();
  const eb = n.addComponent(EnemyElite);
  eb.spawnWave = spawnWave;
  const tier = getBattleMain()?.getThreatTier() ?? 0;
  eb.speed =
    GameConfig.ENEMY_SPEED *
    GameConfig.ENEMY_ELITE_SPEED_MULT *
    GameConfig.enemyMobilityTierMult(tier);
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
