<!-- 下注后显示 -->
<template>
	<div class="vietnam-popup" v-if="cartList.length > 0">
		<div class="c-row c-row-middle c-row-between m-b-15">
			<div class="tit">{{ $t('selectednumber') }}</div>
			<div class="del c-row c-row-middle-center" @click="allDel">
				<van-icon color="#F95959" class="icon m-r-5" name="delete" /> {{ $t('removeall') }}
			</div>
		</div>
		<!-- 这个输入号码和快捷选号的显示 -->
		<div :class="'c-row c-flex-warp compound' + compoundType" v-if="compoundType == 0">
			<div :class="'c-row item item' + gameTabType" v-for="(item, index) in cartList" :key="index">
				<div class="box">
					<div class="c-row">
						<div class="num c-row c-row-middle-center" v-for="(citem, cindex) in item.numList" :key="cindex">
							{{ citem }}
						</div>
					</div>
					<div class="dele c-row c-row-middle-center" @click="compoundDel(item)">
						<van-icon color="#F95959" class="icon" name="cross" />
					</div>
				</div>
			</div>
		</div>
		<!-- 这个是选择号码的显示 -->
		<div :class="'c-row c-flex-warp compound' + compoundType" v-if="compoundType == 1">
			<div class="item" v-for="(item, index) in cartList" :key="index">
				<div class="title">{{ item.unit }}</div>
				<div class="numcontainer">
					<div class="num" v-for="(numitem, index) in item.numList" :key="index">
						{{ numitem }}
						<div class="dele c-row c-row-middle-center" @click="compoundDel(item)">
							<van-icon color="#F95959" class="icon" name="cross" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['allDel', 'compoundDel'])
const props = withDefaults(
	defineProps<{
		cartList: any
		compoundType: any
		gameTabType: any
	}>(),
	{
		cartList: {
			type: Array,
			default: () => []
		},
		compoundType: {
			type: Number,
			default: 0
		},
		gameTabType: {
			type: Number,
			default: 0
		}
	}
)
const compoundType = ref(1)
const gameTabType = ref(0)
// const cartList = ref([
// 	{ count: 1, unit: 'indivual', numList: ['03', '07', '09', '08', '01', '02', '04', '05', '06', '00'] },
// 	{ count: 1, unit: 'ten', numList: ['03', '07', '09', '08', '01', '02', '04', '05', '06', '00'] },
// 	{ count: 1, unit: 'hundred', numList: ['03', '07', '09', '08', '01', '02', '04', '05', '06', '00'] },
// 	{ count: 1, unit: 'thousand', numList: ['03', '07', '09', '08', '01', '02', '04', '05', '06', '00'] }
// ])
const cartList = ref([])
const allDel = () => {
	emit('allDel')
}
const compoundDel = (item: any, compoundType: number) => {
	emit('compoundDel', item, compoundType)
}
</script>
<style lang="scss" scoped>
.vietnam-popup {
	width: 100%;
	position: fixed;
	left: auto;
	bottom: 0;
	padding: 16px 16px 120px 4px;
	background: var(--bg_color_L2);
	z-index: 99;
	border-radius: 20px 20px 0 0;
	//max-width: 10rem;
	html:lang(ar) &{
		right: auto;
		left: unset;
	}
	.tit {
		height: 72px;
		line-height: 72px;
		border-left: 12px solid var(--main-color);
		padding-left: 40px;
		font-size: 30px;
		color: var(--text_color_L1);
	}

	.del {
		.icon {
			font-size: 30px;
		}

		color: var(--text_color_L2);
	}

	.compound0 {
		padding-top: 20px;
		max-height: 300px;
		overflow-x: auto;
		overflow-y: auto;

		.item {
			width: 12.5%;
			margin-bottom: 20px;
			//10个字母样式
			&.item1 {
				width: 100%;

				.num {
					margin: 0 5.5px !important;
				}
			}
			// 8个数字
			&.item2 {
				width: 100%;

				.num {
					margin: 0 10px !important;
				}
			}
			//  4个数字
			&.item3 {
				width: 50%;

				.num {
					margin: 0 10px !important;
				}
			}
			//  3个数字
			&.item4 {
				width: 33.3%;
				.num {
					margin: 0 6px !important;
				}
			}
			// 2个数字
			.item5 {
				width: 25%;
				.num {
					margin: 0 4px !important;
				}
			}
			// 1个字母的样式
			&.item0 {
				.box {
					width: 80%;
					margin: 0 auto;
				}
			}

			.box {
				background: var(--gray-color-1);
				border-radius: 20px;
				position: relative;
				padding-top: 10px;

				.num {
					height: 60px;
					width: 60px;
					background: url('@icon/public/anbg.svg') no-repeat center center;
					background-size: cover;
					font-size: 32px;
					font-weight: 600;
					color: var(--main-color);
					margin: 0 auto;
				}

				.money {
					text-align: center;
					background-color: var(--gray-color-1);
					position: relative;
					height: 40px;
					border-radius: 0 0 20px 20px;

					.all {
						position: relative;
						z-index: 9;
						line-height: 60px;
						font-size: 24px;
						color: var(--main-color);
					}

					&::after {
						position: absolute;
						top: 0px;
						left: 0px;
						content: '';
						display: block;
						width: 100%;
						height: 16px;
						background-color: var(--gray-color-1);
						border-radius: 0 0 50% 50%;
					}
				}

				.dele {
					position: absolute;
					right: -14px;
					top: -14px;
					height: 28px;
					width: 28px;
					border-radius: 40px;
					background-color: var(--colorText-26);

					.icon {
						font-size: 20px;
					}
				}
			}
		}
	}

	.compound1 {
		padding-top: 20px;
		max-height: 450px;
		overflow: auto;
		.item {
			display: flex;
			flex-direction: row;
			margin-bottom: 10px;
			.title {
				width: 104px;
				overflow: hidden;
				position: relative;
				top: 50px;
				text-align: center;
				font-size: 32px;
				color: var(--text_color_L2);
			}
			.numcontainer {
				width: 616px;
				margin-left: 90px;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				.num {
					height: 60px;
					width: 60px;
					background: url('@icon/public/anbg.svg') no-repeat center center;
					background-size: cover;
					font-size: 32px;
					font-weight: 600;
					color: var(--main-color);
					margin: 0 auto;
					position: relative;
					text-align: center;
					line-height: 60px;
					margin-left: 47px;
					margin-bottom: 16px;
					.dele {
						position: absolute;
						right: -14px;
						top: -14px;
						height: 28px;
						width: 28px;
						border-radius: 40px;
						background-color: var(--colorText-26);

						.icon {
							font-size: 20px;
						}
					}
				}
				.num:first-child {
					margin-left: 52px;
				}
			}
		}
	}
}
</style>
