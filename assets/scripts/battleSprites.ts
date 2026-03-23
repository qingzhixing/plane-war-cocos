import { Graphics, Node, Sprite, SpriteFrame, UITransform, resources } from 'cc';

/** `resources.load` 路径（相对 `assets/resources/`，无扩展名） */
export const BattleSpritePath = {
  playerShip: 'sprites/player/player_ship_base',
  bulletPlayer: 'sprites/bullets/bullet_player_basic',
  bulletEnemy: 'sprites/bullets/bullet_enemy_basic',
  bulletHoming: 'sprites/bullets/spell_bullet',
  enemyBasic: 'sprites/enemies/enemy_basic_01',
  enemyTurret: 'sprites/enemies/enemy_basic_02',
  enemySummoner: 'sprites/enemies/enemy_basic_01',
  enemyElite: 'sprites/enemies/enemy_elite_01',
  enemyBoss: 'sprites/enemies/enemy_elite_01',
} as const;

const _cache = new Map<string, SpriteFrame>();

const _uniquePaths = [...new Set(Object.values(BattleSpritePath))];

export function getBattleSprite(path: string): SpriteFrame | null {
  return _cache.get(path) ?? null;
}

export function clearBattleSpriteCache(): void {
  _cache.clear();
}

/**
 * 预载战斗用像素（`Game.scene` 的 `GameRoot.onLoad` 内先于 `createPlayField` 调用）。
 * 单个失败仍继续；全部回调后 `err` 为首个错误（若有）。
 */
export function preloadBattleSpriteFrames(
  done: (err: Error | null) => void,
): void {
  let remaining = _uniquePaths.length;
  let firstErr: Error | null = null;
  if (remaining === 0) {
    done(null);
    return;
  }
  for (const p of _uniquePaths) {
    resources.load(p, SpriteFrame, (err, sf) => {
      if (err) {
        console.warn('[battleSprites] load failed', p, err);
        firstErr = firstErr ?? err;
      } else if (sf) {
        _cache.set(p, sf);
      }
      remaining -= 1;
      if (remaining === 0) {
        done(firstErr);
      }
    });
  }
}

/**
 * 已预载则挂 `Sprite`（`CUSTOM` 尺寸）；否则执行 `fallback` 画占位矩形。
 */
export function attachBattleSpriteOrFallback(
  node: Node,
  path: string,
  w: number,
  h: number,
  fallback: (g: Graphics) => void,
): void {
  const ut =
    node.getComponent(UITransform) ?? node.addComponent(UITransform);
  ut.setContentSize(w, h);
  ut.setAnchorPoint(0.5, 0.5);
  const sf = getBattleSprite(path);
  if (sf) {
    const sp = node.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.spriteFrame = sf;
    return;
  }
  const g = node.addComponent(Graphics);
  fallback(g);
}
