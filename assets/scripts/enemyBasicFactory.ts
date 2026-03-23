import { Color, Graphics, Node } from 'cc';
import { getBattleMain } from './battleAccess';
import { attachBattleSpriteOrFallback, BattleSpritePath } from './battleSprites';
import { EnemyBasic } from './EnemyBasic';
import * as GameConfig from './GameConfig';

/** 在 PlayField 下生成一架基础敌机（`enemy_basic_01` 或 Graphics 兜底） */
export function spawnEnemyBasic(
  playField: Node,
  spawnWave: number,
  x: number,
  y: number,
): void {
  const n = new Node('Enemy');
  attachBattleSpriteOrFallback(n, BattleSpritePath.enemyBasic, 40, 40, (g) => {
    g.lineWidth = 0;
    g.fillColor = new Color(255, 120, 80, 255);
    g.rect(-20, -20, 40, 40);
    g.fill();
  });
  const eb = n.addComponent(EnemyBasic);
  eb.spawnWave = spawnWave;
  const tier = getBattleMain()?.getThreatTier() ?? 0;
  eb.speed =
    GameConfig.ENEMY_SPEED * GameConfig.enemyMobilityTierMult(tier);
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
