import { Color, Graphics, Node } from 'cc';
import { getBattleMain } from './battleAccess';
import { attachBattleSpriteOrFallback, BattleSpritePath } from './battleSprites';
import { EnemyElite } from './EnemyElite';
import * as GameConfig from './GameConfig';

/** 在 PlayField 下生成一架精英（`enemy_elite_01` 或 Graphics 兜底） */
export function spawnEnemyElite(
  playField: Node,
  spawnWave: number,
  x: number,
  y: number,
): void {
  const n = new Node('EnemyElite');
  attachBattleSpriteOrFallback(n, BattleSpritePath.enemyElite, 48, 48, (g) => {
    g.lineWidth = 0;
    g.fillColor = new Color(180, 90, 220, 255);
    g.rect(-24, -24, 48, 48);
    g.fill();
  });
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
