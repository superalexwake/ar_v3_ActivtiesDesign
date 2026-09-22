<template>
    <div class="ChampionshipDetail">
        <NavBar :title="title" left-arrow @click-left="() => router.back()" />
        <template  v-if="JSON.stringify(championTaskDetailVO) !== '{}'">
            <Card :itemD="championTaskDetailVO" :state="championTaskDetailVO.state"
                v-model:isRefresh="isRefresh">
            </Card>
            <div class="ranking">
                <div class="title">
                    <span>{{ $t('binguoPaimin') }}</span>
                    <span>{{ $t('betAmounts') }}</span>
                    <span>{{ $t('k3WarningTip4') }}</span>
                </div>
                <div class="amount">
                    <template v-if="championTaskDetailVO && championTaskDetailVO.userJoinInfo">
                        <span>{{ championTaskDetailVO.userJoinInfo.ranking }}</span>
                        <span>{{ currency(championTaskDetailVO.userJoinInfo.sumBetAmount || 0) }}</span>
                        <span>{{ currency(championTaskDetailVO.userJoinInfo.awardsAmount || 0) }}</span>
                    </template>
                    <template v-else>
                        <span>--</span>
                        <span>--</span>
                        <span>--</span>
                    </template>

                </div>
            </div>
        </template>
        <div class="rankingList">
            <div class="title">
                <span>TOP</span>
                <span>{{ $t('account') }}</span>
                <span>{{ $t('betAmounts') }}</span>
                <span>{{ $t('k3WarningTip4') }}</span>
            </div>
            <div class="info" v-for="(item, index) in top10UserListVO" :key="index">
                <span v-if="![1, 2, 3].includes(item.ranking)" class="txt">{{ item.ranking }}</span>
                <span v-else :class="`top${item.ranking}`"></span>
                <span>{{ item.userName }}</span>
                <span>{{ currency(item.sumBetAmount || 0) }}</span>
                <span>{{ currency(item.awardsAmount || 0) }}</span>
            </div>
            <div class="refresh">{{ $t('cpsTip28') }}</div>
            <Empty v-if="top10UserListVO.length==0"></Empty>
        </div>
        <Rule :data="championTaskDetailVO"></Rule>
        <Game :data="thirdGameListVO" :arLotteryList="arLotteryList"></Game>
    </div>
   
</template>
<script setup lang="ts">
import {useRouter} from 'vue-router'
import Card from '@/components/Activity/Championship/card.vue'
import Rule from '@/components/Activity/Championship/rule.vue'
import Game from '@/components/Activity/Championship/game.vue'
import Empty from '@/components/Empty/index.vue'
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {useChampionship} from "@/hooks"
import {currency} from '@/utils'

const { tabList, getChampionTaskDetailV, championTaskDetailVO, getTop10UserList, top10UserListVO,
    thirdGameListVO, arLotteryList } = useChampionship()
const router = useRouter()
const title = computed(() => {
    return championTaskDetailVO.value ? tabList.find((item) => item.key == championTaskDetailVO.value.state)?.title : ''
})
const championId = ref()
const isRefresh = ref(false)
const timer = ref<NodeJS.Timeout | null>(null)
function onLoad(){
    getChampionTaskDetailV(championId.value)
}

watch(isRefresh,
    (val) => {
        if (isRefresh.value) {
            onLoad()
        }
    })

const loopFunction = () => {
    getTop10UserList(championId.value)
};
onMounted(() => {
    championId.value = Number(router.currentRoute.value.query.championId) || 0
    if (championId.value != 0) {
        onLoad()
        loopFunction();
        timer.value = setInterval(loopFunction, 10 * 60 * 1000);
    }
})
onBeforeUnmount(() => {
	clearInterval(timer.value as NodeJS.Timeout)
})
</script>
<style lang="scss" scoped>
@mixin flexS1 {
    display: flex;
    gap: 10px;

    >span {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 80px;
        word-break: break-all;
    }
}

.ChampionshipDetail {
    padding: 0 20px 40px;

    >div {
        border-radius: 10px;
        overflow: hidden;
        
    }

    .ranking {
        margin-top: 15px;

        .title,
        .amount {
            @include flexS1;

            >span {
                width: calc(100% / 3);
            }
        }

        .title {
            background: var(--sheet_nva_color);
            color: var(--text_white, var(--text_color_L1));
            font-weight: 700;
            font-size: 28px;
            
        }

        .amount {
            font-weight: 500;
            background-color: var(--bg_color_L2);
            color:var(--text_color_L1);
            >span:last-of-type {
                color: var(--norm_red-color);
            }
        }
    }
       
    .rankingList {
        margin-top: 15px;

        .title,
        .info {
            @include flexS1;
            >span:first-of-type{
                width: 100px;
            }

            >span:not(:first-of-type) {
                width: calc((100% - 100px) / 3);
            }
        }

        .title {
			background: var(--sheet_nva_color);
            color: var(--text_white, var(--text_color_L1));
            font-size: 26px;
            font-weight: 700;
        }

        .info {
            color: var(--text_color_L2);
            $list: 1 2 3;

            @each $i in $list {
                .top#{$i} {
                    background: url('@/assets/icons/activity/Championship/#{$i}.png') no-repeat center;
                    background-size: 70px 70px;
                }
            }

            .txt {
                font-family: Roboto;
                font-size: 36px;
                font-weight: 900;
                background: linear-gradient(180deg, #C4CFDF 0%, #778DAE 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            >span:nth-of-type(3) {
                // justify-content: left;
            }

            >span:last-of-type {
                color: var(--norm_red-color);
                // justify-content: right;
                font-weight: 500;
            }

            &:nth-child(odd) {
                background: var(--bg_color_L3);
            }

            &:nth-child(even) {
                background: var(--bg_color_L2);
            }
        }
        .refresh{
            padding: 25px;
            text-align: center;
            background: var(--bg_color_L2);
            color: var(--text_color_L1);
        }
    }
}
</style>