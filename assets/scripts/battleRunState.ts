import { comboScoreCoefficient } from './comboScore';

/**
 * 单场战斗运行态（不含节点 / HUD），供 `BattleMain` 持有。
 * 与 Godot `main.gd` 中波次、得分、升级门闩的子集对齐。
 */
export class BattleRunState {
  exp = 0;
  score = 0;
  /** 当前连击数（击杀后更新；受击断连待接） */
  combo = 0;
  /** 本局最高连击（便于日后本地成绩） */
  maxCombo = 0;
  /** 升级 `combo_boost` 叠层：每次击杀额外 +N 连击 */
  comboKillBonus = 0;

  /** 当前波次编号（从 1 开始） */
  activeWave = 1;
  /** 清场后已弹出升级、尚未进入下一波 */
  waitingForUpgrade = false;
  /** `score_up` 等叠加的评分乘区 */
  scoreMultiplier = 1;
  /** 威胁等级（Boss HP 等）；主线开局 0，续战递增待接 */
  threatTier = 0;

  addExp(n: number): void {
    this.exp += n;
  }

  /** 直接加分（调试用；不走连击系数） */
  addScoreRaw(baseScore: number): void {
    this.score += Math.round(baseScore * this.scoreMultiplier);
  }

  /**
   * 敌机被击杀：先累连击，再按区间系数与评分乘区计分。
   */
  onEnemyKill(expValue: number, baseScore: number): void {
    this.combo += 1 + this.comboKillBonus;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.exp += expValue;
    const coef = comboScoreCoefficient(this.combo);
    this.score += Math.round(baseScore * coef * this.scoreMultiplier);
  }

  applyComboBoostUpgrade(): void {
    this.comboKillBonus += 1;
  }

  /** 玩家受击等导致断连（待接碰撞） */
  resetCombo(): void {
    this.combo = 0;
  }

  applyScoreUpUpgrade(): void {
    this.scoreMultiplier += 0.15;
  }

  /**
   * 清场时调用：进入「等玩家选升级」状态。
   * @returns 若已在升级流程中则为 false，应忽略本次清场通知。
   */
  tryEnterUpgradeFlow(): boolean {
    if (this.waitingForUpgrade) {
      return false;
    }
    this.waitingForUpgrade = true;
    return true;
  }

  /** 选完升级后进入下一波 */
  finishUpgradeAdvanceWave(): void {
    this.waitingForUpgrade = false;
    this.activeWave += 1;
  }
}
