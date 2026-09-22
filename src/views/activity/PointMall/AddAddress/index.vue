<template>
	<div class="addAddress__container">
		<NavBar :title="$t('addAddr')" :placeholder="false" left-arrow @click-left="onClick" />

		<div class="addAddress__container-warning">
			<h1>
				<van-icon name="warning" />
				{{ $t('kindTips') }}
			</h1>
			<p>{{ $t('descActivity3') }}</p>
		</div>

		<div class="addAddress__container-forum">
			<div class="addAddress__container-forum__item" v-for="(item, index) in forumList">
				<h1>
          <svg-icon :name="item.icon" />
					{{ item.title }}
				</h1>
				<div class="input_model">
					<div v-if="index === 1" class="dropCon">
						<DropDown v-model:typeValue="addressForm.area" @change-t="(area)=>addressForm.area=area" />
					</div>
					<input
						v-if="index === 0"
						type="text"
						v-model="addressForm[item.value]"
						:placeholder="item.placeholder"
						:maxlength="item.maxlength"
					/>
					<input
						v-if="index === 1"
						type="text"
						v-only-num
						v-model="addressForm[item.value]"
						:placeholder="item.placeholder"
						:maxlength="item.maxlength"
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

		<div class="addAddress__container-saveBtn" @click="onSaveBtnClick" :class="{ disabled: !addressForumValidate }">
			{{ $t('save') }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { AwaitApiResult } from '@/utils'
import { useI18n } from 'vue-i18n'
import DropDown from '@/components/Login/DropDown.vue'
import { UpdateUserAddress,UpdatePointLotteryUserAddress,AddPointsLotteryUserAddress } from '@/api'
import { showSuccessToast } from 'vant'
import { onMounted } from 'vue'
const { t: $t } = useI18n()

const router = useRouter()
const route=useRoute()
let addressForm = reactive({
	userName: '',
	phoneNumber: '',
	area: '66',
	address: ''
})

onMounted(() => {
	if (Object.keys(route.query).length===0)return;
	if (route.query.type && route.query.type === 'edit') {
		addressForm.userName = router.currentRoute.value.query.name as string
		addressForm.phoneNumber = router.currentRoute.value.query.phone as string
		addressForm.address = router.currentRoute.value.query.address as string
		addressForm.area = router.currentRoute.value.query.area as string
	}
	addressForm.phoneNumber = addressForm.phoneNumber.replace(addressForm.area, '')
})

const addressForumValidate = computed(() => {
	return addressForm.userName && addressForm.phoneNumber && addressForm.address
})

/**
 * @description: input 输入框信息
 * @return {*}
 */
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

function onClick() {
	router.back()
}

/**
 * @description: 点击保存地址
 * @return {*}
 */
async function onSaveBtnClick() {
	if (!addressForumValidate.value) {
		return
	}
	const form=route.query.form;
	const type=route.query.type;
	const AddressId=route.query.addressId as string;
	const address:any={
		"phone": addressForm.phoneNumber,
		"address": addressForm.address,
		"name": addressForm.userName,
		 area: addressForm.area,
	}
	if (form==='lotteryPoint'&&type==='edit'){
		address.userAddressId=parseInt(AddressId,10)
		const res = await AwaitApiResult(UpdatePointLotteryUserAddress(address))
		if (res) {
			showSuccessToast($t('savedSuccessfully'))
			router.back()
		}
		return
	}else if (form==='lotteryPoint'&&type==='add'){
		const res = await AwaitApiResult(AddPointsLotteryUserAddress(address))
		if (res) {
			showSuccessToast($t('savedSuccessfully'))
			router.back()
		}
		return
	}
	let data = {
		...addressForm,
		area: addressForm.area
	}
	const res = await AwaitApiResult(UpdateUserAddress(data))
	if (res) {
		showSuccessToast($t('savedSuccessfully'))
		router.back()
	}
}
</script>

<style lang="scss" scoped>
.addAddress__container {
	padding-inline: 24px;
	padding-bottom: 50px;
	font-family: $font-family;

	&-warning {
		margin-top: 15px;
		width: 702px;
		height: max-content;
		margin-bottom: 55px;
		padding: 20px 23px;
		border: 1px solid var(--bg_color_L3);
		border-radius: 10px;

		h1 {
			display: flex;
			align-items: center;
			gap: 5px;
			margin-bottom: 20px;
			color: var(--norm_red-color);
			font-size: 24px;
			line-height: 29px;

			i {
				color: var(--reminderIcon);
				font-size: 36px;
			}
		}

		p {
			padding-left: 62px;
			color: var(--norm_red-color);
			font-size: 22px;
			line-height: 28px;
		}
	}

	&-forum {
		display: flex;
		flex-direction: column;
		gap: 95px;

		&__item {
			h1 {
				display: flex;
				align-items: center;
				gap: 15px;
				color: var(--text_color_L1);
				font-size: 32px;
				margin-bottom: 20px;
				svg {
					color: var(--main-color);
					font-size: 48px;
				}
			}

			.input_model {
				display: flex;
				//align-items: flex-end;
                :deep(.dropdown){
					line-height: 80px;
					height: 80px;
				}
				.dropCon {
					width: 186px;
					border-radius: 10px;
					background: var(--bg_color_L2);
					height: 80px;
					margin-right: 16px;
					overflow: hidden;
				}

				input {
					flex: auto;
					height: 80px;
					padding-inline: 20px;
					font-size: 28px;
					border: none;
					border-radius: 10px;
					background: var(--bg_color_L2);
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
				background: var(--bg_color_L2);
        color: var(--text_color_L1);
				
				resize: none;

				&:focus {
					outline: 1px solid var(--main-color);
				}

				&::placeholder {
					color: var(--text_color_L3);
				}
			}
		}
	}

	&-saveBtn {
		height: 70px;
		margin-top: 95px;
		margin-inline: 14px;
		color: var(--textW);
		text-align: center;
		line-height: 70px;
		letter-spacing: 10px;
		border-radius: 9rem;
		background:  var(--main_gradient-color);

		&:not(.disabled) {
			
		}

		&.disabled {
			background: var(--bg_color_L3);
			box-shadow: var(--BoxShadowColor-16);
		}

		&:active {
			outline: 4px solid var(--gray-color-1);
		}
	}
}
</style>
