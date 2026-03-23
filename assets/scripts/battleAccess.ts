/** 战斗统计入口（避免 battleAccess ↔ BattleMain 循环依赖） */
export interface IBattleRewards {
  addExp(n: number): void;
  addScore(n: number): void;
  /** 敌机击杀：连击 + 经验 + 得分（含连击区间系数 × 评分乘区） */
  onEnemyKill(expValue: number, baseScore: number): void;
}

let _battle: IBattleRewards | null = null;

export function setBattleMain(b: IBattleRewards | null): void {
  _battle = b;
}

export function getBattleMain(): IBattleRewards | null {
  return _battle;
}
