<template>
	<div class="x-page">

		<NavBar :title="$t('rebateRatio')" left-arrow @click-left="router.go(-1)"> </NavBar>
		<van-sticky :offset-top="46" :container="containerRef" class="bet-container-sticky">
			<div>
				<NavTab :list="tabList" v-model:active="active" tabClassName="tabs" v-slot="{ item, index }"
					@onClickTab="onClickTab" activeClassName="tab_active" ref="tabRefs" tabItemClassName="funtab_item">
					<div class="tab_item" :class="{ tab_active: index === active }">
						<svg-icon :name="item.img" />
						<span>{{ item.name }}</span>
					</div>
				</NavTab>
			</div>
		</van-sticky>
		<div class="x-page-list">
			<div class="item" v-for="(item,index) in commissionType[code].content" :key="index">
				<div class="title">{{$t('rebateLevel')}} <span>L{{ item.rebate_Lv }}</span></div>
				<div class="box">
					<div class="li" v-for="(citem,cindex) in item.rebateLevels" :key="cindex">
						<svg-icon name="round" class="img" />
						<div>
							<span class="sum"> {{$t('lowerRrebate',[(citem.levelId)])}}</span>
							<span class="num">{{getAmount(citem.amount)}}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import NavTab from '@/components/FunTab/NavBar.vue'
import { AwaitApiResult } from '@/utils'
import { GetGameCategoryList, promotionTutorial } from '@/api'
import {  onMounted, reactive, ref } from 'vue'
import type { HomeGameList, RuleList } from '@/types/api'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const containerRef = ref<HTMLElement>(null as any)
const active = ref(0)
const code = ref (0);

const onClickTab = (val: any) => {
	code.value = val.item.codeType;
	window.scroll({
		top:0,
	})
}

const getAmount = (num:number)=>{
	// return num
	// // 将数字转换为字符串
	// const numStr = num.toString();
	// if (numStr.includes('.')) {
	// 	let decimalPart = numStr.split('.')[1].replace(/0+$/, '');
	// 	const index = decimalPart.search(/[1-9]/);
	// 	if (index !== -1 && index + 2 < numStr.length) {
	// 		const result = numStr.substring(0, index + 4);
	// 		return parseFloat(result)
	// 	}
	// }
	return parseFloat(num)
}


const router = useRouter()
const gameTabList = [
	{
		name: t('lottery'),
		img: 'lottery',
		id:1,
		codeType: 0
	},
	{
		name: t('live'),
		img: 'video',
		id:6,
		codeType: 2
	},
	{
		name: t('sport'),
		img: 'sport',
		id:5,
		codeType: 3
	},
	{
		name: t('chess'),
		img: 'chess',
		id:7,
		codeType: 4
	},
	{
		name: t('electric'),
		img: 'slot',
		id:4,
		codeType: 1
	}
]

const commissionType = ref<
	Array<{
		type: string
		title: string
		content: Array<RuleList>
	}>
>([
	{
		type: 'rebateratelist',
		title: t('commissionTitle1'),
		content: []
	},
	{
		type: 'dianzilist',
		title: t('commissionTitle2'),
		content: []
	},
	{
		type: 'shixunlist',
		title: t('commissionTitle3'),
		content: []
	},
	{
		type: 'tiyulist',
		title: t('commissionTitle4'),
		content: []
	},
	{
		type: 'chesslist',
		title: t('commissionTitle5'),
		content: []
	}
])
const siderList = reactive<any[]>([])
let tabList = ref<any[]>([])
const getGameTypeList = async () => {
	const res = await AwaitApiResult<ObjResNull<HomeGameList[]>>(GetGameCategoryList())
	if (res) {
		res.data.forEach((item) => {
			if (item.state !== 1) return
			siderList.push({
				id:item.id,
				isShow: item.state === 1,
				title: t('code' + item.typeNameCode),
				img: item.categoryImg,
				key: item.categoryCode.toLocaleLowerCase()
			})
		})
		tabList.value = gameTabList.filter((item)=> siderList.some((item1)=> item.id === item1.id))
	}
}
const promotionTutorialData = async () => {
	try {
		const res = await promotionTutorial()
		// console.log('🚀 ~ file: index.vue:196 ~ promotionTutorialData ~ res.promotionlist:', res.promotionlist)
		commissionType.value[0].content = res.rebateratelist
		//console.log("🚀 ~ file: index.vue:198 ~ promotionTutorialData ~ res.rebateratelist:", res.rebateratelist)
		commissionType.value[1].content = res.dianzilist
		commissionType.value[2].content = res.shixunlist
		commissionType.value[3].content = res.tiyulist
		commissionType.value[4].content = res.chesslist
	} catch (err) {
		console.log(err)
	}
}

onMounted(() => {
	promotionTutorialData()
	getGameTypeList()
})

</script>

<style scoped lang="scss">
.x-page {
	overflow: hidden;
	padding: 0 24px;

	.tabs {
		background: var(--bg_color_L1);
		margin-left: -10px;
		width: calc(100% + 10px);
	}
	.tab_item {
		width: 190px;
		height: 100px;
		margin-inline: 5px;
		padding: 0;
		color: var(--text_color_L2);
		border-radius: 16px;
		background: var(--bg_color_L2);
		
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		svg {
			height: 50px;
			width: 50px;
		}

		span {
			font-size: 24px;
		}

		&.tab_active {
			color: var(--text_color_L4);
			background: var(--main_gradient-color);
			
		}
	}

	:v-deep(.fun-tabs .fun-tab-item) {
		padding: 14px 0;
	}

	//可洗码量
	&-list {
		padding-bottom: 40px;
		margin-top: 20px;
		.item{
			background-color: var(--bg_color_L2);
			margin-bottom: 20px;
			padding: 20px;
			border-radius: 20px;
			
			.title{
				font-size: 28px;
				color: var(--text_color_L1);
				height: 60px;
				line-height: 60px;
				display: flex;
				span{
					display: block;
					width: 45px;
					margin-left: 10px;
					font-weight: 800;
					font-size: 40px;
					color: var(--main-color);
					font-style: italic;
				}
			}
			.box{
				.li{
					min-height: 50px;
					line-height: 1.4;
					position: relative;
					padding: 7px 0 7px 40px;
					&:first-child{
						&::after{
							display: none;
						}
					}
					&::after{
						content: "";
						position: absolute;
						border-left: 1px dashed var(--darkLight,var(--main-color));
						height: 15px;
						top: -8px;
						left: 8px;
						html:lang(ar) &{
							left: unset;
							right: 8px;
						}
					}
					.img{
						position: absolute;
						left: 0;
						top: 50%;
						transform: translate(0,-50%);
						display: block;
						width: 20px;
						height: 20px;
						html:lang(ar) & {
							left: unset;
							right: 0;
						 }
					}
					&>div{
						width: 100%;
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						gap: 16px;
						.sum{
							flex: 1;
							min-width: 0;
							color: var(--text_color_L2);
							font-size: 26px;
						}
						.num{
							flex-shrink: 0;
							white-space: nowrap;
							font-size:26px;
							color: var(--text_color_L1);
						}
					}
				}
			}

		}


	}
}
</style>