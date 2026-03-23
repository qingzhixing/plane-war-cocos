import { Color, Label, Node, UITransform } from 'cc';
import * as GameConfig from './GameConfig';

export type PostBossChoice = 'settle' | 'continue';

/**
 * 主线首次 / 续战 Boss 击破后二选一（GDD `05b` / `08`）。
 * 结算由调用方处理（通常 `director.loadScene('MainMenu')`）。
 */
export function presentPostBossChoice(
  parent: Node,
  variant: 'main' | 'continuation',
  onChosen: (choice: PostBossChoice) => void,
): void {
  const root = new Node('PostBossChoice');
  root.layer = parent.layer;
  const ut = root.addComponent(UITransform);
  ut.setContentSize(GameConfig.DESIGN_W, GameConfig.DESIGN_H);
  root.setPosition(0, 0, 0);

  const title = new Node('Title');
  title.layer = root.layer;
  const tt = title.addComponent(UITransform);
  tt.setContentSize(680, 80);
  title.setPosition(0, 380, 0);
  const tl = title.addComponent(Label);
  tl.string =
    variant === 'main' ? 'Boss 击破' : '续战 Boss 击破';
  tl.fontSize = 28;
  tl.color = Color.YELLOW;
  root.addChild(title);

  const sub = new Node('Sub');
  sub.layer = root.layer;
  sub.addComponent(UITransform).setContentSize(680, 48);
  sub.setPosition(0, 300, 0);
  const sl = sub.addComponent(Label);
  sl.string = '本局结算 或 继续挑战（威胁+1，评分×+8%）';
  sl.fontSize = 18;
  sl.color = Color.WHITE;
  root.addChild(sub);

  const rowSettle = new Node('Settle');
  rowSettle.layer = root.layer;
  rowSettle.addComponent(UITransform).setContentSize(640, 100);
  rowSettle.setPosition(0, 120, 0);
  const ls = rowSettle.addComponent(Label);
  ls.string = '本局结算';
  ls.fontSize = 24;
  ls.color = Color.WHITE;
  rowSettle.on(Node.EventType.TOUCH_END, () => {
    root.destroy();
    onChosen('settle');
  });
  root.addChild(rowSettle);

  const rowCont = new Node('Continue');
  rowCont.layer = root.layer;
  rowCont.addComponent(UITransform).setContentSize(640, 100);
  rowCont.setPosition(0, -40, 0);
  const lc = rowCont.addComponent(Label);
  lc.string = variant === 'main' ? '继续挑战' : '接着玩';
  lc.fontSize = 24;
  lc.color = new Color(120, 220, 255, 255);
  rowCont.on(Node.EventType.TOUCH_END, () => {
    root.destroy();
    onChosen('continue');
  });
  root.addChild(rowCont);

  parent.addChild(root);
  root.setSiblingIndex(parent.children.length - 1);
}
