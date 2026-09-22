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
		<List :list="CollectionList" @on-click="onClickUrl"></List>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { ReqService } from '@/types/api'
import { useServer } from '@/hooks/useServe.hook'
const { goBack, onClickUrl, CollectionList, getServiceList, List } = useServer({ ServerType: 1 })

const typeId = history.state.itemId
const servType = reactive<ReqService>({
	typeId
})
onMounted(async () => {
	getServiceList(servType)
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
		background: var(--main_gradient-color2);

		:deep(.navbar) {
			.navbar__content {
				.navbar__content-left {
					.van-icon {
						color: #fff;
						// border: 3px solid var(--textW);
						// border-radius: 50%;
						// padding: 4px;
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
