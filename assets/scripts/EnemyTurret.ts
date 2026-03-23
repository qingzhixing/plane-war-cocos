import { _decorator, Component } from 'cc';
import { getBattleMain } from './battleAccess';
import { spawnEnemyBullet } from './enemyBulletFactory';
import * as GameConfig from './GameConfig';
import { enemyRegister, enemyUnregister, type EnemyHitTarget } from './EnemyRegistry';
import { playEnemyExplodeSfx, playEnemyHitSfx } from './gameAudio';

const { ccclass } = _decorator;

@ccclass('EnemyTurret')
export class EnemyTurret extends Component implements EnemyHitTarget {
  spawnWave = 1;
  expValue = GameConfig.ENEMY_TURRET_EXP_VALUE;
  scoreValue = GameConfig.ENEMY_TURRET_SCORE_VALUE;
  maxHp = GameConfig.ENEMY_TURRET_BASE_HP;
  private _hp = 0;
  private _anchored = false;
  private _idleAcc = 0;
  private _windingUp = false;
  private _windupRemain = 0;
  private _driftDir = 1;

  onLoad() {
    const f = GameConfig.waveHpFactor(this.spawnWave);
    const mh = Math.max(
      1,
      Math.round(GameConfig.ENEMY_TURRET_BASE_HP * f),
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
    const tier = getBattleMain()?.getThreatTier() ?? 0;
    const mob = GameConfig.enemyMobilityTierMult(tier);

    if (!this._anchored) {
      const descent =
        GameConfig.ENEMY_SPEED *
        GameConfig.ENEMY_TURRET_DESCENT_MULT *
        mob;
      let ny = p.y - descent * dt;
      if (ny <= GameConfig.ENEMY_TURRET_ANCHOR_Y) {
        ny = GameConfig.ENEMY_TURRET_ANCHOR_Y;
        this._anchored = true;
      }
      this.node.setPosition(p.x, ny, p.z);
      const limit = GameConfig.DESIGN_H * 0.5 + 120;
      if (ny < -limit) {
        this.node.destroy();
      }
      return;
    }

    const drift = GameConfig.ENEMY_TURRET_DRIFT_SPEED * mob;
    let nx = p.x + this._driftDir * drift * dt;
    const xLim = (GameConfig.DESIGN_W - 80) * 0.46;
    if (Math.abs(nx) > xLim) {
      this._driftDir *= -1;
      nx = p.x + this._driftDir * drift * dt;
    }
    this.node.setPosition(nx, p.y, p.z);

    if (this._windingUp) {
      this._windupRemain -= dt;
      if (this._windupRemain <= 0) {
        this._fireVolley();
        this._windingUp = false;
        this._idleAcc = 0;
      }
      return;
    }

    this._idleAcc += dt;
    if (this._idleAcc >= GameConfig.ENEMY_TURRET_VOLLEY_IDLE) {
      this._windingUp = true;
      this._windupRemain = GameConfig.ENEMY_TURRET_WINDUP;
      this._idleAcc = 0;
    }
  }

  private _fireVolley() {
    const pf = this.node.parent;
    if (!pf) {
      return;
    }
    const p = this.node.position;
    const tier = getBattleMain()?.getThreatTier() ?? 0;
    const mag = GameConfig.enemyBulletSpeedForTier(tier);
    const count = Math.random() < 0.5 ? 2 : 3;
    const half = GameConfig.ENEMY_TURRET_FAN_HALF_RAD;
    const base = -Math.PI / 2;
    const offsets =
      count === 2 ? [-half * 0.85, half * 0.85] : [-half, 0, half];
    for (const off of offsets) {
      const th = base + off;
      spawnEnemyBullet(pf, p.x, p.y - 24, {
        velX: Math.cos(th) * mag,
        velY: Math.sin(th) * mag,
      });
    }
  }

  applyDamage(amount: number) {
    this._hp -= amount;
    if (this._hp <= 0) {
      playEnemyExplodeSfx();
      getBattleMain()?.onEnemyKill(this.expValue, this.scoreValue);
      this.node.destroy();
    } else {
      playEnemyHitSfx();
    }
  }
}
