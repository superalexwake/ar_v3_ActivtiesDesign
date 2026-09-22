<template>
	<div class="FD_3">
		<LotteryInfo @change-select-game="changeSelectGame" @setVoice="setVoice" :VoiceType="VoiceType" />
		<!--上期开奖结果-->
		<LotteryResult :premium="lastResult" :sumCount="lastResultSum" />
		<LotteryOpen ref="actionLoad" :handleRule="onSwitchIntroduce" :issue="issue" :premium="lastResult" :countdownTime="countdownTime" />

		<div class="FDB__C">
			<!-- 倒计时蒙层 -->
			<div v-show="isShowMark" class="FDB__C-mark">
				<div v-for="i in secondsStr">{{ i }}</div>
			</div>

			<!--投注列表栏-->
			<BetListColumn
				:currentGame="gameInfo"
				:issueNum="issue"
				:gameCode="gameCode"
				:time="countdown"
				:issueData="issueData"
				@betting="betting"
				:bigSmallEven="bigSmallEven"
				:numList="numList"
			/>
		</div>

		<!--游戏记录导航 -->
		<RecordNav :record="gameComponent" @changeC="(component:any) => (gameComponent = component)" />
		<!-- 动态展示对应的组件 -->
		<KeepAlive>
			<component
				ref="RecordComponent"
				:is="GameRecordList[gameComponent]"
				:gameCode="gameCode"
			/>
		</KeepAlive>
	</div>

	<!--开奖中奖弹窗-->
	<WinningTips ref="winner">
		<template v-slot="{ data }">
			<div class="WinningTip__C-body-l2">
				<p>{{ $t('betResult') }}</p>
				<div class="line1">
					<div v-for="(n, i) in data.premium" :key="i">
						<div class="title">{{ textList[i] }}</div>
						<div class="num">{{ n }}</div>
					</div>
					<div>
						<div class="title sum">SUM</div>
						<div class="num">{{ lastResultSum||0 }}</div>
					</div>
				</div>
			</div>
		</template>
	</WinningTips>

	<!--声音文件-->
	<audioVue/>

	<!--玩法说明规则弹层 begin-->
	<van-popup @open="getIntroduce" v-model:show="introduceDialog" :close-on-click-overlay="false" round>
		<BetRule :title="introduceHtml?.title" @close="onSwitchIntroduce">
			<div class="flex-center" style="height: 100%" v-if="introduceLoading">
				<van-loading  type="spinner" color="#FD565C" />
			</div>
			<div v-else v-html="introduceHtml?.content">
			</div>
		</BetRule>
	</van-popup>

</template>
<script setup lang="ts">
import {onMounted, ref,watch} from "vue";
import LotteryResult from '../../components/D5_3/LotteryResult.vue'
import LotteryOpen from '../../components/D5_3/LotteryOpen.vue'
import {useD5} from "../../hooks/useD5_3";
import {useGlobalContext} from "@/saasLottery/hooks";
import BetListColumn from "../../components/D5_3/BetListColumn.vue";
import {BetRule, LotteryInfo, WinningTips} from "@/saasLottery/components";
import RecordNav from '../../components/D5_3/RecordNav.vue'
import GameRecord from '../../components/D5_3/GameRecord.vue'
import Trend from '../../components/D5_3/Trend.vue'
import audioVue from '@/saasLottery/components/Audio/audio.vue'
import MyGameRecord from '../../components/D5_3/MyGameRecord.vue'
const {setVoice,bigSmallEven,numList,issueData,VoiceType,onClearBet,newBetting,useProvide,getlotteryissue,getIntroduce,onSwitchIntroduce,introduceDialog,introduceHtml,introduceLoading,lastResultSum,lastResult,issue,countdownTime,countdown,winner, isShowMark,secondsStr}=useD5()
const { gameInfo,gameCode,updateBalance,onBetTrigger,onLotteryJump } = useGlobalContext()
// 动态组件ref
const RecordComponent = ref()
// 动态组件
const GameRecordList:any = {
	GameRecord,
	Trend,
	MyGameRecord
}
// 动态组件展示
const gameComponent = ref('GameRecord')
const textList = ref<any[]>(['A', 'B', 'C', 'D', 'E', 'SUM'])
// 上期信息组件
const actionLoad = ref()
const look=ref(false)
useProvide()
onMounted(async () => {
	await getlotteryissue()
	// await getIssue()
})

const changeSelectGame = async (item:any) => {
	if (look.value)return;
	try {
		look.value=true
		onClearBet(true);
		onLotteryJump(item)
		await getlotteryissue()
		actionLoad.value?.control();
	}catch (e) {

	}finally {
		look.value=false;
	}
}

watch(() => countdown.value.seconds, (val) => {
	if (val === 0) {
		actionLoad.value?.animationShow()
	}
})

/*投注刷新*/
const betting=()=>{
	onBetTrigger()
	updateBalance()
	newBetting()
}
</script>
<style lang="scss" scoped>
.FD_3{
	position: relative;
	//z-index: 1000;
	.FDB__C {
		width: calc(100% - 52px);
		margin: auto;
		background-color: var(--darkBg, var(--bg_color_L2));
		padding: 26px 26px 0 26px;
		position: relative;
		&-mark {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			position: absolute;
			z-index: 99;
			top: 0;
			left: 0;
			color: var(--main-color);
			border-radius: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			html:lang(ar) &{
				direction: ltr;
			}
			& > div {
				display: inline-block;
				border-radius: 30px;
				padding: 0 30px;
				background-color: var(--bg_color_L3);
				font-weight: 700;
				font-size: 280px;

				& + div {
					margin-left: 78px;
				}
			}
		}
	}
}

.fd_main-winner{
	display: flex;
	justify-content: center;
	align-items: center;
	gap:8px;
	li{
		width: 40px;
		height: 40px;
		border-radius: 50%;
		text-align: center;
		line-height: 40px;
		color: var(--text_color_L4);
		border: 1px solid var(--text_color_L4);
	}
}

.WinningTip__C-body-l2{
	height: auto;
	color: var(--text_color_L4);
	font-size: 22px;
	margin-bottom: 48px;
	text-align: center;
	position: relative;
	> p{
		position: absolute;
		top: -38px;
		width: 100%;
		text-emphasis: none;
	}
	.line1 {
		height: auto;
		width: 380px;
		//margin: auto;
		font-size: 22px;
		color: var(--text_color_L4);
		display: flex;
		margin: 4px auto;
		justify-content: space-around;

		& > div {
			//width: 62px;
			height: 108px;

			.title {
				width: 54px;
				height: 54px;
				background: var(--norm_secondary-color);
				border-radius: 50% 50% 0 0;
				font-size: 30px;
				line-height: 54px;
				position: relative;

				&::after {
					content: '';
					width: 8px;
					height: 8px;
					position: absolute;
					bottom: 0;
					right: -8px;
					z-index: 9;
					background: var(--linearGradien-38);
				}

				&.sum {
					font-size: 20px;
				}
			}
			.num {
				width: 48px;
				height: 48px;
				color:var(--text_color_L4);
				border-radius: 50%;
				line-height: 48px;
				text-align: center;
				border: 1px solid var(--text_color_L4);
				margin: 8px auto;
			}
		}
	}
}
</style>
<style lang="css">
.bet-rule .bet-rule-head{
	background: var(--main_gradient-color);
}
</style>