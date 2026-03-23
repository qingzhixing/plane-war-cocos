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
/** 实际受击（断连）后的无敌时间（秒），与 GDD「约 1s」一致 */
export const PLAYER_INVULN_SEC = 1;
/** 无敌期间机体明暗切换频率（Hz，近似） */
export const PLAYER_INVULN_BLINK_HZ = 8;
/** 连击中断提示显示时长（秒） */
export const COMBO_BREAK_DISPLAY_SEC = 1.15;
/** 连击档位「Combo!」提示显示时长（秒） */
export const COMBO_MILESTONE_DISPLAY_SEC = 1.05;

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

/** GDD「Boss 与威胁」：小怪/Boss 机体移速 × 1.12^tier */
export const ENEMY_MOBILITY_TIER_BASE = 1.12;

export function enemyMobilityTierMult(tier: number): number {
  const t = Math.max(0, tier);
  return Math.pow(ENEMY_MOBILITY_TIER_BASE, t);
}

/** 对敌 DPS 滑动窗口（秒），与 GDD「约 5 秒」一致 */
export const DPS_WINDOW_SEC = 5;
/** 敌机发射敌弹间隔（秒），MVP 占位 */
export const ENEMY_FIRE_INTERVAL = 2.5;
/** 秒，MVP 定时刷怪间隔（完整波次见 EnemySpawner / main） */
export const ENEMY_SPAWN_INTERVAL = 1;
/** 与 EnemyBase max_hp 默认一致 */
export const ENEMY_MAX_HP = 4;
/** Elite01 基数 HP（再乘 `waveHpFactor(spawnWave)`，见 GDD 06） */
export const ENEMY_ELITE_BASE_HP = 6;
/** 相对 ENEMY_SPEED 的精英下移速 */
export const ENEMY_ELITE_SPEED_MULT = 0.65;
export const ENEMY_ELITE_EXP_VALUE = 15;
export const ENEMY_ELITE_SCORE_VALUE = 50;
/** 秒；圆环弹幕间隔（GDD：约 2s） */
export const ENEMY_ELITE_FIRE_INTERVAL = 2;
export const ENEMY_ELITE_RING_BULLETS = 8;
/** 相对 `enemyBulletSpeedForTier` 的圆环弹速（GDD 约 260–320 vs 基数 420） */
export const ENEMY_ELITE_RING_BULLET_SPEED_MULT = 0.72;
/** 主线第 3～7 波小怪每次生成掷为精英的概率（第 1～2 波为 0） */
export const MAIN_LINE_ELITE_CHANCE = 0.18;
/** Basic02 炮台：基数 HP（略高于 `ENEMY_MAX_HP`） */
export const ENEMY_TURRET_BASE_HP = 5;
export const ENEMY_TURRET_EXP_VALUE = 8;
export const ENEMY_TURRET_SCORE_VALUE = 15;
/** 下移到锚点前相对 `ENEMY_SPEED` 的倍率 */
export const ENEMY_TURRET_DESCENT_MULT = 0.52;
/** PlayField 局部 Y，到达后左右漂移并开火（须小于 `ENEMY_SPAWN_Y`） */
export const ENEMY_TURRET_ANCHOR_Y = 220;
export const ENEMY_TURRET_DRIFT_SPEED = 52;
/** 一轮射毕到下一轮前摇开始（秒） */
export const ENEMY_TURRET_VOLLEY_IDLE = 1.8;
/** GDD：约 0.7s 前摇 */
export const ENEMY_TURRET_WINDUP = 0.7;
/** 2～3 发扇形的半角（弧度） */
export const ENEMY_TURRET_FAN_HALF_RAD = 0.22;
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

/** 主线小怪精英率：第 1～2 波不出精英；第 3～`BOSS_WAVE-1` 波为 `MAIN_LINE_ELITE_CHANCE` */
export function mainLineEliteChance(wave: number): number {
  const w = Math.max(1, Math.floor(wave));
  if (w < 3) {
    return 0;
  }
  if (w >= BOSS_WAVE) {
    return 0;
  }
  return MAIN_LINE_ELITE_CHANCE;
}

/** 续战块 1～7 波小怪精英率（与 GDD `05b` 表一致） */
export function continuationBlockEliteRate(blockWave: number): number {
  const rates = [0.22, 0.28, 0.34, 0.4, 0.46, 0.5, 0.54];
  const bw = Math.max(1, Math.min(7, Math.floor(blockWave)));
  return rates[bw - 1];
}

/** 主线炮台率：第 1 波为 0；第 2 波起有概率（与 GDD「首波以冲锋为主」一致） */
export function mainLineTurretChance(wave: number): number {
  const w = Math.max(1, Math.floor(wave));
  if (w <= 1) {
    return 0;
  }
  if (w >= BOSS_WAVE) {
    return 0;
  }
  if (w === 2) {
    return 0.28;
  }
  return 0.34;
}

/** 续战块 1～7 波炮台混入率（与精英率表同向递增，数值独立） */
export function continuationBlockTurretRate(blockWave: number): number {
  const rates = [0.18, 0.22, 0.26, 0.3, 0.34, 0.38, 0.42];
  const bw = Math.max(1, Math.min(7, Math.floor(blockWave)));
  return rates[bw - 1];
}

/** Basic03 召唤机：基数 HP（低于冲锋机基数 4） */
export const ENEMY_SUMMONER_BASE_HP = 3;
export const ENEMY_SUMMONER_EXP_VALUE = 4;
export const ENEMY_SUMMONER_SCORE_VALUE = 8;
/** 相对 `ENEMY_SPEED` 的下移倍率 */
export const ENEMY_SUMMONER_SPEED_MULT = 0.92;
/** 秒；低频追踪弹 */
export const ENEMY_SUMMONER_FIRE_INTERVAL = 4.2;
/** 追踪弹相对 `enemyBulletSpeedForTier` 的倍率 */
export const ENEMY_HOMING_BULLET_SPEED_MULT = 0.88;
/** 追踪弹每秒最大转角（弧度），数值越小越「笨」 */
export const ENEMY_HOMING_TURN_RAD_PER_SEC = 1.65;

/** 主线召唤机率：第 1 波为 0；第 2 波起混入 */
export function mainLineSummonerChance(wave: number): number {
  const w = Math.max(1, Math.floor(wave));
  if (w <= 1) {
    return 0;
  }
  if (w >= BOSS_WAVE) {
    return 0;
  }
  if (w === 2) {
    return 0.14;
  }
  return 0.2;
}

/** 续战块 1～7 波召唤机混入率 */
export function continuationBlockSummonerRate(blockWave: number): number {
  const rates = [0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 0.24];
  const bw = Math.max(1, Math.min(7, Math.floor(blockWave)));
  return rates[bw - 1];
}
