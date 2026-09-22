<template>
	<div class="redeem__container">
		<NavBar :title="$t('exchangeGoods')" left-arrow @click-left="onClick" />

		<div class="redeem__container-hero">
			<img v-lazy="redeemItem.productImg" />
		</div>

		<div class="redeem__container-detail">
			<div class="redeem__container-detail__description">
				<h1 class="redeem__container-detail__description-header">{{ redeemItem.productName }}</h1>
				<div class="redeem__container-detail__description-body">
					<div class="redeem__container-detail__description-body__left">
						<div>
							<svg-icon name="point" />
							<span>{{ redeemItem.integral }}</span>
						</div>
						<div class="redeem__container-detail__description-body__left-box">
							<span>{{ $t('exchanged') }}</span>
							<span>{{ redeemItem.grandTotal }}</span>
						</div>
					</div>
					<div class="redeem__container-detail__description-body__right">
						<div>
							<span class="nowrap">{{ $t('goodsLeft') }}</span>
							<span>{{ currentRate }}%</span>
						</div>
						<CircleProgress :percentage="currentRate" />
					</div>
				</div>
				<van-divider dashed></van-divider>

				<div class="redeem__container-detail__description-footer">
					<svg-icon name="pointFrame" />
					{{ $t('authenticIdentification') }}
				</div>
			</div>

			<div
				class="redeem__container-detail__redeem"
				:class="{
					active: insufficientPoints
				}"
			>
				<div class="redeem__container-detail__redeem-content">
					<span> {{ $t('exchangeNo') }} </span>
					<div class="redeem__container-detail__redeem-content__amount">
						<span @click="onRedeemClick(0)">
							<svg-icon name="pointMinus" />
						</span>
						<!-- <span> {{ redeemAmount }}</span> -->
						<input
							type="digit"
							step="1"
							:placeholder="$t('plsEnterQuantity')"
							max="maxAmount"
							min="1"
							disabled
							@input="changeQuickInput()"
							:pattern="numberPattern"
							v-model="redeemAmount"
						/>

						<span @click="onRedeemClick(1)">
							<svg-icon name="pointPlus" />
						</span>
					</div>
				</div>

				<div class="redeem__container-detail__redeem-insufficient">
					<div v-if="userInfo.integral < totalPrice">{{ $t('descRedeem1') }} {{ userInfo.integral }}</div>
					<div v-else-if="redeemItem.stock === 0">{{ $t('code241') }}</div>
					<div v-else>{{ $t('noRedeemableItems') }}</div>
					<!-- <p v-if="!isValid && maxAmount > 0">{{ $t('integerRequired') }}{{ maxAmount }}.</p> -->
					<div v-show="redeemAmount > maxAmount" @click="onGetMorePoint">
						{{ $t('descRedeem2') }}<van-icon name="arrow" /><van-icon name="arrow" />
					</div>
				</div>
			</div>

			<div class="redeem__container-detail__notes">
				<h1>{{ $t('descRedeem3') }}</h1>
				<li>{{ $t('descRedeem4') }}</li>
				<li>{{ $t('descRedeem5') }}</li>
				<li>{{ $t('descRedeem6') }}</li>
				<li>{{ $t('descRedeem7') }}</li>
			</div>
		</div>

		<div class="redeem__container-button">
			<div class="redeem__container-button__left" v-if="!actionSheetShow">
				<div>
					<span>{{ $t('consumptionPoints') }}</span>
				</div>
				<div>
					<svg-icon name="point" />
					<span> {{ totalPrice }}</span>
				</div>
			</div>
			<div class="redeem__container-button__cancel" v-else @click="actionSheetShow = false">{{ $t('cancel') }}</div>

			<div
				class="redeem__container-button__right"
				:class="{
					disabled: insufficientPoints
				}"
			>
				<span v-if="!actionSheetShow" @click="actionSheetShow = true">{{ $t('exchange') }}</span>
				<span v-else @click="confirmRedeem">{{ $t('exchangeConfirm') }}</span>
			</div>
		</div>

		<van-action-sheet
			v-model:show="actionSheetShow"
			z-index="2000"
			:close-on-click-overlay="true"
			:closeable="false"
			:title="$t('exchange')"
		>
			<div class="redeem__container-actionSheet">
				<div class="redeem__container-actionSheet__note">
					<van-icon name="warning-o" />
					<p>{{ $t('descRedeem8') }}</p>
				</div>

				<div class="redeem__container-actionSheet__item">
					<div class="redeem__container-actionSheet__item-img">
						<img v-lazy="redeemItem.productImg" />
					</div>
					<p class="redeem__container-actionSheet__item-desc">
						{{ redeemItem.productName }}
					</p>
				</div>

				<div class="redeem__container-actionSheet__cost">
					{{ $t('comsumption') }} <span>{{ totalPrice }}.00 </span>{{ $t('pointsExchange') }}
				</div>

				<div class="redeem__container-actionSheet__address">
					<div class="redeem__container-actionSheet__address-header">
						<van-icon name="location" />
						<span>{{ $t('recipientAddr') }}</span>
						<div v-if="address" @click="handleGoAddress('edit')">

                        <svg-icon name = "edit" />
							<span>{{ $t('edit') }}</span>
						</div>
					</div>
					<van-divider></van-divider>
					<div v-if="address">
						<div class="redeem__container-actionSheet__address-default" v-if="address?.name">
							<div class="redeem__container-actionSheet__address-default__name">{{ address?.name }}</div>
							<div class="redeem__container-actionSheet__address-default__phone">
								{{ '+' + address?.phone }}
							</div>
							<p>
								{{ address?.address }}
							</p>
						</div>
						<div class="redeem__container-actionSheet__address-empty" v-else @click="handleGoAddress('add')">
							<img src="@public/activity/PointMall/addAddress.png" />
							<p>{{ $t('addrecipientAddr') }}</p>
						</div>
					</div>
					<div v-else>
						<div class="addAddress__container-forum__item" v-for="(item, index) in forumList">
							<h1>
                <svg-icon :name="item.icon" />
								{{ item.title }}
							</h1>
							<div class="input_model">
								<div v-if="index === 1">
									<DropDown v-model:typeValue="addressForm.area" @change-t="(area)=>addressForm.area=area"  />
								</div>
								<input
									v-if="index !== 2"
									type="text"
									v-model="addressForm[item.value]"
									:placeholder="item.placeholder"
									:maxlength="item.maxlength"
									@input="onChange"
								/>
							</div>
							<textarea
								v-model="addressForm.address"
								v-if="index === 2"
								:placeholder="$t('phEnterDetailedAddr')"
								maxlength="150"
							></textarea>
						</div>
					</div>
				</div>
			</div>
		</van-action-sheet>
		<Dialog
			v-model:show="dialogShow"
			@confirm="onCancelClick"
			:confirmText="$t('redeemDialogDesc0')"
			:showCancelBtn = "false"
			:clickOutSide = "true"
			:showCloseIcon = "true"
      		:imgUrl="redeemSuccess?'succeed':''"
		>
			<template #title>
				<h1>{{ $t('redeemDialogDesc1') }}</h1>
			</template>
			<template #content>{{ $t('redeemDialogDesc2') }}</template>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import {GetUserAddress, GetUserInfo, SetProductOrder} from '@/api'
import CircleProgress from '@/components/common/CircleProgress.vue'
import {GlobalStore, useActivityStore} from '@/stores'
import type {Product, UserAddress, UserInfo} from '@/types/api'
import { AwaitApiResult } from '@/utils'
import {computed, onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {showFailToast, showSuccessToast, showToast} from 'vant'
import Dialog from '@/components/common/Dialog.vue'
import {useI18n} from 'vue-i18n'
import DropDown from '@/components/Login/DropDown.vue'

const { t: $t } = useI18n()

const forumList = [
	{
		title: $t('recipientName'),
		icon: 'user',
		value: 'userName',
		placeholder: $t('plEnterrecipientName'),
		maxlength: 20
	},
	{
		title: $t('contactInfo'),
		icon: 'phone',
		value: 'phoneNumber',
		placeholder: $t('plEntercontactInfo'),
		maxlength: 11
	},
	{
		title: $t('shippingAddr'),
		icon: 'address',
		value: 'address',
		placeholder: $t('plEnterCity'),
		maxlength: 150
	}
]

let addressForm = reactive({
	userName: '',
	phoneNumber: '', // 不包含地区号码
	area: '66',
	address: ''
})

let redeemSuccess  = ref(false)
const globalStore = GlobalStore()
const activityStore = useActivityStore()

const dialogShow = ref(false)

const router = useRouter()

const actionSheetShow = ref(false)

const redeemAmount = ref(1)
//const maxAmount = ref(99)
const maxAmount = computed(() => {
	return redeemItem.value.stock > 99 ? 99 : redeemItem.value.stock
})
// const isValid = ref(false)

const userInfo = ref<UserInfo>({} as UserInfo)

const redeemItem = ref<Product>({} as Product)

const address = ref<UserAddress>()

const totalPrice = computed(() => redeemItem.value.integral * redeemAmount.value)

function onChange(e: Event) {
	const el = e.target as HTMLInputElement
	const reg = /[\u4e00-\u9fa5]/g
	el.value = el.value.replace(reg, '')
}

const insufficientPoints = computed(() => {
	return (
		userInfo.value.integral < totalPrice.value ||
		redeemItem.value.stock === 0 ||
		userInfo.value.integral === undefined ||
		userInfo.value.integral === 0 ||
		redeemAmount.value > 99 ||
		!Number.isInteger(redeemAmount.value)
	)
})
const numberPattern = computed(() => {
	return `^(?:[1-9]|[1-9]\\d|${maxAmount})$`
})

const currentRate = computed(() => {
	const percentage = (redeemItem.value.grandTotal / (redeemItem.value.stock + redeemItem.value.grandTotal)) * 100
	return redeemItem.value.stock > 0 ? (Math.floor(100 - percentage).toFixed(0) as number | string | null) : 0
})

function onRedeemClick(type: number) {
	if (redeemItem.value.stock === 0) return
	if (type === 0) {
		if (redeemAmount.value > 1) {
			redeemAmount.value -= 1
		}
	} else {
		redeemAmount.value += 1
	}
}
function changeQuickInput() {
	redeemAmount.value = Number(redeemAmount.value.toString().replace(/\D/g, ''))
	if (userInfo.value.integral < totalPrice.value) {
		showFailToast($t('quantityExceeded'))
	}
}

const handleGoAddress = (type: string) => {
	console.log('...address.value', { path: '/activity/pointMall/addAddress', query: { ...address.value, type: 'edit' } })
	type === 'edit'
		? router.push({ path: '/activity/pointMall/addAddress', query: { ...address.value, type: 'edit' } })
		: router.push({ path: '/activity/pointMall/addAddress', query: { type: 'add' } })
}

function onGetMorePoint() {
	router.push({
		path: '/activity/pointMall/rules'
	})
}

async function onCancelClick() {
	router.push({
		path: '/activity/pointMall/myorders'
	})
}

function onClick() {
	router.back()
}

// 验证address、phone、name是否为空
function validateParams(params: any) {
	let msg = ''
	const { name, area, phone, address } = params
	if (!name || name?.trim() === '') msg += $t('phEnterName')
	const fullPhone = '' + area + phone
	if (fullPhone.length < 10 || fullPhone.length > 14) {
		if (msg) msg += '\n'
		msg += $t('wrongTel')
	}
	if (!address || address?.trim() === '') {
		if (msg) msg += '\n'
		// msg += $t('natives.addressEmpty')
		msg += $t('addressEmpty')
	}
	if (msg) {
		showToast({
			message: msg
		})
		return false
	}
	return true
}

/**
 * @description: 确认兑换
 * @return {*}
 */
async function confirmRedeem() {
	const productInfo = activityStore.getRedeemItem
	const params = {
		name: address.value ? (address.value?.name as string) : addressForm.userName,
		address: address.value ? (address.value?.address as string) : addressForm.address,
		phone: address.value ? (address.value?.phone as string) : addressForm.phoneNumber,
		counts: redeemAmount.value,
		area: address.value ? (address.value?.area as string) : addressForm.area.replace('+', ''),
		productid: productInfo.productID
	}
	if (!validateParams(params)) return
	const res = await AwaitApiResult(SetProductOrder(params))
	if (res) {
		// showSuccessToast($t('redeemDialogDesc1'))
		actionSheetShow.value = false
		dialogShow.value = true
    redeemSuccess.value = true
	}
	initInfo()
}

/**
 * @description: 获取用户地址
 * @return {*}
 */
const getUserAddress = async () => {
	const res = await AwaitApiResult(GetUserAddress({}))
	if (res) {
		address.value = res.data
	} else {
		address.value = undefined
	}
}

async function initInfo() {
	getUserAddress()
	const userData = await GetUserInfo({ signature: 'string' })
	globalStore.setUserInfo(userData?.data)
	userInfo.value = globalStore.getUserInfo
	redeemItem.value = activityStore.getRedeemItem
}

onMounted(async () => {
	initInfo()
})
</script>

<style lang="scss" scoped>
.redeem__container {
	padding-block: 0 120px+53px;

	:deep(.dropdown) {
		position: relative;
		width: 100%;
		height: 80px;
		line-height: 80px;
    background: var(--bg_color_L1);
	}

	:deep(.van-nav-bar) {
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
  :deep(.van-action-sheet__header){
    color: var(--text_color_L1);
  }

	&-hero {
		display: grid;
		place-items: center;
		width: 100%;
		height: 562.5px;
		text-align: center;
		background: var(--bg_color_L3);

		img {
			height: 562.5px;
			width: 750px;
		}
	}

	&-detail {
		display: flex;
		flex-direction: column;
		gap: 30px;
		padding-inline: 24px;

		&__description {
			display: flex;
			flex-direction: column;
			width: 100%;
			margin-top: 1rem;
			padding: 24px 20px;
			border-radius: 10px;
			background: var(--darkBg,var(--bg_color_L2));
			

			&-header {
				margin-bottom: 29px;
				color: var(--darkTextW,var(--text_color_L1));
				font-size: 28px;
				font-weight: bold;
				height: 3.6em;
				line-height: 1.2em;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			&-body {
				display: flex;
				margin-bottom: 26.5px;

				&__left {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 27px;

					& > div {
						display: flex;
						align-items: center;

						&:first-of-type {
							gap: 14px;
							color: var(--norm_secondary-color);
							svg {
								width: 36px;
								height: 36px;
							}

							span {
								font-size: 38px;
								line-height: 38px;
							}
						}

						&:last-of-type {
							width: 360px;
							height: 42px;
							padding: 7px 20px;
							color: var(--text_color_L2);
							background-color: var(--bgDark-2,var(--bg_color_L3));

							span {
								flex: 1;

								&:first-of-type {
									display: flex;
									align-items: center;
									font-size: 22px;
									white-space: nowrap;

									&::after {
										content: '';
										display: block;
										width: 1px;
										height: 18px;
										margin-left: 64px;
										background: var(--text_color_L1);
									}
								}

								&:last-of-type {
									color: var(--text_color_L1);
									font-size: 24px;
									text-align: center;
								}
							}
						}
					}
				}

				&__right {
					position: relative;
					right: 42px-24px;
          :deep(.progress__container-content__right-content){
            border-color: var(--main-color);
          }

					div {
						&:first-of-type {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							display: flex;
							flex-direction: column;
							align-items: center;
							color: var(--main-color);
							font-size: 24px;
						}
					}

					.nowrap {
						white-space: nowrap;
					}
				}
			}

			.van-divider {
				margin: 0;
				border-color: var(--saveTextColor-3);
			}

			&-footer {
				display: flex;
				align-items: center;
				gap: 5px;
				margin-top: 20px;
				color: var(--text_color_L2);
				font-size: 24px;

				svg {
					width: 32px;
					height: 32px;
				}
			}
		}

		&__redeem {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 120px;
			padding: 35px 20px;
			border-radius: 20px;
			background: var(--darkBg,var(--bg_color_L2));
			
			transition: height 0.3s ease-in-out;

			&.active {
				height: 230px;
				overflow: hidden;

				.redeem__container-detail__redeem-insufficient {
					opacity: 1;
				}
			}

			&-content {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 50px;

				& > span {
					color: var(--darkTextW,var(--text_color_L1));
					font-size: 28px;
				}

				&__amount {
					display: flex;
					align-items: center;
					gap: 0.5rem;

					svg {
						width: 50px;
						height: 50px;

						&:active {
							transform: scale(0.9);
						}
					}

					input {
						width: 246px;
						height: 50px;
						color: var(--text_color_L1);
						font-size: 28px;
						line-height: 50px;
						text-align: center;
						border-radius: 9rem;
						background: var(--bg_color_L1);
						border: none;
					}

					span {
						&:nth-of-type(1),
						&:nth-of-type(3) {
							line-height: 1;
						}

						// &:nth-of-type(2) {
						// 	width: 246px;
						// 	height: 50px;
						// 	color: var(--text_color_L1);
						// 	font-size: 28px;
						// 	line-height: 50px;
						// 	text-align: center;
						// 	border-radius: 9rem;
						// 	background: #e7e8f0;
						// }
					}
				}
			}

			&-insufficient {
				margin-top: 18px;
				opacity: 0;
				transition: opacity 0.1s ease-in-out;

				p {
					color: var(--main-color);
				}

				div {
					font-size: 22px;

					&:first-of-type {
						color: var(--textBlueLight,var(--norm_red-color));
					}

					&:last-of-type {
						margin-top: 20px;
						color: var(--darkTextW,var(--text_color_L1));
						text-align: end;

						i {
							&:last-of-type {
								left: -8px;
							}
						}
					}
				}
			}
		}

		&__notes {
			height: 323px;
			padding: 28px 24px;
			border-radius: 20px;
			background: var(--darkBg,var(--bg_color_L2));
			h1 {
				color: var(--darkTextW,var(--text_color_L1));
				font-size: 30px;
			}

			li {
				display: flex;
				align-items: center;
				gap: 8.5px;
				height: 30px;
				margin-top: 23px;
				color: var(--text_color_L2);
				font-size: 24px;
				list-style: none;

				&::before {
					content: '';
					display: inline-block;
					width: 8px;
					height: 8px;
					border-radius: 2px;
					background: var(--darkLight2,var(--main-color));
					transform: rotate(45deg);
				}
			}
		}
	}

	&-button {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 750px;
		height: 120px;
		z-index: 3000;

		&__left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 330px;
			height: 100%;
			padding: 20px 24px;
			color: var(--light-main-color, var(--text_color_L2));
			font-size: 24px;
			background: var(--bg_color_L3);

			& > div {
				&:last-of-type {
					display: flex;
					align-items: center;
					gap: 5px;
					color: var(--light-main-color, var(--text_color_L2));
					margin-top: 16px;

					svg {
						width: 32px;
						height: 32px;
					}

					& > span {
						font-size: 26px;
					}
				}
			}
		}

		&__right,
		&__cancel {
			display: grid;
			place-items: center;
			height: 100%;
			font-size: 34px;
			font-weight: 600;
		}

		&__cancel {
			width: 330px;
			color: var(--text_color_L2);
			background: var(--bg_color_L3);
			

		}

		&__right {
			width: 420px;
			color: var(--text_color_L4);
			background: var(--main-color);

			span {
				width: 100%;
				height: 100%;
				text-align: center;
				line-height: 120px;
			}

			&.disabled {
				color: var(--text_color_L3);
				background: var(--button_dis_color);
				pointer-events: none;
			}
		}
	}

	&-actionSheet {
		padding-inline: 24px;
		padding-bottom: 150px;

		&__note {
			display: flex;
			align-items: center;
			gap: 3px;
			margin-bottom: 28px;
			color: var(--norm_red-color);
			font-size: 22px;

			i {
				font-size: 30px;
			}
		}

		&__item {
			display: flex;
			align-items: center;
			gap: 20px;
			height: 110px;
			padding: 17px 10px;
			border-radius: 6px;
			background: var(--bg_color_L3);
			
			&-img {
				display: grid;
				place-items: center;
				width: 100px;
				height: 75px;
				border-radius: 10px;
				overflow: hidden;

				img {
					width: 100px;
					height: 75px;
					object-fit: contain;
				}
			}

			p {
				color: var(--text_color_L1);
				font-size: 24px;
			}
		}

		&__cost {
			margin-block: 31px 54px;
			color: var(--text_color_L1);
			font-size: 36px;

			& > span {
				color: #e22f2f;
				font-family: 'Poppins', sans-serif;
				font-weight: 600;
			}
		}

		&__address {
			padding: 20px 14px;
			border-radius: 10px;
			background: var(--bg_color_L3);
			margin-bottom: 20px;

			&-header {
				display: flex;
				align-items: center;

				i {
					margin-right: 18px;
					color: var(--main-color);
					font-size: 48px;
				}

				& > span {
					font-size: 30px;
					color: var(--text_color_L1);
				}

				& > div {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 6px;
					width: 180px;
					height: 60px;
					margin-left: auto;
					padding: 15px 0;
					color: var(--main-color);
					font-size: 24px;
					border: 1px solid var(--main-color);
					border-radius: 9rem;

					svg {
						width: 36px;
						height:36px;

					}
				}
			}

			.van-divider {
				color: var(--gray-color-1);
			}

			&-default {
				color: var(--text_color_L1);

				& > div {
					font-size: 30px;
					margin-bottom: 0.5rem;
				}

				p {
					color: var(--text_color_L1);
					font-size: 26px;
				}
			}

			&-empty {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 28px;
				color: var(--colorText-11);
			}
		}
	}
}

.addAddress__container-forum__item {
	margin-bottom: 52px;

	h1 {
		display: flex;
		align-items: center;
		gap: 15px;
		color: var(--text_color_L1);
		font-size: 32px;

		svg {
			color: var(--main-color);
			font-size: 48px;
		}
	}

	.input_model {
		display: flex;
		align-items: flex-end;

		&>div {
			width: 200px;
			border-radius: 10px;
			background: var(--bg_color_L2);
			height: 80px;
			margin-right: 16px;
		}

		input {
			width: 100%;
			height: 80px;
			margin-top: 20px;
			padding-inline: 20px;
			font-size: 28px;
			border: none;
			border-radius: 10px;
			background: var(--bg_color_L1);
      color: var(--text_color_L1);
			

			&::placeholder {
				color: var(--text_color_L3);
			}
		}
	}

	textarea {
		width: 100%;
		height: 280px;
		margin-top: 28px;
		padding: 23px 20px;
		font-size: 28px;
		outline: none;
		border: none;
		border-radius: 10px;
		background: var(--bg_color_L1);
    color: var(--text_color_L1);
		resize: none;

		&:focus {
			outline: 1px solid var(--main-color);
		}

		&::placeholder {
			color: var(text_color_L3);
		}
	}
}

.addAddress__container-forum__item:last-child {
	margin-bottom: 10px;
}
</style>
