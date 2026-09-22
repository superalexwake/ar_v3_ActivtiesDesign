<template>
    <div class="lobby">
        <div class="lottery">
            <div class="h">
				<div class="left-title"></div>
				<div class="right-more" @click="gol2('lottery')">{{ homeState.allGameList?.lottery.length}} Games</div>
            </div>
				<Swipe class="my-swipe" ref="swipeRef" :autoplay="3000" :lazy-render="false"
					   :show-indicators="false">
					<SwipeItem v-for="(item, x) in lottertList" :key="x" class="lotty-swipe">
						<div class="lotteryList" v-for="(game) in item" :key="game.categoryCode">
							<img v-lazy="game.categoryImg" @click="isAlowGame(game, golottery)" />
							<p>lottery</p>
							<div>{{game.categoryCode}}</div>
						</div>
					</SwipeItem>
				</Swipe>
        </div>

		<lobbyItem class="lottery" :listData="popList" @item-click="onItemClick">
			<template #head>
				<div class="left-title pop"></div>
				<div class="right-more" @click="gol2('popular')">{{ popList?.length}} Games</div>
			</template>
		</lobbyItem>
        <lobbyItem class="lottery" :gameType="'Mini Games'" :listData="miniList" @more-click="moreClick('Flash')" @item-click="onItemClick">
            <template #head>
                <div class="left-title miniGame"></div>
				<div class="right-more" @click="gol2('falsh')">{{ miniList?.length}} Games</div>
            </template>
        </lobbyItem>

        <lobbyItem class="lottery" :gameType="'Slots'" :listData="slotList" @more-click="moreClick('Slot')" @item-click="goleve2($event, 'slot')">
            <template #head>
				<div class="left-title slot"></div>
				<div class="right-more" @click="gol2('slot')">{{ slotList?.length}} Games</div>
            </template>
        </lobbyItem>
		<div class="videoBanner" @click="onToTurntable" ref="turntableId" v-if="store.getBigTurntableLink"></div>
		<lobbyItem class="lottery" :gameType="'Sports'" :listData="sportList" @more-click="moreClick('Sport')" @item-click="onItemClick">
			<template #head>
				<div class="left-title sport"></div>
				<div class="right-more" @click="gol2('sport')">{{ sportList?.length}} Games</div>
			</template>
		</lobbyItem>
		<lobbyItem class="lottery" :gameType="'Casino'" :listData="liveList" @more-click="moreClick('Video')" @item-click="onItemClick">
			<template #head>
				<div class="left-title live"></div>
				<div class="right-more" @click="gol2('video')">{{ liveList?.length}} Games</div>
			</template>
		</lobbyItem>
		<lobbyItem class="lottery" :gameType="'Card Games'" :listData="chessList" @more-click="moreClick('Chess')" @item-click="goleve2($event, 'chess')">
            <template #head>
				<div class="left-title chess"></div>
				<div class="right-more" @click="gol2('chess')">{{ chessList?.length}} Games</div>
            </template>
        </lobbyItem>
        <lobbyItem class="lottery" :gameType="'Fishing'" :listData="fishList" @more-click="moreClick('Fish')" @item-click="onItemClick">
            <template #head>
				<div class="left-title fishing"></div>
				<div class="right-more" @click="gol2('fish')">{{ fishList?.length}} Games</div>
            </template>
        </lobbyItem>

    </div>
</template>
<script setup lang="ts">
    import { computed, inject } from 'vue';
    import { useRouter } from 'vue-router';
    import lobbyItem from './lobbyItem.vue';

	import {Swipe, SwipeItem} from "vant";
	import { splitIntoGroups } from "@/utils";
	import {SettingStore} from "@/stores";
    // 使用 inject 接收父组件传递的实例
    const useHomeHook: any = inject('useHomeHook');
    const { homeState, isAlowGame, isSassLotteryGame, onItemClick, openThirdGame, gol2 } = useHomeHook;
    // 定义 Emits
    const emit = defineEmits<{
        (e: 'change-type', item: any): void;
    }>();
    const router = useRouter()
	const store=SettingStore();
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
    ];
    const lottertList = computed(() => {
        const lottery = homeState.allGameList?.lottery || []
		return splitIntoGroups(lottery || [], 3)
    })
    const miniList = computed(() => {
        return homeState.allGameList?.flash || []
    })

    const popList = computed(() => {
        return homeState.allGameList?.popular?.platformList?.map((i: any) => {
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
		if (isSassLotteryGame(item)){
			return openThirdGame({...item,vendorCode:'ARLottery'})
		}
        router.push({
            name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
            query: { id: item.id }
        })
    }
    const moreClick = (value) => {
        emit('change-type', value); // 向父组件发送事件和数据
    }
    const goleve2 = (value: any, type: string) => {
        sessionStorage.setItem('slotGamesList', JSON.stringify(homeState.allGameList[type]))
        sessionStorage.setItem('gameType', JSON.stringify(type))
        sessionStorage.setItem('clickedItem', JSON.stringify(value))
        router.push({
            name: 'AllOnlineGames'
        })
    }
	function onToTurntable() {
		if (!store.getBigTurntableLink)return;
		window.open(store.getBigTurntableLink)
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
				height: 66px;
				display:flex;
				justify-content: space-between;
				.left-title{
					width: 50%;
					height: 66px;
					flex-shrink: 0;
					background-image: url(./svg/lottrry.svg);
					background-size: 247px auto;
					background-repeat: no-repeat;
					&.miniGame {
						background-image: url(./svg/mini_icon.svg);
						background-size: 333px auto;
					}
					&.pop {
						background-image: url(./svg/pop.svg);
						background-size: 269px auto;
					}
					&.slot {
						background-image: url(./svg/slot_icon.svg);
						background-size: 213px auto;
					}

					&.chess {
						background-image: url(./svg/chess_icon.svg);
						background-size: 345px auto;
					}

					&.fishing {
						background-image: url(./svg/fish_icon.svg);
						background-size: 255px auto;
					}

					&.live {
						background-image: url(./svg/casino.svg);
						background-size: 247px auto;
					}

					&.sport {
						background-image: url(./svg/sport_icon.svg);
						background-size: 247px auto;
					}
				}
				.right-more{
					background: url('./svg/moreRight.svg') right center no-repeat;
					background-size:34px auto;
					height:66px;
					padding-right: 46px;
					color: #FF3374;
					font-size: 17px;
					line-height: 66px;
				}
            }
			.lotty-swipe{
				display: flex;
				justify-content: start;
			}

            .lotteryList {
                margin-top: 16px;
				width: calc(33.33% - 13px);
				margin-right: 19.5px;
				&:last-child{
					margin-right: 0;
				}
                &>img {
                    width: 100%;
                    height: 304px;
                }
				&> p{
					color: var(--text_color_L1);
					font-size: 20px;
					margin:6px 0;
				}
				&> div{
					color: var(--text_color_L1);
					font-size: 22px;
					font-weight: 700;
				}
            }
        }
    }

    .videoBanner {
        background: url('./svg/videoBanner.svg') center center no-repeat;
		height: 333px;
		background-size: contain;
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
