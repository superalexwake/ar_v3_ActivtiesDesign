<template>
	<div class="receiveLottery__container">
		<NavBar :title="$t('claimPrize')"  fixed left-arrow @click-left="onClick" />

		<template v-if="pointInfo">
			<div class="receiveLottery__container-hero">
				<div class="receiveLottery__container-hero__left">
					<img v-lazy="images[0]" />
					<span>{{ $t('winTheLottery') }}</span>
					<span>{{ $t('winTheLottery') }}</span>
				</div>
				<div class="receiveLottery__container-hero__right">
					<h1>{{pointInfo.name}}</h1>
					<div>{{ $t('betsNo') }}：{{pointInfo.issueNumber}}</div>
					<div>
						<svg-icon name="ticket" />
						{{pointInfo.winningNumber}}
					</div>
				</div>
			</div>

			<div class="receiveLottery__container-note">
				<svg-icon name="act_notic" />
				<span>{{ $t('descActivity5') }}!</span>
			</div>
		</template>

		<template v-else>
			<div class="receiveLottery__container-empty">
				<Empty><p>{{ $t('descActivity6') }}</p></Empty>
			</div>
		</template>

		<div class="receiveLottery__container-address">
			<div class="receiveLottery__container-address__header">
				<van-icon name="location" />
				<h1>{{ $t('recipientAddr') }}</h1>
			</div>
			<template v-if="address.length">
				<div class="receiveLottery__container-address__body" v-for="(item, index) in address" :key="index">
					<div class="receiveLottery__container-address__body-content">
						<div>{{ item.name }}</div>
						<div>+{{item.area}}{{ item.phone }}</div>
						<div>{{ item.address }}</div>
					</div>
					<div class="receiveLottery__container-address__body-footer">
<!--						<div @click="setDefault(item.addressId,item.defaultAddress)">-->
<!--							<van-checkbox :model-value="item.defaultAddress" checked-color="#ee0a24">{{ $t('setAsDefault') }}</van-checkbox>-->
<!--						</div>-->
						<div @click="handleGoAddress('edit')">
							<svg-icon name="editMain" />
							{{ $t('edit') }}
						</div>
						<div @click="delAddress(item.addressId)">
							<svg-icon name="deleteMain" />
							{{ $t('delete') }}
						</div>

					</div>
				</div>
			</template>

			<div class="receiveLottery__container-address__empty" v-else>
				<img src="@public/activity/PointMall/addAddress.png" @click="handleGoAddress('add')" />
				<p>{{ $t('addrecipientAddr') }}</p>
			</div>
		</div>

		<van-button :loading="loading"  :disabled="!address.length" :loading-text="$t('receive')" class="receiveLottery__container-receiverBtn" @click="onReceiveBtnClick" :class="{ disabled: !address.length }">
			{{ $t('receive') }}
		</van-button>

		<van-dialog v-model:show="receiveDialogShow"
					:show-confirm-button="false"
					z-index="3100">
			<img src="@icon/public/succeed.png" class="dialog__content-top" />
			<div class="van-dialog__content-title">{{ $t('receiveSuccess') }}</div>
			<div class="van-dialog__content-note">{{ $t('descActivity7') }}</div>
			<div class="van-dialog__content-btn" @click="onCancelClick">{{ $t('checkOrder') }}</div>
			<img
				src="@public/activity/DailyTask/close.png"
				class="dialog__content-bottom"
				@click="receiveDialogShow = false"
			/>
		</van-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref,computed,onMounted } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { AwaitApiResult } from '@/utils'
import Empty from '@/components/Empty/index.vue'
import {usePointLottery} from "@/hooks";
import {GetPrize} from "@/api";

const router = useRouter()
const route = useRoute()
const {getPointLotteryInfo,getAddress,setDefault,delAddress,address,list,loading,pointInfo}=usePointLottery();
const images=computed(()=>[
	pointInfo.value?.img_Five,
	pointInfo.value?.img_Four,
	pointInfo.value?.img_One,
	pointInfo.value?.img_Three,
	pointInfo.value?.img_Two,
].filter(Boolean))

const receiveDialogShow = ref(false)
async function onCancelClick() {
	router.push({
		path: '/activity/pointMall/myorders'
	})
}
function onClick() {
	router.back()
}
const handleGoAddress = (type: string) => {
	const data=address.value[0]||{}
	type === 'edit'
		? router.push({ path: '/activity/pointMall/addAddress', query: {...data, type: 'edit',form:"lotteryPoint" } })
		: router.push({ path: '/activity/pointMall/addAddress', query: { type: 'add',form:"lotteryPoint" } })
}

async function onReceiveBtnClick() {
	if (loading.value)return;
	loading.value=true;
	const id = route.query.orderId as string;
	const orderId= parseInt(id, 10) as number
	const params=address.value.find((item)=>item.defaultAddress==true)||address.value[0];
	const data=await AwaitApiResult(GetPrize({
		orderId:orderId,
		userAddressId:params.addressId
	}));
	loading.value=false;
	if (data){
		receiveDialogShow.value = true
	}

}
onMounted(async () => {
	await Promise.all([getAddress(),getPointLotteryInfo()])
})
</script>

<style lang="scss" scoped>
.receiveLottery__container {
	padding-inline: 12px;
	padding-block: 50px 75px;
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

	&-hero {
		display: flex;
		align-items: center;
		height: 268px;
		padding: 12px;
		border-radius: 10px;
		background: var(--bg_color_L2);

		&__left,
		&__right {
			flex: 1;
			height: 100%;
		}

		&__left {
			position: relative;
			display: grid;
			place-items: center;
			border-radius: 10px;
			width: 320px;
			height: 240px;
			background: linear-gradient(180deg, #ff7475 -3.33%, #ffa895 100%);

			img {
				height: 212px;
				width: 212px;
			}

			span {
				position: absolute;
				top: 10px;
				left: 0;
				padding: 5px 20px 5px 30px;
				color: var(--textW);
				font-size: 22px;
				border-top-right-radius: 9rem;
				border-bottom-right-radius: 9rem;

				&:first-of-type {
					background: linear-gradient(270deg, #fabb2a 18.36%, #eb9315 89.84%, #fbe571 96.48%, #ed8b19 100%);
					z-index: 2;
				}

				&:last-of-type {
					top: 7px;
					padding: 8px 20px 8px 33px;
					background: linear-gradient(90deg, #ff9c3a -3.24%, #ffe55c 4.63%, #ffb936 13.43%, #fff962 76.75%);
					z-index: 1;
				}
			}
		}

		&__right {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			padding-left: 22px;

			h1 {
				margin-bottom: auto;
				color: var(--text_color_L1);
				font-size: 28px;

				span {
					color: var(--main-color);
				}
			}

			div {
				padding: 5px 10px;
				font-size: 22px;
				border-radius: 5px;

				&:first-of-type {
					color: #8c90a9;
					height: 60px;
					line-height: 60px;
					background-color: var(--bg_color_L3);
					margin-bottom: 15px;
				}

				&:last-of-type {
					display: flex;
					height: 68px;
					align-items: center;
					color: var(--text_color_L1);
					background-color: var(--bg_color_L3);
					font-size: 26px;
					svg {
						width: 78px;
						height: 42px;
						margin-right: 5px;
					}
				}
			}
		}
	}

	&-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		img {
			width: 8rem;
			margin-bottom: 0.5rem;
		}

		p {
			color: var(--text_color_L2);
			font-size: 0.75rem;
		}
	}

	&-note {
		display: flex;
		align-items: center;
		margin-top: 1rem;
		padding: 22px 20px;
		color: var(--text_color_L1);
		font-size: 24px;
		border-radius: 9rem;
		background: var(--bg_color_L2);

		svg {
			width: 32px;
			height: 32px;
			margin-right:20px;
		}
	}

	&-address {
		margin-top: 52px;

		&__header {
			display: flex;
			align-items: center;
			margin-bottom: 25px;
			color: var(--text_color_L1);
			font-size: 36px;

			i {
				margin-right: 18px;
				color: var(--main-color);
				font-size: 48px;
			}
		}

		&__body {
			margin-bottom: 20px;
			border-radius: 10px;
			background: var(--bg_color_L2);
			
			overflow: hidden;

			&-content {
				display: flex;
				flex-direction: column;
				gap: 25px;
				padding: 20px 12px;
				color: var(--text_color_L1);

				div {
					font-size: 30px;
					&:last-of-type {
						color: var(--text_color_L2);
						font-size: 26px;
						word-wrap: break-word;
					}
				}
			}

			&-footer {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 28px 20px;
				background-color: var(--bg_color_L2);

				div {
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--text_color_L2);
					font-size: 24px;

					svg {
						width: 36px;
						height: 36px;
						margin-right: 10px;
					}

					:deep(.van-checkbox__label) {
						color: var(--colorText-26);
					}
				}
			}
		}

		&__empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 84px 0;
			border-radius: 10px;
			background: var(--bg_color_L2);
			

			img {
				width: 88px;
				height: 88px;
				margin-bottom: 15px;
			}

			p {
				color: var(--text_color_L2);
				font-size: 28px;
			}
		}
	}

	&-receiverBtn {
		width: 100%;
		margin-top: 2rem;
		padding-block: 0.375rem;
		color: var(--textW);
		text-align: center;
		border-radius: 9rem;
		background:  var(--main_gradient-color);
		&.disabled {
			background: var(--main_gradient-color);
			box-shadow: var(--BoxShadowColor-16);
		}
	}

	:deep(.van-dialog) {
		overflow: visible;

		.van-dialog__content {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-block: 185px 45px;
		}
	}

	.van-dialog {
		&__content {
			img {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);

				&:first-of-type {
					top: -1rem;
					width: 280px;
				}

				&:last-of-type {
					bottom:-85px;
					width: 60px;
					height: 60px;
				}
			}

			&-title {
				margin-bottom:22px;
				color: var(--text_color_L1);
				font-size: 36px;
			}

			&-note {
				margin-bottom: 85px;
				color: var(--text_color_L2);
				font-size: 24px;
			}

			&-btn {
				width: 326px;
				height: 80px;
				color: var(--text_color_L4);
				line-height: 80px;
				text-align: center;
				font-size: 32px;
				border-radius: 9rem;
				background: var(--main_gradient-color);
			}
		}
	}
}
</style>
