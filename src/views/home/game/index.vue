<script setup lang="ts">
	import { computed, ref, onMounted, onBeforeUnmount } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import { useEventListener, useStyleTag } from '@vueuse/core'
	import { AwaitApiResult, decodeFromBase64, currency, isMobile } from '@/utils'
	import { getBalanceByARGame } from '@/api'
	import { useServer } from "@/hooks/useServe.hook";
	import { useWorkerIntervalFn } from "@/hooks/useWorkerIntervalFn.hook";
	import { GlobalStore } from '@/stores'
	const route = useRoute()
	const globalStore = GlobalStore()
	const fullscreenElement = ref(null)
	const landscape = ref(false)
	const router = useRouter()
	const {
		css,
		load,
		unload,
	} = useStyleTag('')
	const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })
	const money = ref(0);
	const height = computed(() => {
		if (!isMobile) return {};
		if (!landscape) {
			return {
				height: `${window.innerHeight}px`
			}
		}

	})
	const url = computed(() => {
		const data = route.query.url as string;
		if (!data) return '';
		const encode = decodeFromBase64(data || '')
		if (encode.startsWith('https:')) return encode
		return `data:text/html;charset=utf-8,${encodeURIComponent(encode)}`
	})
	const vendorCode = computed(() => {
		const data = route.query.vendorCode as string;
		if (!data) return '';
		return data;
	})
	const isPc = computed(() => {
		return !isMobile && !['PG'].includes(vendorCode.value);
	})
	const full = computed(() => {
		if (landscape.value) return false;
		return !['ARLottery'].includes(vendorCode.value)
	})
	function handleOrientationChange() {
		if (!isMobile) return;
		setTimeout(() => {
			if (window.matchMedia("(orientation: landscape)").matches) {
				// 设置横屏时的样式
				css.value = `
            	    body #app { width: 100%; }
            	`;
				landscape.value = true
				document.documentElement.classList.add('landscape'); // 添加类名
			} else {
				css.value = '';
				landscape.value = false
				document.documentElement.classList.remove('landscape'); // 移除类名
			}
		}, 10)
	}
	useEventListener(window, 'resize', handleOrientationChange)
	useEventListener(window, 'orientationchange', handleOrientationChange)
	useEventListener(window, 'message', (event) => {
		if (event.data === 'game') {
			router.go(-1)
		}
	})

	// 引用 iframe 元素
	const iframeRef = ref<HTMLIFrameElement | null>(null);
	// iframe 加载完成后的回调
	const onIframeLoad = () => {
		setViewportHeight(); // 重新设置视口高度
	};
	// 动态设置 CSS 变量
	const setViewportHeight = () => {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
	};
	const openPage = () => {
		const routeData = router.resolve({ name: 'wallet' });
		window.open(routeData.href, '_blank');
	}
	async function getAllwallets() {
		try {
			const res = await getBalanceByARGame()
			if (res.code === 0) {
				money.value = res.data.balance
			}
		} catch (e) {
			console.log(e)
		}
	}

	const onGohome = async () => {
		globalStore.notifyARGame(true)
		router.push({ name: 'home' });

	}
	const { pause } = useWorkerIntervalFn(() => {
		getAllwallets()
	}, 1000 * 12, { immediate: true })
	onMounted(async () => {
		handleOrientationChange();
		load()
		setViewportHeight(); // 初始化时计算
		window.addEventListener('resize', setViewportHeight); // 监听窗口变化
		setTimeout(() => {
			getAllwallets()
		}, 2000);
	})
	onBeforeUnmount(() => {
		unload()
		pause()
		window.removeEventListener('resize', setViewportHeight); // 移除监听
		document.documentElement.classList.remove('landscape'); // 移除类名
		// 销毁 iframe
		if (iframeRef.value) {
			iframeRef.value.src = 'about:blank'; // 重置 src，释放资源
			iframeRef.value.remove();           // 从 DOM 中移除 iframe
			iframeRef.value = null;             // 清除引用
		}
	})
</script>

<template>
	<div class="game-iframe" ref="fullscreenElement" :style="{ height }" v-if="!isPc">
		<NavBar :class="{ 'landscape-nav': landscape }" left-arrow @click-left="onGohome"
			v-if="!['ARLottery'].includes(vendorCode)">
			<template #right>
				<div class="game-right">
					<span class="game-text"><svg-icon name="game_moneyb" /> {{ currency(money) }}</span>
					<span class="game-icon" @click.stop="openPage()">
						<svg-icon name="icon_addwallet" />
					</span>
					<span class="game-icon" @click.stop="getSelfCustomerServiceLink()">
						<svg-icon name="icon_customer3" />
					</span>
				</div>
			</template>
		</NavBar>
		<iframe :class="{ 'lotteryfull': ['ARLottery'].includes(vendorCode), landscape: landscape }"
			sandbox="allow-forms allow-orientation-lock allow-scripts allow-same-origin allow-top-navigation allow-popups"
			allowfullscreen="true" ref="iframeRef" :src="url" v-if="url" @load="onIframeLoad"></iframe>
	</div>
</template>

<style scoped lang="scss">

	/* 仅在移动设备的横屏模式下设置 font-size 为 36px */
	@media (orientation: landscape) and (max-width: 768px) {
		html {
			font-size: 36px;
		}
	}

	.game-iframe {
		position: relative;
		background-color: #0D0D0D;
		width: 100%;
		height: calc(var(--vh, 1vh) * 100);
		/* 使用动态变量 --vh */
		overflow: hidden;

		/* 避免滚动条 */
		.action-icon {
			position: fixed;
			z-index: 100;
			cursor: move;
			touch-action: none;

			img {
				width: 50px;
				height: 50px;
			}
		}

		iframe {
			position: absolute;
			width: 100%;
			height: calc(100% - 90px);
			top: 92px;
			border: none;
			z-index: 1;

			&.lotteryfull {
				top: 0;
				height: 100%;
			}
		}

		:deep(.navbar-fixed) {
			background-color: #0D0D0D;
			color: #fff !important;

			.navbar__content-left {
				.van-icon {
					color: #fff;
				}
			}

			.game-text {
				color: #fff;
				border-radius: 20px;
				height: 60px;
				border: 1.5px solid #1F4895;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 40px 0 60px;
				background-image: linear-gradient(180deg, rgba(30, 80, 173, 0.00) 0%, rgba(30, 61, 173, 0.85) 100%), url('@/assets/icons/svg/game_money.svg');
				background-size: 100% 100%, 182px 44px;
				background-repeat: no-repeat;
				background-position: left center, 10px center;
				position: relative;

				svg {
					position: absolute;
					left: -24px;
					top: 50%;
					width: 64px;
					height: 64px;
					transform: translateY(-50%);
				}
			}
		}

		.landscape-nav {
			:deep(.navbar-fixed) {
				width: 100vw;
			}
		}

		.game-right {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30px;
		}

		.game-icon {
			width: 48px;
			height: 48px;
			margin-left: 20px;

			svg {
				width: 48px;
				height: 48px;
			}

		}

	}
</style>