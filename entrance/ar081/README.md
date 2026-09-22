# 站点名：DKWIN

## 版型: 电子首页 — 黄色内页

### 构建指令sit:
cross-env BRANCH_NAM=$V NODE_ENV=ar081 npx vite build --mode sit

### 构建指令prd:
cross-env BRANCH_NAM=$V NODE_ENV=ar081 npx vite build

### 启动指令sit:
cross-env BRANCH_NAM=$V NODE_ENV=ar081 npx vite --mode sit

### 启动指令prd:
cross-env BRANCH_NAM=$V NODE_ENV=ar081 npx vite