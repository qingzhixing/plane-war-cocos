/** 与 Godot upgrade_ui.gd 中 UPGRADES 对齐的 MVP 子集（可逐步扩充） */
export type UpgradeDef = {
  id: string;
  name: string;
  desc: string;
};

export const MVP_UPGRADES: UpgradeDef[] = [
  {
    id: 'fire_rate',
    name: '速射机炮',
    desc: '主武器间隔 -15%',
  },
  {
    id: 'damage_percent',
    name: '高爆弹头',
    desc: '主武器伤害 +20%',
  },
  {
    id: 'multi_shot',
    name: '双联机炮',
    desc: '主武器弹数 +1',
  },
  {
    id: 'bullet_speed',
    name: '高初速弹体',
    desc: '主武器弹速 +12%',
  },
  {
    id: 'combo_boost',
    name: '节奏推进',
    desc: '每次击杀额外 +1 连击（叠层可累加）',
  },
  {
    id: 'combo_guard',
    name: '稳态护盾',
    desc: '护盾 +1 层；受击消耗 1 层以免连击中断',
  },
  {
    id: 'score_up',
    name: '评分增幅',
    desc: '评分乘区 +15%（已接 BattleMain 累计得分）',
  },
];

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function shuffleCopy<T>(arr: T[]): T[] {
  const out = arr.slice();
  shuffleInPlace(out);
  return out;
}

/** 随机抽 n 条不重复升级 */
export function pickRandomUpgrades(n: number): UpgradeDef[] {
  const shuffled = shuffleCopy(MVP_UPGRADES);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}
