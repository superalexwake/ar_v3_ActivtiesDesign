<!--
 * @Author: Seven
 * @Date: 2024-03-13 16:24:20
 * @LastEditTime: 2024-03-14 15:35:26
 * @LastEditors: Seven
 * @Description: 
-->
<template>
	<div class="topContainer">
		<div class="backSvg" @click="router.back()"></div>
		<div class="title">{{ $t('code9304Slot') }}</div>
	</div>
	<div class="slot_list">
		<!-- big jiang -->
		<div class="awardbox">
			<div class="title">
				<img src="@public/home/award.png" alt="" />
				{{ $t('code9309') }}
			</div>
			<div class="award_tip">
				{{ $t('awarDesc1') }}<br />
				{{ $t('awarDesc2') }} <span class="amount">{{ currency(getBigAward) }}</span>
			</div>
			<div class="list">
				<div class="big_prize" v-for="item in bigAwardList.slice(0, 3)">
					<div
						class="bg"
						:style="{
							backgroundImage: `url(${item.imgUrl})`
						}"
					></div>
					<div class="info">
						<div class="text">
							<div class="tit">{{ item?.gameName }}</div>
							<div class="multiple">{{ item?.multiple }}X</div>
						</div>
						<div class="award">{{ currency(item?.bonusAmount) }}</div>
					</div>
				</div>
			</div>
			<div class="look_more" @click="handleGoAwar">{{ $t('lookBigAward') }} >></div>
		</div>

		<div class="Slot_game">Slot Game</div>

		<!-- Games images containers starts from here -->
		<div class="GameContainer">
			<div class="GameContainer_games">
				<div v-for="(item, index) in SlotsData" :key="index" @click="goAll(item)">
					<img :src="item.vendorImg"  />
					<Maintain :item="item" />
				</div>
			</div>
			<LuckyWinners />
		</div>

		<!-- Today's Profit Ranking -->
		<div class="WinningContainer">
			{{ $t('homename1') }}
		</div>
		<div class="Winningdata">
			<div class="profitRanking">
				<ProfitRanking />
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { GetElectronWithChildGame, getAllGameList } from '@/api'
import type { ElectronWithChildGame } from '@/types/api'
import { AwaitApiResult, currency } from '@/utils'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import ProfitRanking from '@/components/Home/goGame/ProfitRanking.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SettingStore } from '@/stores'
import { useGames } from '@/hooks/useGoGames.hook'
import { requireLoginAction } from '@/hooks/useLoginIntercept'
const { gameData } = useGames()
const SlotsData = computed(() => gameData.Slot)
interface Award {
	orderId: number
	userId: number
	userPhoto: string
	userName: string
	gameName: string
	imgUrl: string
	multiple: number
	bonusAmount: number
	multipleName: string
	createTime: string
}

const store = SettingStore()
const getBigAward = computed(() => {
	return store.getJackportMaxReswadAmount
})
const bigAwardList = ref<Award[]>([])
const slitLit = ref<ElectronWithChildGame[]>([])
const router = useRouter()

const getSlotList = async () => {
	const res = await AwaitApiResult(GetElectronWithChildGame())
	if (res) {
		slitLit.value = res.data
	}
}

const goAll = (item: ElectronWithChildGame) => {
	sessionStorage.setItem('slotGamesList', JSON.stringify(SlotsData.value))
	sessionStorage.setItem('gameType', JSON.stringify('slot'))
	sessionStorage.setItem('clickedItem', JSON.stringify(item))
	router.push({
		name: 'AllOnlineGames',
		query: {
			game: 'slot',
			currentId: item.slotsName
		}
	})
}

const getAwardList = async () => {
	console.log('1');

	const result = await AwaitApiResult(getAllGameList())
	console.log('result', result);
	bigAwardList.value = result.data.awardRecordList || {}
}

const handleGoAwar = async () => {
	if (!(await requireLoginAction())) return
	router.push({
		path: '/main/SuperJackpot'
	})
}

getSlotList()
getAwardList()
</script>
<style lang="scss" scoped>
.topContainer {
	display: flex;
	height: 72px;
	flex-direction: row;
	align-items: center;
	padding: 0 16px;
	background: var(--bg_color_L2);
	.backSvg {
		background-image: url('@icon/goGame/backButton.svg');
		background-repeat: no-repeat;
		background-position: center;
		width: 84px;
		height: 100%;
	}
	.title {
		display: flex;
		padding: 10px;
		align-items: center;
		justify-content: center;
		font-family: Inter;
		font-size: 36px;
		font-style: italic;
		font-weight: 700;
		letter-spacing: -0.36px;
		background: var(--Text-effects, linear-gradient(180deg, #F5F6FF -2.72%, rgba(245, 246, 255, 0.00) 219.64%));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
}

.slot_list {
	padding: 20px 24px;

	.awardbox {
		margin-bottom: 48px;
        
		.title {
			display: flex;
			align-items: center;
			background: var(--Text-effects, linear-gradient(180deg, #f5f6ff -2.72%, rgba(245, 246, 255, 0) 219.64%));
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			font-family: Inter;
			font-size: 36px;
			font-style: italic;
			font-weight: 700;
			margin-bottom: 20px;
			img {
				width: 48px;
				height: 48px;
				margin-right: 12px;
			} 
		}
		.award_tip {
			color: var(--text_color_L2);
			font-size: 28px;
			font-style: normal;
			font-weight: 400;
			font-family: Inter;
			line-height: 36px; /* 128.571% */
		}
		.list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			margin-bottom: 12px;
			gap:15px;
				
		}
		.big_prize {
			width: 224px;
			height: 280px;
			position: relative;
			margin-top: 15px;
			border-radius: 16px;
			
			.bg {
				position: absolute;
				top: 0;
				left: 0;
				width: 224px;
				height: 280px;
				border-radius: 16px;
				background-repeat: no-repeat;
				background-size: 224px 280px;
				background-position: center;
				z-index: 1;
				
				
			}
			.info {
				width: 100%;
				height: 68px;
				position: absolute;
				bottom: 8px;
				z-index: 3;
				
				// background: linear-gradient(180deg, rgba(22, 35, 56, 0) -105.45%, #162338 75.17%);
				backdrop-filter: blur(2px);
				// border-bottom-left-radius: 16px;
				// border-bottom-right-radius: 16px;
				

				.text {
					margin-top: 10px;
					margin-left: 16px;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					
					.tit {
						font-size: 20px;
						font-weight: 400;
						font-family: Inter;
						color: var(--off-white-texts, #f4f9ff);
						max-height: 30px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.multiple {
						position: relative;
						z-index: 3;
						color: #fff;
						padding: 4px 8px;
						border: 1px solid #fff;
						font-family: Inter;
						border-radius: 6px;
						font-size: 16px;
						margin-right: 16px;
						font-weight: 500;
					}
				}

				.award {
					font-size: 24px;
					color: #fea800;
					font-family: Inter;
					font-weight: 400;
					margin-left: 15px;
				}
			}

			.bottom {
				position: absolute;
				display: flex;
				flex-direction: column;
				justify-content: center;
				bottom: 0;
				left: 0;
				height: 82px;
				z-index: 3;
				width: 100%;
				border:1px solid red;
				background: #141c26;
				.foot {
					position: relative;
					color: #ffffff;
					font-weight: 500;
					font-size: 20px;
					text-align: center;
				}
				.amount {
					position: relative;
					color: #fecc21;
					font-size: 20px;
					text-align: center;
				}
			}
		}
		.big_prize::after {
			content: '';
			display: block;
			width: 224px;
			height: 84px;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 2;
			background: linear-gradient(180deg, rgba(22, 35, 56, 0.00) -105.45%, #162338 75.17%);
			border-bottom-left-radius: 16px;
			border-bottom-right-radius: 16px;
			margin-bottom:-5px;
		}
		.look_more {
			width: 400px;
			height: 66px;
			border-radius: 32px;
			text-align: center;
			line-height: 66px;
			font-family: Inter;
			color: var(--text_color_L4, #E4E7ED);
			font-size: 24px;
			font-style: italic;
			font-weight: 600;
			background: var(--main_gradient-color2);
			margin: 40px  auto auto;
		}
	}

	.Slot_game {
		display: flex;
		gap: 5px;
		flex-direction: row;
		background: var(--Text-effects, linear-gradient(180deg, #f5f6ff -2.72%, rgba(245, 246, 255, 0) 219.64%));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 36px;
		font-style: italic;
		font-weight: 700;
		font-family: Inter;
		margin-bottom: 10px;
		&::before {
			content: '';
			display: block;
			height: 40px;
			width: 66px;
			background: url('@/assets/svg/SlotGame.svg') no-repeat;
		}
	}
	.GameContainer {
		height: auto;
		&_games {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			height: auto;
			gap: 16px;
			& > div {
				position: relative;
				width: calc((100% - 32px) / 3);
				height: auto;
				img{
					width: 100%;
					height: auto;
				}
			}
		}
	}
	.luckyWinners__container{
		margin-top: 40px;
	}
	.WinningContainer {
		margin-top: 10px;
		display: flex;
		align-items: center;
		background: var(--Text-effects, linear-gradient(180deg, #F5F6FF -2.72%, rgba(245, 246, 255, 0.00) 219.64%));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: -0.36px;
		font-family: Inter;
		font-size: 36px;
		font-style: italic;
		font-weight: 700;

		&::before {
			content: '';
			display: block;
			flex: none;
			width: 25px;
			height: 26px;
			background-image: url('@/assets/icons/home/Group20225.svg');
			background-position: left;
			background-repeat: no-repeat;
		}
	}
	// .Winningdata {
	// 	// padding: 17px;
	// }
	.profitRanking {
		margin-top: 20px;
		padding: 7px;
		border-radius: 12px;
		background: var(--bg_color_L2);
		backdrop-filter: blur(82px);
	}
}
</style>
