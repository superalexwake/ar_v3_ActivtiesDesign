<template>
    <div class="gamelist">
        <div class="tab">
            <div :class="{ active: gameListIndex == 0 }" @click="onSwitch(0)">{{ $t('d4Tip1') }}</div>
            <div :class="{ active: gameListIndex == 1 }" @click="onSwitch(1)">{{ $t('myGame') }}</div>
        </div>
        <div class="con">
            <div class="more" @click="onMore">{{ $t('more') }}<svg-icon name="more" /></div>
            <template v-if="gameListIndex == 0">
                    <div class="items" v-for="(item) in newGameResult" :key="item.issueNumber">
                        <div class="head">
                            <img :src="item.typeImg" alt="">
                            <h1>{{ $t(`d4LType${item.type}`) }}</h1>
                            <p>{{ item.openDate }} {{ $t(`${dayjs(item.openDate).format('dddd')}`) }}</p>
                        </div>
                        <ShowResult :data="item"></ShowResult>
                    </div>
                <Empty v-if="newGameResult?.length == 0" />
            </template>
            <template v-if="gameListIndex == 1">
                <ShowGame v-model:pageQuery="pageQuery"></ShowGame>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { use4D } from '@/hooks/use4D.hook'
import ShowResult from '@/components/Home/AllLotteryGames/4D/showResult.vue'
import ShowGame from '@/components/Home/AllLotteryGames/4D/showGame.vue'
import { useRouter } from 'vue-router'
import { onMounted, reactive, watch } from 'vue';
import dayjs from 'dayjs'
import Empty from '@/components/Empty/index.vue'

const router = useRouter()
const { gameListIndex, newGameResult, get4DResult, getMy4DHistory } = use4D();
function onSwitch(index: number) {
    gameListIndex.value = index
    onLoad()
}
function onMore() {
    if (gameListIndex.value == 0) {
        router.push({
            name: 'AllLotteryGames-4DLotteryResults'
        })
    }
    else if (gameListIndex.value == 1) {
        router.push({
            name: 'AllLotteryGames-4DmyGame'
        })
    }
}

const pageQuery = reactive<any>({
    type: 0,
    date: dayjs(new Date()).format('YYYY-MM-DD'+' 00:00:00'),
    pageSize: 10,
    pageNo: 1
})

function onLoad() {
    if (gameListIndex.value == 0) {
        get4DResult()
    } else {
        getMy4DHistory(pageQuery)
    }
}
onMounted(() => {
    onLoad()
})

</script>
<style lang="scss" scoped>
.gamelist {
    margin-top: 30px;
    padding: 0 24px;

    .tab {
        display: flex;
        height: 80px;
        line-height: 80px;
        background-color: var(--bg_color_L3);
        border-radius: 10px;
        font-size: 32px;
        color: var(--text_color_L2);
        overflow: hidden;

        &>div {
            width: 50%;
            text-align: center;

            &.active {
                color:var(--text_color_L4);
                background: var(--main_gradient-color);
                box-shadow: var(--BoxShadowColor-27);
            }
        }
    }

    .con {
        position: relative;
        margin-top: 20px;
        padding: 20px 10px;
        border-radius: 10px;
        /*background: var(--bg_color_L2);*/
        

        .more {
            border-radius: 10px;
            border: 1px solid var(--main-color);
            padding: 0 20px;
            position: absolute;
            height: 60px;
            right: 10px;
            color: var(--main-color);
            font-size: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
            svg {
                width: 32px;
                height: 32px;
            }
        }

        .items {
            .head {
                background: var(--bg_color_L3);
                text-align: center;
                margin: 100px 0 20px;
                padding-bottom: 10px;
                border-radius: 10px;

                img {
                    width: 107.657px;
                    height: 107.657px;
                    margin-top: -50px;
                    border-radius: 50%;
                    overflow: hidden;
                }

                h1 {
                    color: var(--text_color_L1);
                    font-size: 30px;
                    font-weight: 700;
                    margin: 10px 0;
                }

                p {
                    font-size: 26px;
                    color: var(--text_color_L2);
                }
            }
        }
    }
}

:deep(.gameBox) {
    margin-top: 80px;
}
</style>