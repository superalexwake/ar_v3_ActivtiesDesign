<template>
	<div class="customer-container">
		<div class="customer-container-header">
			<NavBar
				:title="$t('poxyServer')"
				class="main"
				left-arrow
				@click-left="goBack"
			/>
			<div class="customer-container-header-belly">
				<img src="@icon/promotion/serverbg.png" alt="" />
			</div>
		</div>
		<List :list="ContactList" @on-click="onItemClick"></List>
	</div>
</template>

<script setup lang="ts">
import { useServer } from '@/hooks/useServe.hook'
import { onMounted } from 'vue'
const { onItemClick, goBack, getList, ContactList, List } = useServer({ ServerType: 1 })

onMounted(() => {
	getList()
})
</script>

<style lang="scss" scoped>
.customer-container {
	&-header {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		width: 100%;
		height: fit-content;
		background: var(--bg_color_L2);

		:deep(.navbar) {
			.navbar__content {
				.navbar__content-left {
					.van-icon {
						color: #fff;
					}
				}

				.navbar__content-center {
					color: #fff;
				}
			}
		}

		&-belly {
			background-image: var(--main_gradient-color2);
			img {
				width: 528px;
				margin: auto;
				
			}

			display: flex;
		}
	}
}
</style>
