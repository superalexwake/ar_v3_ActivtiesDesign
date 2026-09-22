<template>
    <div class="game">
        <div v-if="isSticky" class="sticky nav" ref="stickyRef">
            <div v-for="item in siderList" :key="item.type" :class="[activeType === item.key && 'active', item.icon]"
                @click="handleClick(item.key, $event, true)">
                <img class="gameImg" :src="item.img" />
                <p>{{ item.title }}</p>
            </div>
        </div>
        <div class="nav" ref="navRef" v-if="siderList.length > 3">
            <div class="navFirst">
                <div class="navList" v-for="item in siderList.slice(0, 3)" :key="item.key" :class="[activeType === item.key && 'active', item.key]"
                @click="handleClick(item.key, $event)">
                <div>
                    <img class="gameImg" :src="item.img" />
                    <p>{{ item.title }}</p>
                </div>
                    
                </div>
            </div>
            <div class="navBottom">
                <div class="navList" v-for="item in siderList.slice(3)" :key="item.key" :class="[activeType === item.key && 'active', item.key]"
                    @click="handleClick(item.key, $event)">
                    <img class="gameImg" :src="item.img" />
                    <p>{{ item.title }}</p>
                </div>
            </div>     
        </div>
    </div>
    <lobby v-if="activeType == ''" @change-type="changeType" :menuList = "siderList" />
    <gameList v-if="showAll.includes(activeType)" :activeType="activeType" />
    <seachGame v-if="seachAll.includes(activeType)" :activeType="activeType" />
</template>

<script setup lang="ts">
    import lobby from './lobby.vue'
    import gameList from './gameList.vue';
    import seachGame from '../club91Home/seachGame.vue';
    import { useHome } from '@/hooks';
    import { onMounted, onUnmounted, provide, reactive, ref } from 'vue';
    import { useI18n } from 'vue-i18n';

    // 导航项数据
    // const navItems = [
    //     { type: 'Popular', label: 'popular', icon: 'popular', imgSrc:popular },
    //     { type: 'lottery', label: 'lottery', icon: 'lottery',imgSrc:lottery},
    //     { type: 'Slot', label: 'Slots', icon: 'slots', imgSrc:slots},
    //     { type: 'Flash', label: 'Mini games', icon: 'miniGame', imgSrc:miniGame },  
    //     { type: 'Fish', label: 'Fishing', icon: 'fishing', imgSrc:fishing },   
    //     { type: 'Chess', label: 'PVC', icon: 'card', imgSrc:card },
    //     { type: 'Sport', label: 'Sports', icon: 'sports', imgSrc:sports},
    //     { type: 'Video', label: 'Casino', icon: 'casino', imgSrc:casino },
    // ];
    const showAll = ['flash', 'fish', 'video', 'sport','popular', 'lottery'];
    const seachAll = ['slot', 'chess']
    const useHomeHook = useHome();
    provide('useHomeHook', useHomeHook);
    const { t } = useI18n()
    const { getGameType, homeState, getAllGame } = useHomeHook
    const activeType = ref('');
    const siderList = reactive<any[]>([])
    // 导航栏容器引用
    const navRef = ref<HTMLDivElement | null>(null);
    const stickyRef = ref<HTMLDivElement | null>(null);
    const getGameTypeList = async () => {
        await getGameType()
        if (homeState.gameTypeList.length > 0) {
            homeState.gameTypeList.forEach((item) => {
                if (item.state !== 1) return
                if (item.categoryCode === 'BigAward') return 
                siderList.push({
                    isShow: item.state === 1,
                    title: t('code' + item.typeNameCode),
                    img: item.categoryImg,
                    key: item.categoryCode.toLocaleLowerCase()
                })
            })
            // console.log('siderList', siderList)
            sessionStorage.setItem('gameMenu', JSON.stringify(siderList))
        }
    }

    // 点击事件处理逻辑
    function handleClick(type: string, event: MouseEvent, isScroll: boolean = false) {
        // console.log('type', type);
        activeType.value = type;
        // 获取当前点击的目标元素
        const target = event.currentTarget as HTMLElement;
        if (navRef.value) {
            const navContainer = navRef.value;
            // 容器宽度和目标元素位置
            const containerWidth = navContainer.offsetWidth;
            const targetLeft = target.offsetLeft - navContainer.offsetLeft;
            const targetWidth = target.offsetWidth;
            // console.log('容器，目标左，目标宽', containerWidth, targetLeft, targetWidth);
            // 计算滚动位置，使目标元素居中
            const scrollTo = Math.max(0, targetLeft - (containerWidth - targetWidth) / 2);
            navContainer.scrollTo({
                left: scrollTo / 2,
                behavior: 'smooth', // 平滑滚动
            });
        }
        if (isScroll && navRef.value) {
            window.scrollTo({
                top: navRef.value.offsetTop + 144,
                behavior: 'smooth'
            })
            const stickyCont = stickyRef.value as HTMLElement;
            // console.log('stickyCont', stickyCont.offsetWidth, stickyCont.offsetLeft, target.offsetLeft, target.offsetWidth);
            const stickyTo = Math.max(0, target.offsetLeft - (stickyCont?.offsetWidth - target.offsetWidth) / 2);
            // console.log('stickyTo', stickyTo);
            stickyCont.scrollTo({
                left: stickyTo,
                behavior: 'smooth', // 平滑滚动
            });
            
        }
    }
    const changeType = (value: string, index: number) => {
        // console.log('value', value);
        activeType.value = value;
        if (index > 2 && navRef.value) {
            window.scrollTo({
                top: navRef.value.offsetTop + 144,
                behavior: 'smooth'
            })
            const stickyCont = stickyRef.value as HTMLElement;
            // console.log('stickyCont', stickyCont.offsetWidth, stickyCont.offsetLeft, target.offsetLeft, target.offsetWidth);
            // console.log('stickyTo', stickyTo);
            stickyCont.scrollTo({
                left: (index - 1) * 150 - 200,
                behavior: 'smooth', // 平滑滚动
            });
        }
    }
    const isSticky = ref(false);

    const handleScroll = () => {
        if (navRef.value) {
            const navTop = navRef.value.getBoundingClientRect().top + 140;
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
p{
    margin: 0;
    padding: 0;
}
    .game {
        .nav {
            &.sticky {
                display: flex;
                height: fit-content;
                flex-wrap: nowrap;
                width: 100%;
                overflow-x: auto;
                align-items: center;
                padding-bottom: 6px;
                position: fixed;
                /* 固定在顶部 */
                top: 0;
                left: 50%;
                width: 100%;
                border-bottom: 1px solid #D8D9DB;
                background: #F1F2F5;
                box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                padding: 20px 24px;
                max-width: 750px;
                gap: 14px;
                transform: translateX(-50%);
                >div{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #696F7A;
                    background: #fff;
                    width: 190px;
                    height: 100px;
                    flex: none;
                    flex-direction: column;
                    border-radius: 20px;
                    p{
                        color: #1E2637;
                        text-align: center;
                        font-size: 32px;
                        margin-top: 0;
                    }
                    .gameImg{
                         width: 64px;
                         height: 64px;
                    }
                    &.active {
                        background: linear-gradient(180deg, #FE6868 -0.23%, #F74747 99.78%);
                        p{
                            color: #fff;
                        }
                    }
                }
                /* 阴影效果 */
            }
            .navFirst{
                display: flex;
                gap: 18px;
                .navList{
                    width: 222px;
                    height: 222px;
                    
                    img{
                        width: 160px;
                    }
                    &:first-child{
                        background: url(./svg/popularBg.svg) no-repeat center;
                        background-size: 100% auto;
                    }
                    &:nth-child(2){
                        background: url(./svg/lotteryBg.svg) no-repeat center;
                        background-size: 100% auto;
                    }
                    &:nth-child(3){
                        background: url(./svg/soltBg.svg) no-repeat center;
                        background-size: 100% auto;
                    }
                    p{
                        text-align: center;
                        color: #FFF;
                        text-align: center;
                        font-size: 34px;
                        font-weight: 600;
                        
                    }
                }
            }
            .navList{
                flex: 1;  
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center; 
            }
            .navBottom{
                display: flex;
                border-radius: 20px;
                margin-top: 20px;
                background: linear-gradient(90deg, #F95A5A 0%, #FF8E8A 50.37%, #FFA178 100%);
                height: 140px;
                .navList{
                    width: 137px;  
                    position: relative;
                    &::after{
                        position: absolute;
                        content: '';
                        width: 1px;
                        height: 116px;
                        background: #FFF;
                        opacity: .5;
                        top: 11px;
                        right: 0;
                        
                    }
                    &:last-child{
                            &::after{
                                display: none;
                            }
                        }
                    img{
                        width: 93px;
                    }  
                    p{
                        text-align: center;
                        color: #FFF;
                        font-size: 30px;
                        word-break: break-all;
                        font-weight: 600;
                        margin-top: 4px;
                    }  
                }
            }
        }
    }
</style>