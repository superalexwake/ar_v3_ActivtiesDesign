<template>
	<div>
		<div class="title"><b />{{ $t('code9306Video') }}</div>
		<div class="tip">{{ $t('videoText') }}</div>
		<van-tabs v-model:active="active" animated class="homeNav" :swipe-threshold="3">
			<van-tab v-for="(type, i) in soltGameType" :key="i" :name="type">
				<template #title>
					<div class="tabs-btn"><svg-icon :name="type" class="gameIcon" />{{ getSlotTitle(type) }}</div>
				</template>
				<div class="picContainer">
					<template v-if="soltGameList[active]">
						<div
							class="picContainer-item"
							v-for="(game, i) in soltGameList[active]"
							:key="i"
							@click="onItemClick(game)"
						>
							<img v-lazy="game.img" alt="" />
							<Maintain :item="game" />
						</div>
						<div class="more" @click="gol2('video')">
							<div class="more-l1">
								<svg-icon name="p3more" />
								{{ $t('more') }}
							</div>
							<div class="more-l2">{{ getSlotTitle(active) }}</div>
						</div>
					</template>
				</div>
			</van-tab>
		</van-tabs>
	</div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { getSlotTitle } from '@/utils'
const { homeState, getVideonChildGame, gol2, onItemClick } = useHome()
const active = ref('')
const soltGameType: any = ref([])
const soltGameList: any = ref({})
onMounted(async () => {
	await getVideonChildGame()
	soltGameType.value = homeState.videoGame.map((item) => {
		soltGameList.value[item.vendorCode] = item.childList.slice(0, 5)
		return item.vendorCode
	})
	active.value = soltGameType.value[0]
})
</script>
<style scoped lang="scss">
.title {
	height: 42px;
	display: flex;
	align-items: center;
	font-size: 30px;
	font-weight: 500;
	margin-bottom: 10px;
	b {
		display: block;
		height: 26px;
		width: 8px;
		border-radius: 4px;
		background-color: var(--main-color);
		margin-inline-end: 10px;
	}
}
.tip {
	font-size: 20px;
	color: var(--text_color_L2);
	margin-bottom: 24px;
}
.gameIcon {
	width: 100px;
	height: 50px;
}
.picContainer {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	&-item {
		position: relative;
		width: calc((100% - 24px) / 3);
		height: 300px;
		img {
			width: 100%;
			height: 300px;
		}
	}
}
:deep(.van-tab__panel-wrapper--inactive) {
	overflow: hidden;
}
</style>