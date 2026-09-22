<template>
	<div class="bonus__container">
		<NavBar :title="$t('bonusDetails')" left-arrow @click-left="onClick" />
		<div class="bonus__container-header">
			<div class="ar">
				<div class="ar-searchbar">
					<ArSelect @click-select="onClickSelectS" :selectName="typeLable"></ArSelect>
					<ArSelect :class="{bonusStates:[0,2].includes(query.receiveState)}" @click-select="onSelect" :selectName="query.date || $t('pickDate')"> </ArSelect>
				</div>
			</div>
		</div>
		<ul class="bonus__container-tabs">
			<li v-for="item of rewardStates" :class="{ active: item.value === query.receiveState }" @click="onTabState(item)">
				{{ item.label }}
			</li>
		</ul>
		<List
			v-model:list="list"
			v-model:page-query="query"
			:api="getListRewards"
			:distance="100"
			ref="listRef"
			:is-auto-load="true"
		>
			<template #content>
				<BonusItem
					v-for="item of list"
					:key="item.activityId"
					:item="item"
					:state="query.receiveState"
					@pack="onBonusPack"
				/>
			</template>
		</List>
		<!-- 配合弹窗层使用 -->
		<van-popup v-model:show="showPicker" round position="bottom">
			<van-picker
				:columns-field-names="{ text: 'label', value: 'value' }"
				:columns="rewardTypes"
				@cancel="showPicker = false"
				@confirm="onConfirm"
			/>
		</van-popup>
		<van-popup v-model:show="showDataPick" round position="bottom">
			<van-date-picker
				v-model="currentDate"
				:title="$t('pickDate')"
				@cancel="cancelDataPick"
				@confirm="onConfirmDataPick"
				:min-date="minDate"
				:max-date="maxDate"
			/>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useBonusPack } from '@/hooks'
import BonusItem from '@/components/Activity/Bonus/item.vue'
import List from '@/components/common/ListSimply.vue'
import { dateRange, fixDateStr } from '@/utils'

const { t } = useI18n()
const { rewardStates, rewardTypes, query, list, getListRewards, listRef, onTabState, onBonusPack } = useBonusPack()
const router = useRouter()
function onClick() {
	router.back()
}
const { minDate, maxDate } = dateRange(0)
// 日期选择
const {  value: dateVal } = fixDateStr()
const currentDate = ref(dateVal)
//#region 下拉框部分
const showPicker = ref(false)
const typeLable = ref(t('all'))
const dropdownClickS = ref(false) //判断状态下拉框是否被点击
const showDataPick = ref(false)
const onSelect=()=>{
	if ([0,2].includes(query.receiveState)) return;
	showDataPick.value = true;

}
//选择状态
const onConfirm = async ({ selectedOptions }: any) => {
	showPicker.value = false
	typeLable.value = selectedOptions[0].label
	query.rewardType = selectedOptions[0].value
	listRef.value.resetRefresh()
}
const cancelDataPick = ({ selectedOptions }: any) => {
	showDataPick.value = false
	query.date = ""
	listRef.value.resetRefresh()
}
//选择日期
const onConfirmDataPick = async ({ selectedOptions }: any) => {
	showDataPick.value = false
	query.date = `${currentDate.value[0]}-${currentDate.value[1]}-${currentDate.value[2]} 00:00:00`
	listRef.value.resetRefresh()
}
//状态下拉框点击事件
function onClickSelectS() {
	showPicker.value = true
	dropdownClickS.value = true
}

</script>

<style lang="scss" scoped>
.bonus__container {
	padding-inline: 24px;
	font-family: $font-family;

	.ar {
		margin-top: 20px;
		background: var(--bg_color_L1);
		overflow: hidden;
	}
	.bonusStates{
		opacity: .5;
	}
	&-header {
		height: 84px;
	}
	&-tabs {
		margin-top: 20px;
		display: flex;
		height: 80px;
		justify-content: center;
		align-items: center;

		li {
			color: var(--text_color_L2);
			text-align: center;
			flex: 1;
			font-size: 32px;
			font-style: normal;
			font-weight: 400;
			line-height: 36px;
			cursor: pointer;
			padding-bottom: 10px;
			&.active {
				color: var(--main-color);
				border-bottom: 4px solid var(--main-color);
			}
		}
	}

	&-empty {
		margin-top: 50px;
	}
}
</style>
