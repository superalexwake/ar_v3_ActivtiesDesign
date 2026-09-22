<!-- 投注页面 -->
<template>
	<div class="Betting__C">
		<div v-show="isShowMark" class="Betting__C-mark">
			<div>{{ $t('nomorebet') }}</div>
		</div>
		<div class="Betting__C-bet">
			<div class="tit c-row c-row-between">
				<div class="tit-select">{{ $t('selectNo') }}</div>
				<div class="c-row tit-list">
					<div
						:class="compoundType == 0 ? 'check action c-row c-row-middle-center' : 'check c-row c-row-middle-center'"
						@click="compound(0)"
					>
						<div class="check-item"></div>
						{{ $t('radio') }}
					</div>
					<div
						:class="compoundType == 1 ? 'check action c-row c-row-middle-center' : 'check c-row c-row-middle-center'"
						@click="compound(1)"
					>
						<div class="check-item"></div>
						{{ $t('multiSelect') }}
					</div>
				</div>
			</div>
			<!-- 选中数字 -->
			<div class="nList c-row" v-for="(item, cindex) in 10" :key="cindex">
				<div class="Ntit c-row c-row-middle">
					<div>{{ cindex }}0<br />/<br />{{ cindex }}9</div>
				</div>
				<div class="c-row list c-flex-warp">
					<div
						:id="'ball-' + index"
						class="item c-row c-row-middle-center"
						v-for="(item, index) in 10"
						:key="index"
						@click="betNum(cindex, index)"
					>
						<div
							:class="
								numList.includes(cindex + '' + index)
									? 'action number c-row c-row-middle-center'
									: 'number c-row c-row-middle-center'
							"
						>
							{{ cindex }}{{ index }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const multipleList = ref([1, 5, 10, 20, 50, 100])
const bettingPopupShow = ref(false)
const emit = defineEmits(['compound', 'betNum'])
const props = defineProps({
	numList: {
		type: Array,
		default: () => {
			;[]
		}
	},
	compoundType: {
		type: Number,
		default: 0
	},
	isShowMark: {
		type: Boolean,
		default: false
	},
	currentInfo: {
		// 当期游戏期号，以及倒计时时间等参数。
		type: Object,
		default: () => ({})
	}
})
// 单选和复式切换
const compound = (id: number) => {
	emit('compound', id)
}
//投注号码
const betNum = (cindex: number, index: number) => {
	emit('betNum', cindex, index)
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/xoxs.scss';
</style>
