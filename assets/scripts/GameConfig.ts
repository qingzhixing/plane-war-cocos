/** 与 Godot 默认/导出变量对齐的基础战斗常数（见 plane-war/scripts/player.gd、BulletBase.gd） */
export const DESIGN_W = 720;
export const DESIGN_H = 1280;
export const MARGIN = 16;
/** 秒，对应 fire_interval */
export const FIRE_INTERVAL = 0.2;
/** 像素/秒，对应 bullet_speed */
export const BULLET_SPEED = 1200;
/** 键控移动速度（像素/秒） */
export const MOVE_SPEED = 600;
/** 与 Godot keyboard_speed_multiplier 一致 */
export const KEYBOARD_SPEED_MULT = 1.5;
/** 单帧拖拽位移上限（像素），与 Godot max_delta */
export const MAX_DRAG_DELTA = 120;

/** 敌机基础弹伤害（对齐 BulletBase damage 默认） */
export const BULLET_DAMAGE = 1;
/** 与 enemy_basic.gd speed 默认一致 */
export const ENEMY_SPEED = 250;
/** 敌弹下落速度（像素/秒），MVP 占位 */
export const ENEMY_BULLET_SPEED = 420;
/** 敌弹速度威胁乘区底数；倍率上限见 `enemyBulletSpeedMultiplier` */
export const ENEMY_BULLET_SPEED_TIER_BASE = 1.04;
export const ENEMY_BULLET_SPEED_TIER_CAP = 1.35;

/** GDD「Boss 与威胁」：敌弹 `× min(1.35, 1.04^tier)` */
export function enemyBulletSpeedMultiplier(tier: number): number {
  const t = Math.max(0, tier);
  return Math.min(
    ENEMY_BULLET_SPEED_TIER_CAP,
    Math.pow(ENEMY_BULLET_SPEED_TIER_BASE, t),
  );
}

export function enemyBulletSpeedForTier(tier: number): number {
  return ENEMY_BULLET_SPEED * enemyBulletSpeedMultiplier(tier);
}
/** 敌机发射敌弹间隔（秒），MVP 占位 */
export const ENEMY_FIRE_INTERVAL = 2.5;
/** 秒，MVP 定时刷怪间隔（完整波次见 EnemySpawner / main） */
export const ENEMY_SPAWN_INTERVAL = 1;
/** 与 EnemyBase max_hp 默认一致 */
export const ENEMY_MAX_HP = 4;
/** 生成时 Y（PlayField 局部坐标，靠屏幕上沿） */
export const ENEMY_SPAWN_Y = 580;

/** 主线 Boss 所在波次（GDD：第 8 波） */
export const BOSS_WAVE = 8;
/** Boss 基数 HP；实际最大 HP 见 `bossMaxHpForTier`（×1.2^tier） */
export const BOSS_BASE_HP = 300;
/** 威胁乘区：与 GDD「Boss 与威胁」一致 */
export const BOSS_HP_TIER_MULT = 1.2;
/** 续战 Boss 在 `bossMaxHpForTier` 之后再乘 `(3.2 + tier)` */
export const BOSS_CONTINUATION_MULT = 3.2;

/** 主线 / 续战块威胁等级（≥0）；主线开局为 0。 */
export function bossMaxHpForTier(tier: number): number {
  const t = Math.max(0, tier);
  return Math.round(BOSS_BASE_HP * Math.pow(BOSS_HP_TIER_MULT, t));
}

/** Boss 生成用最大 HP：续战第 8 波 Boss 额外乘区。 */
export function bossMaxHpForSpawn(
  tier: number,
  isContinuationBoss: boolean,
): number {
  const base = bossMaxHpForTier(tier);
  if (!isContinuationBoss) {
    return base;
  }
  const t = Math.max(0, tier);
  return Math.round(base * (BOSS_CONTINUATION_MULT + t));
}
export const BOSS_SPEED = 80;
export const BOSS_EXP_VALUE = 50;
export const BOSS_SCORE_VALUE = 200;
/** Boss 发射敌弹间隔（秒），略快于小怪 */
export const BOSS_FIRE_INTERVAL = 1;

/** 与 enemy_spawner.gd enemies_per_wave_base / increment 一致 */
export const ENEMIES_PER_WAVE_BASE = 7;
export const ENEMIES_PER_WAVE_INCREMENT = 3;

/** 与 EnemyBase.apply_wave_scaling 主线公式一致：wave>1 时 max_hp × (1 + 0.25×(wave−1)) */
export function waveHpFactor(wave: number): number {
  if (wave <= 1) {
    return 1;
  }
  return 1 + 0.25 * (wave - 1);
}

/** 续战块内第 1～7 波小怪数量（GDD `05b`：基数 + tier×系数） */
export function continuationBlockEnemyCount(
  blockWave: number,
  threatTier: number,
): number {
  const t = Math.max(0, threatTier);
  const bw = Math.max(1, Math.min(7, Math.floor(blockWave)));
  const base = [8, 11, 13, 15, 17, 19, 22];
  const tierCoeff = bw >= 6 ? 3 : 2;
  return base[bw - 1] + t * tierCoeff;
}

/** 相对 `ENEMY_SPAWN_INTERVAL` 的间隔倍率（越小刷得越快） */
export function continuationBlockSpawnIntervalMult(blockWave: number): number {
  const mults = [0.88, 0.72, 0.64, 0.56, 0.5, 0.46, 0.42];
  const bw = Math.max(1, Math.min(7, Math.floor(blockWave)));
  return mults[bw - 1];
}

/**
 * 续战小怪 HP 用「等效波次」代入 `waveHpFactor`（GDD 表末列 8～14）。
 * 块内波 1→7 对应 8→14。
 */
export function continuationBlockEquivalentHpWave(blockWave: number): number {
  const bw = Math.max(1, Math.min(7, Math.floor(blockWave)));
  return 7 + bw;
}
