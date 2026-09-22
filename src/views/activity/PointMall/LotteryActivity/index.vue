<template>
	<div class="lotteryActivity__container">
		<NavBar :title="$t('sweepstakes')" fixed left-arrow @click-left="onClick" />

		<van-tabs
			v-model:active="pointTabActive"
			line-width="0"
			line-height="0"
			title-active-color="#fff"
			title-inactive-color="#fff"
		>
			<van-tab v-for="item in pointTabs" :name="item.value" :title="item.label"/>
		</van-tabs>
		<List
			:distance="300"
			:api="GetPointsLotteryList"
			v-model:list="list"
			v-model:page-query="pointQuery"
			:isAutoLoad="true"
			ref="listRef"
		>
			<template #content>
				<div class="lotteryActivity__container-list">
					<Treasure v-for="item of  list" :item="item" :key="item.pointsLotteryID"/>
				</div>
			</template>
		</List>
	</div>
</template>

<script setup lang="ts">
import {watch} from 'vue'
import {useRouter} from 'vue-router'
import Treasure from '@/components/Activity/PointMall/Treasure.vue'
import {useI18n} from 'vue-i18n'
import {usePointLottery} from "@/hooks";
import {GetPointsLotteryList} from "@/api";
import List from "@/components/common/List.vue";

const { t: $t } = useI18n()

const router = useRouter()
const {listRef,list,pointTabs,pointTabActive,pointQuery,pointRest}=usePointLottery()

watch(pointTabActive,()=>{
	pointRest()
	listRef.value.resetRefresh()
})
function onClick() {
	router.back()
}
</script>

<style lang="scss" scoped>
.lotteryActivity__container {

	:deep(.van-tabs) {
    .van-tabs__nav{
      background-color: var(--light-main-color, var(--bg_color_L3));
    }
	}

	:deep(.van-tabs__line) {
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: 8px solid var(--text_white,var(--text_color_L1));
		background-color: unset !important;
	}
    &-list{
		display: flex;
		flex-direction: column;
		gap:30px;
		padding: 30px 24px;
	}
	&-button {
		width: 100%;
		height: 80px;
		color: var(--main-color);
		text-align: center;
		font-size: 34px;
		line-height: 80px;
		border: 1px solid var(--main-color);
		border-radius: 9rem;
	}
	&-products {
		&__treasure {
			position: relative;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			flex-wrap: wrap;
			gap: 1rem;
			width: calc(100% - 30px);
			margin-top: 1rem;

			&-item {
				width: 100%;

				&__header,
				&__footer {
					position: relative;
					width: 100%;
				}

				&__header {
					display: flex;
					align-items: center;
					justify-content: center;
					padding-block: 20px;
					color: var(--textW);
					border-top-left-radius: 10px;
					border-top-right-radius: 10px;
					background: var(--main_gradient-color);

					& > span {
						position: absolute;
						top: 20px;
						left: 0;
						padding: 3px 20px 3px 30px;
						font-size: 0.875rem;
						border-top-right-radius: 9rem;
						border-bottom-right-radius: 9rem;
						// background: linear-gradient(270deg, #FF5353 18.36%, #FF4141 89.84%, #FF9495 96.48%, #EB2426 100%);
						z-index: 2;

						&:last-of-type {
							top: 17px;
							padding: 6px 20px 6px 33px;
							color: transparent;
							white-space: nowrap;
							// background: linear-gradient(90deg, #FF9C3A -3.24%, #FFE55C 4.63%, #FFB936 13.43%, #FFF962 76.75%);
							z-index: 1;
						}
					}
				}

				&__footer {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					padding: 10px 15px;
					border-bottom-left-radius: 10px;
					border-bottom-right-radius: 10px;
					

					&-title {
						margin-bottom: 0.5rem;
						color: var(--text_color_L1);
						font-size: 1.125rem;

						& > span {
							color: var(--main-color);
							font-weight: 700;
						}
					}

					&-progressTitle {
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						color: var(--text_color_L2);
						font-size: 0.875rem;
					}

					.van-progress {
						width: 100%;
						margin-block: 0.5rem;
					}

					&-progressDetails {
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						color: var(--text_color_L1);

						& > span {
							color: #848592;
							font-size: 0.875rem;
						}

						& > div {
							span {
								font-size: 1.125rem;
								font-weight: 600;
							}
						}
					}

					&-ending,
					&-cost {
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						height: 2rem;
						margin-block: 5px;
						border: 1px solid var(--bgColor-6);
						background-color: var(--bg_color_L2);

						& > span,
						& > div {
							display: flex;
							align-items: center;
							height: 100%;
							padding: 5px 10px;
						}

						& > span {
							flex: 0.6;
							background: var(--bgColor-6);
							clip-path: polygon(0 0, 100% 0%, 90% 100%, 0% 100%);
						}

						& > div {
							flex: 0.4;
							justify-content: flex-end;
							color: var(--main-color);
							font-size: 1.125rem;
							font-weight: 600;

							img {
								width: 1.125rem;
								height: 1.125rem;
								margin-inline: 5px;
							}
						}
					}

					&-ending {
						& > div {
							color: var(--text_color_L1);
							font-size: 1rem;
							font-weight: 500;

							& > span {
								font-size: 1.125rem;
								font-weight: 600;
							}
						}
					}

					&-button {
						width: 100%;
						margin-block: 1.5rem 1rem;
						padding-block: 5px;
						color: var(--textW);
						text-align: center;
						border-radius: 9rem;
						background: var(--norm_red-color);
					}
				}
			}

			&-button {
				width: 100%;
				padding: 8px;
				color: var(--main-color);
				text-align: center;
				font-size: 1.25rem;
				border: 1px solid var(--main-color);
				border-radius: 9rem;
			}
		}
	}
}
</style>
