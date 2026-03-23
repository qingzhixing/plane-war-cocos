import { Color, Graphics, Node } from 'cc';
import { attachBattleSpriteOrFallback, BattleSpritePath } from './battleSprites';
import { EnemyTurret } from './EnemyTurret';

/** 在 PlayField 下生成一架炮台机（`enemy_basic_02` 或 Graphics 兜底） */
export function spawnEnemyTurret(
  playField: Node,
  spawnWave: number,
  x: number,
  y: number,
): void {
  const n = new Node('EnemyTurret');
  attachBattleSpriteOrFallback(n, BattleSpritePath.enemyTurret, 44, 44, (g) => {
    g.lineWidth = 0;
    g.fillColor = new Color(100, 200, 230, 255);
    g.rect(-22, -22, 44, 44);
    g.fill();
  });
  const t = n.addComponent(EnemyTurret);
  t.spawnWave = spawnWave;
  n.setPosition(x, y, 0);
  playField.addChild(n);
}
