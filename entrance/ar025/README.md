# 站点名：印度-aviatorgod

## 版型: 土豪金首页 — 红色内页

### 构建指令sit:
BRANCH_NAM=$V NODE_ENV=ar025 npx vite build --mode sit

### 构建指令prd:
BRANCH_NAM=$V NODE_ENV=ar025 npx vite build

### 启动指令sit:
BRANCH_NAM=$V NODE_ENV=ar025 npx vite --mode sit

### 启动指令prd:
cross-env BRANCH_NAM=$V NODE_ENV=ar025 npx vite