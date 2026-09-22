<script setup lang="ts">
import { BetRule, LotteryInfo, WinningTips,FollowBet } from '@/saasLottery/components'
import { computed, onMounted, provide, ref,watchEffect } from 'vue'
import {useGlobalContext, useStorage} from '@/saasLottery/hooks'
import WinGoInfo from '../../components/wingo3/WinGoInfo.vue'
import { useWinGo3 } from '../../hooks/useWinGo3'
import BettingPopup from '../../components/wingo3/BettingPopup.vue'
import Record from '../../components/wingo3/record.vue'
import Trend from '../../components/wingo3/trend.vue'
import MyRecord from '../../components/wingo3/myRecord.vue'
import audioVue from '@/saasLottery/components/Audio/audio.vue'
const { getWebData, currentGame,lotteryCode } = useGlobalContext()
const { localStore } = useStorage();

const gameComponent = ref('Record')
const currentComponent = computed(() => {
    switch (gameComponent.value) {
        case 'Record':
            return Record
		case 'Trend':
			return Trend
        case 'FollowBet':
            return FollowBet
        case 'MyRecord':
            return MyRecord
        default:
            return null
    }
})
const WinHook = useWinGo3()
provide('WinHook', WinHook)
const {
    randomNum,
    numbers,
    colors,
    bigSmalls,
    issue,
    countdownTime,
    betMultiples,
    betMultiple,
    getIssue,
    useProvide,
    getHistoryIssues,
    countdown,
    historyIssues,
    onBet,
    onRandom,
    showMark,
    winner,
    getIntroduce,
    introduceDialog,
    onSwitchIntroduce,
    introduceHtml,
    introduceLoading,
    getlotteryissue,
    setVoice,
	onClearBet,
	setLotteryCode,
    VoiceType,
} = WinHook

useProvide()

onMounted(async () => {
    await Promise.all([getIssue(true), getWebData()])
    await getHistoryIssues()
})

const winGoNumber5 = computed(() => {
    return historyIssues.value.slice(0, 5).map((item) => item.number)
})
const look=ref(false)
const changeSelectGame = async (item:any) => {
	if (look.value)return;
	look.value=true;
	try {
		onClearBet(true)
		setLotteryCode(item.gameCode)
		await getlotteryissue();
	}catch (e) {

	}finally {
		look.value=false
	}
}

const secondsStr = computed(() => {
    return countdown.value.seconds < 10 ? '0' + countdown.value.seconds : countdown.value.seconds + ''
})


// tab 滚动监听处理
const navRef = ref(null);
onMounted(() => {
	if (!navRef.value) return;
	// 处理PC端的滚动
	let isDown = false;
	let startX: number;
	let scrollLeft: number;
	const navElement:any = navRef.value;
	const onMouseDown = (e:any) => {
		isDown = true;
		navElement.style.cursor = 'grabbing';
		startX = e.pageX - navElement.offsetLeft;
		scrollLeft = navElement.scrollLeft;
	};

	const onMouseLeave = () => {
		isDown = false;
		navElement.style.cursor = 'grab';
	};

	const onMouseUp = () => {
		isDown = false;
		navElement.style.cursor = 'grab';
	};

	// 页面加载时，自动将导航栏滚动到第一个标签位置
	setTimeout(() => {
		const firstTab = navElement.querySelector('div:first-child');
		if (firstTab) {
			navElement.scrollLeft = 0; // 直接滚动到最左侧
		}
	}, 100);

	const onMouseMove = (e:any) => {
		if (!isDown) return;
		e.preventDefault();
		const x = e.pageX - navElement.offsetLeft;
		const walk = (x - startX) * 2; // 滚动灵敏度
		navElement.scrollLeft = scrollLeft - walk;
	};

	// 监听鼠标事件
	navElement.addEventListener('mousedown', onMouseDown);
	navElement.addEventListener('mouseleave', onMouseLeave);
	navElement.addEventListener('mouseup', onMouseUp);
	navElement.addEventListener('mousemove', onMouseMove);

	// 设置初始光标样式
	navElement.style.cursor = 'grab';
	// 当活动选项卡改变时，滚动到相应位置
	watchEffect(() => {
		const activeTab = navElement.querySelector('.active');
		if (activeTab) {
			// 计算滚动位置，使活动标签居中
			const tabCenter = activeTab.offsetLeft + activeTab.offsetWidth / 2;
			const navCenter = navElement.offsetWidth / 2;
			navElement.scrollLeft = tabCenter - navCenter;
		}
	});
});
</script>

<template>
    <div class="winGo3">
        <LotteryInfo :showNav="true" @change-select-game="changeSelectGame" @setVoice="setVoice" :VoiceType="VoiceType" :countdown="countdown" />
        <WinGoInfo :handleRule="onSwitchIntroduce" :issue="issue" :numbers="winGoNumber5" :countdownTime="countdownTime" />
        <div class="Betting__C">
            <div v-show="showMark" class="Betting__C-mark">
                <div v-for="i in secondsStr">{{ i }}</div>
                <!-- <div>{{ props.currentInfo.time4 || '0' }}</div>-->
            </div>


            <div class="Betting__C-head">
                <div :class="['Betting__C-head-'+item.playBet]"  v-for="item of colors" @click="onBet(item)">{{ $t(`bet${item.playBet.charAt(0).toUpperCase() + item.playBet.slice(1)}`) }}</div>
            </div>
            <div class="Betting__C-numC">
                <div
                    v-for="(item, index) in numbers"
                    :key="index"
                    :class="[randomNum == item.playBet ? 'active' : '', 'Betting__C-numC-item' + index]"
                    @click="onBet(item)"
                ></div>
            </div>
            <div class="Betting__C-multiple">
                <div class="Betting__C-multiple-l" @click="onRandom">{{ $t('randomBet') }}</div>
                <div
                    v-for="(item, index) in betMultiples"
                    :key="index"
                    class="Betting__C-multiple-r"
                    @click="betMultiple = item"
                    :class="{ active: item == betMultiple }"
                >
                    X{{ item }}
                </div>
            </div>
            <div class="Betting__C-foot">
                <div @click="onBet(bigSmalls[0])" class="Betting__C-foot-b">{{ $t(`big`) }}</div>
                <div @click="onBet(bigSmalls[1])" class="Betting__C-foot-s">{{ $t(`small`) }}</div>
            </div>
        </div>

        <BettingPopup :currentGame="currentGame?.gameName" />

        <div class="history">
            <div class="nav" ref="navRef">
				<div class="nav-container" :class="{'noScroll': !localStore.get('isOpenFollow')}">
					<div :class="{ active: gameComponent === 'Record' }" @click="gameComponent = 'Record'">
						{{ $t('gameRecords') }}
					</div>
					<div :class="{ active: gameComponent === 'Trend' }" @click="gameComponent = 'Trend'">
						{{ $t('chartTrends') }}
					</div>
					<div :class="{ active: gameComponent === 'FollowBet' }" @click="gameComponent = 'FollowBet'" v-if="localStore.get('isOpenFollow')">
						{{ $t('fts') }}
					</div>
					<div :class="{ active: gameComponent === 'MyRecord' }" @click="gameComponent = 'MyRecord'">
						{{ $t('myRecord') }}
					</div>
				</div>
            </div>
			<div class="nav-box">
				<KeepAlive>
					<Suspense>
						<template #default>
							<component :is="currentComponent" />
						</template>
						<template #fallback>
							<p style="height: 200px"></p>
						</template>
					</Suspense>
				</KeepAlive>
			</div>

        </div>
        <audioVue />
        <WinningTips ref="winner">
            <!-- <template v-slot="{ data }">
        <ul class="k3_main-winner">
          <li v-for="(num, index) in data.premium" :key="index" :class="'number' + num"></li>
        </ul>
      </template> -->
            <template v-slot="{ data }">
                <div class="winner_box">
                    <span>{{ $t('winTips3') }}</span>
                    <div class="winner_result" :class="`color_${data.color.replace(/,/g, '_')}`">
                        <div>
							<span v-for="item of data.color.split(',')">{{ $t('common.' + item) }}</span>
						</div>
                        <div>{{ data.number }}</div>
                        <div>{{ data.number > 4 ? $t('betBig') : $t('betSmall') }}</div>
                    </div>
                </div>
            </template>
        </WinningTips>

        <!-- 玩法说明-->
        <van-popup @open="getIntroduce" v-model:show="introduceDialog" :close-on-click-overlay="false" round>
            <BetRule :title="introduceHtml?.title" @close="onSwitchIntroduce">
                <div class="flex-center" style="height: 100%" v-if="introduceLoading">
                    <van-loading type="spinner" color="#FD565C" />
                </div>
                <div v-else v-html="introduceHtml?.content"></div>
            </BetRule>
        </van-popup>
    </div>
</template>

<style scoped lang="scss">
.winGo3 {
    height: 100%;
    background: var(--bg_color_L1);
}
.Betting__C {
    height: 571px;
    width: calc(100% - 52px);
    margin: 22px auto 24px;
    background: var(--darkBg, var(--bg_color_L2));
    box-shadow: var(--boxShadowColor-35);
    border-radius: 20px;
    padding: 14px 20px 19px 14px;
    position: relative;

    &-mark {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        position: absolute;
        z-index: 99;
        top: 0;
        left: 0;
        color: var(--main-color);
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
		p{
			font-size: 100px;
			font-weight: 700;
			text-align: center;
		}
        html:lang(ar) & {
            left: unset;
            right: 0;
            direction: ltr;
        }
        & > div {
            display: inline-block;
            border-radius: 30px;
            padding: 0 30px;
            background-color: var(--bg_color_L3);
            font-weight: 700;
            font-size: 280px;

            & + div {
                margin-left: 78px;
            }
        }
    }

    &-head {
        height: 70px;
        display: flex;
        justify-content: space-between;

        & > div {
            width: calc((100% - 60px) / 3);
            height: 70px;
            line-height: 70px;
            font-weight: 500;
            font-size: 28px;
            color: #fff;
            text-align: center;
        }

        &-green {
            background: var(--norm_green-color);
            border-radius: 0px 20px 0px 20px;
            box-shadow: var(--boxShadowColor-48);
        }

        &-violet {
            background: var(--norm_Purple-color);
            box-shadow: var(--boxShadowColor-49);
            border-radius: 10px;
        }

        &-red {
            background: var(--norm_red-color);
            border-radius: 20px 0 20px 0;
            box-shadow: var(--boxShadowColor-red);
        }
    }

    &-numC {
        height: 260px;
        margin: 26px auto;
        background: var(--bg_color_L1);
        border-radius: 20px;
        padding: 13px 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        & > div {
            width: 110px;
            height: 50%;
            border-radius: 50%;
            font-weight: 400;
            text-align: center;
            background-repeat: no-repeat;
            background-size: 110px;
            background-position: center;

            &.active {
                transform: scale(0.9);
            }

            $list: 0 1 2 3 4 5 6 7 8 9;

            @each $i in $list {
                &.Betting__C-numC-item#{$i} {
                    background-image: url('@game/WinGo/assets/wingo3/img/ball_#{$i}.png');
                }
            }
        }
    }

    &-multiple {
        margin-top: 22px;
        height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-l {
            width: 160px;
            height: 68px;
            line-height: 68px;
            text-align: center;
            border: 2px solid var(--darkLight, var(--norm_red-color));
            border-radius: 16px;
            font-size: 28px;
            color: var(--darkLight, var(--norm_red-color));
        }

        &-r {
            height: 60px;
            width: 74px;
            line-height: 60px;
            font-size: 24px;
            color: var(--darkTextW, var(--text_color_L2));
			background: var(--bgDark-4, var(--bg_color_L1));
            border-radius: 16px;
            text-align: center;

            &.active {
                background: var(--norm_green-color);
                color: #fff;
            }
        }
    }

    &-foot {
        height: 72px;
        display: flex;
        margin-top: 20px;
        justify-content: center;

        &-b,
        &-s {
            width: 310px;
            height: 72px;
            line-height: 72px;
            text-align: center;
            font-size: 32px;
            color: #fff;
        }

        &-b {
            background-color: var(--norm_secondary-color);
            border-radius: 40px 0px 0px 40px;
        }

        &-s {
            background: var(--norm_bule-color);
            border-radius: 0 40px 40px 0;
        }
    }

    .bgcolor {
        color: var(--text_color_L1) !important;
    }

    &-popup {
        &-head {
            height: 190px;
            position: relative;
            padding-top: 30px;

            &::after {
                content: '';
                position: absolute;
                width: 50%;
                left: 0;
                bottom: 0;
                height: 59px;
                background-image: linear-gradient(9deg, var(--bg_color_L2) 50%, transparent 50%);
                html:lang(ar) & {
                    left: unset;
                    right: 0;
                }
            }

            &::before {
                content: '';
                position: absolute;
                right: 0;
                bottom: 0;
                width: 50%;
                height: 59px;
                background-image: linear-gradient(-9deg, var(--bg_color_L2) 50%, transparent 50%);
                html:lang(ar) & {
                    left: 0;
                    right: unset;
                }
            }

            &-title {
                height: 44px;
                font-weight: 700;
                font-size: 36px;
                text-align: center;
                color: var(--text_color_L1);
            }

            &-selectName {
                width: 560px;
                height: 50px;
                margin: 16px auto 0;
                background: var(--bg_color_L2);
                border-radius: 10px;
                text-align: center;
                font-weight: 500;
                font-size: 26px;

                & > span {
                    line-height: 50px;

                    & + span {
                        margin-left: 28px;
                    }
                }
            }
        }

        &-body {
            height: 390px;
            padding: 57px 26px 40px 26px;

            &-line {
                font-size: 32px;
                color: var(--colorText-3);
                height: 56px;
                line-height: 56px;
                display: flex;
                justify-content: space-between;

                &-list {
                    display: flex;
                    justify-content: space-between;
                }

                &-item {
                    padding: 0 16px;
                    background: var(--gray-color-1);

                    & + div {
                        margin-left: 12px;
                    }
                }

                & + div {
                    margin-top: 30px;
                }

                &-btnL {
                    justify-content: center;
                    display: flex;
                }

                &:last-child {
                    justify-content: flex-start;
                }
            }
        }

        &-foot {
            height: 72px;
            display: flex;
            text-align: center;
            line-height: 72px;
            font-size: 28px;
            color: var(--text_color_L1);

            &-c {
                flex: 1;
                background: var(--bgcolor-1);
                color: var(--text_color_L2);
            }

            &-s {
                flex: 2;
            }
        }

        &-12,
        &-1,
        &-3,
        &-7,
        &-9 {
            .bgcolor {
                background-color: var(--norm_green-color);
            }

            .Betting__C-popup-head {
                background: var(--linearGradien-1);
            }
        }

        &-10,
        &-2,
        &-4,
        &-6,
        &-8 {
            .bgcolor {
                background-color: var(--norm_red-color);
            }

            .Betting__C-popup-head {
                background: var(--main-color);
            }
        }

        &-0 {
            .bgcolor {
                background-color: var(--norm_red-color);
            }

            .Betting__C-popup-head {
                background: var(--linearGradien-5);
            }
        }

        &-5 {
            .bgcolor {
                background-color: var(--norm_red-color);
            }

            .Betting__C-popup-head {
                background: linear-gradient(to bottom right, var(--norm_red-color) 50%, #eb43dd 0);
            }
        }

        &-11 {
            .bgcolor {
                background-color: var(--norm_Purple-color);
            }

            .Betting__C-popup-head {
                background: var(--norm_Purple-color);
            }
        }

        &-13 {
            .bgcolor {
                background-color: var(--norm_secondary-color);
            }

            .Betting__C-popup-head {
                background: var(--linearGradien-8);
            }
        }

        &-14 {
            .bgcolor {
                background-color: var(--norm_bule-color);
            }

            .Betting__C-popup-head {
                background: var(--linearGradien-9);
            }
        }

        &-btn {
            width: 56px;
            height: 56px;
            pointer-events: none;
            text-align: center;
            font-size: 50px;
            padding: 0;
            color: var(--gray-color-1);
            flex: none;
        }

        .bgcolor {
            pointer-events: all;
            color: var(--text_color_L1);
        }

        &-input {
            border: 1px solid var(--gray-color-1);
            padding: 2px 20px;
            width: 158px;

            :deep(.van-field__control) {
                text-align: center;
                font-size: 28px;
                line-height: 54px;
            }
        }
    }
}

.history {
    //padding: 0 26px;
	width: 100%;
	.nav {
		padding-left: 26px;
		overflow-x: auto; /* Hide scrollbar */
		white-space: nowrap;
		/* 添加平滑滚动效果 */
		scroll-behavior: smooth;
		/* 确保触摸设备可以滚动 */
		-webkit-overflow-scrolling: touch;
		/* 隐藏所有浏览器的滚动条但保持功能 */
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		&::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Opera */
			width: 0;
			height: 0;
		}

		& > .nav-container {
			display: inline-flex;
			justify-content: space-between;
			margin-bottom:30px;
			&.noScroll{
				& > div {
					width:220px;
				}
			}
			& > div {
				flex: 0 0 auto;
				width:240px;
				height: 72px;
				text-align: center;
				font-size: 28px;
				color: #929292;
				display: flex;
				background: var(--bg_color_L2);
				align-items: center;
				justify-content: center;
				border-radius: 16px;
				margin: 0 10px; /* Add left and right spacing */
				/* 在PC端添加指针样式提示可交互性 */
				cursor: pointer;
				/* 轻微动画提高体验 */
				transition: transform 0.2s;
				user-select: none; /* 防止文本选择干扰拖动 */
				box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.16);
				&.active {
					font-weight: 500;
					color: var(--text_color_L4);
					background: var(--main_gradient-color, var(--main_gradient-color));
				}
				&:first-child {
					margin-left: 0;
				}
			}
		}

		/* Hide scrollbar for all browsers */
		::-webkit-scrollbar {
			width: 0;
			height: 0;
			background: transparent;
		}
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE and Edge */

		/* Ensure the overflow behavior is set to allow scrolling */
		overflow-x: auto;
		overflow-y: hidden;

		/* 添加触摸设备和PC端的悬停效果 */
		@media (hover: hover) {
			.nav-container > div:hover:not(.active) {
				//transform: translateY(-2px);
				background: var(--bg_color_L3, #444);
			}
		}
	}
	.nav-box{
		padding:0 26px
	}
}
.winner_box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    padding: 0 20px;
    gap: 12px;
    >span {
        flex: none;
    }
}
.winner_result {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    >div {
        border-radius: 10px;
        min-width: 78px;
        padding: 0 8px;
        height: 44px;
        color: #fff;
        font-size: 24px;
        text-align: center;
        line-height: 44px;
		span{
			margin:0 6px;
		}
    }
    >div:nth-child(2) {
        flex: none;
        width: 40px;
        height: 40px;
		min-width:40px;
        padding: 0;
        line-height: 40px;
        border-radius: 50%;
    }
    &.color_green >div {
        background: #40ad72;
    }
    &.color_red >div {
        background: #f85050;
    }
    &.color_violet >div {
        background: #a56bff;
    }
    &.color_red_violet >div {
        background: linear-gradient(135deg, #f85050 50.96%, #a56bff 50.97%);
    }
    &.color_green_violet >div {
        background: linear-gradient(135deg, #40ad72 51.48%, #a56bff 51.49%);
    }
}
</style>