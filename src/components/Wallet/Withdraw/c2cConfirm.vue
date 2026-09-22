<template>
    <div class="c2cConfirm">
        <p>*You must click <span>【Confirm Receipt】</span></p>
        <p>*After receiving the transfer, go to order details and click 【Confirm Receipt】to receive the reward.</p>
        <h6>How to <span>【Confirm Receipt】</span></h6>
        <div class="imgBox">
            <div class="box">
                <div><h6>01、</h6>Open my withdrawal record</div>
                <img src="@public/wallet/withdraw/c2c/1.png" />
            </div>

            <div class="box">
                <div>02、Select New-UPI Click Order</div>
                <img src="@public/wallet/withdraw/c2c/2.png" />
            </div>

            <div class="box">
                <div>03、Click to Money received</div>
                <img src="@public/wallet/withdraw/c2c/3.png" />
            </div>

            <div class="box">
                <div>04、Complete the order and get rewards</div>
                <img src="@public/wallet/withdraw/c2c/4.png" />
            </div>
    </div>
    <van-checkbox v-model="isC2cCheck" >I already understand the process and agree to come back
        and click <span>[Money received]</span></van-checkbox>
    <div class="btn" :class="{ active: isC2cCheck }" @click="onConfirm">confirm</div>
</div></template>
<script setup lang="ts">

import { onMounted } from 'vue';
import { ref } from 'vue';
import { showFailToast } from 'vant'
import { useVModels } from '@vueuse/core'

const props = defineProps({
    showC2c: {
        type: Boolean,
        default: false,
        required: true
    }
})
const emit = defineEmits(['update:showC2c'])
const { showC2c } = useVModels(props, emit);
const isC2cCheck = ref(false)
function onConfirm() {
    if (!isC2cCheck.value) {
        return showFailToast({
            message: 'Please read the process and check the box to agree',
            wordBreak: 'break-word'
        })
    }
    localStorage.setItem('isC2cCheck', '1')
    showC2c.value = false
}

onMounted(() => {
    if (localStorage.getItem('isC2cCheck') != null) {
        isC2cCheck.value = localStorage.getItem('isC2cCheck') == '1'
    }
})
</script>
<style lang="scss" scoped>
.c2cConfirm {
    padding: 30px 20px 20px 40px;
    text-align: left;
    width: 100%;

    span {
        color: var(--norm_red-color);
    }

    p {
        color: var(--text_color_L1);
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 20px;
    }

    .imgBox {
        margin-top: 50px;
        max-height: 600px;
        overflow-y: auto;
        margin-bottom: 30px;
        width: 100%;

        .box {
            width: 100%;
            >div {
                color: var(--text_color_L4);
                background: var(--main_gradient-color);
                clip-path: polygon(0 0, 98% 0%, 93% 100%, 0% 100%);
                font-size: 28px;
                font-weight: 700;
                padding: 5px 10px;
                display: flex;
                padding-right: 20px;
                margin-bottom: 10px;
            }

            >img {
                max-width: 100%;
                border: 1px solid var(--rechargeBgColor-1);
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 20px;
            }
        }
    }

    .btn {
        background: var(--main_gradient-color);
        box-shadow: --BoxShadowColor-3;
        color: #fff;
        font-size: 30px;
        font-weight: 700;
        text-align: center;
        padding: 15px 0;
        border-radius: 40px;
        margin-top: 40px;

        &.active {
            background:  var(--main_gradient-color);
            color: var(--text_color_L4);
        }
    }
}
</style>
