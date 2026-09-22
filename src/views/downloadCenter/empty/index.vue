<template>
    <NavBar :title="$t('e4')" left-arrow @click-left="onBack" />
    <div class="download-center">
        {{ $t('e5') }}
    </div>
</template>
<script lang="ts" setup>
import router from '@/router';

const onBack = () => {
    router.back()
}
</script>
<style lang="scss" scoped>
.download-center {
    width: 558px;
    height: 558px;
    display: flex;
    color: var(--text_color_L2);
    text-align: center;
    font-family: Poppins;
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: 36px;
    background: url('@/assets/icons/download/empty.png') no-repeat center center;
    background-size: cover;
    margin: 32px auto;
    padding-top: 457px;
}
</style>