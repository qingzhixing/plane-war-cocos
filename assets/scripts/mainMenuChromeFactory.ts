import { Color, Label, Node, UITransform } from 'cc';

/** 主菜单 MVP：居中提示文案（后续可换预制体） */
export function createMainMenuHint(): Node {
  const hint = new Node('Hint');
  const ut = hint.addComponent(UITransform);
  ut.setContentSize(600, 200);
  const lab = hint.addComponent(Label);
  lab.string = '飞机大战\n点击任意处开始';
  lab.fontSize = 32;
  lab.color = Color.WHITE;
  return hint;
}
