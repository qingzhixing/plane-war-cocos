import { _decorator, Button, Component, Label } from 'cc';
import { pickRandomUpgrades, type UpgradeDef } from './UpgradePool';

const { ccclass, property } = _decorator;

@ccclass('UpgradeUI')
export class UpgradeUI extends Component {
  @property(Label)
  titleLabel: Label | null = null;

  @property(Label)
  optName0: Label | null = null;
  @property(Label)
  optName1: Label | null = null;
  @property(Label)
  optName2: Label | null = null;

  @property(Label)
  optDesc0: Label | null = null;
  @property(Label)
  optDesc1: Label | null = null;
  @property(Label)
  optDesc2: Label | null = null;

  @property(Button)
  btn0: Button | null = null;
  @property(Button)
  btn1: Button | null = null;
  @property(Button)
  btn2: Button | null = null;

  private _choices: UpgradeDef[] = [];
  private _onPick: ((id: string) => void) | null = null;

  onLoad() {
    this.btn0?.node.on(Button.EventType.CLICK, this._onBtn0, this);
    this.btn1?.node.on(Button.EventType.CLICK, this._onBtn1, this);
    this.btn2?.node.on(Button.EventType.CLICK, this._onBtn2, this);
    this.node.active = false;
  }

  onDestroy() {
    this.btn0?.node.off(Button.EventType.CLICK, this._onBtn0, this);
    this.btn1?.node.off(Button.EventType.CLICK, this._onBtn1, this);
    this.btn2?.node.off(Button.EventType.CLICK, this._onBtn2, this);
  }

  private _onBtn0() {
    this._emitPick(0);
  }
  private _onBtn1() {
    this._emitPick(1);
  }
  private _onBtn2() {
    this._emitPick(2);
  }

  showPick(onPick: (id: string) => void) {
    this._onPick = onPick;
    this._choices = pickRandomUpgrades(3);
    const names = [this.optName0, this.optName1, this.optName2];
    const descs = [this.optDesc0, this.optDesc1, this.optDesc2];
    const btns = [this.btn0, this.btn1, this.btn2];
    for (let i = 0; i < 3; i++) {
      const u = this._choices[i];
      if (names[i]) {
        names[i]!.string = u ? u.name : '';
      }
      if (descs[i]) {
        descs[i]!.string = u ? u.desc : '';
      }
      if (btns[i]) {
        btns[i]!.interactable = !!u;
      }
    }
    if (this.titleLabel) {
      this.titleLabel.string = '升级！选一个强化';
    }
    this.node.active = true;
  }

  hide() {
    this.node.active = false;
  }

  private _emitPick(idx: number) {
    const u = this._choices[idx];
    if (!u || !this._onPick) {
      return;
    }
    const cb = this._onPick;
    this._onPick = null;
    cb(u.id);
  }
}
