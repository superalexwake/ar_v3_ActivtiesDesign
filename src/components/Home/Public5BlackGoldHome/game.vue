<template>
	<div class="game">
		<div v-if="isSticky" class="sticky nav">
			<div v-for="item in gameMenuTab" :key="item.type" @click="handleClick(item.type, $event, true)">
				<img :src="activeType === item.type ? item.activeImg : item.no_activeImg" />
				<div :class="{ activeText: activeType === item.type }">{{ item.label }}</div>
			</div>
		</div>
		<div ref="navRef" class="nav">
			<div v-for="item in gameMenuTab" :key="item.type" @click="handleClick(item.type, $event)">
				<img :src="activeType === item.type ? item.activeImg : item.no_activeImg" />
				<div :class="{ activeText: activeType === item.type }">{{ item.label }}</div>
				<div :class="{ active: activeType === item.type }" />
			</div>
		</div>
	</div>
	<lobby v-if="activeType == ''" @change-type="changeType" :tabList="gameMenuTab"  />

	<gameList v-if="showAll.includes(activeType)" :activeType="activeType" />

	<popularGame v-if="popAll.includes(activeType)" />

	<seachGame v-if="seachAll.includes(activeType)" :activeType="activeType" />
</template>

<script lang="ts" setup>
import iconHomeLottery from '@icon/home/Lottery.png'
import iconHomeIconLottery from '@icon/home/icon_Lottery.png'
import iconHomePopular from '@icon/home/Popular.png'
import iconHomeIconPopular from '@icon/home/icon_Popular.png'
import iconHomeMiniGame from '@icon/home/MiniGame.png'
import iconHomeIconMiniGame from '@icon/home/icon_MiniGame.png'
import iconHomeCasino from '@icon/home/Casino.png'
import iconHomeIconCasino from '@icon/home/icon_Casino.png'
import iconHomeSlots from '@icon/home/Slots.png'
import iconHomeIconSlots from '@icon/home/icon_Slots.png'
import iconHomeSports from '@icon/home/Sports.png'
import iconHomeIconSports from '@icon/home/icon_Sports.png'
import iconHomePVC from '@icon/home/PVC.png'
import iconHomeIconPVC from '@icon/home/icon_PVC.png'
import iconHomeFishing from '@icon/home/Fishing.png'
import iconHomeIconFishing from '@icon/home/icon_Fishing.png'
import iconHomeLobby from '@icon/home/Lobby.png'
import iconHomeIconLobby from '@icon/home/icon_Lobby.png'
import lobby from './lobby.vue'
import gameList from './gameList.vue';
import seachGame from './seachGame.vue';
import popularGame from './popular.vue';
import { useHome } from '@/hooks';
import { onMounted, onUnmounted, provide, reactive, ref,computed } from 'vue';
import { useI18n } from 'vue-i18n';

// 导航项数据
const navItems = [
	{ type: 'Lottery', label: 'Lottery', activeImg: iconHomeLottery,no_activeImg:iconHomeIconLottery },
	{ type: 'Popular', label: 'Popular', activeImg: iconHomePopular, no_activeImg: iconHomeIconPopular },
	{ type: 'Flash', label: 'Mini Game', activeImg: iconHomeMiniGame, no_activeImg: iconHomeIconMiniGame },
	{ type: 'Video', label: 'Casino', activeImg: iconHomeCasino, no_activeImg: iconHomeIconCasino },
	{ type: 'Slot', label: 'Slots', activeImg: iconHomeSlots, no_activeImg: iconHomeIconSlots },
	{ type: 'Sport', label: 'Sports', activeImg: iconHomeSports, no_activeImg: iconHomeIconSports },
	{ type: 'Chess', label: 'PVC', activeImg: iconHomePVC, no_activeImg: iconHomeIconPVC },
	{ type: 'Fish', label: 'Fishing', activeImg: iconHomeFishing, no_activeImg: iconHomeIconFishing },
];
const showAll = ['Flash','Fish','Video','Sport','Chess',"Lottery"];
const seachAll = ['Slot']
const popAll = ['Popular']
const useHomeHook = useHome();
provide('useHomeHook', useHomeHook);
const { t } = useI18n()
const { getGameType, homeState, getAllGame } = useHomeHook
const activeType = ref('');
const siderList = reactive<any[]>([])
// 导航栏容器引用
const isSticky = ref(false);
const gameMenuRef = ref<string | null>(sessionStorage.getItem('gameMenu'));
const navRef = ref<HTMLDivElement | null>(null);
const getGameTypeList = async () => {
	await getGameType()
	if (homeState.gameTypeList.length > 0) {
		// console.log("进来的数据",homeState.gameTypeList)
		homeState.gameTypeList.forEach((item) => {
			if (item.state !== 1) return
			siderList.push({
				isShow: item.state === 1,
				title: t('code' + item.typeNameCode),
				img: item.categoryImg,
				sort:item.sort,
				key: item.categoryCode.charAt(0).toUpperCase() + item.categoryCode.slice(1)
				// key: item.categoryCode.toLocaleLowerCase()
			})
		})
		gameMenuRef.value = JSON.stringify(siderList);
		sessionStorage.setItem('gameMenu', JSON.stringify(siderList))
	}
}
/*动态获取导航大类菜单*/
const gameMenuTab = computed(() => {
	const gameMenu = gameMenuRef.value;
	const all= { type: '', label: 'Lobby', activeImg: iconHomeLobby,no_activeImg:iconHomeIconLobby};
	if (gameMenu) {
		const aa = navItems.map(item => {
			const match = JSON.parse(gameMenu)?.find((menu: any) => menu.key === item.type);
			return {
				...match,
				...item,
			};
		}).sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0));
		const bb = aa.filter(item => item.isShow)||[];
		return [all,...bb]
	}
	return [];
});

// console.log("最新的导航菜单",gameMenuTab.value)

// 点击事件处理逻辑
function handleClick(type: string, event: MouseEvent, isScroll: boolean = false) {
	activeType.value = type;
	// 获取当前点击的目标元素
	const target = event.currentTarget as HTMLElement;
	if (navRef.value) {
		const navContainer = navRef.value;
		// 容器宽度和目标元素位置
		const containerWidth = navContainer.offsetWidth;
		const targetLeft = target.offsetLeft - navContainer.offsetLeft;
		const targetWidth = target.offsetWidth;
		// console.log('容器，目标左，目标宽', containerWidth, targetLeft, targetWidth);
		// 计算滚动位置，使目标元素居中
		const scrollTo = Math.max(0, targetLeft - (containerWidth - targetWidth) / 2);
		navContainer.scrollTo({
			left: scrollTo,
			behavior: 'smooth', // 平滑滚动
		});
	}
	if (isScroll && navRef.value) {
		window.scrollTo({
			top: navRef.value.offsetTop + 12,
			behavior: 'smooth'
		})
	}
}
const changeType = (value: string) => {
	activeType.value = value;
}


const handleScroll = () => {
	if (navRef.value) {
		const navTop = navRef.value.getBoundingClientRect().top - 40;
		isSticky.value = navTop <= 0; // 如果滚动超过 nav，设置吸顶
	}
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
getGameTypeList();
getAllGame();
</script>
<style lang="scss" scoped>
@font-face {
	font-family: 'AlibabaPuHuiTi';
	src: url('@/assets/fonts/AlibabaSans-Black.woff2') format('woff2');
	font-weight: 900;
	font-display: swap;
}

@font-face {
	font-family: 'AlibabaPuHuiTi';
	src: url('@/assets/fonts/AlibabaSans-Bold.woff2') format('woff2');
	font-weight: 700;
	font-display: swap;
}

@font-face {
	font-family: 'AlibabaPuHuiTi';
	src: url('@/assets/fonts/AlibabaSans-Heavy.woff2') format('woff2');
	font-weight: 800;
	font-display: swap;
}

@font-face {
	font-family: 'AlibabaPuHuiTi';
	src: url('@/assets/fonts/AlibabaSans-Medium.woff2') format('woff2');
	font-weight: 500;
	font-display: swap;
}

.game {
	.nav {
		display: flex;
		height: fit-content;
		width: 100%;
		align-items: center;
		padding-bottom: 6px;
		overflow: hidden;
		&.sticky {
			position: fixed;
			/* 固定在顶部 */
			top: 0;
			left: 50%;
			width: 100%;
			background: var(--bg_color_L1, #110D14);
			z-index: 1000;
			height:150px;
			padding-top: 22px;
			max-width: 750px;
			transform: translateX(-50%);
			border-bottom: 1px solid var(--text_color_L3, #837064);
			box-shadow: 0px 8px 16px 0px var(--bg_color_L1, #110D14);
			overflow-x: auto;
			-webkit-overflow-scrolling: touch; /* 移动端平滑滚动 */
			scrollbar-width: auto; /* 显示滚动条 */
			&::-webkit-scrollbar {
				display: block; /* 显示滚动条 */
			}
		}

		&>div {
			position: relative;
			display: flex;
			height: 150px;
			box-sizing: border-box;
			flex-flow: column;
			padding: 0px 16px 0 32px;
			justify-content: center;
			align-items: center;
			gap: 8px;
			color: var(--text_color_L3, #837064);
			flex: none;
			font-family: "Alibaba PuHuiTi 3.0";
			img {
				height: 62px;
				width: 62px;
			}
		}
		.activeText{
			color: var(--text_color_L1, #FDE4BC);
		}
		.active {
			position: absolute;
			bottom: 0;
			width: 56px;
			height: 8px;
			flex-shrink: 0;
			border-radius: 16px;
			background: var(--main-color, #FED358);
			box-shadow: 0px 4px 20px 0px rgba(254, 211, 88, 0.65);
		}
	}
}
</style>