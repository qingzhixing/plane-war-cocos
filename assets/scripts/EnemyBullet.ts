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
  /** 像素/秒，右为正 */
  velX = 0;
  /** 像素/秒；正数表示沿 +y，负数表示沿 -y（屏幕下） */
  velY = -GameConfig.ENEMY_BULLET_SPEED;

  onLoad() {
    enemyBulletRegister(this);
  }

  onDestroy() {
    enemyBulletUnregister(this);
  }

  update(dt: number) {
    const p = this.node.position;
    const nx = p.x + this.velX * dt;
    const ny = p.y + this.velY * dt;
    this.node.setPosition(nx, ny, p.z);
    const yLimit = -GameConfig.DESIGN_H * 0.5 - 80;
    const xLimit = GameConfig.DESIGN_W * 0.5 + 120;
    if (ny < yLimit || Math.abs(nx) > xLimit) {
      this.node.destroy();
    }
  }
}
