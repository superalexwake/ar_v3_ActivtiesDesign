<template>
	<NavTab
		:list="tabLists"
		v-model:active="currentTab"
		tabClassName="tabs"
		v-slot="{ item, index }"
		@onClickTab="handleClickTab"
		activeClassName="tab_active"
		ref="tabRefs"
		tabItemClassName="funtab_item"
	>
		<div class="tab_item" :class="{ tab_active: index === currentTab, allGame: !isShowIcon }">
			<img v-if="item.img" :src="getImg(item)" alt="" />
			<span>{{ item.title }}</span>
		</div>
	</NavTab>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ref, watch } from 'vue'
import NavTab from '@/components/FunTab/NavBar.vue'
// import { gameList } from '@/components/Home/GameList/GameList'
import { deepCopy } from '@/utils'
import allIcon from '@icon/home/all.png'
const emit = defineEmits(['tabChange', 'update:currentMenu'])
const tabRef = ref()

type AllGame = {
	isAll: boolean
	img: string
	isShow: boolean
	gameList: any[]
	gameType: string
	title: string
}

const props = withDefaults(
	defineProps<{
		tabList: Partial<AllGame[]>
		visibileAll?: boolean
		currentMenu: number
		isShowIcon?: boolean
		isBg?: boolean
	}>(),
	{
		visibileAll: true,
		isShowIcon: true,
		isBg: true
	}
)

const localTabIconMap: Record<string, string> = {
	all: allIcon
}

const getImg = (item: AllGame) => {
	if (item.img.includes('http')) {
		return item.img
	} 
	return localTabIconMap[item.img] || ''
}

const currentTab = ref(0)

const tabLists = computed(() => {
	let tabList = deepCopy(props.tabList)
	// props?.visibileAll && tabList.unshift(staticTab)
	if (tabList.length === 1) {
		return []
	}
	return tabList
})

const handleClickTab = (val: any) => {
	let { item, index } = val
	emit('tabChange', { item, index: index })
	emit('update:currentMenu', currentTab.value)
}

const currentMenu = computed(() => {
	return props.tabList[currentTab.value]
})

watch(
	() => props.currentMenu,
	(val) => {
		currentTab.value = val
	},
	{
		immediate: true
	}
)

defineExpose({
	currentTab,
	currentMenu,
	tabRef
})
</script>
<style lang="scss" scoped>
.tabs {
	background: none;
	margin-top: 36px;
	margin-bottom: 30px;
}
.tab_item {
	min-width: 96px;
	height: 119px;
	margin-inline: 5px;
	padding: 0;
	color: #80849c;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 10px;
	img {
		max-width: 42px;
		height: 42px;
		margin-bottom: 8px;
	}
	svg {
		width: 42px;
    height: 42px;
    margin-bottom: 8px;
	}
	span {
		font-size: 24px;
	}
}
.allGame {
	height: 70px;
	min-width: 140px;
	flex-direction: row;
}
.tab_active {
	color: var(--norm_Variable_1, #3042DA);
	background: var(--main_gradient-color);
}

::v-deep(.fun-tabs .fun-tab-item) {
	padding: 14px 0;
}

.noBg {
	background: none !important;
	:deep(.van-tabs__nav--card) {
		.van-tab--card {
			background: rgba(21, 30, 43, 0.81) !important;
		}
	}
}
</style>
