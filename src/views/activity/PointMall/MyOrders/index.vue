<template>
	<div class="myOrders__container">
		<NavBar :title="$t('myOrder')" left-arrow @click-left="onClick" />

		<List
			:distance="300"
			:api="GetProductOrderList"
			v-model:list="ordersList.list"
			v-model:page-query="pageQuery"
			:isAutoLoad="true"
		>
			<template #content>
				<div class="myOrders__container-item" v-for="(item, index) in ordersList.list" :key="index">
					<div class="myOrders__container-item__header" @click="onItemClick(item)">
						<div class="myOrders__container-item__header-left">
							<img v-lazy="item.productImg" alt="" />
							<div :class="['state' + item.state]">
								{{ statusText(item.state) }}
							</div>
						</div>
						<div class="myOrders__container-item__header-right">
							<h1>{{ formatString(item.productName, 80) }}</h1>
							<div>
								<span>
									<svg-icon name="point" />
									<span>
										{{ item.integral / item.counts }}
									</span>
								</span>
								<span> x{{ item.counts }} </span>
							</div>
							<div>
								<span>{{ $t('orderTotalAmount') }}</span>
								<span>{{ item.integral }}</span>
							</div>
						</div>
					</div>
					<div class="myOrders__container-item__footer">
						<div class="myOrders__container-item__footer-top">
							<span>{{ $t('orderNo') }}</span>
							<span>{{ item.orderNumber }}</span>
							<i @click="() => copy(item.orderNumber)"><svg-icon name="copy" /></i>
						</div>
						<div class="myOrders__container-item__footer-bottom">
							<span>{{ $t('ordertime') }}</span>
							<span>{{ item.addTime }}</span>
						</div>
					</div>
				</div>
			</template>
		</List>
	</div>
</template>

<script setup lang="ts">
import { formatString, copy } from '@/utils'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import List from '@/components/common/List.vue'

import { GetProductOrderList } from '@/api'
import type { OrderItem } from '@/types/api'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()
const router = useRouter()

interface OrderListData {
	pageNo: number
	list: Array<OrderItem>
	totalCount: number
	totalPage: number
}

const pageQuery = ref({})

const ordersList = ref<OrderListData>({
	pageNo: 1,
	list: [],
	totalCount: 0,
	totalPage: 0
})

function statusText(index: number) {
	switch (index) {
		case 0:
			return $t('tobeDelivered')
		case 1:
			return $t('shipped')
		case 2:
			return $t('completed')
		case 3:
			return $t('canceled')
		default:
			return $t('tobeDelivered')
	}
}

function onClick() {
	router.back()
}

function onItemClick(item: any) {
	router.push({
		name: 'PointMall-OrderDetail',
		query: {
			orderNumber: item.orderNumber,
			orderType: item.orderType,
			orderId: item.orderId
		}
	})
}
</script>

<style lang="scss" scoped>
.myOrders__container {
	padding-inline: 24px;
	padding-block: 0 20px;
	font-family: $font-family;

	:deep(.van-nav-bar) {
		background-color: var(--bg_color_L2);

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

	&-item {
		height: 318px;
		margin-top: 20px;
		margin-bottom: 20px;
		padding: 16px 14px;
		border-radius: 20px;
		background: var(--text_color_L4);

		&__header {
			display: flex;
			gap: 12px;

			&-left {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 380px;
				height: 180px;
				border-radius: 20px;
        overflow: hidden;

				& > img {
					width: 100%;
					height: 100%;
				}

				& > div {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 38px;
          line-height: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          color:#fff;
          text-align: center;
          font-size: var(--text_color_L1);
					html:lang(ar) & {
						right: 0;
						left: auto;
					}
          &.state0 {
            background: var(--norm_green-color)
          }
          &.state1 {
            background: var(--norm_red-color)
          }
          &.state2 {
            background: var(--norm_secondary-color)
          }
          &.state3 {
            background: var(--button_dis_color)
          }
				}
			}

			&-right {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				gap: 16px;
				width: 100%;
				font-size: 28px;

				h1 {
					height: 2.2em;
					width: 100%;
					line-height: 1.1em;
					// white-space: nowrap;
					padding-right: 15px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					color: var(--text_color_L1);
				}

				& > div {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;

					span {
						display: flex;
						align-items: center;
						font-size: 30px;
						color: var(--text_color_L1);

						&:first-of-type {
							gap: 8px;
							color: var(--norm_secondary-color);

							i {
								font-size: 32px;
							}
						}
					}
				}
			}
		}

		&__footer {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-top: 12px;

			& > div {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #8c90a9;
				font-weight: 400;
				font-size: 24px;
				background-color: var(--bg_color_L3);

				span {
					flex: 1;
					height: 42px;
					padding: 0 20px;
					text-align: end;
					line-height: 50px;

					&:first-of-type {
						text-align: start;
						background: var(--HomebgLightColor);
						clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
					}
				}
			}
		}
	}
}
</style>
