import type { Node } from 'cc';

/** 可被玩家子弹击中的目标（对齐 Godot apply_damage） */
export type EnemyHitTarget = {
  applyDamage(amount: number): void;
  node: Node;
};

const _enemies: EnemyHitTarget[] = [];

export function enemyRegister(e: EnemyHitTarget): void {
  _enemies.push(e);
}

export function enemyUnregister(e: EnemyHitTarget): void {
  const i = _enemies.indexOf(e);
  if (i >= 0) {
    _enemies.splice(i, 1);
  }
}

export function enemiesSnapshot(): EnemyHitTarget[] {
  return _enemies.slice();
}
