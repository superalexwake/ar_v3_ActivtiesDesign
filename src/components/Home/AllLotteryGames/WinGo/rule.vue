<template>
	<!-- 规则弹层 begin-->
	<van-popup v-model:show="showPopup" :close-on-click-overlay="false" round>
		<div class="TimeLeft__C-PreSale">
			<div class="TimeLeft__C-PreSale-head">{{ $t('winTrxIndicate') }}</div>
			<div class="TimeLeft__C-PreSale-body">
				<div v-html="gamePresentation"></div>
			</div>
			<div class="TimeLeft__C-PreSale-foot">
				<div class="TimeLeft__C-PreSale-foot-btn" @click="emit('close')">{{ $t('winTrxClose') }}</div>
			</div>
		</div>
	</van-popup>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
	howPlayShow: {
		type: Boolean,
		default: false
	},
	gamePresentation: {
		// 当前选中游戏
		type: String,
		default: ''
	}
})
const showPopup = computed({
	get(): boolean {
		return props.howPlayShow || false
	},
	set(val: boolean) {
		if (!val) {
			emit('close')
		}
	}
})
const emit = defineEmits<{
	(e: 'close'): void
}>() 
</script>
<style lang="scss" scoped>
.TimeLeft__C {
	&-PreSale {
		width: 528px;

		&-head {
			height: 90px;
			line-height: 90px;
			color:var(--text_color_L4);
			font-size: 30px;
			text-align: center;
			background: var(--main_gradient-color);
		}

		&-body {
			max-height: 600px;
			overflow-y: auto;
			color: var(--text_color_L1);
			padding: 20px;
			font-size: 24px;
			line-height: 60px;

			:deep(p) {
				margin-bottom: 15px;
				line-height: 40px;
				color: var(--text_color_L1);
				word-wrap: break-word;
			}
		}

		&-foot {
			height: 140px;
			display: flex;
			justify-content: center;
			align-items: center;
			background: var(--bg_color_L2);
			&-btn {
				width: 60%;
				background: var(--main_gradient-color);
				border-radius: 40px;
				height: 70px;
				line-height: 70px;
				text-align: center;
				font-size: 28px;
				color: #fff;
			}
		}
	}
}
</style>
