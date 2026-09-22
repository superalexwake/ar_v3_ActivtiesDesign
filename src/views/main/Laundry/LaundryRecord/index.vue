<template>
	<div class="Laundry-Record">
		<NavBar :title="t('laundryRecord')" left-arrow @click-left="router.go(-1)" />
		<van-sticky :offset-top="46" :container="containerRef" class="bet-container-sticky">
			<div style="background-color: #f7f8ff">
				<NavTab
					:list="rootConfig.gameTabList"
					v-model:active="active"
					tabClassName="tabs"
					v-slot="{ item, index }"
					@onClickTab="onClickTab"
					activeClassName="tab_active"
					ref="tabRefs"
					tabItemClassName="funtab_item"
				>
					<div class="tab_item" :class="{ tab_active: index === active }">
						<svg-icon :name="item.img" />
						<span>{{ item.name }}</span>
					</div>
				</NavTab>
			</div>
		</van-sticky>
		<div class="list">
			<List
				:distance="300"
				:api="GetCodeWashRecordList"
				v-model:list="ReceiveList.list"
				v-model:page-query="pageQuery"
				v-model:is-first="isFirst"
				ref="listRef"
				:isAutoLoad="true"
			>
				<template #content>
					<div class="item" v-for="(item, index) in ReceiveList.list" :key="index">
						<div class="header">
							<div class="">
								<p class="name">{{ getType(item.codeType) }}</p>
								<span class="time"> {{ item.addTime }} </span>
							</div>
							<div class="state">{{ t('laundrySuccess') }}</div>
						</div>
						<div class="body">
							<div class="left">
								<div class="imgBox"><img class="img" src="@icon/main/gameStatsSteps.png" alt="" /></div>
								<div>
									<p>{{ t('laundryAmount') }}</p>
									<p>{{ t('laundryRate') }}</p>
									<p>{{ t('rebateAmount') }}</p>
								</div>
							</div>
							<div class="right">
								<p>{{ item.washVolume }}</p>
								<p class="red">{{ item.washRate }}%</p>
								<p class="orange">{{ item.rebateAmount }}</p>
							</div>
						</div>
					</div>
				</template>
			</List>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { rootConfig } from '@/utils/selectArr/rootConfig'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { GetCodeWashRecordList } from '@/api'
import type { ReqCodeWashRecordList, ResCodeWashRecordList } from '@/types/api'

import NavTab from '@/components/FunTab/NavBar.vue'
import List from '@/components/common/List.vue'

const { t } = useI18n()

const router = useRouter()

const listRef = ref()
const containerRef = ref<HTMLElement>(null as any)
const active = ref(0)

const onClickTab = async (val: any) => {
	console.log(active.value)
	let type = rootConfig.gameTabList[active.value].codeType
	pageQuery.value.codeType = type
	isFirst.value = true
	data.pageNo = 1
	ReceiveList.list = []
	await listRef.value.resetRefresh()
}

const data = reactive<ReqCodeWashRecordList>({
	pageNo: 1,
	pageSize: 10,
	codeType: -1
})

const ReceiveList = reactive<ResCodeWashRecordList>({
	list: [],
	pageNo: 0,
	totalPage: 0,
	totalCount: 0
})

const isFirst = ref(true)
const pageQuery = ref<any>({
	codeType: -1
})

// 获取游戏分类显示
function getType(type: number) {
	let name = ''
	rootConfig.gameTabList.map((ele: any) => {
		if (ele.codeType == type) {
			name = ele.name
		}
	})
	return name
}
</script>

<style scoped lang="scss">
.Laundry-Record {
	overflow: hidden;
	padding: 0 24px;

	:deep(.navbar-right) {
		width: 45px;
	}

	:deep(.van-nav-bar) {
		background-color: #F6F6F6;

		.van-nav-bar__content {
			.van-nav-bar__left {
				.van-icon {
					color: var(--text_color_L1);
				}
			}
		}
	}

	//:deep(.van-tabs__wrap) {
	// margin-top: -8px;
	//}
	.bet-container__header {
		background-color: #F6F6F6;
		position: relative;
	}

	&-searchBar {
		margin-top: -10px;
		padding-bottom: 18px;
	}

	.tabs {
		background: var(--bg_color_L1);
		height: 140px;
	}

	.tab_item {
		width: 190px;
		height: 100px;
		margin-inline: 5px;
		padding: 0;
		color: var(--text_color_L2) !important;
		border-radius: 10px;
		background: var(--bg_color_L2);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		

		svg,img {
			height: 50px;
			width: 50px;
		}

		span {
			font-size: 24px;
		}
	}

	.tab_active {
		color: var(--text_color_L4) !important;
		background: var(--main_gradient-color);
	
	}

	::v-deep(.fun-tabs .fun-tab-item) {
		padding: 14px 0;
	}

	&-tabBar {
		padding-inline: 24px;

		:deep(.van-tabs__nav--card) {
			height: 140px;
			margin: 0;

			.van-tab--card {
				width: 190px;
				height: 100px;
				margin-inline: 5px;
				padding: 0;
				color: var(--text_color_L2) !important;
				border-radius: 10px;
				background: var(--bgDark-2, var(--bg_color_L2));
				box-shadow: var(--BoxShadowColor-42);

				& > span {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;

					img {
						width: 50px;
						height: auto;
					}

					span {
						font-size: 24px;
					}
				}

				&.van-tab--active {
					color: var(--textW) !important;
					background: var(--main_gradient-color);
					box-shadow: var(--BoxShadowColor-42);
				}
			}
		}
	}

	.list {
		margin-top: 20px;

		.item {
			margin-bottom: 20px;
			background: var(--bg_color_L2);
			
			border-radius: 10px;
			padding: 15px;

			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 10px;
				margin-bottom: 15px;
				border-bottom: 1px solid var(--Dividing-line_color);

				.name {
					font-size: 30px;
					font-weight: bold;
					color: var(--text_color_L1);
					margin-bottom: 15px;
				}

				.time {
					font-size: 22px;
					color: var(--text_color_L3);
				}

				.state {
					font-size: 28px;
					color: #40c592;
				}
			}

			.body {
				display: flex;
				justify-content: space-between;

				.left {
					display: flex;
					justify-content: space-between;
					color: var(--text_color_L3);
					font-size: 24px;
					height: 180px;

					.imgBox {
						padding: 15px 0;
						margin-right: 15px;

						.img {
							height: 100%;
						}
					}

					div {
						& > p {
							line-height: 60px;
							color: var(--text_color_L2);
						}
					}
				}

				.right {
					text-align: right;

					& > p {
						line-height: 60px;
						font-size: 24px;
						color: var(--text_color_L1);

						&.red {
							color: var(--norm_red-color);
						}

						&.orange {
							color: var(--norm_secondary-color);
						}
					}
				}
			}
		}
	}
}
</style>
