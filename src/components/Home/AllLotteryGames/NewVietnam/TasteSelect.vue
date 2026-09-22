<!--趣味玩法 -->
<template>
	<div class="TasteContainer">
		<div class="TasteHeader">{{ $t('xosoTxt60') }}</div>
		<div class="NumberSelect">
			<div class="NumberSelectCon">
				<div
					class="NumberCon"
					v-for="(item, index) in funplaylist"
					:class="{ action: item.oddTypeName === numbercon, more: index == 18 }"
					:key="index"
					@click="selectvalue(item, index)"
				>
					<div class="number" :class="{ active: item.oddTypeName === numbercon }">
						{{ $t('code' + item.oddTypeNameCode) }}
					</div>
					<div class="odds" :class="{ active: item.oddTypeName === numbercon }">{{ item.oddsOrAmount }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	//趣味玩法数组
	funplaylist: {
		type: Array,
		default: []
	},
	// 选中数据
	numbercon: {
		type: String,
		default: '1000'
	}
})
const emit = defineEmits(['selectvalue'])
const selectvalue = (item: any, index: number) => {
	emit('selectvalue', item, index)
}
</script>
<style lang="scss" scoped>
.TasteContainer {
	margin: 20px 24px;
	display: flex;
	flex-direction: column;
	width: 702px;
	height: 831px;
	background: var(--bg_color_L2);
	
	border-radius: 20px;
	.TasteHeader {
		height: 60px;
		background: var(--boxShadowColor-46);
		font-size: 28px;
		color: #fff;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		line-height: 60px;
		text-align: center;
	}
	.NumberSelect {
		display: flex;
		flex-direction: column;
		.NumberSelectCon {
			display: flex;
			flex-wrap: wrap;
			padding: 20px 20px 0 20px;
			.NumberCon {
				width: calc((100% - 30px) / 4);
				height: 110px;
				background: var(--bg_color_L3);
				display: flex;
				flex-direction: column;
				border-radius: 20px;
				margin-bottom: 12px;
				text-align: center;
				justify-content: center;
				margin-right: 5px;
				&.more {
					width: calc((100% - 20px) / 2);
				}
			}
			.action {
				background: linear-gradient(125deg, #FF8E89 12.38%, #FFC3A2 87.13%);
				box-shadow: var(--boxShadowColor-46);
			}
			.active {
				color: #fff !important;
				
			}
			.number {
				font-size: 36px;
				color: var(--text_color_L2);
				font-weight: 700;
			}
			.odds {
				font-size: 24px;
				color: var(--text_color_L2);
			}
		}
		.MethodSelect {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 0px 20px;
			.methodnumber {
				font-size: 28px;
				color: #fff;
				font-weight: 700;
			}
			.methododds {
				font-size: 24px;
				color: #fff;
			}
			.methodbig {
				width: 160px;
				height: 110px;
				background: var(--norm_secondary-color);
				box-shadow: var(--BoxShadowColor-5);
				border-top-right-radius: 20px;
				border-bottom-left-radius: 20px;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			.methodsmall {
				width: 160px;
				height: 110px;
				background: var(--norm_bule-color);
				box-shadow: var(--BoxShadowColor-5);
				border-radius: 20px;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			.methododd {
				width: 160px;
				height: 110px;
				background: var(--norm_Purple-color);
				border-radius: 20px;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			.methodeven {
				width: 160px;
				height: 110px;
				background: var(--norm_red-color);
				box-shadow: var(--BoxShadowColor-5);
				border-top-right-radius: 20px;
				border-bottom-left-radius: 20px;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
		}
	}
}
</style>