<template>
    <div class="betAmount">
        <h4 class="title">{{$t('betAmounts')}}</h4>
        <ul class="betAmount-list">
            <li :class="[item==count?'item active':'item']" @click="onAmount(item)" v-for="(item,index) in list" :key="index">{{ item }}</li>
        </ul>
    </div>
</template>
<script lang="ts" setup>
interface propsTs {
    count:number, // 投注金额
    list:number[] //后台配置金额集合
}
withDefaults(defineProps<propsTs>(),{
	count: 10,
})
//  抛出其方法
const emits = defineEmits<{
	(e: 'onAmount',item:number): void
}>()
const onAmount = (item:number) => {
	emits('onAmount',item)
}
</script>
<style lang="scss" scoped>
.betAmount{
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
    &-list{
        display: flex;
        justify-content: space-between;
        .item{
            width: calc(100% / 6 - 12px);
            height: 70px;
            line-height: 70px;
            background-color: var(--bg_color_L3);
            text-align: center;
            border-radius: 10px;
			font-size: 28px;
			font-weight: 700;
			color: var(--text_color_L2);
            &.active{
                background: var(--norm_green-color);
                color: #fff;
            }
        }
    }
}
</style>