<template>
	<div class="subordinate__container">
		<NavBar :title="$t('addSubor')" left-arrow @click-left="onClick" />
		<div class="subordinate__container-header">
			<!-- <van-tabs class="top-tabBar" v-model:active="topActive" type="card" color="transparent" background="transparent"
				ref="tabsRef" ellipsis>
				<van-tab>
					<template #title> 直属下级 </template>
				</van-tab>
				<van-tab>
					<template #title> 全部下级 </template>
				</van-tab>
			</van-tabs> -->
			<van-tabs
				class="footer-tabBar"
				v-model:active="footerActive"
				type="card"
				color="transparent"
				background="transparent"
				ref="tabsRef"
				ellipsis
			>
				<van-tab>
					<template #title>{{ $t('code9101') }} </template>
				</van-tab>
				<van-tab>
					<template #title> {{ $t('code9102') }} </template>
				</van-tab>
				<van-tab v-if="hasP">
					<template #title> {{ $t('code9105') }} </template>
				</van-tab>
			</van-tabs>
		</div>
		<List
			v-model:list="promotionRecordList"
			v-model:page-query="pageQuery"
			:api="GetPromotionRecord"
			:distance="100"
			ref="listRef"
			:is-auto-load="isAutoLoad"
		>
			<template #content>
				<div class="subordinate__container-content">
					<div
						class="subordinate__container-content__item ar-1px-b"
						v-for="(item, index) in promotionRecordList"
						:key="index"
					>
						<div>
							<span>{{ item.bindUserName }}</span>
							<span>UID:{{ item.bindUserID }}</span>
						</div>
						<div>
							<span>{{ $t('heroDirectSub') }}</span>
							<span>{{ item.bindTime }}</span>
						</div>
					</div>
				</div>
			</template>
		</List>
	</div>
</template>
<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { GetPromotionRecord } from '@/api'
import type { ReqpromotionRecord, RespromotionRecord } from '@/types/api'
import List from '@/components/common/List.vue'
import { getDate } from '@/utils'
import dayjs from 'dayjs'
import { useSessionStorage } from '@vueuse/core'
import { computed } from 'vue'

const router = useRouter()
function onClick() {
	router.back()
}
const isAutoLoad = ref(true)
const listRef = ref()
const pageQuery = reactive<ReqpromotionRecord>({
	startDate: dayjs(getDate().today.start * 1000).format('YYYY-MM-DD HH:mm:ss'),
	endDate: dayjs(getDate().today.end * 1000).format('YYYY-MM-DD HH:mm:ss'),
	level: 1
})
let permission: any = useSessionStorage('permission', null)
permission && (permission = JSON.parse(permission.value))
const promotionRecordList = ref<RespromotionRecord[]>([])
const hasP = computed(() => {
	return permission ? permission[16] : true
})

const today = new Date() //今天
const yesterday = new Date(today) //昨天
yesterday.setDate(yesterday.getDate() - 1)

const footerActive = ref(0)
watch(footerActive, (val) => {
	switch (val) {
		case 0:
			pageQuery.startDate = dayjs(getDate().today.start * 1000).format('YYYY-MM-DD HH:mm:ss')
			pageQuery.endDate = dayjs(getDate().today.end * 1000).format('YYYY-MM-DD HH:mm:ss')
			break
		case 1:
			pageQuery.startDate = dayjs(getDate().yesterday.start * 1000).format('YYYY-MM-DD HH:mm:ss')
			pageQuery.endDate = dayjs(getDate().yesterday.end * 1000).format('YYYY-MM-DD HH:mm:ss')
			break
		case 2:
			pageQuery.startDate = dayjs(getDate().thisMonth.start * 1000).format('YYYY-MM-DD HH:mm:ss')
			pageQuery.endDate = dayjs(getDate().thisMonth.end * 1000).format('YYYY-MM-DD HH:mm:ss')
			break
	}
	listRef.value.resetRefresh()
})
// onMounted(async () => { })
</script>

<style>
:root {
	--van-tabs-card-height: auto;
}
</style>
<style lang="scss" scoped>
.subordinate__container {
	padding-inline: 24px;
	padding-bottom: 20px;

	&-header {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 750px;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		z-index: 100;
		color: var(--text_color_L1);
		padding-top: 24px;
	}

	&-content {
		display: flex;
		flex-direction: column;
		margin-top: 130px;
		margin-bottom: 30px;
		border-radius: 10px;
		background-color: var(--textW);
		padding: 0 25px;
		padding-top: 80px;
		&__item {
			padding: 25px 0;

			> div {
				color: var(--text_color_L2);
				font-weight: 400;
				font-size: 26px;
				display: flex;
				justify-content: space-between;
				//flex-direction: row;
				margin-top: 10px;
				margin-bottom: 20px;

				&:nth-of-type(2) {
					> span:nth-of-type(1) {
						color: var(--text_color_L1);
					}

					> span:nth-of-type(2) {
						color: var(--text_color_L2);
					}
				}
			}
		}
	}
}

:deep(.van-tabs) {
	background: var(--bgColor-6);
	z-index: 100;

	.van-tabs__wrap {
		
	}
}

:deep(.top-tabBar) {
	//top: 90px;
	margin-bottom: 20px;

	.van-tabs__nav--card {
		height: 60px;
		margin: 0;
		display: flex;
		gap: 20px;
		justify-content: space-between;

		.van-tab--card {
			height: 100%;
			padding: 0px 10px;
			color: var(--text_color_L2) !important;
			border-radius: 10px;
			background: var(--bgDark-2, var(--bg_color_L2));
			
			font-weight: 400;
			font-size: 26px;

			& > span {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				white-space: nowrap;
			}

			&.van-tab--active {
				color: var(--textW) !important;
				background: var(--main_gradient-color);
			}
		}
	}
}

:deep(.footer-tabBar) {
	//top: 160px;
	.van-tabs__nav--card {
		height: 88px;
		margin: 0;
		display: flex;
		justify-content: space-between;
		gap: 20px;
		border-radius: 10px;

		.van-tab--card {
			height: 100%;
			padding: 0px 10px;
			background: var(--darkBg,var(--bg_color_L2)) !important;
			font-weight: 400;
			font-size: 26px;
			color: var(--text_color_L2) !important;
			border-radius: 16px;

			& > span {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				white-space: nowrap;
			}

			&.van-tab--active {
				color: var(--text_color_L4) !important;
				background: var(--main_gradient-color) !important;
				position: relative;

				&::after {
					content: ' ';
					position: absolute;
					left: 0;
					bottom: 0;
					right: 0;
					height: 1px;
				}
			}
		}
	}
}

@media screen and (max-width: 500px) {
	.subordinate__container-header {
		max-width: none;
	}
}
</style>
