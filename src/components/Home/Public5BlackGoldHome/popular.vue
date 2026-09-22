<template>
    <div class="popular">
        <div class="title">
			<img src="@icon/home/good.png" alt="">
			<span>{{ $t('platRecom') }}</span>
		</div>
        <div class="container">
            <div v-for="(item, i) in picList1" :key="i">
                <img v-lazy="item.imgUrl" @click="onItemClick(item)" />
                <div class="win-odds" v-if="store.isShowHotGameWinOdds">
                    <span>{{ $t('winOdds') }}</span>
                    <span>{{ item.winOdds }}%</span>
                    <div class="win-p" :style="{ width: `${Math.min(item.winOdds, 100)}%` }" />
                </div>
				<Maintain :item="item"/>
            </div>
        </div>
        <div class="title icon2">
			<img src="@icon/home/Popular.png" alt="">
			<span>{{ $t('hot') }}</span>
		</div>
        <div class="container">
            <div v-for="(item, i) in picList2" :key="i">
                <img v-lazy="item.imgUrl" @click="onItemClick(item)" />
                <div class="win-odds" v-if="store.isShowHotGameWinOdds">
                    <span>{{ $t('winOdds') }}</span>
                    <span>{{ item.winOdds }}%</span>
                    <div class="win-p" :style="{ width: `${Math.min(item.winOdds, 100)}%` }" />
                </div>
				<Maintain :item="item"/>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import { SettingStore } from '@/stores'
import { computed } from 'vue'

const { homeState, onItemClick } = useHome()
const store = SettingStore()
const picList1 = computed(() => {
    return homeState.allGameList?.popular.platformList || []
})
const picList2 = computed(() => {
    return homeState.allGameList?.popular.clicksTopList
})
</script>

<style scoped lang="scss">
.popular {
	padding:40px 24px;
	background:linear-gradient(180deg, #231C21 42.3%, rgba(35, 28, 33, 0.00) 100%);
	border-radius: 24px;
    .title {
		color: var(--text_color_L1, #FDE4BC);
		font-family: "Alibaba PuHuiTi 3.0";
		font-size: 28px;
		font-style: normal;
		font-weight: 600;
		display: flex;
		align-items: center;
		margin-bottom: 24px;
		img{
			width: 40px;
			height:40px;
			margin-right: 16px;
		}
		&.icon2 {
			margin-top: 40px;
		}
    }
    .container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        & > div {
			position: relative;
            width: calc((100% - 36px) / 3);
            display: flex;
            flex-direction: column;
            gap: 12px;
            img {
                width: 100%;
                border-radius: 20px;
            }
            .win-odds {
                display: flex;
                height: 36px;
                background: var(--icon2);
                color: var(--text_color_L4);
                width: 100%;
                border-radius: 10px;
                font-size: 22px;
                overflow: hidden;
                position: relative;
                padding: 0 10px;
                span {
                    position: relative;
                    z-index: 1;
                    display: block;
                    height: 100%;
                    flex: 1;
                    line-height: 40px;
                    &:last-of-type {
                        text-align: right;
                        padding-right: 10px;
                    }
                }
                .win-p {
                    background: var(--main-color);
                    position: absolute;
                    left: 0;
                    height: 100%;
                    html:lang(ar) & {
                        left: unset;
                        right: 0;
                    }
                }
            }
        }
    }
}
</style>
