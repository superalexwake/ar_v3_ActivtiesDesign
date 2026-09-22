<template>
	<div class="bankCard__container">
		<NavBar :title="$t('paymentMethod')" left-arrow @click-left="onBack" />
		<div v-if="withdrawalsL.length > 0" class="bankCard__container-content">
			<div class="bankCard__container-content__item" v-for="(item, index) in withdrawalsL" :key="item.bid">
				<van-radio-group v-model="checked">
					<div class="bankCard__container-content__card">
						<div class="bankCard__container-content__card-top ar-1px-b">
							<div>
								<img :src="getWalletWithdrawTypeIcon(paramsD.withdrawid)" />
								{{ $t('paymentMethodOfPix') }}
							</div>
							<div>
								<van-radio
									:name="`${item.bid.toString()}`"
									icon-size="22px"
									@click="onSelectBank(item)"
								>
								</van-radio>
							</div>
						</div>

						<div class="bankCard__container-content__card-mid">
							<div class="line">
								{{ item.beneficiaryName }}
							</div>
							<div class="line">
								{{ item.accountNo }}
							</div>
							<div class="line">
								{{ item.bankName }}
							</div>
						</div>

						<!-- <div class="delete" @click="onShowDeleteDialog(item)">
							<van-icon name="delete" color="rgba(238, 54, 37, 1)" size="20" />
							{{ $t('delete') }}
						</div> -->
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
		<AddWithdrawType :type="5"/>

	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AwaitApiResult } from '@/utils'
import { getWalletWithdrawTypeIcon } from '@/utils/assetIcons'
import Dialog from '@/components/common/Dialog.vue'
import Empty from '@/components/Empty/index.vue'
import AddWithdrawType from '@/components/Wallet/Withdraw/AddWithdrawType.vue'
import { useWalletStore } from '@/stores'
import type { withdrawalslist, ReqWithdrawals, ReqDeleteBankCard, ReqNewSetWithdrawal } from '@/types/api'
import { GetWithdrawals, deleteBankCard } from '@/api'
import { useCommonStore } from '@/stores'

const { setLoading } = useCommonStore()
const router = useRouter()
const route = useRoute()
const walletStore = useWalletStore()
const withdrawalV = computed(() => walletStore.getWithdrawal as ReqNewSetWithdrawal)
const delelteDialogShow = ref(false)
const checked = computed(() => {
	return walletStore.getWithdrawal.bid.toString() //选中的银行id
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
	withdrawid: 5
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
	withdrawid: 5
})
async function GetWithdrawalsV() {
	setLoading(true)
	const res = await AwaitApiResult(GetWithdrawals(params))
	if (res) {
		withdrawalsL.value = res.data.withdrawalslist
		if ((res.data.withdrawalslist.length > 0 && walletStore.getWithdrawal.bid == 0) || res.data.withdrawalslist.length == 1) {
			withdrawalV.value.bid = res.data.withdrawalslist[0].bid
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
	if (router.currentRoute.value.query.type == 'Add') {
		await GetWithdrawalsV()
	} else {
		withdrawalsL.value = walletStore.getWithdrawalslist as withdrawalslist[]
	}
})
</script>
<style lang="scss" scoped>
.bankCard__container {
	font-family: $font-family;
	color: var(--text_color_L2);
	padding: 30px;
	font-size: 26px;

	&-content {
		margin-bottom: 50px;

		&__card {
			background: var(--darkBg,var(--bg_color_L2));
			box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
			border-radius: 12px;
			margin-bottom: 26px;
			padding: 20px;

			&-top {
				align-items: center;
				display: flex;
				padding-bottom: 20px;
				justify-content: space-between;

				> div {
					align-items: center;
					display: flex;
					gap: 15px;
					color: var(var(--darkTextW),text_color_L1);
					font-size: 32px;
					font-weight: 700;
				}

				img {
					height: 48px;
				}
			}

			&-mid {
				// padding: 30px 0;
				padding-top: 10px;
				display: flex;
				flex-direction: column;
				align-items: left;
				gap: 10px;

				.line {
					padding: 10px 0;
				}
			}

			.delete {
				border: 1px solid #ee3625;
				border-radius: 12px;
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 10px;
				color: rgba(238, 54, 37, 0.7);
				height: 60px;
				margin-top: 30px;
			}
		}
	}

	&-default {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60px 0 100px;
		gap: 16px;

		span {
			font-size: 26px;
			line-height: 31px;
			color: rgba(255, 255, 255, 0.6);
		}
	}
}

// :deep(.empty__container) {
// 	height: fit-content;
// }

:deep(.dialog__container) {
	.dialog__container-img {
		img {
			width: 100%;
		}
	}

	.dialog__container-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;

		img {
			&:last-of-type {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				width: 54px;
				//height: 50px;
				bottom: -250px;
			}
		}
	}
}
</style>
