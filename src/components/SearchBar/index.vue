<template>
	<div class="searchbar-container">
		<input
			type="text"
			auto-complete="new-password"
			autocomplete="off"
			class="searchbar-container__searchbar"
			:placeholder="placeholder"
			v-model="searchValue"
			maxlength="30"
		/>
		<svg-icon v-if="!isShowClose" class="searchIcon" name="searchBtn" @click="handleSearch"/>
		<img v-else class="clearIcon" src="@public/wallet/withdraw/clear.png" @click="onClear" />
	</div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

import { useI18n } from 'vue-i18n'
import searchIcon1 from '@icon/promotion/searchIcon1.png'
const { t } = useI18n()

let searchStr = t('search')
const prop = withDefaults(
	defineProps<{
		value?: string //文本框输入值
		placeholder?: string //文本框提示文本,默认'搜索'
		getSearchIcon?: string //搜索图标地址，默认是searchIcon.png
		isShowClose?: boolean //是否显示关闭按钮，默认不显示,需要注意'搜索图标'和'关闭按钮'默认都显示在右边的，如果需要同时显示，在调用时要自己调样式噢
	}>(),
	{
		// placeholder: useI18n().t('search'),
		placeholder: inject('searchStr'),
		isShowClose: false,
		getSearchIcon: searchIcon1
	}
)
//console.log('prop', prop)
const emit = defineEmits<{
	(e: 'update:value', val: string): void
	(e: 'handleSearch'): void
}>()

const searchValue = computed({
	get(): string {
		return prop.value || ''
	},
	set(val: string) {
		emit('update:value', val)
	}
})

const handleSearch = () => {
	emit('handleSearch')
}

const onClear = () => {
	emit('update:value', '')
}
</script>

<style lang="scss" scoped>
.searchbar-container {
	position: relative;
	z-index: 1;
	input {
		color: var(--text_color_L1);
	}
	&__searchbar {
		width: 100%;
		margin-top: 20px;
		padding: 20px 20px;
		outline: none;
		border: none;
		height: 80px;
		border-radius: 10px;
		background: var(--bg_color_L2);
		font-size: 28px;
		position: relative;
		&::placeholder {
			color: var(--text_color_L2);
		}
	}

	.searchIcon {
		position: absolute;
		right: 40px;	
		margin-top: 30px;	
		width: 120px;
		min-height: 60px;
	
	}

	.clearIcon {
		width: 45px;
		height: auto;
		position: absolute;
		right: 30px;
		top: 45%;
		
	}
}
</style>
