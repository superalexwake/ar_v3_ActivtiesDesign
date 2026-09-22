<template>
    <div class="foot">
        <div class="item">
            <p>{{$t('quantity')}}</p>
            <span class="marks">{{betQuantity}}</span>
        </div>
<!--				<div class="bar" />-->
        <div class="item">
            <p>{{$t('betAmounts')}}</p>
            <span class="marks">{{ digitalCarry(totalAmount) }}</span>
        </div>
        <div class="item bet" :class="[totalAmount>0?'active':'']" @click="onBet">{{$t('betting')}}</div>
    </div>
</template>
<script lang="ts" setup>
import { digitalCarry } from '@/utils'
const props = defineProps({
    //数量
	betQuantity: {
		type: Number,
		default: 0
	},
    //总下注金额
    totalAmount:{
        type: Number,
		default: 0
    },
})

const emits = defineEmits<{
	(e: 'onBet'): void
}>()
const onBet = () => {
    if(props.totalAmount>0){
        emits('onBet')
    }
}

</script>
<style lang="scss" scoped>
.foot{
    position: fixed;
    bottom: 0;
    left: auto;
    height: 120px;
    width: 100%;
    display: flex;
    text-align: center;
    font-size: 24px;
    max-width: 10rem;
	background-color: var(--bg_color_L2);
	/*.bar{
		width: 1px;
		height:100px;
		background-color: var(----Dividing-line_color);
	}*/
	.item:first-child{
		border-right: 1px solid var(--Dividing-line_color);
	}
    .item{
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-color:var(--bg_color_L2);
        color: var(--text_color_L1);
        &.bet{
            line-height: 50px;
            font-size: 32px;
            font-weight: 700;
            background:var(--bg_color_L3);
            color: var(--text_color_L1);
            &.active{
                background-color: var(--main-color);
                color: #fff;
            }
        }
			&>span{
				font-size: 30px;
				font-weight:700;
				color:var(--norm_red-color);
			}
	}
    
}
</style>