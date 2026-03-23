import { Color, Graphics, Node } from 'cc';
import { attachBattleSpriteOrFallback, BattleSpritePath } from './battleSprites';
import { EnemyBoss } from './EnemyBoss';
import * as GameConfig from './GameConfig';

/** Boss 暂复用 `enemy_elite_01` 贴图（见 GDD `11`） */
export function spawnEnemyBoss(
  playField: Node,
  wave: number,
  threatTier: number,
  isContinuationBoss: boolean,
): void {
  const n = new Node('EnemyBoss');
  attachBattleSpriteOrFallback(n, BattleSpritePath.enemyBoss, 72, 72, (g) => {
    g.lineWidth = 0;
    g.fillColor = new Color(200, 60, 80, 255);
    g.rect(-36, -36, 72, 72);
    g.fill();
  });
  const eb = n.addComponent(EnemyBoss);
  eb.spawnWave = wave;
  eb.maxHp = GameConfig.bossMaxHpForSpawn(threatTier, isContinuationBoss);
  eb.speed =
    GameConfig.BOSS_SPEED * GameConfig.enemyMobilityTierMult(threatTier);
  n.setPosition(0, GameConfig.ENEMY_SPAWN_Y, 0);
  playField.addChild(n);
}
