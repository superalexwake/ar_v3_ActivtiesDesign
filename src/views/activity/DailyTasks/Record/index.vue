<template>
	<div class="task-record-container">
		<NavBar :title="$t('titlePickUpRecord')" :placeholder="false" left-arrow @click-left="onClick" />
		<van-sticky :offset-top="49">
			<div class="head">
				<!-- 四个 Tab 与任务页 Tab 栏用同一批文案 key,避免出现两个「Weekly」 -->
				<button :class="{ active: activeIndex == 1 }" @click="onSwitch(1)">{{ $t('actTip4') }}</button>
				<button :class="{ active: activeIndex == 2 }" @click="onSwitch(2)">{{ $t('dailyMission') }}</button>
				<button :class="{ active: activeIndex == 3 }" @click="onSwitch(3)">{{ $t('periodCardWeekTab') }}</button>
				<button :class="{ active: activeIndex == 4 }" @click="onSwitch(4)">{{ $t('periodCardMonthTab') }}</button>
			</div>
		</van-sticky>
		<van-list
			v-model:loading="loading"
			:finished="finished"
			:finished-text="finishedText"
			@load="onLoad"
		>
			<div class="record-panel van-clearfix">
				<div class="record-panel-item" v-for="(item, index) in recordList" :key="index">
					<template v-if="isCardTab">
						<h1>{{ activeIndex == 3 ? $t('periodCardWeekName') : $t('periodCardMonthName') }}</h1>
						<h2>
							<span>{{ item.tierName }}</span>
							<span class="markRed">{{ cardStateText(item.cardState) }}</span>
						</h2>
						<div class="card-progress">
							{{ $t('periodCardClaimedDays', { taken: item.takeDayCount, total: item.totalDays }) }}
						</div>
						<div>
							<span>{{ item.buyTime }}</span>
							<h3>
								<svg-icon name="activityWallet" />
								<span>{{ currency(item.totalRewardAmount) }}</span>
							</h3>
						</div>
					</template>
					<template v-else>
						<h1>{{ activeIndex==1?$t('actTip5'):$t('actTip6') }}</h1>
						<h2>
							<span>{{ item.taskTitle }}</span>
							<span class="markRed">{{ item.taskTarget + '/' + item.taskTarget}}</span>
						</h2>
						<div>
							<span>{{ item.createDate }}</span>
							<h3>
								<svg-icon name = 'activityWallet' />
								<span>{{ currency(item.awardAmount) }}</span>
							</h3>
						</div>
					</template>
				</div>
			</div>
		</van-list>
		<Empty v-if="isShowEmpty"/>
	</div>
</template>

<script setup lang="ts">
import { GetWeeklyAwardRecordList,GetDailyAwardRecordList,GetMyPeriodCardRecords } from '@/api';
import {  AwaitApiResult, currency } from '@/utils'
import Empty from '@/components/Empty/index.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const recordList = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const pageNo = ref(1);
const isShowEmpty = ref(false);
const activeIndex = ref(1)
const finishedText = computed(()=>{
	 return isShowEmpty.value ? '' : t('noMoreThere');
})
// Tab 序号 → cardType 契约值(1 周卡 / 2 月卡);前两个 Tab 不在表内
const CARD_TAB_TYPE: Record<number, number> = { 3: 1, 4: 2 }
const isCardTab = computed(() => !!CARD_TAB_TYPE[activeIndex.value])

const cardStateText = (state: number) => {
	if (state === 2) return t('completed')
	if (state === 3) return t('periodCardExpired')
	return t('ongoing')
}

// 卡记录接口一次返回最近 100 单且不分页,周月卡同在一个数组里,按 cardType 分流
const loadCardRecords = async () => {
	const res: any = await AwaitApiResult(GetMyPeriodCardRecords())
	const list = (res?.data ?? []).filter((order: any) => order.cardType === CARD_TAB_TYPE[activeIndex.value])
	recordList.value = list
	isShowEmpty.value = !list.length
	finished.value = true
	loading.value = false
}

const onLoad = async() => {
	if (isCardTab.value) return loadCardRecords()
	let res: any;
	if(activeIndex.value == 1){
		res = await AwaitApiResult(GetWeeklyAwardRecordList({pageNo: pageNo.value, pageSize: 20}))
	}else{
		res = await AwaitApiResult(GetDailyAwardRecordList({pageNo: pageNo.value, pageSize: 20}))
	}
	if(res) {
		isShowEmpty.value = res.data.totalCount == 0;
		if(res.data.totalPage <= pageNo.value) finished.value = true
		else finished.value = false
		if(res.data.list){
			recordList.value.push(...res.data.list);
			recordList.value.sort((a,b)=>(b.createDate - a.createDate))
		} 
		pageNo.value++
	} else {
		finished.value = true;
	}
	loading.value = false
}
const onClick = ()=> {
	router.push({ name: 'DailyTasks'})
}
function onSwitch(index: number) {
	activeIndex.value = index
	pageNo.value = 1
	recordList.value.length=0
	onLoad()
}
</script>

<style lang="scss" scoped>
.task-record-container {
	font-family: 'Inter', sans-serif;
	
	// Tab 栏与任务页 .task-tabs 一致:胶囊、横向滚动、宽度跟随文案
	.head {
		display: flex;
		gap: 20px;
		// overflow-x 形成裁切上下文,padding 不留够会切掉按钮阴影
		padding: 10px 20px 20px;
		overflow-x: auto;
		scrollbar-width: none;
		// 吸顶时列表会从下方穿过,这里要有页面底色
		background: var(--light-bg_white, var(--bg_color_L1));
		&::-webkit-scrollbar {
			display: none;
		}
		> button {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 190px;
			height: 76px;
			padding: 0 20px;
			border: none;
			border-radius: 38px;
			font-size: 26px;
			white-space: nowrap;
			background: var(--bg_color_L2);
			color: var(--text_color_L2);
			box-shadow: 0 6px 12px 4px rgba(208, 208, 237, 0.36);
			&.active {
				background: var(--main_gradient-color2);
				color: var(--text_color_L4);
				font-weight: 700;
				box-shadow: 0 6px 12px rgba(208, 208, 237, 0.6), inset 0 -4px 10px #FFF6F4;
			}
		}
	}
	.record-panel{
		padding: 20px 24px;
		
		svg{
			width: 30px;
			height: 30px;
			margin-right: 10px;
		}
		&-item{
			padding: 30px 20px;
			background: var(--bg_color_L2);
			border-radius: 10px;
			margin-bottom: 20px;
			h1{
				color: var(--text_color_L1);
				font-size: 30px;
				margin-bottom: 10px;
			}
			.card-progress{
				margin-bottom: 10px;
				color: var(--text_color_L3);
			}
			h2{
				display: flex;
				align-items: center;
				margin-bottom: 10px;

				span{
					color: var(--text_color_L2);
				}
				.markRed{
					color: var(--norm_red-color);
					margin-left: 20px;
				}
			}
			div{
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: var(--text_color_L3);
				h3{
					display: flex;
					align-items: center;
					font-size: 28px;
					color: var(--norm_secondary-color);
				}
			}
		}
		
	}
}
</style>
