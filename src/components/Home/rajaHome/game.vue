<template>
    <div class="game">
        <div v-if="isSticky" class="sticky nav">
            <div v-for="item in navItems" :key="item.type" :class="[activeType === item.type && 'active', item.icon]"
                @click="handleClick(item.type, $event, true)"></div>
        </div>
        <div class="nav" ref="navRef">
            <div v-for="item in navItems" :key="item.type"
				 :class="[activeType === item.type && 'active', item.icon]"
                @click="handleClick(item.type, $event)"></div>
        </div>
    </div>
    <lobby v-if="activeType == ''" @change-type="changeType" />
    <gameList v-if="showAll.includes(activeType)" :activeType="activeType" />
</template>

<script setup lang="ts">
    import lobby from './lobby.vue'
    import gameList from './gameList.vue';
    import { useHome } from '@/hooks';
    import { onMounted, onUnmounted, provide, reactive, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    // 导航项数据
    const navItems = [
		{ type: '', label: 'Lobby', icon: 'lobby' },
		{ type: 'Lottery', label: 'Lottery', icon: 'lottery' },
		{ type: 'Popular', label: 'Popular', icon: 'popular' },
		{ type: 'Flash', label: 'Mini Games', icon: 'miniGame' },
		{ type: 'Slot', label: 'Slots', icon: 'slots' },
		{ type: 'Sport', label: 'Sports', icon: 'sports' },
		{ type: 'Video', label: 'Casino', icon: 'casino' },
        { type: 'Chess', label: 'Card', icon: 'card' },
        { type: 'Fish', label: 'Fishing', icon: 'fishing' }
    ];
    const showAll = ['Lottery', 'Flash', 'Slot', 'Fish', 'Popular', 'Video', 'Sport', 'Chess'];
    const useHomeHook = useHome();
    provide('useHomeHook', useHomeHook);
    const { t } = useI18n()
    const { getGameType, homeState, getAllGame } = useHomeHook
    const activeType = ref('');
    const siderList = reactive<any[]>([])
    // 导航栏容器引用
    const navRef = ref<HTMLDivElement | null>(null);
    const getGameTypeList = async () => {
        await getGameType()
        if (homeState.gameTypeList.length > 0) {
            homeState.gameTypeList.forEach((item) => {
                if (item.state !== 1) return
                siderList.push({
                    isShow: item.state === 1,
                    title: t('code' + item.typeNameCode),
                    img: item.categoryImg,
                    key: item.categoryCode.toLocaleLowerCase()
                })
            })
            sessionStorage.setItem('gameMenu', JSON.stringify(siderList))
        }
    }

    // 点击事件处理逻辑
    function handleClick(type: string, event: MouseEvent, isScroll: boolean = false) {
        activeType.value = type;
        // 获取当前点击的目标元素
        const target = event.currentTarget as HTMLElement;
        if (navRef.value) {
            const navContainer = navRef.value;
            // 容器宽度和目标元素位置
            const containerWidth = navContainer.offsetWidth;
            const targetLeft = target.offsetLeft - navContainer.offsetLeft;
            const targetWidth = target.offsetWidth;
            // 计算滚动位置，使目标元素居中
            const scrollTo = Math.max(0, targetLeft - (containerWidth - targetWidth) / 2);
            navContainer.scrollTo({
                left: scrollTo,
                behavior: 'smooth', // 平滑滚动
            });
        }
        if (isScroll && navRef.value) {
            window.scrollTo({
                top: navRef.value.offsetTop - 24,
                behavior: 'smooth'
            })
        }
    }
    const changeType = (value: string) => {
        activeType.value = value;
    }
    const isSticky = ref(false);

    const handleScroll = () => {
        if (navRef.value) {
            const navTop = navRef.value.getBoundingClientRect().top - 40;
            isSticky.value = navTop <= 0; // 如果滚动超过 nav，设置吸顶
        }
    };

    onMounted(() => {
        window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener("scroll", handleScroll);
    });
    getGameTypeList();
    getAllGame();
</script>
<style lang="scss" scoped>
    @font-face {
        font-family: 'AlibabaPuHuiTi';
        src: url('@/assets/fonts/AlibabaSans-Black.woff2') format('woff2');
        font-weight: 900;
        font-display: swap;
    }

    @font-face {
        font-family: 'AlibabaPuHuiTi';
        src: url('@/assets/fonts/AlibabaSans-Bold.woff2') format('woff2');
        font-weight: 700;
        font-display: swap;
    }

    @font-face {
        font-family: 'AlibabaPuHuiTi';
        src: url('@/assets/fonts/AlibabaSans-Heavy.woff2') format('woff2');
        font-weight: 800;
        font-display: swap;
    }

    @font-face {
        font-family: 'AlibabaPuHuiTi';
        src: url('@/assets/fonts/AlibabaSans-Medium.woff2') format('woff2');
        font-weight: 500;
        font-display: swap;
    }

    .game {
		margin-bottom: 35px;
        .nav {
            display: flex;
            height: fit-content;
            width: 100%;
            overflow-x: auto;
            align-items: center;
            padding-bottom: 6px;
			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* IE/Edge */

			&::-webkit-scrollbar {
				display: none; /* Chrome/Safari */
			}

            &.sticky {
                position: fixed;
                /* 固定在顶部 */
                top: 0;
                left: 50%;
                width: 100%;
                background: radial-gradient(271.54% 167.04% at 83.49% -78.37%, #4B0004 0%, #1F0000 93.19%);
				box-shadow: 0px 4px 11.6px -4px #710006;
                z-index: 1000;
                height: 130px;
                padding: 0 24px;
                max-width: 750px;
                transform: translateX(-50%);
                /* 阴影效果 */
            }

            &>div {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: none;
            }
			.lobby{
				background: url(./svg/lobby_icon.svg) center no-repeat;
				width:141px;
				height:60px;
				background-size: auto 60px;
				&.active{
					background: url(./svg/lobby_icon_a.svg) center no-repeat;
					background-size: auto 60px;
				}
			}
			.lottery{
				background: url(./svg/lottery_icon.svg) center no-repeat;
				width:151px;
				height:60px;
				background-size: auto 60px;
				&.active{
					background: url(./svg/lottery_icon_a.svg) center no-repeat;
					background-size: auto 60px;
				}
			}
			.casino{
				background: url(./svg/casion_icon.svg) center no-repeat;
				width:147px;
				height:60px;
				background-size: auto 60px;
				&.active{
					background: url(./svg/casion_icon_a.svg) center no-repeat;
					background-size: auto 60px;
				}
			}
			.popular{
				background: url(./svg/popular_icon.svg) center no-repeat;
				width:160px;
				height:60px;
				background-size: auto 60px;
				&.active{
					background: url(./svg/popular_icon_a.svg) center no-repeat;
					background-size: auto 60px;
				}
			}
			.miniGame{
				background: url(./svg/miniGame_icon.svg) center no-repeat;
				width:150px;
				height:60px;
				background-size: auto 60px;
				&.active{
					background: url(./svg/miniGame_icon_a.svg) center no-repeat;
					background-size: auto 60px;
				}
			}
			.slots{
				background: url(./svg/slots_icon.svg) center no-repeat;
				width:126px;
				height:60px;
				background-size: cover;
				&.active{
					background: url(./svg/slots_icon_a.svg) center no-repeat;
					background-size: cover;
				}
			}
			.sports{
				 background: url(./svg/sports_icon.svg) center no-repeat;
				 width:147px;
				 height:60px;
				background-size: auto 60px;
				 &.active{
					 background: url(./svg/sports_icon_a.svg) center no-repeat;
					 background-size: auto 60px;
				 }
			 }
			.card{
				background: url(./svg/card_icon.svg) center no-repeat;
				width:146px;
				height:60px;
				background-size: cover;
				&.active{
					background: url(./svg/card_icon_a.svg) center no-repeat;
					background-size: cover;
				}
			}
			.fishing{
				background: url(./svg/fishing_icon.svg) center no-repeat;
				width:153px;
				height:60px;
				background-size: auto 60px;
				&.active{
					background: url(./svg/fishing_icon_a.svg) center no-repeat;
					background-size: auto 60px;
				}
			}

        }
    }
</style>
