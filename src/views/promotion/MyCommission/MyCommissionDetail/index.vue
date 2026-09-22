<template>
	<div class="TeamReportDetail__C">
		<NavBar :title="$t('details')" left-arrow @click-left="onClick" />
		<div class="TeamReportDetail__C-head">
			<div class="TeamReportDetail__C-head-top">
				{{ Promotion?.settlementTime }}
			</div>
			<div class="TeamReportDetail__C-head-detail">
				<div class="TeamReportDetail__C-head-detail-lv">
					{{$t('totalBetP')}}<span>{{Promotion?.children_LotteryAmount_Users}}{{ $t('people') }}</span>
				</div>
				<div class="TeamReportDetail__C-head-detail-commission">
					{{$t('totalBetA')}}<span>{{ currency(Promotion?.children_LotteryAmount) }}</span>
				</div>
				<!-- <div class="TeamReportDetail__C-head-detail-time">
					{{$t('rebateLevel')}}<span>LV5</span>
				</div> -->
				<div class="TeamReportDetail__C-head-detail-time">
					{{$t('totalCommissionA')}}<span>{{Promotion?.rebateAmount_Last}} </span>
				</div>
			</div>
		</div>
		<div class="TeamReportDetail__C-img"></div>
		<div class="TeamReportDetail__C-detail">
			<div class="btn" @click="router.push({'name':'RebateRatio'})">{{$t('rebateRules')}}</div>
		</div>
		<div class="TeamReportDetail__C-body" v-for="(item, index) in Promotion?.rebateWhereItems" :key="index">
			<div class="title">{{textList[item.type]}}</div>
			<div class="box">
				<div class="TeamReportDetail__C-body-item">
					{{$t('betPeople')}}
					<span>{{ item.children_LotteryAmount_Users }}{{ $t('people') }}</span>
				</div>
				<div class="TeamReportDetail__C-body-item">
					{{$t('rebateLevel')}}
					<span class="level">LV{{ item.rebateLevel }}</span>
				</div>
				<div class="TeamReportDetail__C-body-item">
					{{$t('betMoney')}}
					<span class="meony">{{ currency(item.children_LotteryAmount) }}</span>
				</div>
				<div class="TeamReportDetail__C-body-item">
					{{$t('commSettlement')}}
					<span class="meony">{{ currency(item.rebateAmount) }}</span>
				</div>
			</div>
			<div class="TeamReportDetail__C-body-grade">
				<div class="TeamReportDetail__C-body-grade-th">
					<div class="item"> {{$t('lowerLevel')}} </div>
					<div class="item"> {{$t('betAmounts')}} </div>
					<div class="item"> {{$t('rebateRatio')}} </div>
					<div class="item"> {{$t('betRebateAmount')}} </div>
				</div>
				<div class="TeamReportDetail__C-body-grade-tr" v-for="(citem, index) in item.rebateWhereItemDetails" :key="index">
					<div class="item">
						<div class="icon-LV">
							<span class="txt">L{{ citem.levelId }}</span>
						</div>
					</div>
					<div class="item">{{ citem.children_LotteryAmount }}</div>
					<div class="item">{{ citem.rebateRate }}%</div>
					<div class="item">{{ digitalCarry(citem.rebateAmount) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currency ,digitalCarry} from '@/utils'
import { useRouter , useRoute } from 'vue-router'
import { PromotionReceiveList } from '@/api';
import { ResPromotionReceiveList } from '@/types/api';
import { useI18n } from 'vue-i18n'
const router = useRouter()
const route = useRoute()

const { t } = useI18n();
//1 彩票 2 电子 3 视讯 4 体育 5 小游戏 6 棋牌
const textList:{
	[key: number]: string
} = {
	1:t('commissionLottery'),
	2:t('commissionElectric'),
	3:t('commissionLive'),
	4:t('commissionSport'),
	5:t('commissionGames'),
	6:t('commissionChess'),

}

console.log('routes', router.options.routes[41].meta)

const onClick = () => {
	router.go(-1)
}

const Promotion = ref<ResPromotionReceiveList|null>();
const PromotionReceive = async () => {
	try {
		const res = await PromotionReceiveList({date:route.query.date})
		Promotion.value = res;
	} catch (err) {
		console.log(err)
	}
}

onMounted(() => {
	PromotionReceive()
})
</script>

<style lang="scss" scoped>
.icon-LV {
	height: 46px;
	width: 100px;
	background: url('@icon/promotion/lv.png') no-repeat center center;
	background-size: cover;
	position: relative;
	text-align: center;
	.txt {
		display: block;
		position: absolute;
		right: 0;
		bottom: 0;
		height: 30px;
		line-height: 32px;
		width: 52px;
		background: linear-gradient(180deg, #fffba9 0%, #fff670 56.13%, #ffd180 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;
	}
}
.TeamReportDetail__C {
	padding: 0 24px;

	&-head {
		border-radius: 10px 10px 0 0;
		background-color: var(--bg_color_L2);
		min-height: 260px;
		padding: 0 20px;

		&-top {
			height: 80px;
			border-bottom: 1px solid #d6d6d6;
			display: flex;
			font-size: 28px;
			justify-content: space-between;
			align-items: center;
			color: var(--text_color_L1);

			&-btn {
				width: 225px;
				height: 42px;
				line-height: 42px;
				border: 1px solid #f95959;
				border-radius: 20px;
				font-size: 24px;
				color: #f95959;
				text-align: center;
			}
		}

		&-detail {
			padding: 22px 0;
			font-size: 26px;
			color: var(--text_color_L1);

			& > div {
				height: 30px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				& + div {
					margin-top: 22px;
				}
			}
			&-time {
				span {
					font-size: 26px;
					color: #FF7F22;
				}
			}

			&-commission {
				span {
					color: #ff7f22;
				}
			}
		}
	}

	&-img {
		height: 1px;
		width: 100%;
		position: relative;
		border-bottom: 1px dashed #525167;
		border-width: 4px;
		&::after,&::before {
			content: '';
			display: block;
			background: var(--bg_color_L1);
			width: 42px;
			height: 42px;
			position: absolute;
			border-radius: 50%;
			top: -21px;
		}
		&::before {
			left: -21px;
		}
		&::after {
			right: -21px;
		}
	}

	&-detail {
		border-radius: 0 0 10px 10px;
		background-color: var(--bg_color_L2);
		padding: 30px 24px;

		.btn{
			width: 100%;
			height: 60px;
			line-height: 60px;
			border: 1px solid var(--main-color);
			color: var(--main-color);
			text-align: center;
			border-radius: 60px;
		}
	}
	&-body {
		background: var(--bg_color_L2);
		margin-top: 20px;
		border-radius: 10px;
		.title{
			font-size: 28px;
			color: var(--text_color_L1);
			padding: 20px 25px 0;
		}
		.box{
			padding: 20px;
		}
		&-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 28px;
			font-size: 26px;
			color: #7e829f;
			padding-left: 36px;
			background-image: url('@icon/promotion/roundIcon.png');
			background-size: 20px;
			background-position: left center;
			background-repeat: no-repeat;
			position: relative;
			html:lang(ar) &{
				background-position: right center;
			}
			&:last-child {
				&::before {
					content: normal;
				}
			}

			&::before {
				content: '';
				position: absolute;
				display: block;
				height: calc(100% + 30px);
				width: 0;
				border-left: 1px dashed var(--main-color);
				left: 8px;
				top: 50%;
				html:lang(ar) &{
					right: 8px;
					left: auto;
				}
			}

			& + div {
				margin-top: 30px;
			}

			span {
				color: var(--text_color_L1);
				font-size: 26px;
				&.meony{
					color: #FF7F22;
				}
				&.level{
					color: var(--main-color);
				}
			}
		}
		&-grade {
			overflow: hidden;
			margin-bottom: 50px;
			&-th {
				display: flex;
				height: 100px;
				color: #fff;
				font-size: 26px;
				line-height: 100px;
				background: var(--sheet_nva_color);
				text-align: center;
				.item {
					flex: 1;
				}
			}
			&-tr {
				display: flex;
				width: calc(100% + 1px);
				background-color: #fff;
				margin: 0 -1px -1px;
				color: var(--text_color_L2);
				background: var(--bg_color_L2);
				&:nth-of-type(odd) {
					background: var(--sheet_detail_bg_color);
				}
				.item {
					display: flex;
					align-items: center;
					justify-content: center;
					width: calc(33.3%);
					height: 70px;
					padding: 5px 0;
					font-size: 26px;
				}
			}
		}
	}
}
</style>