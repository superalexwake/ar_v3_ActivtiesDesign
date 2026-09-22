<template>
    <div class="game">
        <div v-if="isSticky" class="sticky nav">
            <div v-for="item in navItems" :key="item.type" :class="[activeType === item.type && 'active', item.icon]"
                @click="handleClick(item.type, $event, true)">
                {{ item.label }}
            </div>
        </div>
        <div class="nav" ref="navRef">
            <div v-for="item in navItems" :key="item.type" :class="[activeType === item.type && 'active', item.icon]"
                @click="handleClick(item.type, $event)">
                {{ item.label }}
            </div>
        </div>
    </div>
    <lobby v-if="activeType == ''" @change-type="changeType" />
    <gameList v-if="showAll.includes(activeType)" :activeType="activeType" />
    <seachGame v-if="seachAll.includes(activeType)" :activeType="activeType" />
</template>

<script setup lang="ts">
    import lobby from './lobby.vue'
    import gameList from './gameList.vue';
    import seachGame from './seachGame.vue';
    import { useHome } from '@/hooks';
    import { onMounted, onUnmounted, provide, reactive, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    // 导航项数据
    const navItems =ref([
        { type: '', label: 'Lobby', icon: 'lobby' },
        { type: 'Flash', label: '', icon: 'miniGame' },
        { type: 'Slot', label: 'Slots', icon: 'slots' },
        { type: 'Chess', label: 'Card', icon: 'card' },
        { type: 'Fish', label: 'Fishing', icon: 'fishing' },
        { type: 'Video', label: 'Casino', icon: 'casino' },
        { type: 'Sport', label: 'Sports', icon: 'sports' },
    ]);
    const showAll = ['Flash', 'Fish', 'Video', 'Sport'];
    const seachAll = ['Slot', 'Chess']
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
			// console.log("原属数据",homeState.gameTypeList)
			// 过滤 state===1 并按 sort 降序排序
			const sortedList = homeState.gameTypeList.filter((item:any) => item.state === 1).sort((a, b) => b.sort - a.sort);
			// 匹配 navItems
			const matchedNavItems = navItems.value.filter((nav:any) =>sortedList.some((item:any) => item.categoryCode === nav.type));
			const startHead = { type: '', label: 'Lobby', icon: 'lobby' }
			navItems.value= [startHead, ...matchedNavItems];
			// console.log('匹配到的navItems:', matchedNavItems);
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
                left: scrollTo / 2,
                behavior: 'smooth', // 平滑滚动
            });
        }
        if (isScroll && navRef.value) {
            window.scrollTo({
                top: navRef.value.offsetTop - 10,
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
        .nav {
            display: flex;
            height: fit-content;
            width: 100%;
            overflow-x: auto;
            align-items: center;
            padding-bottom: 6px;

            &.sticky {
                position: fixed;
                /* 固定在顶部 */
                top: 0;
                left: 50%;
                width: 100%;
                border-bottom: 1px solid #D8D9DB;
                background: #F1F2F5;
                box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                height: 130px;
                padding: 0 24px;
                max-width: 750px;
                transform: translateX(-50%);
                /* 阴影效果 */
            }

            &>div {
                display: flex;
                height: 72px;
                padding: 0px 16px 0 52px;
                justify-content: center;
                align-items: center;
                gap: 6px;
                color: #696F7A;
                background-position-x: 16px;
                background-position-y: center;
                background-repeat: no-repeat;
                background-size: 36px;
                flex: none;
                font-family: "Alibaba PuHuiTi 3.0";

                &.lobby {
                    background-image: url(./svg/lobby.svg);
                }

                &.slots {
                    background-image: url(./svg/slots.svg);
                }

                &.card {
                    background-image: url(./svg/card.svg);
                }

                &.fishing {
                    background-image: url(./svg/fishing.svg);
                }

                &.casino {
                    background-image: url(./svg/casino.svg);
                }

                &.sports {
                    background-image: url(./svg/sports.svg);
                }

                &.miniGame {
                    width: 162px;
                    background-image: url(./svg/miniGame.svg);
                    background-position-x: center;
                    background-size: 127px 46px;
                }

                img.game {
                    height: 46px;
                }

                &.active {
                    border-radius: 8px;
                    background-color: #FFF;
                    box-shadow: 0px 4px 10px 0px rgba(30, 38, 55, 0.05);
                    font-size: 28px;
                    color: #1E2637;
                    font-style: normal;
                    font-weight: 900;

                    &.lobby {
                        background-image: url(./svg/lobby_a.svg);
                    }

                    &.slots {
                        background-image: url(./svg/slots_a.svg);
                    }

                    &.card {
                        background-image: url(./svg/card_a.svg);
                    }

                    &.fishing {
                        background-image: url(./svg/fishing_a.png);
                    }

                    &.casino {
                        background-image: url(./svg/casino_a.png);
                    }

                    &.sports {
                        background-image: url(./svg/sports_a.svg);
                    }
                }
            }
        }
    }
</style>
