<script setup lang="ts">
import { Overlay } from 'vant'
import { reactive, ref } from 'vue'
import { useGlobalContext } from '@/saasLottery/hooks'

interface Winnner {
	isWin: boolean
	issueNumber: string
	amount: number
	result: Record<string, any>
}

const { currentGame } = useGlobalContext()
const show = ref(false)
const isWin = ref(false)
const autoClose = ref(false)
const autoTimer = ref<any>(null)
const store = reactive({
	issueNumber: '',
	amount: 0,
	result: null
})

const onAutoClose = () => {
	autoClose.value = !autoClose.value
	if (autoClose.value) {
		clearTimeout(autoTimer.value)
		autoTimer.value = setTimeout(() => {
			autoClose.value = false
			show.value = false
			store.issueNumber='';
			store.amount=0;
			store.result=null
		}, 3000)
	} else {
		clearTimeout(autoTimer.value)
	}
}

const open = async (options: Winnner) => {
	autoClose.value = false
	show.value = true
	isWin.value = options.isWin
	store.issueNumber = options.issueNumber
	store.amount = options.amount
	// @ts-ignore
	store.result = options.result
	onAutoClose()
}
defineExpose({
	open
})
</script>

<template>
	<Overlay :show="show" z-index="99" @click="show = false">
		<div class="winning" @click.stop :class="{ winBg: isWin, failBg: !isWin }">
			<div class="winning-wrap" :class="{ noWin: !isWin }">
				<div class="title" v-if="isWin">{{$t('motoTip1')}}</div>
				<div class="noWin_title" v-else>{{$t('common.fail')}}</div>
				<div class="amount" v-if="isWin">{{ store.amount }}</div>
				<div class="amount" v-else>{{$t('motoTip2')}}</div>
				<div class="result_txt">{{$t('motoTip3')}}</div>
				<div class="result_box" v-if="store.result">
					<slot name="result" :data="{result: store.result as any, isWin}"></slot>
				</div>

				<div class="lottery_info">
					<div class="lottery_img" />
					<div class="info">
						<div>{{$t('game')}}:{{ currentGame?.gameName || '' }}</div>
						<div>{{$t('motoTip4')}}:</div>
						<div>{{ store.issueNumber }}</div>
					</div>
				</div>

				<div class="go_it" @click.stop="show = false">{{$t('motoTip5')}}</div>
			</div>
		</div>
	</Overlay>
</template>

<style scoped lang="scss">
.winning {
	width: 750px;
	height: 990px;
	background-color: transparent;
	background-size: 100% 100%;
	background-position: center;
	background-repeat: no-repeat;
	padding-top: 147px;
	position: absolute;
	top: 18%;
	left: 50%;
	transform: translateX(-50%);
	.winning-wrap {
		margin: 0 auto;
		width: 520px;
		height: 760px;
		padding: 24px 40px 0 40px;
		.title {
			color: #04060a;
			font-size: 44px;
			font-weight: 600;
			margin-bottom: 12px;
		}
		.noWin_title {
			color: #768ca6;
			font-size: 44px;
			font-weight: 600;
			margin-bottom: 12px;
		}
		.amount {
			color: #f9561b;
			font-size: 88px;
			font-weight: bold;
		}
		.result_txt {
			color: #646c7b;
			font-size: 24px;
			font-weight: 400;
			line-height: 34px; /* 141.667% */
			margin-bottom: 20px;
		}

		.lottery_info {
			padding: 16px;
			border-radius: 16px;
			border: 2px solid #fff;
			background: rgba(255, 255, 255, 0.2);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			gap: 16px;
			margin-bottom: 24px;
			.lottery_img {
				width: 72px;
				height: 72px;
				background: url('./assets/moto_logo.png') no-repeat left center;
				background-size: 72px;
			}
			.info {
				width: calc(100% - 88px);
				color: #646c7b;
				font-size: 24px;
				font-weight: 500;
				line-height: 28px; /* 116.667% */
				div {
					margin-bottom: 8px;
				}
			}
		}

		.go_it {
			display: flex;
			width: 200px;
			height: 72px;
			padding: 10px;
			justify-content: center;
			align-items: center;
			border-radius: 50px;
			background: linear-gradient(180deg, #ff9350 0%, #f9561b 100%);
			box-shadow: 0px 4px 8px 0px rgba(255, 255, 255, 0.7);
			color: #fff;
			font-size: 32px;
			font-weight: 500;
			margin: 0 auto;
		}
	}
	.noWin {
		.amount {
			color: #768ca6;
			font-size: 56px;
			line-height: 102px;
		}

		.go_it {
			color: #4b637e;
			border-radius: 50px;
			background: linear-gradient(180deg, #d5e3f3 10.46%, #9bb7d8 91.19%);
			box-shadow: 0px 4px 8px 0px rgba(255, 255, 255, 0.2);
		}
	}
}
.winBg {
	background-image: url('./assets/win.png');
}
.failBg {
	background-image: url('./assets/fail.png');
}
</style>
