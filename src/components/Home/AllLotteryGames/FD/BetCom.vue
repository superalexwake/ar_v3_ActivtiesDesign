<template>
	<div class="FDB__C-nav">
		<div
			v-for="(item, index) in betTypeNameMap"
			:key="index"
			:class="{ active: betType == index }"
			@click="emit('changeType', index)"
		>
			{{ item }}
		</div>
	</div>
	<div class="FDB__C-H">
		<div
			v-for="(item, index) in BettingH"
			:key="index"
			:class="{ active: onTabID == item.id }"
			@click="emit('onTab', item.id)"
		>
			<span>{{ item.name }}</span
			><span>{{ item.rate }}</span>
		</div>
	</div>
	<div class="FDB__C-Num">
		<template v-if="betType != 5">
			<div
				v-for="(item, index) in 10"
				:key="index"
				:txt="index"
				:class="{ active: numberChack[index] }"
				@click="emit('numberTab', index)"
			>
				<div class="round">{{ index }}</div>
				<div class="rate">
					{{ OddsList[0].playRate ? OddsList[0].playRate : OddsList[0].playRate_Original }}
				</div>
			</div>
		</template>
	</div>
</template>
<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		betTypeNameMap: any
		betType: any
		BettingH: any
		onTabID: any
		numberChack: any
		OddsList: any
	}>(),
	{}
)
const emit = defineEmits(['changeType', 'onTab', 'numberTab'])
</script>
<style lang="scss" scoped>
.FDB__C {
	&-nav {
		display: flex;
		border-bottom: 1px solid var(--Dividing-line_color);

		& > div {
			width: 80px;
			height: 80px;
			line-height: 80px;
			background: var(--button_dis_color);
			font-size: 36px;
			font-weight: 700;
			color: #fff;
			border-radius: 19px 19px 0 0;
			position: relative;
			margin-right: 20px;
			text-align: center;

			&:last-child {
				font-size: 32px;
			}

			&.active {
				background: var(--main-color);
				color: var(--text_color_L4);

				&::after {
					background:radial-gradient(circle at 100% 0, var(--bg_color_L2) 20px, var(--main-color) 20px);
				}
			}

			&::after {
				content: '';
				width: 20px;
				height: 20px;
				position: absolute;
				bottom: 0;
				right: -20px;
				z-index: 9;
				background: var(--linerGradient-70);
				html:lang(ar) &{
					left: -20px;
					right: unset;
				}
			}
		}
	}

	&-H {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 66px;
		line-height: 66px;
		margin-top: 24px;
		font-size: 28px;
		color: #fff;

		& > div {
			width: calc((100% - 102px) / 4);
			height: 100%;
			background: var(--button_dis_color);
			border-radius: 10px;
			padding: 0 12px;
			display: flex;
			justify-content: space-between;

			&.active {
        color: #fff;
				// 顺序对应 BettingH：大橙 / 小蓝 / 单红 / 双绿
				$list: (
					1: var(--norm_secondary-color),
					2: var(--norm_bule-color),
					3: var(--norm_red-color),
					4: var(--norm_green-color)
				);

				@each $key, $color in $list {
					&:nth-child(#{$key}) {
						background: $color;
					}
				}
			}
		}
	}

	&-Num {
		padding: 26px 0 0 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		height: 250px;

		& > div {
			width: 20%;
			height: 50%;

			.round {
				width: 66px;
				height: 66px;
				border: 1px solid var(--text_color_L3);
				border-radius: 50%;
				color: var(--text_color_L3);
				font-size: 28px;
				text-align: center;
				line-height: 66px;
				margin: auto;
			}

			.rate {
				line-height: 24px;
				font-size: 24px;
				color: var(--text_color_L2);
				text-align: center;
			}

			&.active {
				.round {
					background: var(--main-color);
					border: 1px solid var(--main-color);
					color: #fff;
				}
			}
		}
	}
}
</style>
