<template>
    <div class="game">
        <h1>{{ $t('cpsTip22') }}</h1>
        <div class="items">
                <div class="item" v-for="item in data" :key="item.gameID" @click="onItemClick(item)">
                    <img v-lazy="item.img" />
                </div>
                <div class="lottery" v-for="(i,k) in arLotteryList" :key="k" @click="onItemClick(i)">{{ i.title }}</div>
            <Empty v-if="data.length==0 && arLotteryList.length == 0"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useHome} from "@/hooks"
import Empty from '@/components/Empty/index.vue'
import { useRouter } from "vue-router";
const {onItemClick} = useHome()

const router = useRouter()
withDefaults(
    defineProps<{
        data?: any,
        arLotteryList?: any
    }>(),
    {
    }
)
</script>
<style lang="scss" scoped>
.game{
    margin-top: 30px;
    background: none !important;
    box-shadow: none !important;
    h1{
        color: var(--text_color_L1);
        font-size: 36px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 10px;
        &::before{
            content: '';
            display: block;
            height: 30px;
            width: 6px;
            background: var(--main-color);
        }
    }
    .items{
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        .lottery {
            display: flex;
            width: calc((100% / 3) - 15px);
            border-radius: 20px;
            overflow: hidden;
            color: #fff;
            background: var(--main_gradient-color);
            height: 72px;
            justify-content: center;
            align-items: center;
        }
        .item{
            width: calc((100% / 3) - 15px);
            height: 220px;
            border-radius: 20px;
            overflow: hidden;
            img{
                width: 220px;
                height: 220px;
            }
        }
    }
}
</style>