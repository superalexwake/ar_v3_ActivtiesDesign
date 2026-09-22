<template>
	<div class="bankCard__container">
		<NavBar :title="$t('bankCard')" left-arrow @click-left="onBack" />
		<div v-if="withdrawalsL.length > 0" class="bankCard__container-content">
			<div class="bankCard__container-content__item" v-for="(item) in withdrawalsL" :key="item.bid">
				<van-radio-group v-model="checked">
					<div class="bankCard__container-content__card">
						<div class="bankCard__container-content__card-top"></div>
						<div class="bankCard__container-content__card-mid">
							<div class="line">
								<div class="left">{{ $t('bankname') }}</div>
								<div class="right">{{ item.bankName }}</div>
							</div>
							<!-- <div class="line" v-if="item.beneficiaryName">
								<div class="left">{{ $t('payeename') }}</div>
								<div class="right">{{ item.beneficiaryName }}</div>
							</div> -->
							<div class="line">
								<div class="left">{{ $t('bankcardNo') }}</div>
								<div class="right">{{ item.accountNo }}</div>
							</div>
							<div class="line">
								<div class="left">{{ $t('tel') }}</div>
								<div class="right">{{ item.mobileNo }}</div>
							</div>
							<div class="line">
								<div class="left">IFSCode</div>
								<div class="right">{{ item.ifsCode }}</div>
							</div>
						</div>
						<div>
							<van-radio
								:name="`${item.bid.toString()}`"
								icon-size="18px"
								@click="onSelectBank(item)"
							>
								{{ $t('select') }}</van-radio
							>
						</div>
					</div>
				</van-radio-group>
			</div>
		</div>
		<div v-else class="bankCard__container-default">
			<Empty>
				<template #text>
					<span>{{ $t('noPaymentMethodsYet') }}</span>
				</template>
			</Empty>
		</div>
		<AddWithdrawType :type="1"/>
		<Dialog
			v-model:show="delelteDialogShow"
			@confirm="onDelete"
			:show-cancel-btn="true"
			:title="$t('tipCanNotRetrivedAfterDeleted')"
			:confirmText="$t('confirmDelete')"
			:cancelText="$t('cancel')"
		>
			<template #content>
				<img src="@public/main/close.png" class="dialog__content-bottom" @click="delelteDialogShow = false" />
			</template>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult } from '@/utils'
import Dialog from '@/components/common/Dialog.vue'
import Empty from '@/components/Empty/index.vue'
import AddWithdrawType from '@/components/Wallet/Withdraw/AddWithdrawType.vue'
import { useWalletStore } from '@/stores'
import type { withdrawalslist, ReqWithdrawals, ReqDeleteBankCard, ReqNewSetWithdrawal } from '@/types/api'
import { GetWithdrawals, deleteBankCard } from '@/api'
import { useCommonStore } from '@/stores'

const { setLoading } = useCommonStore()
const router = useRouter()
const walletStore = useWalletStore()
const withdrawalV = computed(() => walletStore.getWithdrawal as ReqNewSetWithdrawal)
const delelteDialogShow = ref(false)
const checked = computed(() => {
	return walletStore.getWithdrawal.bid.toString()
})
const withdrawalsL = ref<withdrawalslist[]>([])

function onBack() {
	router.replace({
		name: 'Withdraw',
		query: { bid: checked.value }
	})
}

const paramsD = reactive<ReqDeleteBankCard>({
	bid: walletStore.getWithdrawal.bid as number,
	withdrawid: walletStore.getWithdrawal.type as number
})

//选中银行卡
function onSelectBank(item: any) {
	router.replace({
		name: 'Withdraw',
		query: { bid: item.bid }
	})
}

//删除银行卡
async function onDelete() {
	delelteDialogShow.value = false
	setLoading(true)
	const res = await AwaitApiResult(deleteBankCard(paramsD))
	if (res) {
		if (paramsD.bid == withdrawalV.value.bid) {
			withdrawalV.value.bid = 0
		}
		walletStore.setWithdrawal({
			...withdrawalV.value
		})
		await GetWithdrawalsV() //刷新银行卡列表
	}
	setLoading(false)
}

const params = reactive<ReqWithdrawals>({
	withdrawid: walletStore.getWithdrawal.type
})
async function GetWithdrawalsV() {
	setLoading(true)
	const res = await AwaitApiResult(GetWithdrawals(params))
	if (res) {
		withdrawalsL.value = res.data.withdrawalslist
		if ((res.data.withdrawalslist.length > 0 && walletStore.getWithdrawal.bid == 0) || res.data.withdrawalslist.length == 1) {
			withdrawalV.value.bid = res.data.withdrawalslist[0].bid
			//walletStore.withdrawal.bid = res.data.withdrawalslist[0].bid //默认显示第一个银行
		} else if (res.data.withdrawalslist.length == 0) {
			withdrawalV.value.bid = 0
		}
		walletStore.setWithdrawal({
			...withdrawalV.value
		})
		walletStore.setWithdrawalslist(res.data.withdrawalslist)
	}
	setLoading(false)
}

onMounted(async () => {
	console.log('type', router.currentRoute.value.query)
	if (router.currentRoute.value.query.type == 'Add') {
		await GetWithdrawalsV()
	} else {
		withdrawalsL.value = walletStore.getWithdrawalslist as withdrawalslist[]
	}
})
</script>
<style lang="scss" scoped>
.bankCard__container {
	padding-inline: 24px;
	padding-block: 0 30px;
	font-family: $font-family;
	font-weight: 400;
	color: var(--text_color_L2);
	padding-top: 10px;

	:deep(.navbar__content-left > .van-icon) {
		font-size: 40px;
	}

	&-content {
		&__card {
			background: var(--darkBg,var(--bg_color_L2));
			border-radius: 10px;
			margin-bottom: 26px;
			padding-bottom: 10px;

			> div:last-of-type {
				display: flex;
				padding: 15px 20px 5px;
				justify-content: space-between;

				:deep(.van-checkbox__icon--checked + span) {
					color: var(--colorText-26);
				}

				> div {
					display: flex;
					align-items: center;
					font-size: 24px;
					line-height: 29px;
					color: var(--text_color_L2);
				}

				img {
					width: 34px;
					height: 34px;
					margin-right: 10px;
				}
			}
		}

		&__card-top {
			background: var(--linerGradien-94,var(--main_gradient-color));
			height: 70px;
			position: relative;
			border-radius: 10px 10px 0 0;

			&::before {
				content: '';
				display: block;
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				html:lang(ar) &{
					left: unset;
					right: 0;
				}
			}

			img {
				height: 70px;
			}
		}

		&__card-mid {
			padding: 15px 20px 5px;

			.line {
				position: relative;
				background: var(--bgDark-3,var(--bg_color_L3));
				height: 60px;
				padding: 16px 20px;
				display: flex;
				align-items: center;
				//justify-content: space-between;
				font-size: 24px;
				margin-bottom: 10px;

				> div {
					flex: 1;
				}

				.left {
					color: var(--darkLight,--text_color_L1);
					z-index: 1;
				}

				.right {
					color: var(--text_color_L2);
				}
			}

			.line::after {
				content: '';
				position: absolute;
				width: 300px;
				height: 60px;
				//background: no-repeat url('@icon/main/transAction/trans.png') 100%;
				top: 0;
				left: 0;
				background-color: var(--bg_color_L3);
				clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
				html:lang(ar) &{
					right: 0;
					left: auto;
					width: 370px;
					background: no-repeat url('@/assets/icons/main/transAction/ar-trans.png') -100%;

				}
			}
		}

		&__card-bot {
			margin: 0 10px;
			display: flex;
			border: 1px solid var(--Dividing-line_color);
			border-radius: 10px;
			padding: 20px;
			flex-direction: column;

			.top {
				color: var(--text_color_L1);
				font-size: 24px;
			}

			.textarea {
				height: 100px;
				border: 0;
				padding-top: 20px;
				//padding-left: 21px;
				resize: none;
				margin-bottom: 22px;
				font-size: 24px;
				color: var(--text_color_L2);
				//safari浏览器不能输入
				user-select: text;
			}

			.textarea::placeholder {
				color: var(--text_color_L2);
				font-size: 22px;
			}
		}
	}

	&-default {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60px 0;
		gap: 16px;

		span {
			font-size: 26px;
			line-height: 31px;
			color: var(--text_color_L2);
		}
	}
}

:deep(.empty__container) {
	height: fit-content;
}

:deep(.dialog__container) {
	.dialog__container-title {
		h1 {
			font-size: 36px;
			font-weight: 700;
			line-height: 36px;
			color: var(--text_color_L1);
		}
	}

	.dialog__container-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;

		img {
			&:nth-of-type(1) {
				width: 160px;
				height: 160px;
			}

			&:last-of-type {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				width: 50px;
				height: 50px;
				bottom: -300px;
			}
		}
	}
}
</style>
