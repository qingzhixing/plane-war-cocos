# 02 平台与发布（跨平台 + 发布方式）

## 版本与变更记录

- **Godot 参考仓库当前版本**：`0.2.1`（`project.godot` → `application/config/version`；Android 导出 `version/name` 与 `version/code=201` 对齐）。
- **Cocos 本仓库**：版本号在发布前与 `plane-war` / `CHANGELOG` 对齐并写入 `docs/gdd/sections/13_release_and_metadata.md`。
- **面向玩家的变更说明**：以 **`CHANGELOG.md`**（若与 Godot 共用）或本仓库发布说明为准。

## 目标平台

- **必须**：Windows（桌面端可玩）
- **必须**：Android（移动端可玩）
- **可扩展**：后续可加入 Web（若性能/输入适配允许）

## 发布与打包方式（当前阶段）

- 当前项目 **不再要求「必须有自动构建 CI」**，只需保证：
  - Windows 与 Android 均可以通过本地 Godot 导出得到可运行的构建包；
  - 导出流程在 README / 文档中有简单说明，方便未来复现。
- **可选 CI（本仓库）**：在 **GitHub Actions** 上对 `master` / `main` 的 **push / PR** 运行 **`npm install` + `npm test`（Vitest）**，验证 `tests/` 下与引擎无关的纯逻辑单测；**不**替代 Cocos Creator 的构建发布，也不作为合并的硬性门槛（可视为开发辅助信号）。

## 当前工程约定（仅保留与平台相关的约定）

- **Godot 参考实现（`plane-war`）**：统一使用同一大版本（4.x），具体子版本由工程配置与导出设置保持一致；主场景入口为 `MainMenu.tscn` / `Main.tscn`；竖屏 **720×1280**。
- **Cocos 移植工程（本仓库 `plane-war-cocos`）**：**Cocos Creator 3.8.x**；主流程入口场景为 `assets/scenes/MainMenu.scene`，战斗为 `assets/scenes/Game.scene`；设计分辨率 **720×1280**；构建与导出以 Cocos Creator **构建发布** 为准。
- **分辨率与渲染约定**：竖屏 720×1280 为目标设计分辨率；Godot 侧为 viewport 等比缩放；Cocos 侧在项目设置中勾选适配宽高，保持与参考实现观感一致。
