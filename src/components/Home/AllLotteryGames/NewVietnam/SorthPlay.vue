<!-- 玩法 -->
<template>
	<div class="Play__C">
		<van-tabs v-model:active="active" type="card">
			<van-tab :title="item.title" v-for="(item, index) in list" :key="index">
				<div class="Play__C-Cotent" v-for="(citem, cindex) in item.subList" :key="cindex">
					<div class="title">
						<img src="@public/home/AllLotteryGames/NewVietnam/Star.png" /><span> {{ citem.sub }} </span>
					</div>
					<div class="info">
						<div class="info_item" v-for="(kitem, kindex) in citem.txtList" :key="kindex">
							<img src="@icon/public/Triangle.png" /><span class="sub">{{
								kitem.bet
							}}</span>
							<div class="text">{{ kitem.betTip }}</div>
						</div>
						<div class="info_text">
							<div class="forexample">{{ $t('forexample') }}</div>
							<div class="betting" v-if="citem.num">{{ $t('betting') }}：{{ citem.num }}</div>
							<div class="result">{{ $t('result') }}：{{ citem.resultTip }}</div>
						</div>
						<div class="info_item" v-if="active === 7">
							<img src="@icon/public/Triangle.png"  /><span class="sub">
								{{ $t('xosoTxt71') }}
							</span>
							<div class="text">{{ $t('xosoTxt67') }}</div>
						</div>
						<div class="info_text" v-if="active === 7">
							<div class="forexample">{{ $t('forexample') }}</div>
							<div class="result">{{ $t('result') }}： {{ $t('xosoTxt68') }}</div>
						</div>
					</div>
				</div>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
// 定义recode内容
const active = ref(0)

const list = reactive([
	{
		title: $t('xosoTab1'), //包胆
		subList: [
			{
				sub: $t('xosoSub1'), //二码
				num: '［45］',
				resultTip: $t('xosoTxt3', ['18']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt1')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt2', ['18', '2'])
					}
				]
			},
			{
				sub: $t('xosoSub3'), //包二码 1K
				num: '［45］',
				resultTip: $t('xosoTxt6', ['18']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt1')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt2', ['18', '2'])
					}
				]
			},
			{
				sub: $t('xosoSub4'), //包三码
				num: '［456］',
				resultTip: $t('xosoTxt9', ['17']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt8')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt2', ['17', '3'])
					}
				]
			},
			{
				sub: $t('xosoSub5'), //包四码
				num: '［4567］',
				resultTip: $t('xosoTxt11', ['16']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt10')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt2', ['16', '4'])
					}
				]
			}
		]
	},
	{
		title: $t('xosoTab2'), //后二组合
		subList: [
			{
				sub: $t('xosoSub6'), //组二码
				num: '［45/55］',
				resultTip: $t('xosoTxt14', ['18']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt12', ['2'])
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt13', ['18', '2', '2'])
					}
				]
			},
			{
				sub: $t('xosoSub7'), //组三码
				num: '［45/55/65］',
				resultTip: $t('xosoTxt15', ['18']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt12', ['3'])
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt13', ['18', '3', '2'])
					}
				]
			},
			{
				sub: $t('xosoSub8'), //组四码
				num: '［45/55/65/75］',
				resultTip: $t('xosoTxt16', ['18']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt12', ['4'])
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt13', ['18', '4', '2'])
					}
				]
			}
		]
	},
	{
		title: $t('xosoTab3'), //二星
		subList: [
			{
				sub: $t('xosoSub14'), //二星（八等奖）
				num: '［45］',
				resultTip: $t('xosoTxt20'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt1')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt18')
					}
				]
			},
			{
				sub: $t('xosoSub15'), //二星（特等奖）
				num: '［45］',
				resultTip: $t('xosoTxt24'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt1')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt22')
					}
				]
			},
			{
				sub: $t('xosoSub16'), //二星（特/八等级）
				num: '［45］',
				resultTip: $t('xosoTxt28'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt1')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt26')
					}
				]
			}
		]
	},
	{
		title: $t('xosoTab4'), //定位胆
		subList: [
			{
				sub: $t('xosoSub17'), //十位（特等奖）
				num: '［4］',
				resultTip: $t('xosoTxt31'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt29')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt30')
					}
				]
			},
			{
				sub: $t('xosoTxt100'), //个位（特等奖）
				num: '［4］',
				resultTip: $t('xosoTxt33'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt101')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt102')
					}
				]
			}
		]
	},
	{
		title: $t('xosoTab5'), //三星
		subList: [
			{
				sub: $t('xosoSub23'), //三星(七等奖)
				num: '［456］',
				resultTip: $t('xosoTxt42'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt38')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt40')
					}
				]
			},
			{
				sub: $t('xosoSub20'), //三星(特等奖)
				num: '［456］',
				resultTip: $t('xosoTxt45'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt43')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt44')
					}
				]
			},
			{
				sub: $t('xosoSub24'), //三星(七/特等奖)
				num: '［456］',
				resultTip: $t('xosoTxt50'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt43')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt48')
					}
				]
			}
		]
	},
	{
		title: $t('xosoTab6'), //四星
		subList: [
			{
				sub: $t('xosoSub25'), //四星(特等奖)
				num: '［4567］',
				resultTip: $t('xosoTxt53'),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt51')
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt52')
					}
				]
			}
		]
	},
	{
		title: $t('xosoTab7'), //不同号
		subList: [
			{
				sub: $t('xosoSub26'), //四不同号
				num: '［45/55/66/77］',
				resultTip: $t('xosoTxt57', ['18']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt12', ['4'])
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt56', ['18'])
					}
				]
			},
			{
				sub: $t('xosoSub27'), //八不同号
				num: '［45/55/66/77/88/99/11/22］',
				resultTip: $t('xosoTxt58', ['18']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt12', ['8'])
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt56', ['18'])
					}
				]
			},
			{
				sub: $t('xosoSub28'), //十不同号
				num: '［45/55/66/77/88/99/11/22/33/44］',
				resultTip: $t('xosoTxt59', ['18']),
				txtList: [
					{
						bet: $t('betting'),
						betTip: $t('xosoTxt12', ['10'])
					},
					{
						bet: $t('winningconditions'),
						betTip: $t('xosoTxt56', ['18'])
					}
				]
			}
		]
	},
	{
		title: $t('xosoTab8'), //趣味游戏
		subList: [
			{
				sub: $t('xosoTxt60'), //和值
				num: '',
				resultTip: $t('xosoTxt66'),
				txtList: [
					{
						bet: $t('xosoTxt60'),
						betTip: $t('xosoTxt61')
					},
					{
						bet: $t('big'),
						betTip: $t('xosoTxt62')
					},
					{
						bet: $t('small'),
						betTip: $t('xosoTxt63')
					},
					{
						bet: $t('xosoTxt69'),
						betTip: $t('xosoTxt64')
					},
					{
						bet: $t('xosoTxt70'),
						betTip: $t('xosoTxt65')
					}
				]
			}
		]
	}
])
</script>
<style lang="scss" scoped>
.Play__C {
	width: 100%;
	:deep(.van-tab--card) {
		min-width: 220px;
	}
	&-Cotent {
		background-color: var(--darkBg,#fff);
		margin: 0 30px 30px;
		border-radius: 30px;
		.title {
			width: 702px;
			height: 60px;
			line-height: 60px;
			background: url('@icon/public/palybg.png') no-repeat center;
			background-size: auto 100%;
			background-color: #fff;
			display: flex;
			align-items: center;
			img {
				display: block;
				width: 42px;
				height: 42px;
				margin: 0 20px;
			}
			& > span {
				color: #fff;
				font-size: 32px;
				font-weight: 600;
			}
		}
		.info {
			width: 100%;
			background-color: var(--darkBg,var(--bg_color_L2));
			margin-bottom: 30px;
			padding: 20px 20px 30px;
			border-radius: 0 0 20px 20px;
			&_item {
				margin-bottom: 30px;
				font-size: 26px;
				color: var(--text_color_L2);
				& > img {
					width: 34px;
					height: 34px;
					display: inline-block;
					vertical-align: -4px;
					margin-right: 12px;
				}
				.sub {
					color: var(--darkTextW,var(--main-color));
					font-size: 32px;
				}
				.text {
					margin: 16px 42px 0;
					color: var(--text_color_L2);
					font-size: 26px;
					line-height: 40px;
				}
			}
			&_text {
				border-radius: 20px;
				border: 1px solid var(--gray-color-1);
				padding: 0 17px 25px 51px;
				color: var(--text_color_L2);
				font-size: 24px;
				& > div {
					margin-top: 15px;
					line-height: 40px;
				}
			}
		}
	}
}
</style>
