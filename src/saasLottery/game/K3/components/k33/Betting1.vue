<template>
	<section class="betting_main">
		<ul>
			<li class="bet_item" 
				:class="[bet.playBet, bets.includes(bet.playBet) ? 'active' : '']" 
				v-for="(bet) in numbers"
				:key="bet.playTypeId" @click="emit('choose', { item: bet, playType: 'SumNum' })">
				<template v-if="['Big', 'Small', 'Odd', 'Even'].includes(bet.playBet)">
					<p>{{ $t(`${BetEnum[bet.playBet]}`) }}</p>
				</template>
				<template v-else>
					<div :class="['ball', bet.playBet % 2 === 0 ? 'gball' : 'rball']"><p :class="'K3B__C-odds-bet num' + bet.playBet">{{ bet.playBet }}</p></div>
				</template>
				<p class="K3B__C-odds-rate">{{ bet.playRate }}X</p>
			</li>
		</ul>
	</section>
</template>
<script lang="ts" setup>
import { GetGameInfoRspPlayRate } from '@/saasLottery/api'
import { BetEnum } from "@/saasLottery/utils/enum";
withDefaults(
	defineProps<{
		numbers: GetGameInfoRspPlayRate[]
		bets: string[]
	}>(),
	{}
)
const emit = defineEmits(['choose'])
</script>
<style lang="scss" scoped>
.betting_main {
	padding: 24px 0 0;

	p {
		margin: 0;
		padding: 0;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.bet_item {
			width: 25%;
			height: 120px;
			border-radius: 10px;
			text-align: center;
			margin-top: 16px;
			color: var(--text_color_L2);
			display: flex;
			flex-direction: column;
			justify-content: center;
			.ball {
				width: 88px;
				height: 88px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 auto;
				&.rball {
					background: url('../../assets/k33/AllGames/redBall.png') no-repeat center center;
					background-size: cover;
					.K3B__C-odds-bet {
						background:  linear-gradient(180deg, #FF827A 0%, #E93333 68.18%);
						background-clip: text;
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
				&.gball {
					background: url('../../assets/k33/AllGames/greenBall.png') no-repeat center center;
					background-size: cover;
					.K3B__C-odds-bet {
						background: var(--norm_green-color);
						background-clip: text;
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
				}
				.K3B__C-odds-bet {
					font-size: 48px;
					font-weight: 700;
				}
			}
			.K3B__C-odds-bet {
				font-size: 28px;
			}
			.K3B__C-odds-rate {
				font-size: 22px;
			}
			&.Small,
			&.Big,
			&.Odd,
			&.Even {
				width: calc((100% - 45px) / 4);
				height: 88px;
				background-color: var(--norm_secondary-color);
				color: #fff;
				:first-child {
					color: #fff;
					font-weight: 500;
					font-size: 32px;
				}

				:last-child {
					color: #fff;
					font-size: 24px;
				}
			}

			// &.Small {
			// 	box-shadow: 0px -4px 0px 0px #2D7FE9 inset;
			// }

			// &.Big {
			// 	box-shadow: 0px -4px 0px 0px #F49C30 inset;

			// }

			// &.Odd {
			// 	box-shadow: 0px -4px 0px 0px #D5191D inset;

			// }

			// &.Even {
			// 	box-shadow: 0px -4px 0px 0px #08AA61 inset;
			// }

			// :first-child {
			// 	color: #323536;
			// 	font-style: normal;
			// 	font-weight: 600;
			// 	font-size: 36px;
			// 	line-height: 36px;
			// 	padding: 16px 0 4px;

			// }

			&:nth-child(4n) {
				margin-right: 0;
			}
		}
	}
}
</style>