import { _decorator, Color, Component, Label, UITransform } from 'cc';

const { ccclass } = _decorator;

/** 战斗顶栏：波次 / 得分 / 连击 / 经验 / 评分乘区（纯展示，数据由 BattleMain 驱动） */
@ccclass('BattleHud')
export class BattleHud extends Component {
  private _label: Label | null = null;

  onLoad() {
    const ut = this.node.addComponent(UITransform);
    ut.setContentSize(700, 120);
    this.node.setPosition(0, 550, 0);
    const lab = this.node.addComponent(Label);
    lab.fontSize = 18;
    lab.color = Color.WHITE;
    this._label = lab;
  }

  refresh(
    wave: number,
    score: number,
    combo: number,
    exp: number,
    scoreMultiplier: number,
  ): void {
    if (!this._label) {
      return;
    }
    const sm = Math.round(scoreMultiplier * 100) / 100;
    this._label.string = `波次 ${wave}  得分 ${score}  连击 ${combo}  经验 ${exp}  评分×${sm}`;
  }
}
