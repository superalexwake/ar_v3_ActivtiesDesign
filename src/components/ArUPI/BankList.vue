<template>
    <div class="item select mt8" v-if="list.length>0">
        <div :class="'x-row x-row-between bg'+item.bankCode" v-for="(item,index) in list" :key="index" @click="onSelect(item,index)">
            <span>{{  item.bankName }} </span>
            <img class="img" :src="getKycBankIcon(item.bankCode)" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import 'swiper/css';
import { useAssets } from '@/hooks/useAssets'

const { getKycBankIcon } = useAssets()

withDefaults(defineProps<{
    list:any
}>(),{
    list:[],
})
const emits =  defineEmits<{
	(e: 'update:show',value:boolean): void
    (e: 'onSelect',value:any,index:number): void
}>()

const onSelect = (item:any,index:number) =>{
    emits('onSelect',item,index)
}
</script>
<style scoped lang="scss">
.item{

&.select{
    &>div{
        padding: 32px;
        border-radius: 16px;
        margin-bottom: 32px;
        height:140px;
        background: linear-gradient(101deg, #2184DC 1.06%, #0242CF 99.4%);
        box-shadow: 0px 4px 10px 0px rgba(40, 134, 244, 0.40);
        &.bgphonepe{
            background: linear-gradient(101deg, #2184DC 1.06%, #0242CF 99.4%);
            box-shadow: 0px 4px 10px 0px rgba(40, 134, 244, 0.40);
        }
        &.bgmobikwik{
            background: linear-gradient(101deg, #8937DC 1.06%, #52259F 99.4%);
            box-shadow: 0px 4px 10px 0px rgba(116, 48, 196, 0.40);
        }
        &.bgpaytm{
            background: linear-gradient(101deg, #6FD0FA 1.06%, #38B5EB 99.4%);
            box-shadow: 0px 4px 10px 0px rgba(80, 193, 242, 0.40);
        }
        &.bgairtel{
            background: linear-gradient(101deg, #FC4141 1.06%, #FB1818 99.4%);
            box-shadow: 0px 4px 10px 0px rgba(239, 67, 67, 0.40);
        }
        &.bgfreeCharge
        {
            background: linear-gradient(101deg, #FF9752 1.06%, #F56224 99.4%);
            box-shadow: 0px 4px 10px 0px rgba(242, 150, 80, 0.40);
        }
		&.bgsupermoney
		{
			background: linear-gradient(101deg, #4D43FE 1.06%, #4A42DE 99.4%);
			box-shadow: 0 4px 10px 0 rgba(77, 67, 254, 0.40);
		}
		&.bgfreo
		{
			background: #212121;
			box-shadow: 0 4px 10px 0 rgba(87, 87, 87, 0.40);
		}
		&.bgslice
		{
			background: linear-gradient(92deg, #E51BE9 0%, #C71ECA 100%);
			box-shadow: 0 4px 10px 0 rgba(232, 87, 234, 0.40);
		}
        span{
            color: #fff;
            font-weight: 500;
            font-size: 28px;
        }
        img{
            width: 240px;
            height: 64px;
            display: block;
            border-radius: 10px;
        }
    }
}
}
</style>