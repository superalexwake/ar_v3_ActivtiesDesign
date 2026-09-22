<template>
    <Teleport to="body" v-if="props.modelValue">
        <div class="banks-mask">
            <div class="choose-bank">
                <div class="choose-title">{{ $t('selectBank') }}</div>
                <div class="choose-list">
                    <p class="warm-tips">{{ $t('chooseBankWarmTips') }}</p>
                    <div class="bank-radio-group">
                        <van-radio-group class="bank-radio-group-van" v-model="bank.code">
                            <van-radio class="bank-radio-item" v-for="item in props.list" :name="item.code">{{ item.name }}</van-radio>
                        </van-radio-group>
                    </div>
                    <button class="confirm-button" @click="handleChange">{{ $t('confirm') }}</button>
                </div>
            </div>
            <div class="close" @click="handleClose">
                <svg-icon class="img" name="close" />
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import {
	Teleport,
    PropType,
    ref
} from 'vue'


const bank = ref<{name: string, code: number}>({name: '', code: 0})
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    list: {
        type: Array as PropType<{name: string, code: number}[]>,
        default: () => []
    }
})

const handleChange = () => {
    const code = bank.value.code
    const selectedBank = props.list.find(item => item.code == code)
    if (code === 0) return
    if (selectedBank) {
        emit('changeBank', selectedBank)
        emit('update:modelValue', false)
    }
}

const emit = defineEmits(['update:modelValue', 'changeBank'])

const handleClose = () => {
    emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.banks-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 22px;
    .choose-bank {
        background: var(--main_gradient-color2);
        padding: 20px;
        width: 700px;
        height: 997px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        .choose-title {
            text-align: center;
            color: var(--text_color_L4);
            font-family: "PingFang SC";
            margin: 36px 0;
            font-size: 38px;
            font-style: normal;
            font-weight: 600;
            line-height: 36px; /* 94.737% */
            position: relative;
            &::before, &::after {
                content: '';
                width: 110px;
                height: 3px;
                display: block;
                position: absolute;
                top: 50%;
            }
            &::before {
                left: 8%;
                background: linear-gradient(right, #FFF -2.73%, rgba(255, 255, 255, 0.00) 91.36%);
            }
            &::after {
                left: 75%;
                background: linear-gradient(90deg, #FFF -2.73%, rgba(255, 255, 255, 0.00) 91.36%);
            }
        }
        .choose-list {
            flex: 1;
            background: var( --bg_color_L2);
            border-radius: 10px;
            padding: 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 20px;
            overflow: hidden;
            .bank-radio-group {
                flex: 1;
                height: 100%;
                font-size: 32px;
                background: var(--bg_color_L1);
                padding: 30px;
                box-sizing: border-box;
                border-radius: 10px;
                overflow-y: auto;
            }
            .bank-radio-group-van {
                font-size: 32px;
                .bank-radio-item {
                    margin-bottom: 30px;
                }
            }
            .warm-tips {
                font-size: 32px;
                color: var(--text_color_L1, #1E2637);
            }
            .confirm-button {
                width: 100%;
                height: 80px;
                background: var(--main_gradient-color, linear-gradient(90deg, #49C755 15.38%, #0F9957 98.73%));
                border-radius: 40px;
                outline: none;
                border: none;
                color: var(--text_color_L4);
                font-size: 36px;
            }
        }
    }
    .close {
        .img {
            width: 50px;
            height: 50px;
            cursor: pointer;
        }
    }
}
</style>