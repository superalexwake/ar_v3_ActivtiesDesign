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
