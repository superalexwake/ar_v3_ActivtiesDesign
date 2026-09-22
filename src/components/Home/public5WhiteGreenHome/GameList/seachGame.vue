<template>
	<div class="seach-game">
		<div v-if="showCategoryTitle" class="seach-game__head">
			<img :src="partnerIcons.icon_Slots" alt="" />
			<span>{{ $t('electronicGame') }}</span>
		</div>

		<van-tabs v-model:active="active" animated class="seach-game__tabs">
			<van-tab v-for="(type, i) in slotGameTypes" :key="i" :name="type">
				<template #title>
					<div class="seach-game__tab-btn">
						<div class="seach-game__tab-pic">
							<svg-icon class="seach-game__tab-icon" :name="type" />
						</div>
						<div class="seach-game__tab-text">{{ getSlotTitle(type) }}</div>
					</div>
				</template>
			</van-tab>
		</van-tabs>

		<div class="seach-game__grid">
			<GameCard
				v-for="(game, i) in currentList"
				:key="i"
				:item="game"
				ratio="4 / 5"
				:tag-text="getSlotTitle(active)"
				:tag-icon="active"
				:name="game.gameName || game.gameNameEn || game.slotsName || game.name"
				@click="onItemClick"
			/>
		</div>

		<div class="seach-game__more" @click="goAll">{{ $t('more') }}</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult, getSlotTitle } from '@/utils'
import { getThirdGameList } from '@/api'
import GameCard from './GameCard.vue'
import { shouldShowCategoryTitle } from './displayRules'
import { partnerIcons } from './partnerIcons'

const useHomeHook: any = inject('useHomeHook')
const { homeState, onItemClick, getSlotList } = useHomeHook
const router = useRouter()

const active = ref('')
const slotGameTypes = ref<string[]>([])
const slotGameMap = ref<Record<string, any[]>>({})
const dynamicList = ref<any[]>([])
const activeVendor = ref<any>(null)

const currentList = computed(() => {
	if (dynamicList.value.length) return dynamicList.value
	return slotGameMap.value[active.value] || []
})
const showCategoryTitle = computed(() => shouldShowCategoryTitle('Slot'))

const fetchByVendor = async (vendorId: number) => {
	const res = await AwaitApiResult<any>(getThirdGameList({ type: vendorId }))
	if (res) {
		dynamicList.value = (res.data?.gameLists || []).slice(0, 9)
	}
}

watch(active, (val) => {
	const list = homeState.allGameList?.slot || []
	const matched = list.find((i: any) => i.vendorCode === val)
	activeVendor.value = matched
	if (matched?.vendorId) {
		fetchByVendor(matched.vendorId)
	} else {
		dynamicList.value = []
	}
})

const goAll = () => {
	const list = homeState.allGameList?.slot || []
	sessionStorage.setItem('slotGamesList', JSON.stringify(list))
	sessionStorage.setItem('gameType', JSON.stringify('slot'))
	sessionStorage.setItem('clickedItem', JSON.stringify(activeVendor.value || list[0] || {}))
	router.push({ name: 'AllOnlineGames' })
}

onMounted(async () => {
	await getSlotList()
	slotGameTypes.value = (homeState.slotsGame || []).map((item: any) => {
		slotGameMap.value[item.vendorCode] = (item.childList || []).slice(0, 9)
		return item.vendorCode
	})
	if (slotGameTypes.value.length && !active.value) {
		active.value = slotGameTypes.value[0]
	}
})
</script>

<style scoped lang="scss">
.seach-game {
	display: flex;
	flex-direction: column;
	gap: 24px;

	&__head {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text_color_L1);
		font-size: 30px;
		font-weight: 600;

		img {
			width: 40px;
			height: 40px;
			object-fit: contain;
		}
	}

	&__tabs {
		:deep(.van-tabs__wrap) {
			height: auto;
			background: transparent;

			.van-tabs__nav {
				background: transparent;
				padding: 0;
				gap: 16px;

				.van-tab {
					flex: 0 0 auto;
					padding: 0;
					height: auto;

					&--active {
						.seach-game__tab-pic {
							border-color: transparent;
							background: linear-gradient(180deg, #00d577 0%, #00e989 100%);
						}
						.seach-game__tab-icon {
							color: #fff;
						}
						.seach-game__tab-text {
							color: var(--text_color_L1);
							font-weight: 700;
						}
					}
				}

				.van-tabs__line {
					display: none;
				}
			}
		}
	}

	&__tab-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	&__tab-pic {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		border-radius: 12px;
		border: 2px solid #d1f7ff;
		box-sizing: border-box;
	}

	&__tab-icon {
		width: 64px;
		height: 48px;
		color: #6b8f7f;
	}

	&__tab-text {
		font-size: 22px;
		color: #6b8f7f;
		line-height: 1;
	}

	&__grid {
		margin-top: 8px;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	&__more {
		height: 80px;
		line-height: 80px;
		text-align: center;
		border-radius: 40px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 28px;
		font-weight: 600;
		cursor: pointer;
	}
}
</style>
