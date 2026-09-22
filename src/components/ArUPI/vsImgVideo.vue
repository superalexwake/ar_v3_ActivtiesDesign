<template>
    <van-popup v-model:show="show" round style="width: 80%;" :style="{height: auto?'auto':'80%'}">
        <div class="vsImgVideo" :class="contentClass">
            <div class="con" :class="{auto:auto}">
                <slot></slot>
            </div>
            <div class="cmdB" @click="()=>{
				show = false;
				emit('close');
            }">{{ btnText||$t('close') }}</div>
        </div>
    </van-popup>
</template>
<script setup lang="ts">
import { useVModels } from '@vueuse/core'
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
        required: true
    },
	auto:{
		type:Boolean,
		default:false
	},
	contentClass: {
		type:String,
		default:''
	},
	btnText:{
		type:String,
		default:''
	}
})
const emit = defineEmits(['update:show','close'])
const { show } = useVModels(props, emit);
</script>
<style lang="scss" scoped>
.vsImgVideo {
    padding: 40px 30px;
    text-align: left;
    width: 100%;
    height: 100%;
    .con{
		&.auto{
			height: auto;
		}
        height: calc(100% - 120px);
        overflow-y: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        :deep(.van-image){
            max-height: 100%;
        }
        :deep(video),:deep(img){
            max-width: 100%;
            max-height: 100%;
        }
    }
    .cmdB {
        background: var(--main-color);
		color: var(--text_color_L4);
        text-align: center;
        padding: 26px 0;
        border-radius: 16px;
        margin-top: 40px;
    }
}
</style>