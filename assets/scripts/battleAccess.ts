/** 战斗统计入口（避免 battleAccess ↔ BattleMain 循环依赖） */
export interface IBattleRewards {
  addExp(n: number): void;
  addScore(n: number): void;
  /** 敌机击杀：连击 + 经验 + 得分（含连击区间系数 × 评分乘区） */
  onEnemyKill(expValue: number, baseScore: number): void;
  /** 玩家与敌机相撞等待：清零连击（敌机由调用方销毁且不计分） */
  onPlayerHit(): void;
  /** 本局数据写入本地最高成绩（返回主菜单前） */
  flushLocalRecords(): void;
  /** 威胁等级（敌弹速度等） */
  getThreatTier(): number;
  /** 对敌机/Boss 造成有效伤害（用于 DPS） */
  onPlayerDamageDealt(amount: number): void;
}

let _battle: IBattleRewards | null = null;

export function setBattleMain(b: IBattleRewards | null): void {
  _battle = b;
}

export function getBattleMain(): IBattleRewards | null {
  return _battle;
}
