<template>
	<div class="personInfoBar">
		<div class="infoItem1">
			<img src="@icon/home/Group1.png" @click="router.push({ name: 'Turntable' })" alt="" />
			<img src="@icon/home/Group2.png" @click="router.push({ name: 'vip' })" alt="" />
		</div>
		<div class="infoItem2">
			<div class="leftItem">
				<template v-if="globalStore.getToken">
					<div class="avatarBox">
						<img :src="avatarUrl" class="userAvatar" @error="fixIcons(avatarUrl, 'userAvatar')" />
						<img :src="getVipLevelIcon(vipUsersData?.vipLevel)" class="level" alt="">
					</div>
					<div class="amount">
						<div>{{ currency(walletStore.getAmount) }}</div>
						<img class="tu2" src="@icon/home/resh_bt.png" @click="getWinsUserAmount" alt="" />
					</div>
				</template>
				<template v-else>
					<img class="tu1" src="@public/main/Avatar/6.png" alt="" />
					<div @click="router.push({ name: 'login' })">{{$t('goToLogin')}}</div>
				</template>
			</div>
			<div class="rightItem">
				<div @click="router.push({ name: 'Recharge' })">
					<img src="@icon/home/icon_deopsit.png" alt="" />
					<p>{{ $t('recharge') }}</p>
				</div>
				<div @click="router.push({ name: 'Withdraw' })">
					<img src="@icon/home/icon_withdraw.png" alt="" />
					<p>{{ $t('withdraw') }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed,ref,onMounted } from 'vue'
import { GlobalStore, useWalletStore } from '@/stores'
import { AwaitApiResult, currency } from '@/utils'
import { useAssets } from '@/hooks/useAssets'
import { useRouter } from 'vue-router'
import type { UserInfo } from '@/types/api'
import { GetVipUsers } from '@/api'
import level0Icon from '@icon/home/level0.png'
import level1Icon from '@icon/home/level1.png'
import level2Icon from '@icon/home/level2.png'
import level3Icon from '@icon/home/level3.png'
import level4Icon from '@icon/home/level4.png'
import level5Icon from '@icon/home/level5.png'
import level6Icon from '@icon/home/level6.png'
import level7Icon from '@icon/home/level7.png'
import level8Icon from '@icon/home/level8.png'
import level9Icon from '@icon/home/level9.png'
import level10Icon from '@icon/home/level10.png'
const router = useRouter()
const walletStore = useWalletStore()
const globalStore = GlobalStore()
const userInfo = globalStore.getUserInfo as UserInfo
const { getAvatarUrl, defaultImgAvatar1 } = useAssets()
const avatarUrl = computed(() => getAvatarUrl(userInfo.userPhoto))

const vipUsersData = ref() //vip初始信息
const vipLevelIconMap: Record<string, string> = {
	level0: level0Icon,
	level1: level1Icon,
	level2: level2Icon,
	level3: level3Icon,
	level4: level4Icon,
	level5: level5Icon,
	level6: level6Icon,
	level7: level7Icon,
	level8: level8Icon,
	level9: level9Icon,
	level10: level10Icon
}

const getVipLevelIcon = (level?: number | string) => {
	return vipLevelIconMap[`level${level ?? 0}`] || level0Icon
}

async function getVipUsers() {
	const res = await AwaitApiResult(GetVipUsers())
	if (res) {
		vipUsersData.value = res.data
	}
}

const fixIcons = (url: any, className: string) => {
	url = defaultImgAvatar1
	let dom: any = document.querySelector(`.${className}`)
	dom.src = url
}

// 获取钱包金额
const getWinsUserAmount = async () => {
	walletStore.resetData(false, true)
}

onMounted(() => {
	if (globalStore.getToken) {
		getVipUsers()
	}
})

</script>

<style scoped lang="scss">
.personInfoBar {
	margin-top: 24px;
	display: flex;
	flex-direction: column;
	gap: 24px;
	.infoItem1 {
		display: flex;
		align-items: center;
		img {
			height: 110px;
			width: 100%;
		}
	}
	.infoItem2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: var(--text_color_L1);
		font-family: 'Roboto';
		font-size: 32px;
		font-style: normal;
		font-weight: 550;
		line-height: normal;
		.leftItem {
			display: flex;
			align-items: center;
			gap:15px;
			.tu1 {
				width: 100px;
				height: 100px;
				border-radius: 50%;
			}
			.amount {
				display: flex;
				flex-direction: column;
				gap:10px;
				.tu2 {
					height:36px;
					width:80px;
				}
			}
			.avatarBox {
				width: 114px;
				height: 120px;
				position: relative;
				text-align: center;
				.userAvatar {
					width: 100px;
					height: 100px;
					border-radius: 50%;
				}
				.level{
					position: absolute;
					bottom: 0;
					left: -3px;
					width: 114px;
					height: 56px;
				}
			}
		}
		.rightItem {
			display: flex;
			justify-content: space-around;
			gap: 32px;
			div {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 5px;
				img {
					height: 64px;
					width: 64px;
				}
				p {
					font-size: 24px;
					color: var(--text_color_L1);
					text-align: center;
					font-family: 'Poppins';
					font-style: normal;
					font-weight: 500;
				}
			}
		}
	}
}
</style>
