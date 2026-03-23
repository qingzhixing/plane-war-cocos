import { _decorator, Component } from 'cc';
import { getBattleMain } from './battleAccess';
import { spawnEnemyBullet } from './enemyBulletFactory';
import * as GameConfig from './GameConfig';
import { enemyRegister, enemyUnregister, type EnemyHitTarget } from './EnemyRegistry';

const { ccclass } = _decorator;

@ccclass('EnemySummoner')
export class EnemySummoner extends Component implements EnemyHitTarget {
  spawnWave = 1;
  expValue = GameConfig.ENEMY_SUMMONER_EXP_VALUE;
  scoreValue = GameConfig.ENEMY_SUMMONER_SCORE_VALUE;
  maxHp = GameConfig.ENEMY_SUMMONER_BASE_HP;
  private _hp = 0;
  speed = GameConfig.ENEMY_SPEED * GameConfig.ENEMY_SUMMONER_SPEED_MULT;
  private _fireAcc = 0;

  onLoad() {
    const f = GameConfig.waveHpFactor(this.spawnWave);
    const mh = Math.max(
      1,
      Math.round(GameConfig.ENEMY_SUMMONER_BASE_HP * f),
    );
    this.maxHp = mh;
    this._hp = mh;
    enemyRegister(this);
  }

  onDestroy() {
    enemyUnregister(this);
  }

  update(dt: number) {
    const p = this.node.position;
    const ny = p.y - this.speed * dt;
    this.node.setPosition(p.x, ny, p.z);

    this._fireAcc += dt;
    while (this._fireAcc >= GameConfig.ENEMY_SUMMONER_FIRE_INTERVAL) {
      this._fireAcc -= GameConfig.ENEMY_SUMMONER_FIRE_INTERVAL;
      const pf = this.node.parent;
      if (pf) {
        spawnEnemyBullet(pf, p.x, p.y - 26, { homing: true });
      }
    }

    const limit = GameConfig.DESIGN_H * 0.5 + 120;
    if (ny < -limit) {
      this.node.destroy();
    }
  }

  applyDamage(amount: number) {
    this._hp -= amount;
    if (this._hp <= 0) {
      getBattleMain()?.onEnemyKill(this.expValue, this.scoreValue);
      this.node.destroy();
    }
  }
}
