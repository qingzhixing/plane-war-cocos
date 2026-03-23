# plane-war-cocos

从 Godot 工程 [**plane-war**](https://github.com/qingzhixing/plane-war) 移植的 **Cocos Creator 3.8.x** 竖屏弹幕射击项目。玩法与验收以 **`docs/gdd/`** 为准。

## 环境

- [Cocos Creator 3.8.8](https://www.cocos.com/creator-download)（与根目录 `package.json` 中 `creator.version` 对齐）
- **可选**：根目录执行 `npm install` 后运行 **`npm test`**，用 Vitest 跑 `tests/` 下与引擎无关的纯逻辑单测（`aabbMath`、`battleRunState`、`waveSpawnScheduler` 等）。

## 打开与运行

1. 用 Cocos Creator 打开本仓库根目录。
2. 首次打开若未识别启动场景：菜单 **项目 → 项目设置 → 通用**，将 **设计分辨率** 设为 **720 × 1280**，并勾选 **适配高度 / 适配宽度**（与 Godot 版一致）。
3. 在 **资源管理器** 中双击 **`assets/scenes/MainMenu.scene`**，或到 **项目设置** 里将 **启动场景** 设为 `MainMenu.scene`。
4. 点击编辑器 **预览** 运行：主菜单点击屏幕进入 **Game**；战斗中 **拖拽 / WASD** 移动，**自动射击**；**清场**后出现 **三选一升级**（未配置预制体时用简易文字版），选完后进入下一波；点 **菜单** 返回主菜单。

**升级 UI 预制体（推荐）**：在编辑器中按 `assets/prefabs/ui/EDITOR_SETUP.md` 制作 `UpgradePick.prefab` 并挂到 **Game** 场景 **Canvas** 上 **GameRoot** 的 **Upgrade Pick Prefab** 槽位。

### 若提示「Script … is missing or invalid」

- 自定义组件在场景里的 `__type__` 必须是引擎编译后的 **类 ID**（与 `@ccclass` 名一致但不能只写字面量）。本仓库已按 Creator 3.8 序列化格式写好；若你本地升级引擎或大幅改脚本后仍报错：**打开对应场景并保存一次**（Ctrl+S），或 **项目 → 构建发布** 前先让脚本完成编译。

## 仓库结构（摘要）

| 路径 | 说明 |
|------|------|
| `docs/gdd/` | 游戏设计文档（与 Godot 版同步，技术栈说明见 `sections/12_technical_notes.md`） |
| `assets/scenes/` | `MainMenu`（主菜单）、`Game`（战斗 MVP：波次、清场、三选一升级） |
| `assets/scripts/` | `MainMenu.ts`、`mainMenuChromeFactory.ts`、`GameRoot.ts`、`playFieldFactory.ts`、`gameChromeFactory.ts`、`BattleMain.ts`、`battleRunState.ts`、`comboScore.ts`、`BattleHud.ts`、`battleAccess.ts`、`UpgradePool.ts`、`UpgradeUI.ts`、`UpgradePickFlow.ts`、`PlayerController.ts`、`playerInput.ts`、`playerMotion.ts`、`playerBulletFactory.ts`、`aabbMath.ts`、`playerBulletHitscan.ts`、`PlayerBullet.ts`、`EnemyBasic.ts`、`enemyBasicFactory.ts`、`EnemySpawner.ts`、`waveSpawnScheduler.ts`、`EnemyRegistry.ts`、`GameConfig.ts` |
| `tests/` | Vitest 单测（`aabbMath`、`comboScore`、`battleRunState`、`waveSpawnScheduler` 等） |
| `assets/prefabs/ui/` | `EDITOR_SETUP.md`（`UpgradePick.prefab` 制作说明，预制体需在编辑器中创建） |

## 下一步（移植里程碑）

- **美术与音频**：从 `plane-war/assets/` 复制到本仓库 `assets/`，按 GDD `11_art_and_assets.md` 命名。
- **玩法扩展**：Boss、连击与本地成绩/结算（对齐 Godot `main.gd` 余项）；可选 `npm test` 持续覆盖纯逻辑模块。

## 许可

与 Godot 参考仓库保持一致；若根目录未单独放置 `LICENSE`，以仓库内实际声明为准。
