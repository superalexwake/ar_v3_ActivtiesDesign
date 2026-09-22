<template>
	<div class="checkInRecord-container content">
		<NavBar :title="$t('checkInRecord')" left-arrow @click-left="onClickLeft" />
		<List
			:distance="300"
			:api="getCheckInList"
			v-model:list="recordData.list"
			v-model:page-query="pageQuery"
			:isAutoLoad="true"
		>
			<template #content>
				<div class="dailySignInRecord__container-wrapper">
					<div
						class="dailySignInRecord__container-wrapper__content"
						v-for="item in recordData.list"
						:key="item.markDayTime"
					>
						<div class="dailySignInRecord__container-wrapper__content-left">
							<h1>{{ $t('continuousCheckedIn') }}{{ item.continuousDayContinue }}{{ $t('days') }}</h1>
							<span>{{ item.markDayTime }}</span>
						</div>
						<div class="dailySignInRecord__container-wrapper__content-right">
							<img src="@public/activity/DailySignIn/coin.png" alt="" />
							<span>{{ item.amount }}</span>
						</div>
					</div>
				</div>
			</template>
		</List>
	</div>
</template>

<script setup lang="ts">
import { getCheckInList } from '@/api'
import type { ReqCheckInList } from '@/types/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import List from '@/components/common/List.vue'

const router = useRouter()

const pageQuery = ref<any>({
	pageSize: 20
})

interface MessageData {
	list: Array<ReqCheckInList>
	pageNo: number
	totalPage: number
	totalCount: number
}
const recordData = ref<MessageData>({
	list: [],
	pageNo: 0,
	totalPage: 0,
	totalCount: 0
})

function onClickLeft() {
	router.back()
}

onMounted(async () => {})
</script>

<style lang="scss" scoped>
.dailySignInRecord__container {
	padding-inline: 24px;

	&-wrapper {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-top:20px;

		&__content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: fit-content;
			padding: 19px 20px;
			border-radius: 10px;
			background: var(--darkBg,var(--bg_color_L2));
			&-left {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				gap: 8px;

				h1 {
					font-size: 30px;
					font-weight: 500;
					color: var(--darkTextW,var(--text_color_L1));
				}

				span {
					font-size: 24px;
					color: var(--text_color_L3);
				}
			}

			&-right {
				position: relative;
				display: flex;
				align-items: center;
				width: 280px;
				height: 60px;
				padding: 7px 14px;
				text-align: center;
				border-radius: 9rem;
				background: var(--main_gradient-color);

				img {
					position: absolute;
					left: 7px;
					top: 50%;
					transform: translateY(-50%);
					width: 42px;
					height: 42px;
					html:lang(ar) & {
						left: unset;
						right: 7px;
					}
				}

				span {
					flex: 1;
					font-size: 36px;
					color: var(--text_color_L4);
				}
			}
		}
	}
}
</style>
