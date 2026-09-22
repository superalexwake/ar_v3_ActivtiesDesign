<template>
    <div class="okwin2Home_chess">
        <div class="title">{{ $t('code9307Chess') }}</div>
        <div class="container">
            <div v-for="(item, i) in picList1" :key="i" @click="go(item)">
				<img  v-lazy="item.vendorImg"  />
				<Maintain :item="item"/>
			</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Maintain from '@/components/common/Maintain.vue'

const router = useRouter()
const { homeState } = useHome()
const picList1 = computed(() => {
    return homeState.allGameList?.chess || []
})
const go = (item: string) => {
    sessionStorage.setItem('slotGamesList', JSON.stringify(homeState.allGameList?.chess))
    sessionStorage.setItem('gameType', JSON.stringify('chess'))
    sessionStorage.setItem('clickedItem', JSON.stringify(item))
    router.push({
        name: 'AllOnlineGames'
    })
}
</script>

<style scoped lang="scss">
.okwin2Home_chess {
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
        background-image: url('./assets/icon_chess.svg');
        background-repeat: no-repeat;
        background-size: 40px;
    }
    .container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
		&>div{
			width: calc((100% - 36px) / 3);
			border-radius: 20px;
			position: relative;
			img {
				width:100%;
				border-radius: 20px;
			}
		}

    }
}
</style>