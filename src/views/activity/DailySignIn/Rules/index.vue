<template>
	<div class="dailySignInRules__container">
		<NavBar :title="$t('playRules')" left-arrow @click-left="onClick" />
		<div class="dailySignInRules__container-hero">
			<div class="dailySignInRules__container-hero__wrapper">
				<div class="dailySignInRules__container-hero__wrapper-titlebox">
					<div class="dailySignInRules__container-hero__wrapper-title">{{ $t('ruleSignIn') }}</div>
					<div class="dailySignInRules__container-hero__wrapper-title">{{ $t('ruleAcount') }}</div>
					<div class="dailySignInRules__container-hero__wrapper-title">{{ $t('ruleBonus') }}</div>
				</div>
				<ul>
					<li v-for="(item, index) in signInList" :key="index">
						<div>{{ item.day }}</div>
						<div>{{ currency(item.amount) }}</div>
						<div>{{ currency(item.bouns) }}</div>
					</li>
				</ul>
			</div>
		</div>
		<ruleContainer :name="$t('rule')" :tiplist="tipList"/>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { UserInfo, DailySignInData } from '@/types/api'
import { GetDailySignIn } from '@/api'
import { AwaitApiResult, currency } from '@/utils'
import { GlobalStore } from '@/stores'
import ruleContainer from '@/components/common/Rule.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const globalStore = GlobalStore()
const userInfo = globalStore.getUserInfo as UserInfo
const { t } = useI18n()

const signModel = ref<DailySignInData['data']['signModel']>({} as any)
const signInList = ref<DailySignInData['data']['signInlist']>([] as any)
const tipList = ref([
	t('desc1'),
	t('desc2'),
	t('desc3'),
	t('desc4'),
	t('desc5'),
	t('desc6'),
])
function onClick() {
	router.go(-1)
}
onMounted(async () => {
	const res: any = await AwaitApiResult(
		GetDailySignIn({
			uid: userInfo.userId,
			sign: userInfo.sign
		})
	)
	signInList.value = res.data.signInRechargesList
	signModel.value = res.data.signIn
})
</script>

<style lang="scss" scoped>
.dailySignInRules__container {
	padding-inline: 24px;
	padding-bottom: 92px;
	li {
		background-color: var(--bg_color_L2);
		color: var(--text_color_L2);
		&:nth-of-type(even) {
			background-color: var(--bg_color_L3);
		}
	}
	&-hero__wrapper-title {
		display:flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		background: var(--sheet_nva_color);
		
	}
}
:deep(.rule) {
	width: 100%;
}
</style>
