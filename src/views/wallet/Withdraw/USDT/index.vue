<template>
	<div class="USDT__container">
		<NavBar :title="$t('usdtAddr')" left-arrow @click-left="onBack" />
		<div v-if="withdrawalsL.length > 0" class="USDT__container-content">
			<div class="USDT__container-content__item" v-for="(item) in withdrawalsL" :key="item.bid">
				<van-radio-group v-model="checked">
					<div class="USDT__container-content__card">
						<div class="USDT__container-content__card-top">
							<!-- <svg-icon name="bankHeader" ></svg-icon> -->
							<svg-icon class="chainLogo" :name="getChainIcon(item)" ></svg-icon>
							<span>{{ item?.bankAlias || item.bankName }}</span>
						</div>
						<div class="USDT__container-content__card-mid ar-1px-b">
							<span>{{ item.accountNo }}</span>
							<span>{{ item.usdtRemarkName }}</span>
						</div>
						<div>
							<!--这是假的-->
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
		<div v-else class="USDT__container-default">
			<Empty>
				<template #text>
					<span>{{ $t('noPaymentMethodsYet') }}</span>
				</template>
			</Empty>
		</div>

		<AddWithdrawType :type="3" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult } from '@/utils'
import Dialog from '@/components/common/Dialog.vue'
import Empty from '@/components/Empty/index.vue'
import AddWithdrawType from '@/components/Wallet/Withdraw/AddWithdrawType.vue'
import { GlobalStore, useUserStore, useWalletStore } from '@/stores'
import type { withdrawalslist, ReqWithdrawals, ReqDeleteBankCard, ReqNewSetWithdrawal } from '@/types/api'
import { GetWithdrawals, deleteBankCard } from '@/api'
import { useCommonStore } from '@/stores'
const { setLoading } = useCommonStore()
const { getUserInfo } = useUserStore()
const globalStore = GlobalStore()
getUserInfo({ signature: globalStore.token })
const router = useRouter()
const walletStore = useWalletStore()
// const withdrawalV = computed(() => walletStore.getWithdrawal as ReqNewSetWithdrawal)
const withdrawalV = walletStore.getWithdrawal as ReqNewSetWithdrawal

const delelteDialogShow = ref(false)
// const checked = ref(`${withdrawalV.bid}`)
const checked = computed(() => {
	return walletStore.getWithdrawal.bid.toString()
})
const withdrawalsL = ref<withdrawalslist[]>([])

const paramsD = reactive<ReqDeleteBankCard>({
	bid: walletStore.getWithdrawal.bid as number,
	withdrawid: walletStore.getWithdrawal.type as number
})

/** 主网络关键字与链 logo 的对应关系，新增主网络在此追加一条即可 */
const chainIcons = [
	{ match: /BEP|BNB|BSC/i, icon: 'usdtBep20' },
	{ match: /TRC|TRON/i, icon: 'usdtTrc20' }
]

/**
 * 按主网络匹配对应的链 logo。
 * @param item 提现地址列表项
 * @returns svg-icon 的 name，未匹配到主网络时回退到通用 USDT 图标
 */
function getChainIcon(item: withdrawalslist) {
	const chain = item?.bankAlias || item.bankName
	return chainIcons.find((c) => c.match.test(chain))?.icon || 'usdtLogo3'
}

//选中usdt
function onSelectBank(item: any) {
	router.replace({
		name: 'Withdraw',
		query: { bid: item.bid }
	})
}

//删除usdt
async function onDelete() {
	delelteDialogShow.value = false
	setLoading(true)
	const res = await AwaitApiResult(deleteBankCard(paramsD))
	if (res) {
		if (paramsD.bid == withdrawalV.bid) {
			withdrawalV.bid = 0
		}
		walletStore.setWithdrawal({
			...withdrawalV
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
			withdrawalV.bid = res.data.withdrawalslist[0].bid
			//walletStore.withdrawal.bid = res.data.withdrawalslist[0].bid //默认显示第一个银行
		} else if (res.data.withdrawalslist.length == 0) {
			withdrawalV.bid = 0
		}
		walletStore.setWithdrawal({
			...withdrawalV
		})
		walletStore.setWithdrawalslist(res.data.withdrawalslist)
	}
	setLoading(false)
}

onMounted(async () => {
	console.log('11', withdrawalV)
	//if (walletStore.getWithdrawal.bid != 0) checked1.value = walletStore.getWithdrawal.bid
	console.log('type', router.currentRoute.value.query)
	if (router.currentRoute.value.query.type == 'Add') {
		await GetWithdrawalsV()
	} else {
		withdrawalsL.value = walletStore.getWithdrawalslist as withdrawalslist[]
	}

	// checked.value = walletStore.getWithdrawal.bid.toString()
})

function onBack() {
	//Withdraw
	router.replace({
		name: 'Withdraw',
		query: { bid: checked.value }
	})
}
</script>
<style lang="scss" scoped>
.USDT__container {
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
					// color: #fe6868;
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
			//display: flex;
			//align-items: center;
			border-radius: 10px 10px 0 0;
			position: relative;

			> .chainLogo {
				box-sizing: border-box;
				width: 50px;
				height: 50px;
				padding: 8px;
				position: absolute;
				top: 50%;
				left: 20px;
				transform: translateY(-50%);
				background: #fff;
				border-radius: 50%;
				color: var(--main-color);
			}

			> span {
				position: absolute;
				top: 50%;
				left: 80px;
				right: 20px;
				transform: translateY(-50%);
				font-size: 26px;
				font-weight: 500;
				line-height: 32px;
				color: #fff;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		&__card-mid {
			padding: 30px 30px;
			display: flex;
			flex-direction: column;
			align-items: left;

			span {
				font-weight: 400;
				margin: 10px 0;
			}

			> span:first-of-type {
				//text-align: left;
				color: var(--text_color_L1);
				font-size: 26px;
			}

			> span:last-of-type {
				color: var(--text_color_L2);
				font-size: 24px;
			}
		}
	}

	&-add {
		background: var(--bg_color_L2);
		border-radius: 10px;
		height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		//padding-top: 20px;
		justify-content: center;
		gap: 8px;
		margin-bottom: 20px;

		img {
			width: 88px;
			height: 88px;
		}

		span {
			color: var(--text_color_L3);
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
			color: var(--text_color_L3);
		}
	}
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

:deep(.empty__container) {
	height: fit-content;
}
</style>