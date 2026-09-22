<template>
    <div class="lobby">
        <div v-for="(menu, index) in menuList" :key="menu.key">
        <div class="lottery" v-if="menu.key ==='lottery'">
            <div class="h">
                <div class="t">{{ menu.title }}</div>
            </div>
            <div class="b">
                <img v-for="(i, k) in lottertList" :key="k" :src="i.categoryImg" @click="isAlowGame(i, golottery)" />
            </div>
        </div>
        <lobbyItem :listData="popList" :isMore="true" @more-click="moreClick('popular', index)" @item-click="onItemClick" v-if="menu.key ==='popular'">
            <template #head>
                <div class="title pop">{{ menu.title }}</div>
            </template>
        </lobbyItem>
        <lobbyItem :listData="slotList" @more-click="moreClick('slot', index)" @item-click="goleve2($event, 'slot')" v-if="menu.key ==='slot'">
            <template #head>
                <div class="title slot">{{ menu.title }}</div>
            </template>
        </lobbyItem>
        <lobbyItem :listData="miniList" @more-click="moreClick('flash', index)" @item-click="onItemClick" v-if="menu.key ==='flash'">
            <template #head>
                <div class="title miniGame">{{ menu.title }}</div>
            </template>
        </lobbyItem>
        <lobbyItem :listData="fishList" @more-click="moreClick('fish', index)" @item-click="onItemClick" v-if="menu.key ==='fish'">
            <template #head>
                <div class="title fishing">{{ menu.title }}</div>
            </template>
        </lobbyItem>
        <lobbyItem :listData="chessList" @more-click="moreClick('chess', index)" @item-click="goleve2($event, 'chess')" v-if="menu.key ==='chess'">
            <template #head>
                <div class="title chess">{{ menu.title }}</div>
            </template>
        </lobbyItem>
        <lobbyItem :listData="sportList" @more-click="moreClick('sport', index)" @item-click="onItemClick" v-if="menu.key ==='sport'">
            <template #head>
                <div class="title sport">{{ menu.title }}</div>
            </template>
        </lobbyItem>
        <lobbyItem :listData="liveList" @more-click="moreClick('video', index)" @item-click="onItemClick" v-if="menu.key ==='video'">
            <template #head>
                <div class="title live">{{ menu.title }}</div>
            </template>
        </lobbyItem>
    </div>
    <bigaward />
    </div>
</template>
<script setup lang="ts">
    import { computed, inject } from 'vue';
    import { useRouter } from 'vue-router';
    import lobbyItem from './lobbyItem.vue';
    import bigaward from '../club91Home/bigaward.vue';
    // 使用 inject 接收父组件传递的实例
    const useHomeHook: any = inject('useHomeHook');
    const { homeState, isAlowGame, onItemClick,isSassLotteryGame,openThirdGame } = useHomeHook;

    // 定义 Emits
    const emit = defineEmits<{
        (e: 'change-type', item: any): void;
    }>();
    defineProps<{
        menuList: any[];
    }>();
    const router = useRouter()
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
        },
		{
			value: 9,
			path: 'MotoRace'
		},
		{
			value: 10,
			path: 'VideoWinGo'
		}
    ];
    const lottertList = computed(() => {
        return homeState.allGameList?.lottery || []
    })
    const miniList = computed(() => {
        return homeState.allGameList?.flash || []
    })

    const popList = computed(() => {
        return homeState.allGameList?.popular?.platformList.map((i: any) => {
            i.img = i.imgUrl
            return i;
        }) || [];
    })

    const slotList = computed(() => {
        return homeState.allGameList?.slot.map((i: any) => {
            i.img = i.vendorImg
            return i;
        }) || [];
    })
    const chessList = computed(() => {
        return homeState.allGameList?.chess.map((i: any) => {
            i.img = i.vendorImg
            return i;
        }) || [];
    })

    const fishList = computed(() => {
        return homeState.allGameList?.fish || [];
    })

    const liveList = computed(() => {
        return homeState.allGameList?.video.map((i: any) => {
            i.img = i.vendorImg
            return i;
        }) || [];
    })
    const sportList = computed(() => {
        return homeState.allGameList?.sport.map((i: any) => {
            i.img = i.vendorImg
            return i;
        }) || [];
    })
    /**
    * @description: 点击前往游戏页面
    * @return {*}
    */
    const golottery = (item: any) => {
		if (isSassLotteryGame(item)) {
			return openThirdGame({ ...item, vendorCode: 'ARLottery' })
		}
		router.push({
            name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
            query: { id: item.id }
        })
    }
    const moreClick = (value, index) => {
        emit('change-type', value, index); // 向父组件发送事件和数据
    }
    const goleve2 = (value: any, type: string) => {
        sessionStorage.setItem('slotGamesList', JSON.stringify(homeState.allGameList[type]))
        sessionStorage.setItem('gameType', JSON.stringify(type))
        sessionStorage.setItem('clickedItem', JSON.stringify(value))
        router.push({
            name: 'AllOnlineGames'
        })
    }
</script>

<style lang="scss" scoped>
    .lobby {
        font-family: "Alibaba PuHuiTi 3.0";
        display: flex;
        gap: 56px;
        flex-direction: column;

        .lottery {
            .h {
                padding-inline-start: 52px;
                background-image: url(./svg/ball_8.png);
                background-size: 40px;
                line-height: 40px;
                background-repeat: no-repeat;
                background-position-y: center;

                .t {
                    font-style: normal;
                    font-weight: 700;
                    height: 40px;
                    color: #1E2637;
                    font-size: 32px;
                }
            }

            .b {
                margin-top: 32px;
                display: flex;
                flex-wrap: wrap;
                gap: 18px;
                &>img {
                    width: 222px;
                    height: 300px;
                }
            }
        }
    }

    .miniGame {
        width: 250px;
        height: 40px;
        padding-left: 50px;
        line-height: 40px;
        background-image: url(./svg/icon_Mini.png);
        background-size: 40px;
        background-repeat: no-repeat;
    }

    .title {
        color: #1E2637;
        font-family: "Alibaba PuHuiTi 3.0";
        font-size: 28px;
        font-style: normal;
        font-weight: 900;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: left center;
        padding-inline-start: 50px;
        height: 44px;
        line-height: 44px;

        &.pop {
            background-image: url(./svg/icon_Popular.png);
        }

        &.slot {
            background-image: url(./svg/icon_Slots.png);
        }

        &.chess {
            background-image: url(./svg/icon_PVC.png);
        }

        &.fishing {
            background-image: url(./svg/icon_Fishing.png);
        }

        &.live {
            background-image: url(./svg/icon_Casino.png);
        }

        &.casino {
            background-image: url(./svg/icon_Casino.png);
        }

        &.sport {
            background-image: url(./svg/icon_sport.png);
        }
    }

    .tip {
        color: #7D889D;
        height: 34px;
        line-height: 34px;
        font-family: "Alibaba PuHuiTi 3.0";
        font-size: 24px;
        font-style: normal;
        font-weight: 400;

        span {}
    }
</style>
