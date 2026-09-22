<template>
	<div class="lottery_container">
		<div class="lotterySlotItem" :class="item.class" v-for="item in list[currentLottery]" :key="item.typeId" @click="isAlowGame(item, onItemClick)">
			<i class="lottery_icon" :data-key="`${item.class}${item.typeId}`" />
			<div>{{ item.title }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {onMounted, reactive} from 'vue'
import {AwaitApiResult} from '@/utils'
import { useHome } from '@/hooks'
import { getLotteryGameTypeList } from '@/api';

const router = useRouter()

const { isAlowGame,isSassLotteryGame,openThirdGame} = useHome()
withDefaults(
	defineProps<{
		currentLottery: string
	}>(),
	{}
)
function flattenDeep(arr:any[]):any[] {
	return arr.reduce((acc, val) => {
		return Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val);
	}, []);
}
let list = reactive<any>({
	All: [],
	'MotoRace': [
		{
			typeId: 17,
			class: 'Motorace',
			title: 'Moto Racing',
			path: 'MotoRace',
			gameCode: 'MotoRace_1M'
		}
	],
	'Win Go':[
		{
			typeId: 30,
			class: 'wingo',
			title: 'Win Go 30s',
			path: 'WinGo',
		},
		{
			typeId: 1,
			class: 'wingo',
			title: 'Win Go 1Min',
			path: 'WinGo',
		},
		{
			typeId: 2,
			class: 'wingo',
			title: 'Win Go 3Min',
			path: 'WinGo',
		},
		{
			typeId: 3,
			class: 'wingo',
			title: 'Win Go 5Min',
			path: 'WinGo',
		},
		{
			typeId: 4,
			class: 'wingo',
			title: 'Win Go 10Min',
			path: 'WinGo',
		}
	],
	'5D': [
		{
			typeId: 5,
			class: 'd5',
			title: '5D 1Min',
			path: '5D'
		},
		{
			typeId: 6,
			class: 'd5',
			title: '5D 3Min',
			path: '5D'
		},
		{
			typeId: 7,
			class: 'd5',
			title: '5D 5Min',
			path: '5D'
		},
		{
			typeId: 8,
			class: 'd5',
			title: '5D 10Min',
			path: '5D'
		}
	],
	K3: [
		{
			typeId: 9,
			class: 'k3',
			title: 'K3 1Min',
			path: 'K3'
		},
		{
			typeId: 10,
			class: 'k3',
			title: 'K3 3Min',
			path: 'K3'
		},
		{
			typeId: 11,
			class: 'k3',
			title: 'K3 5Min',
			path: 'K3'
		},
		{
			typeId: 12,
			class: 'k3',
			title: 'K3 10Min',
			path: 'K3'
		}
	],
	'Trx Win Go': [
		{
			typeId: 13,
			class: 'trx',
			title: 'Trx Win Go 1Min',
			path: 'WinTrx'
		},
		{
			typeId: 14,
			class: 'trx',
			title: 'Trx Win Go 3Min',
			path: 'WinTrx'
		},
		{
			typeId: 15,
			class: 'trx',
			title: 'Trx Win Go 5Min',
			path: 'WinTrx'
		},
		{
			typeId: 16,
			class: 'trx',
			title: 'Trx Win Go 10Min',
			path: 'WinTrx'
		}
	],
	"VideoWinGo":[
		{
			typeId: 23,
			class: 'VideoWinGo',
			title: 'VideoWinGo 3Min',
			path: 'VideoWinGo',
			icon: 'VideoWinGo',
		},
	]
})



/**
 * @description: 点击前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	if (isSassLotteryGame(item)){
		return openThirdGame({...item,vendorCode:'ARLottery'})
	}
	router.push({
		name: 'AllLotteryGames-' + item.path,
		query: {
			typeId: item.typeId,
			id:item.id
		}
	})
}

const getWingo = async () => {
	// const result = await AwaitApiResult(winGoGetTypeList())
	const res = await AwaitApiResult(getLotteryGameTypeList())
	let wingo = res.data.winGo || []
	let k3 = res.data.k3 || []
	let trx = res.data.trxWinGo || []
	let d5 = res.data.fiveD || []
	let motorace = res.data.motoRace || [];
	let videoWingo = res.data.videoWinGo || []
	for (let i = list['Win Go'].length - 1; i >= 0; i--) {
		let item = list['Win Go'][i]
		let el = wingo.find((x: any) => item.typeId === x.typeID)
		if (!el) {
			list['Win Go'].splice(i, 1)
		}else{
			Object.assign(item,el)
		}
	}
	list['Win Go'].sort((a: any, b: any) => b.sort - a.sort)

	for (let i = list['K3'].length - 1; i >= 0; i--) {
		let item = list['K3'][i]
		let el = k3.find((x: any) => item.typeId === x.typeID)
		if (!el) {
			list['K3'].splice(i, 1)
		}else{
			Object.assign(item,el)
		}
	}
	list['K3'].sort((a: any, b: any) => b.sort - a.sort)

	for (let i = list['Trx Win Go'].length - 1; i >= 0; i--) {
		let item = list['Trx Win Go'][i]
		let el = trx.find((x: any) => item.typeId === x.typeID)
		if (!el) {
			list['Trx Win Go'].splice(i, 1)
		}else{
			Object.assign(item,el)
		}
	}
	list['Trx Win Go'].sort((a: any, b: any) => b.sort - a.sort)

	for (let i = list['5D'].length - 1; i >= 0; i--) {
		let item = list['5D'][i]
		let el = d5.find((x: any) => item.typeId === x.typeID)
		if (!el) {
			list['5D'].splice(i, 1)
		}else{
			Object.assign(item,el)
		}
	}
	list['5D'].sort((a: any, b: any) => b.sort - a.sort)

	for (let i = list['MotoRace'].length - 1; i >= 0; i--) {
		let item = list['MotoRace'][i]
		let el = motorace.find((x: any) => item.typeId === x.typeID)
		if (!el) {
			list['MotoRace'].splice(i, 1)
		}else{
			Object.assign(item,el)
		}
	}
	list['MotoRace'].sort((a: any, b: any) => b.sort - a.sort)
	for (let i = list['VideoWinGo'].length - 1; i >= 0; i--) {
		let item = list['VideoWinGo'][i]
		let el = videoWingo.find((x: any) => item.typeId === x.typeID)
		if (!el) {
			list['VideoWinGo'].splice(i, 1)
		}else{
			Object.assign(item,el)
		}
	}
	list['VideoWinGo'].sort((a: any, b: any) => b.sort - a.sort)
	const flattened = flattenDeep(Object.values(list)).sort((a: any, b: any) => b.sort - a.sort);
	list.All = flattened
}

onMounted(async () => {
	await getWingo()
})
</script>

<style lang="scss" scoped>
.lottery_container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 24px;
	.lotterySlotItem {
		width: 218px;
		height: 218px;
		border-radius: 30px;
		text-align: center;
		position: relative;
		background: linear-gradient(90deg, #FFC59A 0%, #FF8580 100%);
		div {
			position: absolute;
			bottom: 15px;
			left: 0;
			width: 100%;
			text-align: center;
			color: #171717;
			text-align: center;
			font-size: 20px;
			font-style: normal;
			font-weight: 400;
			letter-spacing: 1.42px;
			html:lang(ar) &{
				left: unset;
				right: 0;
			}
		}
		.lottery_icon {
			display: block;
			width: 172px;
			height: 172px;
			background: no-repeat center / contain;
		}
	}
	$lottery-items: (
		'wingo30', 'wingo1', 'wingo2', 'wingo3', 'wingo4',
		'd55', 'd56', 'd57', 'd58',
		'k39', 'k310', 'k311', 'k312',
		'trx13', 'trx14', 'trx15', 'trx16',
		'Motorace17',
		'VideoWinGo23'
	);
	@each $key in $lottery-items {
		.lottery_icon[data-key="#{$key}"] {
			background-image: url('@public/home/lottery/#{$key}.png');
		}
	}
	//.wingo {
	//	background-image: url('@/assets/icons/home/icons/wingo.png');
	//}
	//.k3 {
	//	background-image: url('@/assets/icons/home/icons/k3.png') ;
	//}
	//.d5 {
	//	background-image: url('@/assets/icons/home/icons/5d.png');
	//}
	//.trx {
	//	background-image: url('@/assets/icons/home/icons/trx.png');
	//}
}
</style>
