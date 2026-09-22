<template>
    <div class="gameTypeList">
        <div
            v-for="(type, k) in gameList"
            :key="k"
            :class="['gameTypeItem', type.categoryCode.toLowerCase() == activeType && 'active']"
            @click="setActiveType(type.categoryCode.toLowerCase())"
        >
            <img :src="type.categoryImg" />
            <div class="gameTypeTitle">{{ $t(textMap[type.categoryCode.toLowerCase()]) }}</div>
        </div>
    </div>
    <div>
        <component :is="GameRecordList[activeType]" :id="activeType" />
    </div>
</template>

<script setup lang="ts">
import { useHome } from '@/hooks'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import lottery from './lottery.vue'
import popular from './popular.vue'
import flash from './flash.vue'
import slot from './slot.vue'
import sport from './sport.vue'
import video from './video.vue'
import fish from './fish.vue'
import chess from './chess.vue'

// 动态组件
const GameRecordList: any = {
    lottery,
    popular,
    flash,
    slot,
    sport,
    video,
    fish,
    chess
}
const { getAllGame, getGameType, homeState } = useHome()
const { t } = useI18n()
const gameList: any = computed(() =>homeState.gameTypeList)
const activeType = ref('lottery')
const textMap: any = {
    fish: 'fishing',
    lottery: 'lottery',
    slot: 'electronic',
    flash: 'code9308',
    sport: 'sport',
    video: 'code9306Video',
    chess: 'code9307Chess',
    popular: 'code9302Popular',
    bigaward: 'superjackpot'
}

const setActiveType = (type: any) => {
    activeType.value = type
}
onMounted(async () => {
    await getGameType()
	activeType.value = homeState.gameTypeList[0]?.categoryCode.toLowerCase()
    await getAllGame()
})
</script>

<style lang="scss" scoped>
.gameTypeList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(152px, 1fr));
    flex-wrap: wrap;
    justify-content: space-between; // 让元素均匀分布
    gap: 31px 24px;
    .gameTypeItem {
        width: 152px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('./assets/icon_bg.png');
        &.active {
            background-image: url('./assets/icon_bg_select.png');
            .gameTypeTitle {
                color: var(--main-color);
            }
        }
        img {
            width: 152px;
            height: 122px;
        }
        .gameTypeTitle {
            font-size: 24px;
            color: var(--text_color_L3);
            text-align: center;
        }
    }
}
</style>