<template>
    <div v-if="activeType==='Lottery'">
		<div class="left-title"></div>
		<div class="allGame">
			<div class="lotteryList" v-for="(game) in listData" :key="game.categoryCode">
				<section class="gameImg">
					<img v-lazy="game.categoryImg" @click="onLottyItemClick(game)" />
					<Maintain :item="game"/>
				</section>
				<p>{{activeType}}</p>
				<div>{{game.categoryCode}}</div>
			</div>
		</div>
    </div>
	<div v-else-if="activeType==='Popular'">
		<div class="left-title tit-platform"></div>
		<div class="allGame" >
			<div class="lotteryList" v-for="(game) in listData?.platformList" :key="game.categoryCode">
				<section class="gameImg">
					<img v-lazy="game.img" @click="onItemClick(game)" />
					<Maintain :item="game"/>
				</section>
				<div class="win-odds">
					<span>{{$t('Chances')}}</span>
					<span>{{game.winOdds}}%</span>
					<div class="win-p" :style="{width:`${Math.min(game.winOdds,100)}%`}"/>
				</div>

			</div>

		</div>
		<div class="left-title tit-popular" :class="'tit-'+activeType"></div>
		<div class="allGame">
			<div class="lotteryList" v-for="(game) in listData?.clicksTopList" :key="game.categoryCode">
				<section class="gameImg">
					<img v-lazy="game.imgUrl" @click="onItemClick(game)" />
					<Maintain :item="game"/>
				</section>
				<div class="win-odds">
					<span>{{$t('Chances')}}</span>
					<span>{{game.winOdds}}%</span>
					<div class="win-p" :style="{width:`${Math.min(game.winOdds,100)}%`}"/>
				</div>

			</div>
		</div>
		<div v-if="globalStore.token" class="raja_btn" @click="gol2('popular')">{{ $t('viewAll') }}</div>
	</div>
	<div class="allGameMain" v-else-if="activeType==='Chess'">
		<div class="left-title" :class="'tit-'+activeType"></div>
		<div class="allGame">
			<div class="lotteryList" v-for="(game) in listData" :key="game.categoryCode">
				<section class="gameImg">
					<img v-lazy="game.img" @click="goleve2(game, 'chess')" />
					<Maintain :item="game"/>
				</section>
				<p>Card Games</p>
				<div>{{game.vendorCode}}</div>
			</div>
		</div>
	</div>
	<div class="allGameMain" v-else-if="['Slot'].includes(activeType)">
		<div class="left-title" :class="'tit-'+activeType"></div>
		<div class="allGame">
			<div class="lotteryList" v-for="(game) in listData" :key="game.categoryCode">
				<section class="gameImg">
					<img v-lazy="game.img" @click="goleve2(game, activeType.toLocaleLowerCase())" />
					<Maintain :item="game"/>
				</section>
				<p>{{activeType}}</p>
				<div>{{ getSlotTitle(game.vendorCode)}}</div>
			</div>
		</div>
	</div>
	<div class="allGameMain" v-else>
		<div class="left-title" :class="'tit-'+activeType"></div>
		<div class="allGame">
			<div class="lotteryList" v-for="(game) in listData" :key="game.categoryCode">
				<section class="gameImg"><img v-lazy="game.img" @click="onItemClick(game)" /></section>
				<p>{{activeType ==='Flash'?'Mini Games':activeType}}</p>
				<div>{{ getSlotTitle(game.gameNameEn || game.vendorCode)}}</div>
			</div>
		</div>
		<div v-if="globalStore.token && ['Flash', 'Fish'].includes(activeType)" class="raja_btn" @click="gol2(activeType.toLowerCase())">{{ $t('viewAll') }}</div>
	</div>
</template>
<script setup lang="ts">
    import { computed, inject } from 'vue';
	import {useRouter} from "vue-router";
	import {GlobalStore} from "@/stores";
	import {getSlotTitle} from '@/utils'
    // 使用 inject 接收父组件传递的实例
    const useHomeHook: any = inject('useHomeHook');
    const { homeState, onItemClick, isSassLotteryGame, openThirdGame ,gol2} = useHomeHook;
	const router = useRouter()
	const globalStore = GlobalStore()
    // 定义 props 接收父组件的 activeType
    const props = defineProps<{
        activeType: string;
    }>();
    const listData = computed(() => {
        return homeState.allGameList[props.activeType.toLocaleLowerCase()] || [];
    })
	const lotteryRoutes = [
		{
			value: 1,
			path: 'WinGo'
		},
		{
			value: 3,
			path: '5D'
		},
		{
			value: 2,
			path: 'K3'
		},
		{
			value: 4,
			path: 'WinTrx'
		},
		{
			value: 5,
			path: 'XoSo'
		},
		{
			value: 6,
			path: 'XoSo'
		},
		{
			value: 7,
			path: 'Binguo'
		},
		{
			value: 8,
			path: '4D'
		}
	]
	const onLottyItemClick = (item: any) => {
		if (isSassLotteryGame(item)) {
			return openThirdGame({ ...item, vendorCode: 'ARLottery' })
		}
		router.push({
			name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
			query: { id: item.id }
		})
	}
	// console.log('listData',props.activeType, listData.value)
	const goleve2 = (value: any, type: string) => {
		sessionStorage.setItem('slotGamesList', JSON.stringify(homeState.allGameList[type]))
		sessionStorage.setItem('gameType', JSON.stringify(type))
		sessionStorage.setItem('clickedItem', JSON.stringify(value))
		router.push({
			name: 'AllOnlineGames'
		})
	}
</script>
<style lang="scss" scoped>
    .allGame {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
        gap: 20px;
		.lotteryList{
			.gameImg{
				position: relative;
				height: 304px;
				&>img {
					width: 222px;
				}
			}

			&> p{
				color: var(--text_color_L1);
				font-size: 20px;
				margin:6px 0;
			}
			&> div{
				color: var(--text_color_L1);
				font-size: 22px;
				font-weight: 700;
			}
			.win-odds{
				display: flex;
				height: 36px;
				background: rgba(252, 62, 78, 0.25);
				color: #333;
				width: 100%;
				border-radius: 10px;
				font-size: 22px;
				overflow: hidden;
				margin-top: 6px;
				margin-bottom: 10px;
				position: relative;
				span{
					position: relative;
					z-index: 1;
					display: block;
					height: 100%;
					flex: 1;
					line-height: 40px;
					font-weight: 400;
					color: #fff;
					&:first-child{

						padding-left: 10px;
					}
					&:last-child{
						text-align: right;
						padding-right: 10px;
					}
				}
				.win-p{
					background: rgba(252, 62, 78, 1);
					position: absolute;
					left: 0;
					height: 100%;
					html:lang(ar) &{
						left: unset;
						right: 0;
					}
				}
			}
		}
    }
	.left-title{
		width: 100%;
		height: 66px;
		flex-shrink: 0;
		background-image: url(./svg/lottrry.svg);
		background-size: 247px auto;
		background-repeat: no-repeat;
		margin-bottom:15px;
		&.tit-Flash {
			background-image: url(./svg/mini_icon.svg);
			background-size: 333px auto;
		}
		&.tit-platform {
			background-image: url(./svg/plat.svg);
			background-size: 667px auto;
		}
		&.tit-popular {
			background-image: url(./svg/pop.svg);
			background-size: 269px auto;
		}
		&.tit-Slot {
			background-image: url(./svg/slot_icon.svg);
			background-size: 213px auto;
		}

		&.tit-Chess {
			background-image: url(./svg/chess_icon.svg);
			background-size: 345px auto;
		}

		&.tit-Fish {
			background-image: url(./svg/fish_icon.svg);
			background-size: 255px auto;
		}

		&.tit-Video {
			background-image: url(./svg/casino.svg);
			background-size: 247px auto;
		}

		&.tit-Sport {
			background-image: url(./svg/sport_icon.svg);
			background-size: 247px auto;
		}
	}
</style>