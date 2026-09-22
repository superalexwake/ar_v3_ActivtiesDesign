<template>
    <div class="okwin2Home_slot">
        <div class="title">{{ $t('electronic') }}</div>
    <van-tabs v-model:active="active" animated class="tabs-nav">
        <van-tab v-for="(type, i) in soltGameType" :key="i" :name="type">
            <template #title>
                <div class="tabs-btn"><svg-icon class="gameIcon" :name="type" />{{  getSlotTitle(type) }}</div>
            </template>
            <div class="slotsPic">
                <template v-if="soltGameList[active]">
                    <div v-for="(game, i) in soltGameList[active]" @click="onItemClick(game)">
						<img v-lazy="game.img" alt="" :key="i"  />
						<Maintain :item="game"/>
					</div>
                </template>
            </div>
        </van-tab>
    </van-tabs>
    <div class="all" @click="gol2('slot')">{{ $t('all') }}</div>
    <Card
        v-if="ActiveSotre.isOpenChampion == 1 && globalStore.token"
        :itemD="championEntranceVO"
        :state="championEntranceVO.state"
        v-model:isRefresh="isRefresh"
        bgImgWidth="100%"
        bgImgHeight="150px"
        @click="() => router.push({ name: 'Championship' })"
    >
    </Card>

    <div class="title sup">{{ $t('superjackpot') }}</div>
    <div class="tip">
        {{ $t('bigAward') }}{{ $t('cpsTip4') }} <span>{{ currency(settingS.jackportMaxReswadAmount) }}</span>
    </div>
    <Swipe class="my-swipe" ref="swipeRef" :autoplay="3000" @change="swipeChange" :lazy-render="false" :show-indicators="false">
        <SwipeItem v-for="(item, x) in supList" :key="x">
            <div class="supjack">
                <div v-for="(game, i) in item"  :key="i">
                    <div class="multiple">{{ game.multiple }}X</div>
                    <img v-lazy="game.imgUrl" />
                    <div class="gameName">{{ game.gameName }}</div>
                    <div class="bonusAmount">{{ currency(game.bonusAmount) }}</div>
                </div>
            </div>
        </SwipeItem>
    </Swipe>
    <div v-if="globalStore.token" class="btn" @click="goSuperJ">{{ $t('lookBigAward') }}</div>
    </div>
    
</template>
<script setup lang="ts">
import { Swipe, SwipeItem } from 'vant'
import Card from '@/components/Activity/Championship/card.vue'
import { useChampionship, useHome } from '@/hooks'
import { useActive } from '@/components/common/use'
import { computed, onMounted, watch } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { currency, splitIntoGroups,getSlotTitle } from '@/utils'
import { GlobalStore, SettingStore } from '@/stores'
import Maintain from '@/components/common/Maintain.vue'

const settingS = SettingStore()
const { homeState, getSlotList, onItemClick, gol2 } = useHome()
const { championEntranceV, championEntranceVO } = useChampionship()
const globalStore = GlobalStore()
const { ActiveSotre, getActive } = useActive()
const active = ref('')
const router = useRouter()
const soltGameType: any = ref([])
const soltGameList: any = ref({})
const isRefresh = ref(false)
watch(isRefresh, (val) => {
    if (isRefresh.value) {
        championEntranceV()
    }
})
const goSuperJ = () => {
    router.push({
        name: 'SuperJackpot'
    })
}
const supList = computed(() => splitIntoGroups(homeState.allGameList?.awardrecordlist || [], 3))
onMounted(async () => {
    await getSlotList()
    soltGameType.value = homeState.slotsGame.map((item) => {
        soltGameList.value[item.vendorCode] = item.childList.slice(0, 6)
        return item.vendorCode
    })
    if (globalStore.token) {
        active.value = soltGameType.value[0]
        await getActive()
        if (ActiveSotre.value.isOpenChampion) championEntranceV()
    }
})
</script>
<style scoped lang="scss">
.title {
    color: var(--text_color_L1, #e3efff);
    font-family: Poppins;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    height: 42px;
    display: flex;
    align-items: center;
    margin: 40px 0 20px 0;
    padding-inline-start: 52px;
    gap: 12px;
    background-image: url('./assets/icon_fish.svg');
    background-repeat: no-repeat;
    background-size: 40px;
    &.sup {
        background-image: url('./assets/icon_super.svg');
    }
}
.all {
    width: 100%;
    height: 78px;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    border-radius: 40px;
    border: 1.5px solid #d0ffef;
    color: var(--text_color_L4);
    background: var(--main_gradient-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
.tip {
    font-size: 22px;
    color: var(--text_color_L2);
    line-height: 34px;
    margin-bottom: 24px;
    span {
        color: var(--main-color);
    }
}
:deep(.van-tabs__wrap) {
    margin-bottom: 20px;
    .van-tabs__nav {
        background: linear-gradient(180deg, rgba(9, 54, 130, 0.55) 5.17%, rgba(1, 16, 53, 0.85) 98.56%);
        border: 2px solid rgba(35, 88, 200, 0.65);
        border-radius: 8px;
        box-sizing: border-box;
        transform: skewX(-4deg);
        padding: 0;
        .van-tab--active {
            background: linear-gradient(180deg, #7afec3 0%, #02afb6 112.5%);
            border: 1.5px solid #d0ffef;
            border-radius: 8px;
            .tabs-btn {
                color: #05012b;
            }
        }
        .tabs-btn {
            color: #acbff6;
            transform: skewX(4deg);
        }
    }
    .van-tabs__line {
        background: transparent;
    }
}
.slotsPic {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    height: fit-content;
    padding: 0 1px;
	&>div{
		position: relative;
		width: calc((100% - 24px) / 3);
		img {
			width: 100%;
			height: 300px;
		}
	}

}
.gameIcon {
    width: 100px;
    height: 50px;
}

.supjack {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    & > div {
        position: relative;
        width: calc((100% - 24px) / 3);
        border-radius: 10px;
        overflow: hidden;
        font-size: 22px;
        img {
            width: 100%;
        }
        .multiple {
            position: absolute;
            top: 0;
            right: 0;
            background: var(--main_gradient-color);
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            font-size: 24px;
            font-weight: 700;
            border-bottom-left-radius: 10px;
        }
		.gameName {
			color: var(--text_color_L3);
			line-height: 33px;
			font-size: 22px;
		}
        .bonusAmount {
            color: var(--main-color);
			line-height: 33px;
			font-size: 22px;
        }
    }
}
</style>
