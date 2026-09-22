<template>
	<div class="orderDetail__container">
		<div class="orderDetail__container-header">
			<NavBar
			:title="$t('myOrder')"
			:placeholder="false"
			left-arrow
			@click-left="onClick"
		/>
			<div class="orderDetail__container-header__content">
				<div>
					<h1>{{ statusText(orderItem.state) }}</h1>
					<p v-if="orderItem.state === 3">{{ $t('ordercancle') }}</p>
					<p v-else-if="orderItem.state === 1">{{ $t('orderShipped') }}</p>
					<p v-else-if="orderItem.state === 2">{{ $t('orderCompleted') }}</p>
					<p v-else-if="orderItem.state === 0">{{ $t('descActivity4') }}</p>
				</div>
				<img :src="getStatusImg(orderItem.state)" alt="" />
			</div>
		</div>

		<div class="orderDetail__container-content">
			<div class="orderDetail__container-content__itemDetail">
				<div class="orderDetail__container-content__itemDetail-header">
					<svg-icon name="pointDetail" />
					<h1>{{ $t('productDetail') }}</h1>
				</div>
				<div class="orderDetail__container-content__itemDetail-body">
					<div class="orderDetail__container-content__itemDetail-body__top">
						<div>
							<img v-lazy="orderItem.productImg" alt="" />
						</div>
						<div>
							<h1>{{ orderItem.productName }}</h1>
							<div>
								<span>
									<svg-icon name="point" />
									<span>
										{{ orderItem.integral / orderItem.counts || 0 }}
									</span>
								</span>
								<span> x{{ orderItem.counts }} </span>
							</div>
							<div>
								<span>{{ $t('orderTotalAmount') }}</span>
								<span class="colorf95959"
									>
									<svg-icon name="point" /> &hairsp;&hairsp;{{
										orderItem.integral
									}}
								</span>
							</div>
						</div>
					</div>
					<div class="orderDetail__container-content__itemDetail-body__footer">
						<div>
							<span>{{ $t('orderNo') }}</span>
							<span>{{ orderItem.orderNumber }}</span>
							<i @click="() => copy(orderItem.orderNumber)"><svg-icon name="pointCopy" /></i>
						</div>
						<div class="myOrders__container-item__footer-bottom">
							<span>{{ $t('ordertime') }}</span>
							<span>{{ orderItem.addTime }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="orderDetail__container-content__address">
				<div class="orderDetail__container-content__address-header">
					<van-icon name="location" />
					<h1>{{ $t('recipientAddr') }}</h1>
				</div>
				<div class="orderDetail__container-content__address-body" v-if="address">
					<div>{{ address?.name }}</div>
					<div>+{{address?.phone.startsWith(address?.area)?'':address?.area}}{{ address?.phone }}</div>
					<p>
						{{ address?.address }}
					</p>
				</div>
			</div>

			<div class="orderDetail__container-content__orderDetail">
				<div class="orderDetail__container-content__orderDetail-header">
					<svg-icon name="pointDetail" />
					<h1>{{ $t('orderDetail') }}</h1>
				</div>
				<div class="orderDetail__container-content__orderDetail-body">
					<div class="orderDetail__container-content__orderDetail-body__item">
						<span>{{ orderItem.addTime }}</span>
						<span>{{ $t('orderSuccess') }}</span>
					</div>
					<div class="orderDetail__container-content__orderDetail-body__item">
						<span>{{ orderItem.upTime }}</span>
						<span>{{ statusText(orderItem.state) }}</span>
					</div>
				</div>
			</div>

			<div class="orderDetail__container-content__btn">
				<div
					@click="onOrderCancel"
					class="orderDetail__container-content__btn-cancel"
					v-if="orderItem.state !== 3 && orderItem.state !== 1 && orderItem.state !== 2&&OrderCancel"
				>
					{{ $t('concelOrder') }}
				</div>
				<div @click="router.push({ name: 'CustomerService' })">{{ $t('contactServicer') }}</div>
			</div>
		</div>

		<Dialog
			v-model:show="orderCancelDialogShow"
			:cancelText="$t('cancel')"
			:confirmText="$t('confirm')"
			@confirm="onOrderCancelClick"
		>
			<template #title>
				<h1>{{ $t('tipWeatherToCancel') }}</h1>
			</template>
		</Dialog>

		<Dialog
			v-model:show="orderCancelResultDialogShow"
			@confirm="orderCancelResultDialogShow = false"
			:confirmText="$t('confirm')"
			:show-cancel-btn="false"
			:title="cancelable ? $t('orderCanceled') : $t('tipUnableToConcel')"
		>

		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { GetProductOrderDetails, CancelOrderData, GetUserAddress } from '@/api'
import { GlobalStore } from '@/stores'
import type { OrderItem, UserAddress } from '@/types/api'
import { useActivityStore } from '@/stores'
import { AwaitApiResult, copy, fixMsg } from '@/utils'
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import Dialog from '@/components/common/Dialog.vue'
import { getStatusImg, statusText } from './orderUtil'

const router = useRouter()
const globalStore = GlobalStore()
const activityStore = useActivityStore()
const address = ref<UserAddress>()

interface OrderDetail {
	address: string
	upTime: string
}

const orderItem = ref<OrderItem & OrderDetail>({} as OrderItem & OrderDetail)

const orderCancelDialogShow = ref(false)

const orderCancelResultDialogShow = ref(false)
const route=useRoute()
const getUserAddress = async () => {
	const orderType= (route.query.orderType as string) || '';
	const orderId= (route.query.orderId as string) || ''
	const res = await AwaitApiResult(GetUserAddress({
		orderId:Number(orderId),
		orderType:Number(orderType),
	}))
	if (res) {
		address.value = res.data
	}
}

// const orderDetailList = [
// 	{
// 		time: '2021-09-09 12:00:00',
// 		status: $t('orderSuccess')
// 	},
// 	{
// 		time: '2021-09-09 12:00:00',
// 		status: $t('orderCanceled')
// 	},
// 	{
// 		time: '2021-09-09 12:00:00',
// 		status: $t('orderShipped')
// 	},
// 	{
// 		time: '2021-09-09 12:00:00',
// 		status: $t('orderCompleted')
// 	}
// ]

const cancelable = ref(false)

function getOrderResultImg(result: boolean) {
	if (result) {
		return 'orderCancelSuccess'
	} else {
		return 'orderCancelWarn'
	}
}
const OrderCancel=computed(()=>{
	const orderType=route.query.orderType as string
	return orderType!=='2'
})
function onOrderCancel() {
	if (orderItem.value.state === 3) {
		// #TODO:完善逻辑
		// ...
		return
	}
	orderCancelDialogShow.value = true
}

function onClick() {
	router.back()
}

async function onOrderCancelClick() {
	console.log(orderItem.value.state)
	if (orderItem.value.state === 0) {
		// const res = await AwaitApiResult(
		// 	CancelOrderData({
		// 		orderNumber: orderItem.value.orderNumber
		// 	})
		// )
		CancelOrderData({ orderNumber: orderItem.value.orderNumber })
			.then((res: any) => {
				if (res.code == 0) {
					cancelable.value = true
					orderItem.value.state = 1
					orderCancelResultDialogShow.value = true
					getInfo()
				} else {
					cancelable.value = false
					orderItem.value.state = 1
					orderCancelResultDialogShow.value = true
					getInfo()
				}
				orderCancelDialogShow.value = false
			})
			.catch((e) => {
				fixMsg(e)
			})
		//console.log('状态', res.code)

		// if (!res) {
		// 	cancelable.value = true
		// 	orderItem.value.state = 1
		// 	orderCancelResultDialogShow.value = true
		// 	getInfo()
		// }
		// else {
		// 	cancelable.value = false
		// 	orderItem.value.state = 1
		// 	orderCancelResultDialogShow.value = true
		// 	getInfo()
		// }
	}
	orderCancelDialogShow.value = false
}
async function getInfo() {
	const orderNumber = (route.query.orderNumber as string) || '';
	const orderType= (route.query.orderType as string) || '';
	const orderId= (route.query.orderId as string) || ''
	const res = await AwaitApiResult(
		GetProductOrderDetails({
			orderNumber: orderNumber,
			orderId:Number(orderId),
			orderType:Number(orderType),
		})
	)
	if (res) {
		orderItem.value = res.data
	}
	getUserAddress()
}

onMounted(async () => {
	getInfo()
})
</script>

<style lang="scss" scoped>
.orderDetail__container {
	padding-block: 0 112px;
	font-family: $font-family;
	&-header {
		position: relative;
		width: 100%;
		height: 360px;
		background: var(--main_gradient-color);

		&__content {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding-inline: 24px 93px;
			color: var(--text_color_L4);

			h1 {
				margin-bottom: 24px;
				font-size: 36px;
				font-weight: 600;
			}

			p {
				font-size: 26px;
			}

			img {
				width: 300px;
				//height: 160px;
			}
		}
	}

	&-content {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: -65px;
		padding-inline: 24px;

		&__itemDetail {
			padding: 27px 10px;
			background: var(--bg_color_L2);
      color: var(--text_color_L1);
			border-radius: 20px;
			

			&-header {
				display: flex;
				align-items: flex-start;
				
				svg{
					width: 48px;
					height: 48px;
					margin-right: 0.2rem;
					
				}
				h1 {
					width: 100%;
					padding-bottom: 17.5px;
					font-size: 32px;
					font-weight: bold;
					border-bottom: 1px solid var(--Dividing-line_color);
				}

				i {
					margin-right: 0.2rem;
					font-size: 48px;
				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				margin-top: 30.5px;

				&__top {
					display: flex;
					gap: 12px;

					& > div {
						&:first-of-type {
							display: flex;
							flex-shrink: 0;
							align-items: center;
							justify-content: center;
							width: 240px;
							height: 180px;
							border-radius: 20px;
							background: var(--bg_color_L3);

							img {
								width: 100%;
								height: 100%;
							}
						}

						&:last-of-type {
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							gap: 22px;
							width: 100%;

							h1 {
								font-size: 28px;
								line-height: 28px;
								line-height: 1.2;
							}

							& > div {
								display: flex;
								align-items: center;
								justify-content: space-between;
								width: 100%;

								.colorf95959 {
									color: var(--norm_red-color) !important;
								}

								span {
									display: flex;
									align-items: center;
									font-size: 28px;
									line-height: 28px;
									svg{
										width: 32px;
										height: 32px;
									}
									&:first-of-type {
										gap: 6px;
										color: var(--norm_secondary-color);

										i {
											font-size: 32px;
										}

										span {
											font-size: 30px;
										}
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
						align-items: center;
						justify-content: space-between;
						color: #8c90a9;
						font-weight: 500;
						font-size: 24px;
						background-color: var(--bg_color_L3);

						&:first-of-type {
							padding-right: 0.5rem;

							span {
								&:last-of-type {
									padding-right: 0.25rem;
								}
							}

							i {
								font-size: 24px;
							}
						}

						span {
							flex: 1;
							padding: 7px 20px;
							text-align: end;

							&:first-of-type {
								text-align: start;
								background: var(--activityBg3);
								clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
							}
						}
					}
				}
			}
		}

		&__address {
			padding: 30px 21px;
			color: var(--text_color_L1);
			background: var(--bg_color_L2);
			border-radius: 20px;
			

			&-header {
				display: flex;
				align-items: flex-start;

				h1 {
					width: 100%;
					padding-bottom: 17.5px;
					font-size: 32px;
					font-weight: bold;
					border-bottom: 1px solid var(--Dividing-line_color);
				}

				i {
					margin-right: 5px;
					color: var(--main-color);
					font-size: 48px;
					
				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 19px;
				margin-top: 41.5px;
				font-size: 30px;

				p {
					color: var(--text_color_L2);
					font-size: 26px;
				}
			}
		}

		&__orderDetail {
			padding: 30px 11px;
			color: var(--text_color_L1);
			background: var(--bg_color_L2);
			border-radius: 20px;
			

			&-header {
				display: flex;
				align-items: flex-start;
				font-size: 1.125rem;
				svg{
					width: 48px;
					height: 48px;
					margin-inline-end: .2rem;
				}
				h1 {
					width: 100%;
					padding-bottom: 17.5px;
					font-size: 32px;
					font-weight: bold;
					border-bottom: 1px solid var(--Dividing-line_color);
				}

				i {
					margin-right: 5px;
					color: var(--main-color);
					font-size: 48px;
					
				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 47px;
				margin-top: 41.5px;

				&__item {
					display: flex;
					align-items: center;
					justify-content: space-between;

					span {
						color: var(--text_color_L2);
						font-size: 26px;
					}

					&:first-of-type {
						span {
							&:last-of-type {
								color: var(--main-color);
							}
						}
					}
				}
			}
		}

		&__btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 28px;
			width: 100%;
			padding-inline: 45px;

			&-cancel {
				color: var(--text_color_L4);
				background: var(--main_gradient-color);
			}

			div {
				border-radius: 9rem;
				width: 100%;
				height: 70px;
				text-align: center;
				line-height: 70px;

				&:last-of-type {
					color: var(--main-color);
					border: 1px solid var(--main-color);
				}
			}
		}
	}
}
</style>
