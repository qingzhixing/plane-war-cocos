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
/** Boss 占位 HP（MVP 固定；续战乘区未接） */
export const BOSS_BASE_HP = 300;
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
