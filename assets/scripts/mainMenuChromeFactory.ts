import { Color, Graphics, Label, Node, UITransform } from 'cc';
import * as GameConfig from './GameConfig';
import { loadLocalRecords, type ReturnHint } from './localRecords';
import { applyUiFontsUnder } from './uiFonts';

function addCenteredLabel(
  parent: Node,
  name: string,
  layer: number,
  text: string,
  y: number,
  fontSize: number,
  color: Color,
): void {
  const n = new Node(name);
  n.layer = layer;
  n.setPosition(0, y, 0);
  const lab = n.addComponent(Label);
  lab.string = text;
  lab.fontSize = fontSize;
  lab.color = color;
  parent.addChild(n);
}

/** 主菜单标题区：标题 + 可选「刷新纪录」提示 + 本地最佳摘要（代码搭建） */
export function createMainMenuHint(
  layer: number,
  returnHint: ReturnHint | null,
): Node {
  const rec = loadLocalRecords();
  const hasStats =
    rec.bestScore > 0 || rec.bestCombo > 0 || rec.bestDps > 0;
  const hintH = returnHint ? 280 : hasStats ? 220 : 140;
  const hint = new Node('Hint');
  hint.layer = layer;
  const ut = hint.addComponent(UITransform);
  ut.setContentSize(620, hintH);

  addCenteredLabel(hint, 'Title', layer, '飞机大战', 105, 30, Color.WHITE);

  if (returnHint) {
    const parts: string[] = [];
    if (returnHint.newBestScore) parts.push('得分');
    if (returnHint.newBestCombo) parts.push('连击');
    if (returnHint.newBestDps) parts.push('DPS');
    addCenteredLabel(
      hint,
      'ReturnBanner',
      layer,
      `★ 本次刷新本地纪录：${parts.join('、')}`,
      45,
      26,
      new Color(255, 220, 100, 255),
    );
  }

  if (hasStats) {
    const statsY = returnHint ? -55 : -35;
    addCenteredLabel(
      hint,
      'Stats',
      layer,
      `最高得分 ${rec.bestScore}  最高连击 ${rec.bestCombo}  最高DPS ${Math.round(rec.bestDps)}`,
      statsY,
      24,
      Color.WHITE,
    );
  }

  return hint;
}

function touchLabelRow(
  name: string,
  text: string,
  y: number,
  fontSize: number,
  color: Color,
  layer: number,
  onEnd: () => void,
): Node {
  const row = new Node(name);
  row.layer = layer;
  const rt = row.addComponent(UITransform);
  rt.setContentSize(520, 80);
  row.setPosition(0, y, 0);
  const lab = row.addComponent(Label);
  lab.string = text;
  lab.fontSize = fontSize;
  lab.color = color;
  row.on(Node.EventType.TOUCH_END, onEnd);
  return row;
}

/** 主菜单布局：标题 +「开始游戏」+「成绩查询」 */
export function createMainMenuRoot(
  parent: Node,
  onStartGame: () => void,
  onRecords: () => void,
  returnHint: ReturnHint | null = null,
): Node {
  const layer = parent.layer;
  const root = new Node('MainMenuRoot');
  root.layer = layer;
  const ut = root.addComponent(UITransform);
  ut.setContentSize(GameConfig.DESIGN_W, GameConfig.DESIGN_H);

  const hint = createMainMenuHint(layer, returnHint);
  hint.setPosition(0, 200, 0);
  root.addChild(hint);

  root.addChild(
    touchLabelRow(
      'StartGame',
      '开始游戏',
      -80,
      34,
      Color.WHITE,
      layer,
      onStartGame,
    ),
  );
  root.addChild(
    touchLabelRow(
      'RecordsQuery',
      '成绩查询',
      -200,
      28,
      new Color(180, 220, 255, 255),
      layer,
      onRecords,
    ),
  );

  return root;
}

/** 全屏遮罩只读成绩 +「关闭」 */
export function presentRecordsQueryOverlay(parent: Node): void {
  const rec = loadLocalRecords();
  const layer = parent.layer;
  const root = new Node('RecordsOverlay');
  root.layer = layer;
  root.addComponent(UITransform).setContentSize(GameConfig.DESIGN_W, GameConfig.DESIGN_H);
  root.setPosition(0, 0, 0);

  const dim = new Node('Dim');
  dim.layer = layer;
  dim.addComponent(UITransform).setContentSize(GameConfig.DESIGN_W, GameConfig.DESIGN_H);
  const g = dim.addComponent(Graphics);
  g.fillColor = new Color(0, 0, 0, 200);
  g.rect(
    -GameConfig.DESIGN_W * 0.5,
    -GameConfig.DESIGN_H * 0.5,
    GameConfig.DESIGN_W,
    GameConfig.DESIGN_H,
  );
  g.fill();
  root.addChild(dim);

  const title = new Node('Title');
  title.layer = layer;
  title.addComponent(UITransform).setContentSize(680, 64);
  title.setPosition(0, 380, 0);
  const tl = title.addComponent(Label);
  tl.string = '成绩查询';
  tl.fontSize = 32;
  tl.color = Color.YELLOW;
  root.addChild(title);

  const body = new Node('Body');
  body.layer = layer;
  body.addComponent(UITransform).setContentSize(640, 220);
  body.setPosition(0, 100, 0);
  const bl = body.addComponent(Label);
  bl.string = `最高得分：${rec.bestScore}\n最高连击：${rec.bestCombo}\n最高DPS：${Math.round(rec.bestDps)}`;
  bl.fontSize = 26;
  bl.color = Color.WHITE;
  root.addChild(body);

  const closeRow = touchLabelRow(
    'CloseRecords',
    '关闭',
    -400,
    28,
    Color.WHITE,
    layer,
    () => {
      root.destroy();
    },
  );
  root.addChild(closeRow);

  parent.addChild(root);
  root.setSiblingIndex(parent.children.length - 1);
  applyUiFontsUnder(root);
}
