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
/** 秒，MVP 定时刷怪间隔（完整波次见 EnemySpawner / main） */
export const ENEMY_SPAWN_INTERVAL = 1;
/** 与 EnemyBase max_hp 默认一致 */
export const ENEMY_MAX_HP = 4;
/** 生成时 Y（PlayField 局部坐标，靠屏幕上沿） */
export const ENEMY_SPAWN_Y = 580;
