<template>
    <NavBar :title="$t('firstSaveTitle')" left-arrow @click-left="router.go(-1)" />
    <div class="first_list">
        <firstItem :list="ActiveSotre.FirstRechargeList" @gorecharge="gorecharge"/>
    </div>
    <ruleContainer :name="$t('firstSaveRule')" :tiplist="tipList"/>
</template>

<script setup lang="ts">
import ruleContainer from '@/components/common/Rule.vue'
import firstItem from '@/components/Activity/FirstRecharge/listItem.vue'
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useActive } from '@/components/common/use';
import { onMounted } from 'vue';
import { currency } from '@/utils';
const { ActiveSotre, getFirstRechargeList } =  useActive();
const { t } = useI18n()
const router = useRouter()
const maxamount = computed(()=>{
    if(ActiveSotre.value.FirstRechargeList?.length) {
        return ActiveSotre.value.FirstRechargeList.reduce((a:any,b:any)=>{
            return Math.max(a.rewardAmount || a,b.rewardAmount)
        })
    } else {
        return '0'
    }

})
const fa1 = sessionStorage.getItem('fa1') || '1.00'
const tipList = computed(() => {
    return [
        t('firstSave1', [currency(maxamount.value)]),
        t('firstSave2'),
        t('firstSave3'),
        t('firstSave4', [fa1]),
        t('firstSave5'),
        t('firstSave6'),
    ]
})

const gorecharge = ()=> {
    router.push({name: 'Recharge'})
}
onMounted(()=>{
    getFirstRechargeList()
})
</script>

<style lang="scss" scoped>
.first_list {
    padding: 24px;
}
</style>