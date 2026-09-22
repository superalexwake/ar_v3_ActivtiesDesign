<template>
	<!-- 头部 -->
	<UserInformation :userInfo="userInfo" />
	<div class="userinfo-content">
		<!-- 总余额及钱包 -->
		<TotalSavings :userInfo="userInfo" />
		<!-- 保险箱 积分商城 下注-交易-充值-提现 -->
		<FinancialServices :userInfo="userInfo" />
		<!-- 通知 邀请奖励 礼物兑换 商品订单 游戏统计 语言变更 -->
		<SettingPanel />
		<!-- 服务中心 -->
		<ServiceCenter />
	</div>
</template>

<script setup lang="ts">
import UserInformation from '@/components/Main/UserInformation/index.vue'
import TotalSavings from '@/components/Main/TotalSavings/index.vue'
import FinancialServices from '@/components/Main/FinancialServices/index.vue'
import ServiceCenter from '@/components/Main/ServiceCenter/index.vue'
import SettingPanel from '@/components/Main/SettingPanel/index.vue'
import { GlobalStore, useUserStore } from '@/stores'
import type { UserInfo } from '@/types/api'
import { useEventBus } from '@/components/common/use'
const eventBus = useEventBus()
const globalStore = GlobalStore()
const userStore = useUserStore()
userStore.getUserInfo({ signature: globalStore.token })

const userInfo = globalStore.getUserInfo as UserInfo
const isneedUpd = localStorage.getItem('needUpd')
if (isneedUpd === '1') {
	localStorage.setItem('isReload', '1')
	localStorage.setItem('needUpd', '2')
	eventBus.emit('keyChange')
	// 只能刷新，否则 /wallet/RechargeHistory 匹配值依然有问题
	// window.location.reload()
}
</script>

<style lang="scss" scoped>
.userinfo-content {
	display: flex;
	flex-direction: column;
	gap: 40px;
	padding: 0 24px 61px;
	position: relative;
	top: -164px;
}
</style>
