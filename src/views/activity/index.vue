<template>
	<NavBar class="main" :headLogo="true">
	</NavBar>
	<Section />
</template>

<script setup lang="ts">
import Section from '@/components/Activity/Section/index.vue'
</script>

<style lang="scss" scoped>
.navbar {
	background-color: var(--bg_color_L2);
	// 顶部状态栏要跟 Section 头部(ActivityRewardHeader,纯色 #F95959)连成一整块,不能再用公共渐变色断开;
	// 只在活动页这里覆盖,不改 NavBar.vue 共享组件本身(它还被 30+ 个其它页面用 class="main" 复用)。
	// NavBar.vue 内部 .navbar.main .navbar-fixed[data-v-*] 的选择器权重比这里高,要加 !important 才盖得过
	&.main :deep(.navbar-fixed) {
		background: #F95959 !important;
	}

	&__content {
		&-center {
			img {
				width: 217.86px;
				height: auto;
			}
		}

		&-right {
			img {
				width: 48px;
				height: auto;
			}
		}
	}
}
</style>
