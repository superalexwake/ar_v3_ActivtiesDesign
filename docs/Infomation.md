## 目录

-   [vue3 vscode 插件](#-2)
-   [git 提交流程](#-1)
-   [1. sourcetree 操作步骤](#1)
-   [2. 文件结构](#2)
-   [3. BEM 使用示范案例](#3)
-   [4. gitlab 提交合并流程](#4)
-   [5. 发版流程](#5)
-   [6. 性能优化](#6)

### git-sourcetree

&nbsp;

> <h3 id="-1">vue3 vscode插件</h3>
> &nbsp;

```
TypeScript Vue Plugin (Volar)
Vetur
Vue 3 Snippets
Vue Language Features (Volar)
Vue VSCode Snippets
```

> <h3 id="-1">git提交流程</h3>
> &nbsp;

```
拉取 远端dev分支 到 本地dev分支
切换到 本地dev分支
再将本地dev分支 切换到一个新的自己开发的分支（命名：dev-英文名，例：dev-Richar）
然后在 本地 dev-xxx 分支 开发代码

需要提交代码时，将代码提交到 dev-xxx 分支

需要推送到远端dev分支时，
首先将代码提交到 本地dev-xxx分支

切换分支到本地dev，拉取远端dev代码，保证时最新代码
然后切换回本地dev-xxx分支，`合并dev至当前分支`，处理代码冲突，然后提交到dev-xxx分支

切换分支到本地dev，再次 `合并dev-xxx至当前分支`,
这个时候代码时肯定没有冲突，因为之前已经解决了，然后推送本地dev代码至远端dev分支

```

```
master 最新稳定版 测试确认bug无误后进行合并
release 最新测试版 专门更改对应的bug 处理bug 进行迭代
dev 开发板 最新功能添加


本地分支 release-xxx
提交合并一样的流程 提交合并到 release 分支

bug处理 在release分支上处理
功能更新 在dev分支上处理
```

&nbsp;

> <h3 id="1">sourcetree操作步骤</h3>

> &nbsp; > ![git](./imgs/git/1.png) > ![git](./imgs/git/2.png) > ![git](./imgs/git/3.png) > ![git](./imgs/git/4.png) > ![git](./imgs/git/5.png) > ![git](./imgs/git/6.png) > ![git](./imgs/git/7.png) > ![git](./imgs/git/8.png) > ![git](./imgs/git/9.png) > ![git](./imgs/git/10.png) > ![git](./imgs/git/11.png) > ![git](./imgs/git/12.png) > ![git](./imgs/git/13.png) > ![git](./imgs/git/14.png) > ![git](./imgs/git/15.png) > ![git](./imgs/git/16.png) > ![git](./imgs/git/17.png)

&nbsp;

> <h3 id="2">2. 文件结构</h3>

```
ar_v2_vue
    ├─.husky 			提交代码格式化
    ├─.vscode			vscode配置文件
    ├─dist				打包目录
    ├─docs				文档目录
    ├─mock				mock数据
    ├─public			公用资源
    └─src
        ├─api			接口配置文件
        ├─assets		静态资源文件
        │  ├─fonts
        │  ├─icons		小图标文件
        │  ├─images		大图片、背景文件
        │  └─styles
        ├─components	组件文件
        ├─config		组件内配置文件
        ├─directives	自定义组件
        │  └─modules
        ├─enums			枚举文件夹
        ├─languages		语言包
        ├─plugins		插件集
        ├─router		路由配置
        ├─stores		Pinia文件
        ├─svg			svg文件
        ├─types			类型处理文件
        │  ├─api
        │  │  └─interface
        │  │      └─store
        │  └─interfaces
        │      ├─Activity
        │      └─Home
        │          ├─DailyProfitRank
        │          ├─GameList
        │          └─Swiper
        ├─utils			常用方法
        └─views			页面
```

&nbsp;

> <h3 id="3">3. BEM 使用示范案例</h3>

&nbsp;

-   `!注意 类名不要写得太长了!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`
-   https://juejin.cn/post/6844903672162304013

&nbsp;

```html
<!--

	.block {}

	.block__element {}

	.block--modifier {}

	每一个块(block)名应该有一个命名空间（前缀）
	block 代表了更高级别的抽象或组件。
	block__element 代表 .block 的后代，用于形成一个完整的 .block 的整体。
	block--modifier 代表 .block 的不同状态或不同版本。 使用两个连字符和下划线而不是一个，是为了让你自己的块可以用单个连字符来界定。如：

	.sub-block__element {}

	.sub-block--modifier {}

	<div class="article">
		<div class="article__body">
			<div class="tag"></div>
			<button class="article__button--primary"></button>
			<button class="article__button--success"></button>
		</div>
	</div>

-->

<!-- 需要优化案例 -->
<!-- userInfo__container-content-wrapper 类似这种类名太长了，名字可以取短一点 -->
<div class="userInfo__container-content">
	<div class="userInfo__container-content-wrapper">
		<div class="userInfo__container-content__avatar">
			<img :src="userInfo.UserPhoto" />
		</div>

		<!-- 错误案例 -->
		<!-- 最多接受3个- 拼接的类名 : aaa-bbb-ccc -->
		<!-- 最多接受2个__ 拼接的类名 ：home-page__activity__swipe  -->
		<div class="info-dialog-content-avatar-list">
			<div>
				<img :src="getIcons('main', 'dialogNickname')" />
			</div>
		</div>
	</div>
</div>
```

&nbsp;

```html
<!-- 正确案例 -->
<!-- 最多接受这种长度的类名  -->
<!--  class="home-page__activity__swipe" -->

<template>
	<div class="home-shop-item" @click="gotoShop(data.id)">
		<img class="home-shop-item__poster" v-lazy="data.postUrl" />
		<div class="home-shop-item__info">
			<div class="info__top">
				<div class="info__name op-ellipsis">{{ shopName }}</div>
				<VanIcon name="weapp-nav" color="rgb(207, 207, 207)" style="margin-left: 10px"></VanIcon>
			</div>
			<div class="info__desc">
				<span class="score">{{ data.score }}</span>
				<span class="monthly-count">月售{{ data.monthlyCount }}</span>
				<span class="delivery-time">{{ data.deliveryTime }}</span>
				<span class="delivery-distance">月售{{ data.deliveryDistance }}</span>
			</div>
			<div class="info__desc">
				<span class="delivery-strating-price">起送{{ data.deliveryStratingPrice }}</span>
				<span class="delivery-strategy">{{ data.deliveryStrategy }}</span>
				<span v-for="v in data.deliveryTags" :key="v" class="delivery-tag op-thin-border"> {{ v }} </span>
			</div>
			<div class="info__comment">{{ data.comments[0] }}</div>
			<div class="info__more" @click.stop="showMore">
				<div v-if="isMoreShown" class="label">活动</div>
				<div class="activities">
					<div v-if="!isMoreShown" class="activity op-thin-border">{{ reduction[0] }} | {{ reduction[1] }}</div>
					<template v-else>
						<div v-for="v in reduction" :key="v" class="activity op-thin-border">{{ v }}</div>
					</template>
				</div>
				<VanIcon :name="`arrow-${isMoreShown ? 'up' : 'down'}`" color="rgb(207, 207, 207)" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.home-shop-item {
		background: white;
		border-radius: 10px;
		padding: 15px 15px 12px 10px;
		margin-bottom: 10px;
		font-size: 12px;
		text-align: left;
		display: flex;

		&__poster {
			width: 105px;
			height: 105px;
		}

		&__info {
			margin-left: 10px;
			width: 0;
			flex: 1;

			.info__top {
				display: flex;
				.info__name {
					font-weight: bold;
					font-size: 16px;
					line-height: 16px;
					margin-bottom: 4px;
				}
			}

			.info__desc {
				display: flex;
				align-items: baseline;
				margin-bottom: 4px;
				color: gray;
				.score {
					color: rgb(252, 95, 4);
					font-weight: bold;
					margin-right: 7px;
				}
				.monthly-count {
					flex: 1;
				}
				.delivery-time {
					margin-right: 7px;
				}
				.delivery-distance {
					display: inline-block;
					vertical-align: baseline;
				}
				.delivery-strating-price {
					margin-right: 5px;
				}
				.delivery-strategy {
					flex: 1;
					margin-right: 6px;
				}
				.delivery-tag {
					color: var(--op-primary-color);
					padding: 1px 2px;
					&:before {
						border: 1px solid var(--op-primary-color);
					}
				}
			}

			.info__comment {
				border-radius: 2px;
				color: rgb(252, 95, 4);
				background: rgb(253, 239, 229);
				width: fit-content;
				padding: 1px 5px;
				margin-bottom: 5px;
				font-size: 10px;
			}

			.info__more {
				display: flex;
				.label {
					width: 35px;
					color: gray;
				}
				.activities {
					flex: 1;
				}
				.van-icon {
					margin-top: 3px;
				}

				.activity {
					display: inline-block;
					color: rgb(247, 68, 68);
					padding: 0 4px;
					margin-right: 5px;
					margin-bottom: 2px;
					font-size: 10px;
					&:before {
						border: 1px solid rgb(247, 68, 68);
					}
				}
			}
		}
	}
</style>
```

&nbsp;

> <h3 id="4">4. gitlab提交合并流程</h3>

> &nbsp; > ![git](./imgs/gitlab-submit/1.jpg) > ![git](./imgs/gitlab-submit/2.jpg) > ![git](./imgs/gitlab-submit/3.jpg) > ![git](./imgs/gitlab-submit/4.jpg) > ![git](./imgs/gitlab-submit/5.jpg)

&nbsp;

> <h3 id="5">5. 发版流程</h3>

&nbsp;

```
一天就是一个小版本
如果哪天没有发版，你就按发版那一天的版本+1

比如说 3号发第一版，v1.0.0
5号发第二版，v1.0.1
5号发第三版，v1.0.1.1

6号发第4版，v1.0.2
6号发第5版，v1.0.2.1
6号发第6版，v1.0.2.2

7号发第7版，v1.0.3
7号发第8版，v1.0.3.1

新功能 feature-xx-版本号
发布测试版 release-xx-版本号

生产，sit，开发，bug
都可能产生在 release和feature

生产，sit，开发，bug
都可能产生在 release和feature
```

```shell
发版执行命令

// 泰国站为示例
// release-tha-pro-v1.0.0 生产环境
// release-tha-dev-v1.0.0 开发环境
// release-tha-feat-v1.0.0 新增功能

// 泰国: tha
// 越南: vi
// 巴西: brazil
// 蓝色: colorBlue
// 印度: yindu

# 在当前目录下
# node 执行文件 执行方式 tag名称
node ./release.js 1 release-tha-pro

越南站 生产
node ./release.js 1 release-vi-pro
巴西站 生产
node ./release.js 1 release-brazil-pro

建议先 npm run build 之后再执行此命令

# 在 npm run build 执行正确情况下
# 可以执行shell脚本
# 命令为
./pack3.sh release-tha-pro
```

&nbsp;

> <h3 id="6">6. 性能优化</h3>

!!!!!!!!!!!!!

-   [vue 刷新页面所占用的内存没有被释放，刷新页面增加内存的问题（重要）](https://blog.csdn.net/qq_42740797/article/details/120451600)

```js

<template>
	<div class="body">
		<div v-if="isShow">
			<router-view />
		</div>
	</div>
</template>

...script
    data () {
        return {
            isShow:false,
        };
    },
    mounted () {
        window.addEventListener("beforeunload",(e)=> {
            console.log('刷新');
            this.isShow=false;
            window.removeEventListener('beforeunload', ()=>{})//移除这个监听
        });
    },
```

&nbsp;

-   vue3 相关性能优化：

```ts
// watch处理
import { ref, watch, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

// const unwatch = watch(
// 	percentage,
// 	(newVal, oldVal) => {
// 		if (newVal >= 0 && newVal <= 50) {
// 			rightRotate.value = (newVal / 50) * 180
// 			leftRotate.value = 0
// 		} else if (newVal > 50 && newVal <= 100) {
// 			rightRotate.value = 180
// 			leftRotate.value = ((newVal - 50) / 50) * 180
// 		}
// 	},
// 	{ immediate: true }
// )

const timer = ref(null as unknown as NodeJS.Timeout)
timer.value = setInterval(async () => {
	allList.value.unshift(allList.value.pop())
}, 3000)

const timerout = ref(null as unknown as NodeJS.Timeout)
timerout.value = setTimeout(async () => {
	allList.value.unshift(allList.value.pop())
}, 3000)
// setInterval 可用 useInterval替代使用，这样就不用再最后清除计时器

// setInterval处理
// 方法一
onBeforeUnmount(async () => {
	// unwatch()
	clearTimeout(timerout.value)
	clearInterval(timer.value)
})

// 方法二
// onUnmounted(() => {
// 	unwatch()
// 	clearInterval(timer.value)
// })
```
