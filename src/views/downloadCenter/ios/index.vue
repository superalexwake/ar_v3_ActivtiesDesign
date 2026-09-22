<template>
    <NavBar :title="$t('e6')" left-arrow @click-left="onBack" />
    <div class="iosTip">
        <div class="text">{{ $t('e5') }}</div>
        <div class="img i1"></div>
        <div class="img i2">
            <img src="/icon-192x192.png" alt="iOS Download Instructions" />
            <div class="title">{{ store.getProjectName }}</div>
            <div class="c">{{ host }}</div>
        </div>
        <div class="img i3">
            <img src="/icon-192x192.png" alt="iOS Download Instructions" />
            <div class="title">{{ store.getProjectName }}</div>
            <div class="c">{{ location }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { SettingStore } from "@/stores";
import router from '@/router';

const store = SettingStore();
const host = window.location.host;
const location = window.location.origin;
const onBack = () => {
    router.back()
}
</script>
<style lang="scss" scoped>
.iosTip {
    display: flex;
    padding: 32px;
    flex-direction: column;

    .text {
        color: var(--norm_red_color, #F95959);
        text-align: center;
        font-family: Poppins;
        font-size: 28px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-bottom: 32px;
    }

    .img {
        width: 690px;
        height: 1494px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        position: relative;
        font-family: Poppins;
        font-style: normal;
        &.i1 {
            background-image: url('@/assets/icons/download/ios1.webp');
        }
        &.i2 {
            background-image: url('@/assets/icons/download/ios2.png');
            position: relative;
            font-size: 24px;
            &>img {
                width: 111px;
                height: 111px;
                border-radius: 8px;
                box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);
                position: absolute;
                top: 128px;
                left: 29px;
            }
            .title {
                width: fit-content;
                max-width: 476px;
                height: 36px;
                line-height: 36px;
                position: absolute;
                top: 128px;
                left: 171px;
                color: #000;
                font-weight: 600;
            }

            .c {
                width: fit-content;
                max-width: 476px;
                height: 36px;
                line-height: 36px;
                position: absolute;
                top: 163px;
                left: 171px;
                color: #8D9293;
            }
        }
        &.i3 {
            background-image: url('@/assets/icons/download/ios3.png');
            &>img {
                width: 90px;
                height: 90px;
                border-radius: 8px;
                position: absolute;
                top: 303px;
                left: 38px;
            }
            .title {
                width: fit-content;
                max-width: 476px;
                height: 42px;
                line-height: 42px;
                position: absolute;
                font-size: 28px;
                top: 285px;
                left: 171px;
                color: #000;
                font-weight: 600;
            }

            .c {
                width: fit-content;
                max-width: 476px;
                height: 36px;
                line-height: 36px;
                position: absolute;
                top: 374px;
                left: 171px;
                color: #8D9293;
            }
        }
    }
}
</style>