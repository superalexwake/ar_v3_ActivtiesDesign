<template>
    <div class="noRightTimeDialog">
        <img src="@icon/wallet/tip.png" class="fail" />
        <div class="van-dialog__content-title title1">{{ $t('noRightTime') }}</div>
        <div class="van-dialog__content-note">
            <p>
                {{ $t('wTimeInterval') }}<span class="red">{{ startTime }}-{{ endTime }}</span>,
            </p>
            <p>{{ $t('later') }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useWithdraw } from '@/hooks'

const { withdrawalsrule } = useWithdraw()

const startTime = computed(() => {
    if (withdrawalsrule.value) {
        return withdrawalsrule.value.startTime
    } else {
        return '00:00'
    }
})
const endTime = computed(() => {
    if (withdrawalsrule.value) {
        return withdrawalsrule.value.endTime
    } else {
        return '23:59'
    }
})
</script>
<style lang="scss" scoped>
@import '@/assets/styles/withdraw';
</style>
