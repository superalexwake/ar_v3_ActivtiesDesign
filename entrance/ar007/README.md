# 站点名：孟加拉-HGZY
BDT
## 版型: 蓝版首页 — 红色内页

### 构建指令sit:
BRANCH_NAM=$V NODE_ENV=mz9 npx vite build --mode sit

### 构建指令prd:
BRANCH_NAM=$V NODE_ENV=bdtgame npx vite build

### 启动指令sit:
BRANCH_NAM=$V NODE_ENV=bdtgame npx vite --mode sit

### 启动指令prd:
BRANCH_NAM=$V NODE_ENV=bdtgame npx vite
