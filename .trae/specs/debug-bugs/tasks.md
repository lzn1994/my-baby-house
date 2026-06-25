# 装修 Demo 项目 Bug 修复 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 修复 TypeScript 配置（baseUrl 弃用问题）
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 修复 tsconfig.json 中的 baseUrl 弃用警告
  - 保留路径别名 @/* 功能
  - 确保 TypeScript 类型检查通过
- **Acceptance Criteria Addressed**: AC-1, AC-3
- **Test Requirements**:
  - `programmatic` TR-1.1: 执行 `npx tsc --noEmit` 无错误输出
  - `programmatic` TR-1.2: 执行 `npm run build` 成功，生成 dist 目录
  - `programmatic` TR-1.3: 路径别名 @/* 导入正常解析
- **Notes**: TypeScript 5.x 推荐使用 paths 配合 moduleResolution: bundler，baseUrl 可以移除

## [x] Task 2: 修复 ESLint 配置兼容性问题
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 从旧的 .eslintrc.cjs 格式迁移到新的 eslint.config.js 格式
  - 保留现有的 ESLint 规则配置
  - 确保 @typescript-eslint 和 react-hooks 插件正常工作
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-2.1: 执行 `npm run lint` 无配置错误
  - `programmatic` TR-2.2: ESLint 能正常扫描所有 .ts 和 .tsx 文件
- **Notes**: ESLint v9+ 使用扁平配置格式，需要安装 @eslint/js 等新包

## [x] Task 3: 检查并修复其他代码问题
- **Priority**: medium
- **Depends On**: Task 1, Task 2
- **Description**: 
  - 全面检查 TypeScript 类型错误
  - 检查未使用的变量和导入
  - 检查 React hooks 依赖问题
  - 修复发现的代码问题
- **Acceptance Criteria Addressed**: AC-1, AC-5
- **Test Requirements**:
  - `programmatic` TR-3.1: TypeScript strict 模式下无错误
  - `human-judgement` TR-3.2: 代码逻辑审查，确认修复不影响业务功能
- **Notes**: 仅修复明显的 bug 和类型错误，不进行功能重构

## [x] Task 4: 验证开发服务器和构建产物
- **Priority**: high
- **Depends On**: Task 1, Task 2, Task 3
- **Description**: 
  - 启动开发服务器验证页面正常加载
  - 验证构建产物正常
  - 确保所有页面功能正常
- **Acceptance Criteria Addressed**: AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: `npm run dev` 正常启动
  - `programmatic` TR-4.2: `npm run build` 成功完成
  - `programmatic` TR-4.3: `npm run preview` 可以正常预览构建产物
  - `human-judgement` TR-4.4: 页面视觉和交互正常
- **Notes**: 进行快速冒烟测试，确保核心功能可用
