<template>
	<div class="about-container">
		<NavBar :title="title" left-arrow @click-left="router.go(-1)" />
		<div class="about-container-content" v-html="contentMsg"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GetProtocols, GetAgreement } from '@/api'
import { AwaitApiResult } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const title = ref(t('pravicyProtocal'))
const router = useRouter()
const toType = history.state.paramValue
const contentMsg = ref<any>()
// 根据列表传入参数 请求隐私协议或者风险披露协议
onMounted(async () => {
	title.value = toType === 'Protocols' ? t('pravicyProtocal') : t('riskProtocal')
	const res = toType === 'Protocols' ? await AwaitApiResult(GetProtocols()) : await AwaitApiResult(GetAgreement())
	if (res) {
		contentMsg.value = toType === 'Protocols' ? res.data.protocols : res.data.agreement
	}
})
</script>

<style lang="scss" scoped>
.about-container {
	
	&-content {
	
		padding: 30px 30px;
		
         
		&-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 72px 0 23px 0;
			font-size: 30px;
			
		}
	}
}
</style>
