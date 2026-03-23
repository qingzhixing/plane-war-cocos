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
  /** 像素/秒；生成时由工厂按当前 `threatTier` 赋值 */
  speed = GameConfig.ENEMY_BULLET_SPEED;

  onLoad() {
    enemyBulletRegister(this);
  }

  onDestroy() {
    enemyBulletUnregister(this);
  }

  update(dt: number) {
    const p = this.node.position;
    const ny = p.y - this.speed * dt;
    this.node.setPosition(p.x, ny, p.z);
    const limit = -GameConfig.DESIGN_H * 0.5 - 80;
    if (ny < limit) {
      this.node.destroy();
    }
  }
}
