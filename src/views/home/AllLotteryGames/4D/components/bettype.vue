<template>
<!-- 投注类型 -->
<div class="betType">
    <h4 class="title">{{$t('xosoTxt78')}}</h4>
    <ul class="betType-list">
        <van-skeleton :loading="!betTypeList" class="flex">
            <template #template>
                <li class="item action" v-for=" in 7"></li>
            </template>
            <li :class="[ betType.includes(item)?'item action':'item']" @click="onBetType(item)" v-for="(item,index) in betTypeList" :key="index">{{ $t('d4gameType'+item) }}</li>
        </van-skeleton>
    </ul>
</div>
</template>
<script lang="ts" setup>
interface propsTs{
    betType:number[]
    betTypeList:number[]
}

withDefaults(defineProps<propsTs>(),{
    //选中集合
})
const emits = defineEmits<{
	(e: 'onBetType',item:number): void
}>()
const onBetType = (item:number) => {
	emits('onBetType',item)
}
</script>
<style lang="scss" scoped>
.betType{
    display: flex;
    flex-direction: column;
    .title{
        font-size: 32px;
        margin-bottom: 10px;
        font-weight: 400;
        position: relative;
        height: 36px;
        line-height: 36px;
        padding-left: 20px;
		color:var(--text_color_L1);
        &::after{
            position: absolute;
            top: 0;
            left: 0;
            content: "";
            display: block;
            width: 6px;
            height: 30px;
            background-color: var(--main-color);
            border-radius: 5px;
        }
    }
    &-list,.flex{
        display: flex;
        flex-wrap: wrap;
        margin-right: -16px;
        width: 100%;
        padding: 0;
        .item{
            display: flex;
            align-items: center;
            justify-content: center;
            width: calc(33.3% - 16px);
            background: var(--bg_color_L3);
            height: 70px;
            border-radius: 10px;
            margin-bottom: 12px;
            margin-right: 16px;
            text-align: center;
            font-size: 28px;
            color: var(--text_color_L2);
            overflow: hidden;
            &.action{
                background: var(--main_gradient-color);
                color: var(--text_color_L4);
            }
        }
    }
}
</style>