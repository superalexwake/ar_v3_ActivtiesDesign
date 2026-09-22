<template>
	<div class="Laundry-Rule">
		<NavBar :title="t('laundryRule')" left-arrow @click-left="router.go(-1)" />
		<div class="Laundry-Rule-content" v-html="contentMsg" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult } from '@/utils'
import { GetCodeWashRule } from '@/api'
import type { ReqlaundryRule } from '@/types/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()

const contentMsg = ref<ReqlaundryRule>()
// 获取新手指南
onMounted(async () => {
	//请求新手指南内容
	const res = await AwaitApiResult(GetCodeWashRule())
	if (res) {
		contentMsg.value = res.data.washRules
	}
})
</script>

<style scoped lang="scss">
.Laundry-Rule {
	overflow: hidden;
	padding: 0 24px;
}

:deep().Laundry-Rule-content {
	font-size: 26px;
	color: var(--text_color_L2);

	img {
		max-width: 99% !important;
	}
}
</style>
