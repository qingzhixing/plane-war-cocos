import { _decorator, Color, Component, director, Label, Node, UITransform } from 'cc';

const { ccclass } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {
  onLoad() {
    const hint = new Node('Hint');
    const ut = hint.addComponent(UITransform);
    ut.setContentSize(600, 200);
    const lab = hint.addComponent(Label);
    lab.string = '战斗场景占位\n点击返回主菜单';
    lab.fontSize = 28;
    lab.color = Color.WHITE;
    this.node.addChild(hint);
    this.node.on(Node.EventType.TOUCH_END, this._back, this);
  }

  onDestroy() {
    this.node.off(Node.EventType.TOUCH_END, this._back, this);
  }

  private _back() {
    director.loadScene('MainMenu');
  }
}
