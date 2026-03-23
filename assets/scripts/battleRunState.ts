/**
 * 单场战斗运行态（不含节点 / HUD），供 `BattleMain` 持有。
 * 与 Godot `main.gd` 中波次、得分、升级门闩的子集对齐。
 */
export class BattleRunState {
  exp = 0;
  score = 0;
  /** 当前波次编号（从 1 开始） */
  activeWave = 1;
  /** 清场后已弹出升级、尚未进入下一波 */
  waitingForUpgrade = false;
  /** `score_up` 等叠加的评分乘区 */
  scoreMultiplier = 1;

  addExp(n: number): void {
    this.exp += n;
  }

  /** 击杀上报的原始分值，会乘 `scoreMultiplier` 再累加 */
  addScoreFromKill(baseScore: number): void {
    this.score += Math.round(baseScore * this.scoreMultiplier);
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

  applyScoreUpUpgrade(): void {
    this.scoreMultiplier += 0.15;
  }

  /** 选完升级后进入下一波 */
  finishUpgradeAdvanceWave(): void {
    this.waitingForUpgrade = false;
    this.activeWave += 1;
  }
}
