<template>
   <!-- 玩法 -->
<div class="howPay">
    <h4 class="title">{{$t('gamePlay')}}</h4>
    <ul class="howPay-list">
        <van-skeleton :loading="!getBetPay(betPayList)" class="flex">
            <template #template>
                <li class="item" v-for=" in 4"></li>
            </template>
            <van-button plain :disabled="getDisabled(item)" :class="[item==betPayId?'item action':'item']" @click="onBetpay(item)" v-for="(item,index) in getBetPay(betPayList)" :key="index">
                {{ $t('d4gamePay'+item) }}
                <i class="icon" v-if="item==betPayId"><van-icon name="success" /></i>
            </van-button>
        </van-skeleton>
    </ul>
</div>
</template>
<script lang="ts" setup>
interface propsTs{
    rollNum:number //判断输入框是否有几个R
    banBetPay:number //是否不符合 四位全保 && 四位包字 0符合 1不符合
    betPayId:number//选中的玩法类型id
    duplex:boolean //选择的时候 个，十 ，百，千是否存在两位 ，一位的时候和输入逻辑一致
    betPayList:number[]
}
const props = withDefaults(defineProps<propsTs>(),{
    rollNum: 1,
    banBetPay:0,
    betPayId:1,
    duplex:false
})
//判断是有四位R选，四位R选不计入选择集合
const getBetPay = (list:number[]) =>{
    if(list.includes(5)){
        return list.slice(0, -1)
    }else{
        return list
    }
}   

// 玩法
// const betPay = reactive([{
//     name:'四位直选',
//     type:0,
// },{
//     name:'四位全保(I-BOX)',
//     type:1,
// },{
//     name:'四位包字(BOX)',
//     type:2,
// },{
//     name:'四位来回',
//     type:3,
// }])
// 判断按钮是否可以点 (当输入数字为AAAA格式的时候，只有四位全保，四位包字不能选),选择投注的时候根据duplex来判断是否多选
const getDisabled = (type:number) =>{
    let result = false;
    let enter = (type === 2||type === 3)&&props.banBetPay === 1||props.rollNum>0; //输入四位全选和四位包字不能选，R选都不能选
    let duplex = props.duplex?(type === 2||type===3||type === 4)&&props.banBetPay === 1:type === 2&&(type === 2||type === 3)&&props.banBetPay === 1;//复式的时候只有直选
    if(enter||duplex){
        result = true;
    }
    return result
}

const emits = defineEmits<{
	(e: 'onBetpay',item:number): void
}>()
const onBetpay = (item:number) => {
	emits('onBetpay',item)
}

</script>
<style lang="scss" scoped>
.howPay{
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
        justify-content: space-between;
        padding: 0;
        .item{
            width:calc(50% - 7px);
            text-align: center;
            border: 1px solid var(--text_color_L2);
            border-radius: 10px;
            margin-bottom: 12px;
            font-size: 28px;
            position: relative;
            overflow: hidden;
			background:var(--bg_color_L3);
            &:active:before{
                opacity: 0;
            }
            .icon{
                position: absolute;
                right: 0;
                bottom: 0;
                height: 40px;
                width: 45px;
                text-align: right;
                background-image: linear-gradient(315deg, var(--main-color) 50%, rgba(255, 255, 255, 0) 50%);
                color: #ffffff;
                line-height: 60px;
            }
            &.action{
                border-color: var(--main-color);
                color: var(--main-color);
            }
        }
    }
}
</style>