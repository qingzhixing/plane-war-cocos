import type { Node } from 'cc';

export type EnemyBulletTarget = {
  node: Node;
};

const _bullets: EnemyBulletTarget[] = [];

export function enemyBulletRegister(b: EnemyBulletTarget): void {
  _bullets.push(b);
}

export function enemyBulletUnregister(b: EnemyBulletTarget): void {
  const i = _bullets.indexOf(b);
  if (i >= 0) {
    _bullets.splice(i, 1);
  }
}

export function enemyBulletsSnapshot(): EnemyBulletTarget[] {
  return _bullets.slice();
}
