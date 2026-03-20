import { _decorator, Color, Component, director, Label, Node, UITransform } from 'cc';

const { ccclass } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
  onLoad() {
    const hint = new Node('Hint');
    const ut = hint.addComponent(UITransform);
    ut.setContentSize(600, 200);
    const lab = hint.addComponent(Label);
    lab.string = '飞机大战\n点击任意处开始';
    lab.fontSize = 32;
    lab.color = Color.WHITE;
    this.node.addChild(hint);
    this.node.on(Node.EventType.TOUCH_END, this._go, this);
  }

  onDestroy() {
    this.node.off(Node.EventType.TOUCH_END, this._go, this);
  }

  private _go() {
    director.loadScene('Game');
  }
}
