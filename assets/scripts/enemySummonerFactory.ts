import { Color, Graphics, Node } from 'cc';
import { getBattleMain } from './battleAccess';
import { attachBattleSpriteOrFallback, BattleSpritePath } from './battleSprites';
import { EnemySummoner } from './EnemySummoner';
import * as GameConfig from './GameConfig';

/** 在 PlayField 下生成一架召唤机（`enemy_basic_01` 或 Graphics 兜底） */
export function spawnEnemySummoner(
  playField: Node,
  spawnWave: number,
  x: number,
  y: number,
): void {
  const n = new Node('EnemySummoner');
  attachBattleSpriteOrFallback(
    n,
    BattleSpritePath.enemySummoner,
    38,
    38,
    (g) => {
      g.lineWidth = 0;
      g.fillColor = new Color(255, 200, 120, 255);
      g.rect(-19, -19, 38, 38);
      g.fill();
    },
  );
  const s = n.addComponent(EnemySummoner);
  s.spawnWave = spawnWave;
  const tier = getBattleMain()?.getThreatTier() ?? 0;
  s.speed =
    GameConfig.ENEMY_SPEED *
    GameConfig.ENEMY_SUMMONER_SPEED_MULT *
    GameConfig.enemyMobilityTierMult(tier);
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
