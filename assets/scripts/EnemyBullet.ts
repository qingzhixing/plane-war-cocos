import { _decorator, Component } from 'cc';
import * as GameConfig from './GameConfig';
import {
  enemyBulletRegister,
  enemyBulletUnregister,
  type EnemyBulletTarget,
} from './EnemyBulletRegistry';
import { getPlayerTargetPosition } from './playerPositionAccess';

const { ccclass } = _decorator;

/** 敌机发射的向下弹幕（MVP：仅与玩家 AABB 判定，见 PlayerController） */
@ccclass('EnemyBullet')
export class EnemyBullet extends Component implements EnemyBulletTarget {
  /** 像素/秒，右为正 */
  velX = 0;
  /** 像素/秒；正数表示沿 +y，负数表示沿 -y（屏幕下） */
  velY = -GameConfig.ENEMY_BULLET_SPEED;
  /** 向玩家机方向限速转向（`spawnEnemyBullet` 可开启） */
  homing = false;
  private _speedMag = GameConfig.ENEMY_BULLET_SPEED;

  onLoad() {
    enemyBulletRegister(this);
    this._speedMag = Math.max(1, Math.hypot(this.velX, this.velY));
  }

  onDestroy() {
    enemyBulletUnregister(this);
  }

  update(dt: number) {
    const p = this.node.position;
    if (this.homing) {
      const target = getPlayerTargetPosition();
      if (target) {
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const desired = Math.atan2(dy, dx);
        const cur = Math.atan2(this.velY, this.velX);
        let diff = desired - cur;
        while (diff > Math.PI) {
          diff -= 2 * Math.PI;
        }
        while (diff < -Math.PI) {
          diff += 2 * Math.PI;
        }
        const w = GameConfig.ENEMY_HOMING_TURN_RAD_PER_SEC * dt;
        const next =
          cur + Math.sign(diff) * Math.min(Math.abs(diff), w);
        const spd = this._speedMag;
        this.velX = Math.cos(next) * spd;
        this.velY = Math.sin(next) * spd;
      }
    }
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
