import { _decorator, Component } from 'cc';
import { getBattleMain } from './battleAccess';
import { spawnEnemyBullet } from './enemyBulletFactory';
import * as GameConfig from './GameConfig';
import { enemyRegister, enemyUnregister, type EnemyHitTarget } from './EnemyRegistry';

const { ccclass } = _decorator;

/** 主线第 `BOSS_WAVE` 波占位 Boss（高 HP、慢速、敌弹更密） */
@ccclass('EnemyBoss')
export class EnemyBoss extends Component implements EnemyHitTarget {
  spawnWave = 1;
  expValue = GameConfig.BOSS_EXP_VALUE;
  scoreValue = GameConfig.BOSS_SCORE_VALUE;
  /** 生成前由工厂设为 `bossMaxHpForTier(tier)` */
  maxHp = GameConfig.BOSS_BASE_HP;
  private _hp = 0;
  speed = GameConfig.BOSS_SPEED;
  private _fireAcc = 0;

  onLoad() {
    this._hp = this.maxHp;
    enemyRegister(this);
    getBattleMain()?.onBossSpawned(this.maxHp);
  }

  onDestroy() {
    enemyUnregister(this);
    getBattleMain()?.onBossGone();
  }

  update(dt: number) {
    const p = this.node.position;
    const ny = p.y - this.speed * dt;
    this.node.setPosition(p.x, ny, p.z);

    this._fireAcc += dt;
    while (this._fireAcc >= GameConfig.BOSS_FIRE_INTERVAL) {
      this._fireAcc -= GameConfig.BOSS_FIRE_INTERVAL;
      const pf = this.node.parent;
      if (pf) {
        spawnEnemyBullet(pf, p.x - 20, p.y - 40);
        spawnEnemyBullet(pf, p.x + 20, p.y - 40);
      }
    }

    const limit = GameConfig.DESIGN_H * 0.5 + 120;
    if (ny < -limit) {
      this.node.destroy();
    }
  }

  applyDamage(amount: number) {
    this._hp -= amount;
    getBattleMain()?.onBossHpChanged(this._hp, this.maxHp);
    if (this._hp <= 0) {
      getBattleMain()?.onEnemyKill(this.expValue, this.scoreValue);
      this.node.destroy();
    }
  }
}
