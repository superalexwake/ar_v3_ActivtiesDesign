<template>
	<NavBar :title="$t('inviteRule')" left-arrow @click-left="router.go(-1)" />
    <div class="container">
        <div class="tip">{{ $t('iRule1') }}</div>
        <div class="tip">{{ $t('iRule2') }}</div>
    </div>
    <div class="dailySignInRules__container-hero">
		<div class="dailySignInRules__container-hero__wrapper">
			<div class="dailySignInRules__container-hero__wrapper-titlebox">
				<div class="dailySignInRules__container-hero__wrapper-title">{{ $t('iRule3') }}</div>
				<div class="dailySignInRules__container-hero__wrapper-title">{{ $t('rechageAmount') }}</div>
				<div class="dailySignInRules__container-hero__wrapper-title">{{ $t('winTips5') }}</div>
			</div>
			<ul>
				<li v-for="(item, index) in signInList" :key="index">
					<div>{{ item.taskPeople }} {{ $t('people') }}</div>
					<div>{{ currency(item.rechargeAmount) }}</div>
					<div>{{ currency(item.taskAmount) }}</div>
				</li>
			</ul>
		</div>
	</div>
    <ruleContainer :name="$t('rule')" :tiplist="tipList"/>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { currency, AwaitApiResult } from '@/utils'
import ruleContainer from '@/components/common/Rule.vue'
import { GetCurrentActivityTasks } from '@/api'
import { ref, onMounted } from 'vue';
import i18n from '@/languages'
const { t } = i18n.global

const router = useRouter()
const tipList = [
    t('iRule4'),
    t('iRule5'),
    t('iRule6'),
    t('iRule7'),
]
const signInList = ref([])

const getRule = async() => {
    const res = await AwaitApiResult(GetCurrentActivityTasks())
    signInList.value = res.data.taskList || []
}
onMounted(()=>{
    getRule()
})
</script>
<style lang="scss" scoped>
.container {
    padding: 24px;
    &>.tip {
        font-size: 26px;
        color: var(--text_color_L2);
        & + .tip {
            margin-top: 12px;
        }
    }
    
}
.dailySignInRules__container-hero {
    width: calc(100% - 48px);
    color: var(--bg_color_L2);
   
    &__wrapper-titlebox
    {
        background: var(--sheet_nva_color);
        color: #fff;
    }
    &__wrapper-title
    {
        color: #fff;
        background: var(--sheet_nva_color);
    }
    li {
		background-color: var(--bg_color_L2);
		color: var(--text_color_L2);
		&:nth-of-type(even) {
			background-color: var(--sheet_detail_bg_color);
		}
	} 
}
</style>