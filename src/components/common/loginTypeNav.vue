<template>
	<div class="nav">
		<div v-for="item in loginList" :key="item.type" :class="{active: activeLogin == item.type}" @click="activeFun(item.type)">{{ t(item.name) }}</div>
	</div>
</template>

<script setup lang="ts">
import i18n from '@/languages'
const { t } = i18n.global


defineProps({
	activeLogin: {
		type: String,
		default: ''
	},
	loginList: {
		type: Array,
		default: [
			{ type: 'mobile', name: 'phoneN'},
			{ type: 'email', name: 'emaillogin'}
		]
	}
})
const emits = defineEmits(['activeLogin'])
const activeFun = (val: any)=> {
	emits('activeLogin', val)
}
</script>

<style  lang="scss" scoped>

.nav {
	height: 68px;
	display: flex;
	justify-content: center;
	align-items: baseline;
	&>div {
		font-size: 24px;
		color: rgba(255,255,255,.6);
		width: fit-content;
		& + div {
			margin-left: 80px;
		}
		&.active {
			font-size: 36px;
			color: #fff;
			position: relative;
			&::after {
				content: '';
				display: block;
				background-color: #F7D349;
				width: 50%;
				height: 6px;
				position: absolute;
				left: 50%;
				bottom: -12px;
				border-radius: 3px;
				transform: translateX(-50%);
			}
		}
	}
}
</style>