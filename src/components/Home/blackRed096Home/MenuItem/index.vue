<script setup lang="ts">
import { ref, watch } from 'vue'
import NavTab from '@/components/FunTab/NavBar.vue'
import popularIcon from '@icon/home/tabHome/popular.png'
import slotIcon from '@icon/home/tabHome/slot.png'
import sportIcon from '@icon/home/tabHome/sport.png'
import videoIcon from '@icon/home/tabHome/video.png'
import chessIcon from '@icon/home/tabHome/chess.png'
import fishIcon from '@icon/home/tabHome/fish.png'
import flashIcon from '@icon/home/tabHome/flash.png'
import lotteryIcon from '@icon/home/tabHome/lottery.png'

interface TabItem {
	title: string
	type: string
	isShow: boolean
	img: string
}

const props = withDefaults(
	defineProps<{
		tabList: TabItem[]
		currentMenu: number
	}>(),
	{
		currentMenu: 0
	}
)

const emit = defineEmits(['tab-change', 'update:current-menu'])

const active = ref(props.currentMenu)

// 图片读 src/assets/{MAINCOLOR}/icons/home/tabHome/{img}.png
const tabHomeIconMap: Record<string, string> = {
	popular: popularIcon,
	slot: slotIcon,
	sport: sportIcon,
	video: videoIcon,
	chess: chessIcon,
	fish: fishIcon,
	flash: flashIcon,
	lottery: lotteryIcon
}

const getImg = (item: TabItem) => {
	if (!item.img) return ''
	if (item.img.includes('http')) return item.img
	return tabHomeIconMap[item.img] || ''
}

const handleClickTab = (val: { item: TabItem; index: number }) => {
	const { item, index } = val
	emit('update:current-menu', index)
	emit('tab-change', { item, index })
	sessionStorage.setItem('currentKey', item.type)
}

watch(
	() => props.currentMenu,
	(val) => {
		active.value = val
	},
	{ immediate: true }
)
</script>

<template>
	<div class="menu_list">
		<NavTab :list="tabList" v-slot="{ item, index }" v-model:active="active" tabClassName="fff"
			@onClickTab="handleClickTab">
			<div class="item" :class="{ active_item: index === active }">
				<img :src="getImg(item as TabItem)" alt="" />
				<div class="title">{{ (item as TabItem).title }}</div>
			</div>
		</NavTab>
	</div>
</template>

<style scoped lang="scss">
.menu_list {
	position: sticky;
	top: 0;
	z-index: 102;
	display: flex;
	flex-direction: row;
	align-items: end;
	width: 100%;
	height: 178px;
	overflow-x: scroll;
	margin-bottom: 30px;
	margin-top: 40px;
	background-color: var(--bg_color_L1);

	&::-webkit-scrollbar {
		display: none;
	}

	::v-deep(.fun-tabs) {
		background: none;
	}

	::v-deep(.fun-tabs__tab-list) {
		align-items: end;
	}

	.item {
		position: relative;
		margin-left: 16px;

		img {
			width: 110px;
			height: 140px;
			object-fit: contain;
		}

		.title {
			position: absolute;
			bottom: 16px;
			left: 0;
			text-align: center;
			width: 100%;
			font-size: 20px;
			color: #fff;
		}
	}

	.active_item {
		img {
			width: 140px;
			height: 178px;
		}

		.title {
			font-size: 26px;
			font-weight: 500;
		}
	}
}
</style>
