<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { LuckyWheel } from '@lucky-canvas/vue'
import { useTurntable } from '@/hooks'
import { currency } from '@/utils'
import List from "@/components/common/List.vue";
import Dialog from '@/components/common/Dialog.vue'
import zp from '@/assets/icons/activity/Turntable/zp.png'
import btn from '@/assets/icons/activity/Turntable/btn.png'
import {useRouter} from "vue-router";
import {getTurnTableRecord} from "@/api";
import {useI18n} from "vue-i18n";
const router=useRouter()
const {t}=useI18n()
const content=ref();
const wrap=ref(null)
const { getTurntabl, store,pull, prizes,recordQuery, getTurntablAmount, onEnd, onStart, myLucky,onClick } = useTurntable()
const blocks = [
	{
		padding: '0px',
		imgs: [
			{
				src: zp,
				width: '100%',
				height: '100%',
				rotate:true
			}
		]
	}
]
const buttons = [
	{
		radius: '30%',
		pointer: true,
		imgs: [
			{
				src: btn,
				top: -(204 / 4),
				width: 158 / 2,
				height: 204 / 2
			}
		]
	}
]
const rewardType={
	1:t('amountReward'),
	2:t('physicalReward')
}
const goPage=async (name:string)=>{
	router.push({
		name,
	})
}
onMounted(() => {
	const width = content.value?.offsetWidth || 350
	const height = content.value?.offsetHeight || 350
	wrap.value = {
		width,
			height
	}
	getTurntabl()
})
</script>

<template>
	<div class="turntable-page">
		<NavBar :title="$t('activityTurntable')" class="white" :placeholder="false" left-arrow @click-left="onClick" />
		<div class="turntable-page-header">
			<img src="@/assets/icons/activity/Turntable/bg.png" alt="" />
		</div>
		<div class="turntable-wrap">
			<div class="turntable-back">
			<div class="turntable-rule">
				
				<h3>{{$t('code9101')}}</h3>
				<img class="svg" src="@icon/activity/Turntable/frame.svg" alt="">
			</div>
			<div class="turntable-item">
				<span class="label">{{$t('depositMoney')}}</span>
				<div class="wallet">
					<span>{{ currency(store.amount) }}</span>
					<span class="re" @click="getTurntablAmount">
						<svg-icon name="refresh" />
					</span>
				</div>
			</div>
			<div class="turntable-item">
				<span class="label">{{$t('turntableCount')}}</span>
				<div class="count">
					<span class="count-progress">{{ store.rotateCount }}</span
					>/{{ store.count }}
				</div>
			</div>
		</div>

			<div class="turntable-main" ref="content">
				<LuckyWheel
					ref="myLucky"
					@start="onStart"
					@end="onEnd"
					v-if="wrap"
					:prizes="prizes"
					:width="wrap.width"
					:height="wrap.height"
					:buttons="buttons"
					:blocks="blocks"
					:defaultConfig="{
						offsetDegree:-20,
						accelerationTime:1000
						}"
					:defaultStyle="{
						lineHeight:15
					}"
				></LuckyWheel>
			</div>
			<ul class="turntable-entry">
				<li class="turntable-entry-item" @click="goPage('Turntable-Introduce')">
					<svg-icon name = "activityIntro" />
					<p>{{$t('activityIntroduce')}}</p>
				</li>
				<li class="turntable-entry-item" @click="goPage('Turntable-Detail')">
					<svg-icon name = "activityDetail" />
			
					<p>{{$t('eventDetails')}}</p>
				</li>
				<li class="turntable-entry-item" @click="goPage('Turntable-Rules')">
					<svg-icon name = "activityRule" />
					
					<p>{{$t('firstSaveRule')}}</p>
				</li>
			</ul>
			<div class="turntable-title">
				<svg-icon name = "historyHead" />
				<span>{{$t('record')}}</span>
			</div>

			<div class="turntable-table">
				<div class="turntable-table-titlebox">
					<div class="turntable-table-title">{{$t('turntableTime')}}</div>
					<div class="turntable-table-title">{{$t('winType')}}</div>
					<div class="turntable-table-title">{{$t('turntableWin')}}</div>
				</div>
				<List
					:distance="300"
					:api="getTurnTableRecord"
					v-model:list="store.turntableRecord"
					v-model:page-query="recordQuery"
					:isAutoLoad="true"
					ref="pull"
				>
					<template #content>
						<ul>
							<li v-for="(item, index) in store.turntableRecord" :key="index">
								<div>
									<p>{{item.drawTime}}</p>
								</div>
								<div class = "rewardType">{{ rewardType[item.rewardType] }}</div>
								<div class="rotateNum" v-if="item.rewardType===1">{{currency(item.rewardAmount)}}</div>
								<div class="rotateNum" v-else>{{item.rewardSetting}}</div>
							</li>
						</ul>
				</template>

				</List>

			</div>
		</div>
		<Dialog v-model:show="store.dialog" img-url="succeed" @confirm="store.dialog=false"  :show-cancel-btn="false" :confirmText="$t('sure')"
				:title="$t('succTip1')">
			<template #title>
				<div style="text-align: center">
					{{$t('turntableWinTip')}}<span class="rewardWin"> {{store.result?.rewardType === 1?currency(store.result?.rewardSetting):store.result?.rewardSetting}}</span>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<style scoped lang="scss">
.turntable-page {
	&-header {
		height: 338px;

		img {
			display: block;
			width: 100%;
			object-fit: cover;
			height: 100%;
		}
	}

	.turntable-wrap {
		padding: 24px;
	
	}
	.turntable-back{
		height: 360px;
		padding: 0px 20px;
		border-radius: 16px;
		background: var(--bg_color_L2);
		
	}
   
	.turntable-rule {
		position: relative;
		height: 58px;
		h3 {
			position: absolute;
			width: 100%;
			text-align: center;
			color: var(--text_white, var(--text_color_L1));
			font-size: 26px;
			font-weight: 600;
			line-height: 86px;
		}

		.svg {
			width: 100%;
		}
	}

	.turntable-item {
		height: 80px;
		background: var(--bg_color_L1);
		border-radius: 20px;
		margin-top: 50px;
		justify-content: space-between;
		align-items: center;
		display: flex;
		padding: 10px 20px;
		

		.label {
			color: var(--text_color_L1);
			font-family: Inter;
			font-size: 28px;
			font-style: normal;
			font-weight: 400;
			line-height: 30px;
		}

		.wallet {
			min-width: 220px;
			height: 60px;
			border-radius: 50px;
			background: var(--main_gradient-color);
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: var(--text_color_L4);
			text-align: center;
			font-size: 24px;
			font-style: normal;
			font-weight: 700;
			line-height: 30px;
			padding: 18px 20px;

			.re {
				width: 28px;
				height: 28px;

				svg {
					width: 100%;
					height: 100%;
				}
			}
		}
	
		.count {
			color: var(--text_color_L2);
			font-family: Inter;
			font-size: 30px;
			font-style: normal;
			font-weight: 700;
			line-height: 30px;

			&-progress {
				color: var(--norm_red-color);
				font-family: Inter;
				font-size: 30px;
				font-style: normal;
				font-weight: 700;
				line-height: 30px;
			}
		}
	}

	.turntable-main {
		height: 700px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.turntable-entry {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin: 20px 0;

		&-item {
			text-align: center;
			color: var(--darkTextW,var(--text_color_L1));

			svg {
				
				width: 96px;
				height: 96px;
				
			}

			p {
				font-family: PingFang SC;
				font-size: 24px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
		}
	}

	.turntable-title {
		margin-top: 30px;
		margin-bottom:15px;
		display: flex;
		align-items: center;
		gap:10px;
		span {
			vertical-align: middle;
		}

		svg {
			width: 48px;
			height: 48px;
		}

		color: var(--darkTextW,var(--text_color_L1));
		font-family: Inter;
		font-size: 32px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		
	}
	.turntable-table {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		&-titlebox {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			width: 100%;
			color:var(--text_color_L1);
			border-radius: 10px 10px 0 0;
			background: var(--sheet_nva_color);
		}
		ul {
			width: 100%;

			li {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				border-bottom: 1px solid var(--Dividing-line_color);
				
				div {
					height: 100%;
					flex: 1;
					font-size: 28px;
					padding: 26px 0;
					text-align: center;
				}
			}
			.targetAmount{
				color: var(--main-color);
				font-family: Inter;
				font-size: 26px;
				font-style: normal;
				font-weight: 500;
				line-height: 26px;
				margin-bottom: 6px;
				
			}
			p{
				color: var(--text_color_L1);
				font-size: 22px;
				font-style: normal;
				font-weight: 400;
				line-height: 22px;
			}

			.rewardType
			{
				color: var(--text_color_L1);
			}
			.rotateNum{
				color: var(--norm_red-color);
				font-size: 26px;
				font-style: normal;
				font-weight: 500;
				line-height: 26px;
			}
		}
		&-title {
			width: 100%;
			height: 80px;
			padding-block: 26px;
			font-size: 28px;
			line-height: 24px;
			text-align: center;
			color: var(--text_white, var(--text_color_L1));
		}

		&-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			height: 100%;

			& > div {
				width: 100%;
				padding: 26px 0;
				font-size: 28px;
				line-height: 28px;
				text-align: center;
				border-bottom: 1px solid var(--norm_red-color);

				&:last-of-type {
					border-bottom: none;
				}
			}
		}
	}
	:deep(.infiniteScroll){
		width: 100%;
		background: var(--bg_color_L2);
	}
	:deep(.dialog__container){
		position: relative;
		padding-top:145px ;
	}
	:deep(.dialog__container-img){
		position: absolute;
		width: 280px;
		height: 185px;
		top: -30px;
	}
	.rewardWin{
		color: var(--norm_red-color);
	}
}
</style>
