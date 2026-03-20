# 12 技术栈与项目结构（Cocos Creator 3.x 移植版）

## 技术栈

- 引擎版本：**Cocos Creator 3.8.x**（见仓库根目录 `package.json` → `creator.version`）
- **设计分辨率（竖屏）**：**720×1280**，与 Godot 版一致；在项目设置 **项目 → 项目设置 → 通用 → 设计分辨率** 中配置为 **适配宽度和高度**（与 Godot `viewport + keep` 的等比缩放目标一致）。
- 平台目标：Windows + Android（与 GDD 一致）
- 脚本语言：**TypeScript**（`assets/scripts/`）

## 与 Godot 版的对应关系（移植时查阅）

- 玩法与数值以 **`docs/gdd/`** 与 Godot 仓库 **`plane-war`** 源码为准；本仓库为 **Cocos 实现**，路径与 API 不同，但系统划分应对齐：
  - 主流程 / 波次 / 升级 / 结算：`plane-war/scripts/main.gd`
  - 玩家：`plane-war/scripts/player.gd`
  - 刷怪：`plane-war/scripts/enemy_spawner.gd`
  - 敌人与子弹基类：`plane-war/scripts/enemies/EnemyBase.gd`、`plane-war/scripts/bullets/BulletBase.gd`

## 本仓库目录约定（建议）

- 启动流程：**主菜单** `assets/scenes/MainMenu.scene` → **开始游戏** 进入 `assets/scenes/Game.scene`（后续在 `Game` 中挂载战斗与 HUD，与 Godot `Main.tscn` 对齐）。
- 脚本：`assets/scripts/`（例如主菜单入口 `MainMenu.ts`、战斗场景根节点 `GameRoot.ts`）。
- 美术与音频：由 `plane-war/assets/` 复制到本仓库 `assets/`（勿提交 Godot 的 `.import`），命名保持与 `docs/gdd/sections/11_art_and_assets.md` 一致。
- 本地成绩：与 Godot 的 `user://records.cfg` 类似，实现阶段使用 **本地存储**（如 `sys.localStorage` 或原生文件 API），键名与字段见 GDD 与 Godot `Main` 读写逻辑。

## 视觉与 Shader 约定

- Godot 中敌人受击 Shader、护盾圈等，在 Cocos 中改用 **Material / Sprite / 粒子** 等等价实现；具体参数约定仍在 GDD「战斗规则」与 `plane-war` 脚本注释中维护，本节仅要求 **表现可读、逻辑一致**。

## 调试与发布

- 开发期可在战斗场景保留与 Godot 类似的 **调试入口**（跳 Boss、自选升级等），发布前在 GDD「发布」章节中声明是否关闭。
- 发布构建：使用 Cocos Creator **构建发布** 面板；CI 为可选项（见 `02_platform_and_ci.md`）。

## 第一阶段实现目标（本仓库）

- 主菜单与战斗场景可切换，设计分辨率 **720×1280**。
- 下一里程碑：在 `Game` 场景中接入玩家移动、自动射击、子弹与敌人（见 `10_mvp_acceptance_and_milestones.md`）。

> 若实现与 Godot 版有路径或 API 差异，优先更新本节与 `README`，再改代码。
