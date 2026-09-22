<template>
    <div class="select">
        <ul class="tab">
            <li @click="allAddnum(item.type)" :class="allActive.includes(item.type)?'active':''" v-for="(item,index) in tabList" :key="index">
                {{item.name}}
                <span>ALL</span>
            </li>
        </ul>
        <div class="numList">
            <ul v-for="(item,index) in numList" :key="index">
                <li v-for="(citem,cindex) in 10" :class="[item?.list.includes(cindex)?'action':'']" :key="citem" @click="addNumber(index,cindex)">{{ cindex }}</li> 
            </ul>
        </div>
    </div>
</template>
<script lang="ts" setup>
interface propsTs {
    tabList:{name:string,type:number}[], //个，十，百，千集合
    allActive:number[], //选中个，十，百，千集合
    numList: {
            list: number[];
        }[] //复选数字选中集合
}
withDefaults(defineProps<propsTs>(),{})

const emits = defineEmits<{
	(e: 'allAddnum',item:number): void
    (e: 'addNumber',type:number,index:number): void
}>()
//单点，个，十，百，千
const allAddnum = (item:number) => {
	emits('allAddnum',item)
}
//单点复选号码
const addNumber = (type:number,index:number) => {
	emits('addNumber',type,index)
}
</script>
<style lang="scss" scoped>
    .select{
        margin-top: 30px;
        margin: 0 -24px;
        .tab{
            display: flex;
            justify-content: space-between;
            height: 80px;
            li{
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: calc(25% - 4px);
                height: 80px;
                text-align: center;
                background-color: var(--bg_color_L3);
                border-radius: 10px 10px 0 0;
				color:var(--text_color_L2);
                &.active{
                    background: var(--main-color);
                    color: #fff;
                }
            }
        }
        .numList{
            display: flex;
            background-color: var(--bg_color_L2);
            border-radius: 0 0 10px 10px;
            margin-top: 20px;
            ul{
                width: 25%;
                text-align: center;
                li{
                    margin: 0 auto 20px;
                    height: 110px;
                    width: 110px;
                    line-height: 110px;
                    background: url('@/assets/icons/svg/nbg.svg') no-repeat center center;
                    background-size: cover;
                    color: var(--text_color_L2);
                    font-size: 50px;
                    font-style: normal;
                    font-weight: 700;
                    &.action{
                        color: var(--norm_red-color);
                        background: url('@icon/public/anbg.svg') no-repeat center center;
                        background-size: cover;
                    }
                    
                }
            }
        }
    }
</style>