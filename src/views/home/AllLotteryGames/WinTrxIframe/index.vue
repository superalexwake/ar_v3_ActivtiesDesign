<template>
	<div class="WinTrxIfram__C">
		<NavBar left-arrow @click-left="onClickLeft" backgroundColor="linear-gradient(90deg,#cd0103,#f64841)" title="TRX" />
		<iframe
			class="iframe"
			sandbox="allow-same-origin allow-popups allow-scripts"
			frameborder="0"
			marginwidth="0"
			marginheight="0"
			vspace="0"
			hspace="0"
			allowtransparency="true"
			:allowfullscreen="true"
			ref="iframe"
			:src="url"
		></iframe>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
//设置iframe地址
const url = computed(() => {
	return String(router.currentRoute.value.query.url)
})
// 返回上一页
const onClickLeft = () => {
	router.go(-1)
}
</script>

<style lang="scss" scoped>
.WinTrxIfram__C {
	:deep(.navbar__content) {
		.van-icon {
			color: var(--textW);
		}

		.navbar__content-center {
			color: var(--textW);
		}
	}

	.iframe {
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 100vh;
		background: #eee;
	}
}
</style>
