# 装修 Demo 项目 Bug 修复 - Product Requirement Document

## Overview
- **Summary**: 修复装修 Demo 前端项目中的已知 bug，包括 TypeScript 构建失败、ESLint 配置不兼容等问题，确保项目能够正常构建和运行。
- **Purpose**: 解决项目构建和代码质量工具的配置问题，提升开发体验和项目可维护性。
- **Target Users**: 前端开发人员、项目维护者

## Goals
- 修复 TypeScript 构建失败问题，确保 `npm run build` 正常执行
- 修复 ESLint 配置兼容性问题，确保 `npm run lint` 正常执行
- 检查并修复代码中可能存在的其他问题
- 保持项目功能完整性，不引入破坏性变更

## Non-Goals (Out of Scope)
- 不新增功能特性
- 不重构业务逻辑
- 不升级 major 版本的依赖（除非必要）
- 不修改 UI 样式和交互

## Background & Context
- 项目是一个 React + TypeScript + Vite 的装修 Demo 应用
- 使用 Tailwind CSS 进行样式管理
- 使用 GSAP 进行动画处理
- 发现的问题：
  1. TypeScript 5.x 版本中 `baseUrl` 选项已弃用，导致构建失败
  2. ESLint 10.x 版本需要新的配置格式（eslint.config.js），但项目仍使用旧的 .eslintrc.cjs 格式

## Functional Requirements
- **FR-1**: 项目能够成功执行 `npm run build` 构建命令
- **FR-2**: 项目能够成功执行 `npm run lint` 代码检查命令
- **FR-3**: 所有 TypeScript 类型检查通过
- **FR-4**: 项目开发服务器 `npm run dev` 能够正常启动

## Non-Functional Requirements
- **NFR-1**: 修复后不影响现有功能和业务逻辑
- **NFR-2**: 配置修改遵循官方推荐的最佳实践
- **NFR-3**: 保持代码风格一致性

## Constraints
- **Technical**: 
  - 使用 TypeScript 5.x
  - 使用 ESLint 10.x
  - 使用 Vite 5.x
  - 使用 React 18.x
- **Business**: 不修改业务功能，仅修复配置和构建问题
- **Dependencies**: 依赖版本以 package.json 中现有版本为准

## Assumptions
- 项目代码本身的业务逻辑没有严重 bug
- 主要问题集中在构建配置和工具配置上
- 路径别名 `@/*` 功能需要保留

## Acceptance Criteria

### AC-1: TypeScript 构建成功
- **Given**: 项目代码处于当前状态
- **When**: 执行 `npm run build` 命令
- **Then**: 构建成功，无 TypeScript 错误，生成 dist 目录
- **Verification**: `programmatic`
- **Notes**: 特别关注 baseUrl 弃用警告是否已解决

### AC-2: ESLint 检查通过
- **Given**: 项目代码处于当前状态
- **When**: 执行 `npm run lint` 命令
- **Then**: ESLint 正常运行，无配置错误
- **Verification**: `programmatic`
- **Notes**: 从旧的 .eslintrc.cjs 迁移到 eslint.config.js 格式

### AC-3: 路径别名正常工作
- **Given**: TypeScript 和构建配置已修复
- **When**: 代码中使用 `@/` 路径别名导入模块
- **Then**: 导入正常解析，无类型错误和构建错误
- **Verification**: `programmatic`

### AC-4: 开发服务器正常启动
- **Given**: 所有配置修复完成
- **When**: 执行 `npm run dev` 命令
- **Then**: 开发服务器正常启动，页面可正常访问
- **Verification**: `programmatic`

### AC-5: 现有功能不受影响
- **Given**: 所有修复已完成
- **When**: 浏览项目各页面功能
- **Then**: 所有原有功能正常运行，无回归问题
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要同时升级 TypeScript 到最新版本？
- [ ] 是否需要添加更严格的 ESLint 规则？
