import {
  _decorator,
  Color,
  Component,
  director,
  Label,
  Node,
  Prefab,
  UITransform,
} from 'cc';
import { BattleMain } from './BattleMain';
import { createPlayField } from './playFieldFactory';

const { ccclass, property } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {
  @property(Prefab)
  upgradePickPrefab: Prefab | null = null;

  private _backBtn: Node | null = null;

  onLoad() {
    const playField = createPlayField();
    this.node.addChild(playField);

    const hint = new Node('Hint');
    const hut = hint.addComponent(UITransform);
    hut.setContentSize(620, 120);
    hint.setPosition(0, 420, 0);
    const hintLab = hint.addComponent(Label);
    hintLab.string = '拖拽 / WASD 移动 · 清场后三选一升级，再进入下一波';
    hintLab.fontSize = 22;
    hintLab.color = Color.WHITE;
    this.node.addChild(hint);

    const back = new Node('Back');
    const but = back.addComponent(UITransform);
    but.setContentSize(100, 48);
    back.setPosition(280, 560, 0);
    const backLab = back.addComponent(Label);
    backLab.string = '菜单';
    backLab.fontSize = 26;
    backLab.color = Color.WHITE;
    back.on(Node.EventType.TOUCH_END, this._back, this);
    this.node.addChild(back);
    this._backBtn = back;

    const battle = this.node.addComponent(BattleMain);
    battle.init(playField, this.upgradePickPrefab);
  }

  onDestroy() {
    this._backBtn?.off(Node.EventType.TOUCH_END, this._back, this);
  }

  private _back() {
    director.loadScene('MainMenu');
  }
}
