import { _decorator, Component } from 'cc';
import * as GameConfig from './GameConfig';
import {
  enemyBulletRegister,
  enemyBulletUnregister,
  type EnemyBulletTarget,
} from './EnemyBulletRegistry';

const { ccclass } = _decorator;

/** 敌机发射的向下弹幕（MVP：仅与玩家 AABB 判定，见 PlayerController） */
@ccclass('EnemyBullet')
export class EnemyBullet extends Component implements EnemyBulletTarget {
  onLoad() {
    enemyBulletRegister(this);
  }

  onDestroy() {
    enemyBulletUnregister(this);
  }

  update(dt: number) {
    const p = this.node.position;
    const ny = p.y - GameConfig.ENEMY_BULLET_SPEED * dt;
    this.node.setPosition(p.x, ny, p.z);
    const limit = -GameConfig.DESIGN_H * 0.5 - 80;
    if (ny < limit) {
      this.node.destroy();
    }
  }
}
