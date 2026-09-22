<!-- xoso下注记录 -->
<template>
	<div class="bet-container-lottery-items" v-for="item in listData" :key="item.orderNumber">
		<div class="bet-container-lottery-card">
			<div class="bet-container-lottery-card-header ar-1px-b">
				<h1>
					<h2>{{ typeValue }}</h2>
					<span :class="statusClass(item.state)">{{ stateText[item.state] }}</span>
				</h1>
				<p>{{ item.createTime }}</p>
			</div>
			<div class="bet-container-lottery-card-info" :class="`type${typeValue}`">
				<img src="@icon/main/betInfoStep.png" :class="`type${typeValue}`"/>
				<ul>
					<li>
						<h2>{{ $t('betNumber') }}</h2>
						<span>{{ item.issueNumber }}</span>
					</li>
					<li>
						<h2>{{ $t('orderNo') }}</h2>
						<span> {{ item.orderNumber }} </span>
					</li>
					<li>
						<h2> {{ $t('ColorSpecies') }}</h2>
						<span>{{ $t(`d4LType${item.type}`) }}</span>
					</li>
					<li>
						<h2>{{ $t('gamePlay') }}</h2>
                        <span>{{ $t('d4gamePay'+item.gameType) }}</span>
					</li>
                    <li>
						<h2>{{ $t('xosoTxt78') }}</h2>
					</li>
                    <div class="type">
                        <span v-for="(citem,index) in item.betType.split(',')" :key="index">{{$t('d4gameType'+citem) }}</span>
                    </div>
				</ul>
			</div>
		</div>
		<img src="@icon/main/moonBar.png" />
		<div class="bet">
			<div class="li betNum">
				<div class="lab">
					{{ $t('bettingnumber') }}<span class="txt" v-if="item.betMethod === 1">({{ $t('EnterBet') }})</span>
					<span class="txt" v-if="item.betMethod === 2">({{ $t('SelectBet') }})</span>
					<!-- 选择号码 -->
					<div class="betList select" v-if="item.betMethod == 1">
						<span>
							{{ item.betContent }}
						</span>
					</div>
					<div class="betList select" v-else>
						<div class="num">
                            <div v-for="(i, index) in item.betContent.split('|')" :key="index">
                                <h6>{{ getText[index] }}</h6>
                                <div class="n">
                                    <span v-for="(j, index_1) in i.split(',')" :key="index_1">
                                        {{ j }}
                                    </span>
                                </div>
                            </div>
                        </div>
					</div>
				</div>
			</div>
		</div>
		<div class="bet-container-lottery-note-box">
			<div>
				<div class="bet-container-lottery-note-box-para">
					<h3>{{ currency(item.amount) }}</h3>
					<span>{{ $t('actualAmount') }}</span>
				</div>
			</div>
			<div>
				<div class="bet-container-lottery-note-box-para">
					<h3>{{ currency(item.winAmount) }}</h3>
					<span>{{ $t('lotteryAmount') }}</span>
				</div>
			</div>
			<div class="last">
				<div class="bet-container-lottery-note-box-para">
					<h4 :class="item.profitAmount > 0 ? 'h4_green' : 'h4_red'">
						{{ item.profitAmount?currency(item.profitAmount) : '-' }}
					</h4>
					<span>{{ $t('profitNloss') }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()
withDefaults(
	defineProps<{
		listData: any
		typeValue: any
	}>(),
	{
		listData: {
			type: Array,
			default: () => []
		},
		typeValue: {
			type: Number,
			default: 0
		}
	}
)
//1待开奖, 2未中奖, 3已中奖4 取消期号5 已撤销6 开奖中
const stateText:{
    [key: number]: string
    }={
	1: $t('bettingResultState1'),
	2: $t('bettingResultState3'),
	3: $t('hasWon'),
	4: $t('xosoTxt74'),
	5: $t('xosoTxt75'),
	6: $t('xosoTxt76')
}
const getText:{
    [key: number]: string
    } ={
        0: $t('xosoTxt90'),
        1: $t('xosoTxt89'),
        2: $t('xosoTxt88'),
        3: $t('xosoTxt87'),
    }
const statusClass = (status: any) => {
	if (status == '3') {
		return 'color40C592'
	}
}
</script>
<style lang="scss" scoped>
.bet-container-lottery-items {
	margin-bottom: 24px;

	img {
		display: block;
		width: 100%;
		height: 44px;
	}
}

.bet-container-lottery-card {
	background: var(--darkBg,var(--bg_color_L2));
	width: 100%;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	padding: 26px 24px 26px;
}

.bet-container-lottery-card-header {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding-bottom: 12px;

	h1 {
		display: flex;
		justify-content: space-between;
		align-items: center;

		h2 {
			font-weight: bold;
			font-size: 30px;
			color: var(--darkTextW,var(--text_color_L1));
			padding-bottom: 8px;
		}

		span {
			font-size: 28px;

			&.color40C592 {
				color: #40c592;
			}

			color: #e98613;
		}
	}

	p {
		font-size: 22px;
		color: var(--text_color_L2);
	}
}

.bet-container-lottery-card-info {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	margin-top: 25px;
	min-height: 240px;

	img {
		width: 20px;
		height: 230px;
        margin-top: 10px;
		margin-right: 26px;
	}

	&-chessimg {
		height: 307px !important;
	}

	ul {
		width: calc(100% - 30px);
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;

		li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24px;
			color: var(--text_color_L3);
			padding-bottom: 20px;
			position: relative;
			width: 100%;
			height: fit-content;

			&:last-of-type {
				padding-bottom: 0 !important;
				align-items: flex-start;

				h2 {
					flex: none;
					width: fit-content;
				}

				p {
					height: fit-content;
					text-align: right;
				}
			}

			span {
				color: #595959;
				&.success {
					color: var(--norm_green-color);
				}
				&.fail {
					color: var(--norm_red-color);
				}
			}

			h3 {
				display: inline-block;
				text-align: center;
				width: 100px;
				height: 50px;
				line-height: 50px;
				color: var(--textW);
				border-radius: 10px;
				margin-left: 12px;
				background: var(--norm_green-color);
			}

			p {
				color: var(--main-color);
				height: 50px;
				display: inline-block;
				line-height: 50px;
				text-align: center;
				border-radius: 50px;
				font-weight: bold;
				font-size: 30px;
				width: 80%;
				word-wrap: break-word;
			}

			.betcontent {
				word-wrap: break-word;
			}
		}
        .type {
            margin-top: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 7px;

            >span {
                background: var(--bgDark-3,var(--bg_color_L3));
                width: calc((100% / 3) - 7px);
				display: flex;
				align-items: center;
				justify-content: center;
                text-align: center;
                color: var(--text_color_L2);
                font-size: 22px;
                border-radius: 10px;
                padding: 10px 0;
                margin-bottom: 5px;
            }
        }
	}
}
.bet {
	background-color: var(--darkBg, var(--bg_color_L2));
	.li {
		display: flex;
		justify-content: space-between;
		min-height: 50px;
		line-height: 50px;
		padding-left: 80px;
		&.betNum {
			flex-direction: column;
			flex-wrap: wrap;
			.lab {
				color: var(--text_color_L1);
				font-size: 28px;
				.txt {
					font-size: 28px;
					color: var(--text_color_L2);
				}
				.betList {
					width: 100%;
					&.select {
						max-height: 425px;
						overflow-y: auto;
                        display: flex;
                        .num{
                            >div {
                                display: flex;
                                align-items: center;
                                margin-bottom: 10px;

                                h6 {
                                    width: 110px;
                                    color: var(--text_color_L2);
                                }

                                .n {
                                    span {
                                        border-radius: 6px;
                                        background: var(--bg_color_L3);
                                        width: 38px;
                                        height: 36px;
                                        display: inline-block;
                                        margin-right: 10px;
                                        text-align: center;
                                        line-height: 36px;
                                        color: var(--text_color_L1);
                                        font-size: 22px;

                                    }
                                }
                            }
                        }
					}
					& > span {
						display: inline-block;
						text-align: center;
						height: 48px;
						line-height: 48px;
						width: 48px;
						color: var(--text_color_L1);
						background-color: var(--bg_color_L3);
						border-radius: 48px;
						font-size: 24px;
						margin-right: 15px;
						margin-bottom: 15px;
						&.active {
							background-color: var(--main_gradient-color);
							color: var(--textW);
						}
					}
					& > span {
						width: auto;
						padding: 0 12px;
						border-radius: 12px;
					}
				}
				width: 100%;
				&::after {
					top: 20px;
				}
				&::before {
					top: 38px;
					height: 97%;
				}
			}
		}
		.lab {
			color: var(--text_color_L2);
			position: relative;
			&::after {
				content: '';
				display: block;
				background: url(@icon/public/before_cire.png) no-repeat center center;
				background-size: cover;
				height: 20px;
				width: 20px;
				position: absolute;
				top: 50%;
				transform: translate(0, -50%);
				left: -40px;
				html:lang(ar) &{
					left: unset;
					right: -40px;
				}
			}
		}
		.sub {
			color: var(--text_color_L1);
			font-size: 24px;
			& > img {
				width: 30px;
				vertical-align: -5px;
			}
			&.success {
				color: var(--bgcolor-22);
			}
			&.fail {
				color: var(--main-color);
			}
		}
	}
}
.bet-container-lottery-note {
	&-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px;
		flex-wrap: wrap;

		&-para {
			font-size: 24px;
			display: flex;
			flex-direction: column;
			align-items: center;

			h3 {
				font-size: 28px;
				color: var(--text_color_L2);
			}

			h4 {
				font-size: 28px;
				color: var(--norm_green-color);
			}

			.h4_green {
				color: var(--norm_green-color);
			}

			.h4_red {
				color: var(--norm_red-color);
			}
		}

		& > div {
			width: 48%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 10px 0;
			background: var(--bg_color_L3);
			border-radius: 10px;
			height: 120px;
			&.last {
				width: 100%;
			}

			span {
				font-size: 24px;
				color: var(--text_color_L2);
				display: inline-block;
				margin-top: 12px;
			}
		}
	}
}
</style>
