<template>
	<div class="binguo_count_tab">
		<div
			class="item"
			:class="{ active: store.currentTabIndex === index }"
			v-for="(item, index) in tabList"
			:key="item.value"
			@click="store.currentTabIndex = index"
		>
			{{ item.lable }}
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useBinguoCount } from '@/hooks/useBinguoCount'
import { useI18n } from 'vue-i18n';

const { store } = useBinguoCount()
const {t} = useI18n()

const tabList = [
	{
		lable: t('betting'),
		value: 1
	},
	{
		lable: t('detail'),
		value: 2
	},
	{
		lable: t('thisWeek'),
		value: 3
	},
	{
		lable: t('binguoLeaderboard'),
		value: 4
	}
]
</script>
<style lang="scss" scoped>
.binguo_count_tab {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 100px;
	border-radius: 12px;
	background-color: #0f6946;
	margin-bottom: 26px;
	.item {
		
    color: #fff;
    font-size: .4rem;
    font-style: normal;
    font-weight: 400;
    line-height: .4rem;
    text-align: center;
    padding: 0 0.66667rem;
    -webkit-transition: opacity .3s ease;
    transition: opacity .3s ease;
    height: 100%;
    display: flex;
    align-items: center;
	}
	.active {
		background-color: #5dba47;
		border-radius: 12px;
		color: #fff;
		opacity: 1; /* 默认选中的元素不透明 */
	}
	.item:not(.active) {
		opacity: 0.8; /* 非选中的元素半透明 */
	}
}
</style>
