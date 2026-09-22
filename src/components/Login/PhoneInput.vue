<template>
	<div class="phoneInput__container">
		<div class="phoneInput__container-label">
			<svg-icon name="phone" />
			<span>{{ $t('phone') }}</span>
		</div>
		<div class="phoneInput__container-input">
			<DropDown :typeValue="prop.numberType" ref="dropDown" @changeT="changeT" />
			<input
				v-only-num
				type="text"
				name="userNumber"
				v-model="inputNum"
				:placeholder="$t('plsEnterTel')"
				@blur="onBlur"
				@input="onChange"
				ref="number"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import DropDown from './DropDown.vue'
import { onMounted, ref, nextTick, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

const dropDown = ref()
const prop = withDefaults(
	defineProps<{
		type: string
		showValidate: boolean
		typeP?: string //判断是不是从更改手机号码界面进入
		numberType: string
		number: string
	}>(),
	{}
)

const emits = defineEmits<{
	(e: 'update:show-validate', val: boolean): void
	(e: 'changeT', val: string): void
	(e: 'changeN', val: string): void
}>()

const inputNum = computed({
	get(): string {
		return prop.number
	},
	set(val: string) {
		emits('changeN', val.replace(/[^0-9]/g, ''))
	}
})
function onBlur(e: Event) {
	const el = e.target as HTMLInputElement
	if (el.value.length < 6) {
		emits('update:show-validate', true)
	}
}

function onChange(e: Event) {
	const el = e.target as HTMLInputElement
	//去掉中文

	const reg = /[\u4e00-\u9fa5]/g
	el.value = el.value.replace(reg, '')
	if (el.value.length > 0) {
		emits('update:show-validate', false)
	}
}

const changeT = (value: string) => {
	emits('changeT', value)
}
onClickOutside(dropDown, () => {
	dropDown.value.close()
})

onMounted(() => {})

const number = ref()
function getFocus() {
	nextTick(() => {
		number.value.focus()
	})
}

defineExpose({
	getFocus
})
</script>

<style lang="scss" scoped>
.phoneInput__container {
	margin-bottom: 60px;

	&-label,
	&-input {
		display: flex;
		align-items: center;
		padding: 0 2px;
	}

	&-label {
		margin-bottom: 24px;
		color: var(--text_color_L1);
		font-size: 30px;

		svg {
			width: 48px;
			height: 48px;
			margin-right: 12px;
			color: var(--main-color);
		}
	}

	&-input {
		gap: 18px;
		input {
			width: 80%;
			height: 88px;
			margin-left: 200px;
			padding: 27px 26px 27px 26px;
			color: var(--text_color_L1);
			font-size: 28px;
			border: none;
			border-radius: 20px;
			background: var(--bg_color_L2);

		html:lang(ar) &{
			left: unset;
			right: 30px;
			margin: 0 200px 0 0;
		}
		}
	}

	&-tips {
		margin-top: 24px;
		padding-left: 17px;
		color: var(--norm_red-color);
		font-size: 24px;
		display: flex;
		flex-direction: row;
		.tipbg {
			width: 32px;
			height: 32px;
			background-image: url('@icon/wallet/hint.png');
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
		}
	}
}
</style>
