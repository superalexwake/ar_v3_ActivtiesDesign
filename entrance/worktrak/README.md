# 站点名：worktrak 工单测试

## 版型: 电子首页 — 黑色内页

### 构建指令sit:
BRANCH_NAM=$V NODE_ENV=worktrak npx vite build --mode sit

### 构建指令prd:
BRANCH_NAM=$V NODE_ENV=worktrak npx vite build

### 启动指令sit:
BRANCH_NAM=$V NODE_ENV=worktrak npx vite --mode sit

### 启动指令prd:
BRANCH_NAM=$V NODE_ENV=worktrak npx vite