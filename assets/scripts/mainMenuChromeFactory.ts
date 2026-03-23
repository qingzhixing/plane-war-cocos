import { Color, Label, Node, UITransform } from 'cc';
import { loadLocalRecords } from './localRecords';

/** 主菜单 MVP：居中提示文案（后续可换预制体） */
export function createMainMenuHint(): Node {
  const rec = loadLocalRecords();
  const lines = ['飞机大战', '点击任意处开始'];
  if (rec.bestScore > 0 || rec.bestCombo > 0 || rec.bestDps > 0) {
    lines.push(
      `最高得分 ${rec.bestScore}  最高连击 ${rec.bestCombo}  最高DPS ${Math.round(rec.bestDps)}`,
    );
  }
  const hint = new Node('Hint');
  const ut = hint.addComponent(UITransform);
  ut.setContentSize(620, 280);
  const lab = hint.addComponent(Label);
  lab.string = lines.join('\n');
  lab.fontSize = 32;
  lab.color = Color.WHITE;
  return hint;
}
