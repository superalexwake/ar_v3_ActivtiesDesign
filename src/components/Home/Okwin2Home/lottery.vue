<template>
    <div class="okwin2Home_lottery">
        <div class="title">{{ $t('lottery') }}</div>
        <div class="container">
            <img v-for="(item, i) in picList" :key="i"  v-lazy="item.categoryImg" @click="isAlowGame(item, onItemClick)"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import router from '@/router'
import { computed } from 'vue'

const { homeState, isAlowGame, isSassLotteryGame, openThirdGame } = useHome();
const picList = computed(() => {
    return homeState?.allGameList?.lottery || []
})
const lotteryRoutes = [
    {
        value: 1,
        path: 'WinGo'
    },
    {
        value: 3,
        path: '5D'
    },
    {
        value: 2,
        path: 'K3'
    },
    {
        value: 4,
        path: 'WinTrx'
    },
    {
        value: 5,
        path: 'XoSo'
    },
    {
        value: 6,
        path: 'XoSo'
    },
    {
        value: 7,
        path: 'Binguo'
    },
    {
        value: 8,
        path: '4D'
    }
]

/**
 * @description: 点击前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
    if (isSassLotteryGame(item)) {
        return openThirdGame({ ...item, vendorCode: 'ARLottery' })
    }
    router.push({
        name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
        query: { id: item.id }
    })
}
</script>

<style scoped lang="scss">
.okwin2Home_lottery {
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
		background-image: url('./assets/icon_lottery.svg');
		background-repeat: no-repeat;
		background-size: 40px;
    }
	.container {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		img {
			width: calc(50% - 12px);
			border-radius: 20px;
		}
	}
}
</style>