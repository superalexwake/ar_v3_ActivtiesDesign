<template>
    <div class="resultBox" v-if="data">
        <div class="r123">
            <div class="r">
                <div class="num">
                    <span v-for="(item,index) in data?.firstPrize.split('')" :key="index">{{ item }}</span>
                </div>
                <p>{{$t('d4gameType3') }}</p>
            </div>
            <div class="r">
                <div class="num">
                    <span v-for="(item,index) in data?.secondPrize.split('')" :key="index">{{ item }}</span>
                </div>
                <p>{{$t('d4gameType4') }}</p>
            </div>
            <div class="r">
                <div class="num">
                    <span v-for="(item,index) in data?.thirdPrize.split('')" :key="index">{{ item }}</span>
                </div>
                <p>{{$t('d4gameType5') }}</p>
            </div>
        </div>
        <div class="title">{{$t('d4gameType6') }}</div>
        <div class="rOther">
            <span v-for="(item,index) in data?.specialPrize.split(',')" :key="index">{{ item }}</span>
        </div>
        <div class="title">{{$t('d4gameType7') }}</div>
        <div class="rOther">
            <span v-for="(item,index) in data?.consolationPrize.split(',')" :key="index">{{ item }}</span>
        </div>
    </div>
    
</template>
<script setup lang="ts">
withDefaults(
    defineProps<{
        data?:any
    }>(),
    {
    }
)
</script>
<style lang="scss" scoped>
.resultBox {
    .r123 {
        display: flex;
        gap: 10px;

        .r {
            width: calc(100% / 3);
            background: var(--bg_color_L3);
            display: flex;
            gap: 10px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 15px 0;
            border-radius: 10px;

            .num {
                display: flex;
                gap: 3px;

                span {
                    display: block;
                    background: var(--norm_red-color);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    text-align: center;
                    line-height: 40px;
                    color: #fff;
                    font-size: 28px;
                    font-weight: 700;
                }
            }
            p{
                color: var(--text_color_L2);
                font-size: 28px;
            }
        }
    }
    .title{
        border-radius: 10px;
        background-color: var(--bg_color_L3);
        margin: 20px 0;
        color: var(--main-color);
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        padding: 15px 0;

    }
    .rOther{
        display: flex;
        flex-wrap: wrap;
        gap:7px;
        span{
            width: calc((100% / 5) - 7px);
            background: var(--bg_color_L3);
            color: var(--text_color_L1);
            font-size: 30px;
            font-weight: 700;
            border-radius: 10px;
            text-align: center;
            padding: 10px 0;
            margin-bottom: 5px;
        }
    }
}
</style>