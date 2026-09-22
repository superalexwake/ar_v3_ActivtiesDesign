<template>
	<div class="myInvitation__container">
		<NavBar :title="$t('myInvitation')" left-arrow @click-left="onClick" />
		<SearchBar :placeholder="$t('searchSubUID')" v-model:value="value" @handleSearch="handleSearch" />
		<div class="myInvitation__container-searchbar">
			<ArSelect
				@click-select="showPickerRegister = !showPickerRegister"
				:selectName="currentDate?.typeName || $t('time')"
			></ArSelect>
			<ArSelect
				@click-select="showPickerLevel = !showPickerLevel"
				:selectName="currentLevel.key || $t('selectLevel')"
			></ArSelect>
		</div>

		<div class="myInvitation__container-content">
			<List
				v-model:list="inviList"
				v-model:page-query="pageQuery"
				:api="getPromotionMytem"
				:distance="100"
				ref="listRef"
				@pageChange="getChange"
				:is-auto-load="isAutoLoad"
			>
				<template #content>
					<div class="myInvitation__container-content__item" v-for="(item, index) in inviList" :key="index">
						<div class="myInvitation__container-content__item-header">
							<span
								:class="{
									inactive: item.userState !== 1
								}"
								>{{ $t(getArrayKey(rootConfig.StatusType, item.userState)) }}</span
							>
							<span>{{ item.lv }}{{ $t('level') }}</span>
						</div>
						<div class="myInvitation__container-content__item-body">
							<div>
								<span>{{ $t('nickName') }}</span>
								<span>{{ item.nickName }}</span>
							</div>
							<div>
								<span>UID</span>
								<span>{{ item.userID }}</span>
							</div>
							<div>
								<span>{{ $t('betRebateAmount') }}</span>
								<span>{{ item.rebateAmount }}</span>
							</div>
						</div>
					</div>
				</template>
			</List>
		</div>
		<van-popup v-model:show="showPickerRegister" round position="bottom">
			<van-picker
				:columns-field-names="{ text: 'typeName', value: 'type', children: 'children' }"
				:columns="SelectTimeList"
				@cancel="showPickerRegister = false"
				@confirm="onItemClickTime"
			/>
		</van-popup>
		<van-popup v-model:show="showPickerLevel" round position="bottom">
			<van-picker
				:columns-field-names="{ text: 'key', value: 'value', children: 'children' }"
				:columns="levelTypes"
				@cancel="showPickerLevel = false"
				@confirm="onItemClick"
			/>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { rootConfig } from '@/utils/selectArr/rootConfig'
import SearchBar from '@/components/SearchBar/index.vue'
import List from '@/components/common/List.vue'
import { reactive } from 'vue'
import type { PromotionMytemData, PromotionMytemList, ReqPromotionMytem } from '@/types/api'
import { dateRange1, getArrayKey } from '@/utils'
import { getPromotionMytem } from '@/api'
import { getDateTimeScopeTypes } from '@/api/modules/common'
import type { SelectTimeType } from '@/types/api/interface/selectType.js'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const { t } = useI18n()
const showPickerRegister = ref(false)
const showPickerLevel = ref(false)
const listRef = ref()
const { minDate, maxDate } = dateRange1()
const pageQuery = reactive<ReqPromotionMytem>({
	startDate: dayjs(minDate).format('YYYY-MM-DD HH:mm:ss'),
	endDate: dayjs(maxDate).format('YYYY-MM-DD HH:mm:ss'),
	lv: -1,
	myTemId: 0
})
const inviList = ref<PromotionMytemList[]>([])
const router = useRouter()
const SelectTimeList = ref<SelectTimeType[]>([])
const value = ref('')
const currentDate = ref<SelectTimeType>()

const levelTypes = rootConfig.levelTypes.map((v: any) => {
	if (v.value == -1) {
		v.key = t(v.key)
	}
	v.key = t(v.key, [v.value])
	console.log(t(v.key))
	return v
})
const currentLevel = ref(levelTypes[0])
const isAutoLoad = ref(true)

onMounted(() => {
	getTimeList()
})

const getTimeList = async () => {
	const data = await getDateTimeScopeTypes()
	let newList = data.typeList.filter((p: any) => {
		p.typeName = t('code' + p.typeNameCode)
		return p.type != 1 && p.type != 4 && p.type != 7
	})

	newList.unshift({ type: -1, typeName: t('all'), startTime: new Date(minDate), endTime: new Date(maxDate) })
	SelectTimeList.value = newList
}

const onItemClick = async ({ selectedOptions }: any) => {
	pageQuery.lv = selectedOptions[0].value
	currentLevel.value = selectedOptions[0]
	showPickerLevel.value = false
	listRef.value.resetRefresh()
}

const onItemClickTime = (val: any) => {
	let value = { ...val.selectedOptions[0] } as SelectTimeType
	currentDate.value = value
	if (value.type == -1) {
		pageQuery.startDate = dayjs(value.startTime).format('YYYY-MM-DD HH:mm:ss')
		pageQuery.endDate = dayjs(value.endTime).format('YYYY-MM-DD HH:mm:ss')
	} else {
		pageQuery.startDate = value.startTime + ''
		pageQuery.endDate = value.endTime + ''
	}

	showPickerRegister.value = false
	listRef.value.resetRefresh()
}

const handleSearch = () => {
	if (value.value) {
		pageQuery.myTemId = Number(value.value)
	} else {
		pageQuery.myTemId = 0
	}
	listRef.value.resetRefresh()
}

const getChange = (obj: PromotionMytemData) => {
	console.log(obj)
}

function onClick() {
	router.back()
}
</script>

<style lang="scss" scoped>
.myInvitation__container {
	padding-inline: 24px;
	padding-block: 0 112px;
	font-family: $font-family;

	:deep(.van-nav-bar) {
		background-color: #F6F6F6;

		.van-nav-bar__content {
			.van-nav-bar__left {
				.van-icon {
					color: var(--text_color_L1);
				}
			}

			.van-nav-bar__title {
				color: var(--text_color_L1);
			}
		}
	}

	&-searchbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 22px;
		width: 100%;
		font-size: 28px;
		margin-top: 20px;

		span {
			color: var(--text_color_L2);
		}

		.default_active {
			color: var(--text_color_L2);
		}

		&__selector {
			position: relative;
			display: flex;
			width: 340px;
			height: 80px;
			color: var(--text_color_L2);

			& > div {
				width: 100%;
				line-height: 80px;
				border-radius: 10px;
				background: var(--bg_color_L2);
				

				&:first-of-type {
					position: relative;
					padding: 0 20px;
					z-index: 10;

					i {
						position: absolute;
						top: 50%;
						right: 16px;
						transform: translateY(-50%);
						transition: all 0.2s ease-in-out;
					}
				}
			}

			&-dropdown {
				position: absolute;
				top: 100%;
				transform: translateY(-10%);
				opacity: 0;
				visibility: hidden;
				z-index: 9;
				border: 1px solid var(--text_color_L1);
				overflow: hidden;
				transition: all 0.2s ease-in-out;

				li {
					padding: 0 20px;
					list-style: none;

					&.selected {
						color: var(--textW);
						background-color: var(--norm_red-color);
					}
				}
			}

			&.active {
				& > div {
					&:first-of-type {
						i {
							transform: translateY(-50%) rotate(180deg);
							transform-origin: center;
						}
					}

					&:last-of-type {
						transform: translateY(0%);
						opacity: 1;
						visibility: visible;
						z-index: 1;
					}
				}
			}
		}

		& > i {
			font-size: 1.625rem;
		}
	}

	&-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 42px;

		&__item {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 24px 10px;
			border-radius: 10px;
			background-color: var(--textW);
			
			margin-bottom: 20px;

			&-header {
				display: flex;
				align-items: center;
				gap: 10px;

				span {
					width: 150px;
					height: 50px;
					font-size: 28px;
					text-align: center;
					line-height: 50px;
					border-radius: 10px;

					&:first-of-type {
						margin-left: 10px;
						color: var(--textW);
						background: var(--norm_green-color);
					}

					&:nth-of-type(2) {
						color: var(--main-color);
						border: 1px solid var(--main-color);
					}

					&:last-of-type {
						margin-left: auto;
					}

					&.inactive {
						background: var(--main-color);
					}
				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 10px;
				font-size: 24px;
				color: var(--text_color_L3);

				& > div {
					display: flex;
					align-items: center;
					justify-content: space-between;
					background-color: #F6F6F6;

					&:last-of-type {
						span {
							&:last-of-type {
								color: var(--main-color);
							}
						}
					}

					span {
						height: 60px;
						padding: 0 20px;
						line-height: 60px;

						&:first-of-type {
							flex: 0.45;
							background: var(--bgColor-6);
							clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
						}

						&:last-of-type {
							flex: 0.55;
							text-align: right;
						}
					}
				}
			}
		}
	}
}

.look_detail {
	color: var(--text_color_L1);
}
</style>
