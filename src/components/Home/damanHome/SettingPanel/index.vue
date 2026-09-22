<template>
    <div class="settingPanel__container">
        <div class="settingPanel__container-items">
            <div
                v-for="item in settingPanelItems"
                :key="item.title"
                @click="handleItem(item)"
                class="settingPanel__container-items__item ar-1px-b"
                v-show="item.isopen == '1'"
                v-haspermission="item.haspermission"
            >
                <div class="settingPanel__container-items__title">
                    <svg-icon :name="item.icon" />
                    <span>{{ item.title }}</span>
                </div>
                <div class="settingPanel__container-items-right">
                    <h5 v-show="item.icon === 'notifyIcon' && userInfo?.unRead > 0">{{ userInfo?.unRead }}</h5>
                    <span v-show="item.icon === 'languageIcon'">{{ globalStore.getLanguageName }}</span>
                    <van-icon name="arrow" color="#666" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GlobalStore, SettingStore } from '@/stores'
import { computed, PropType } from 'vue'
import { useRouter } from 'vue-router'
import type { UserInfo } from '@/types/api'
import { useI18n } from 'vue-i18n'
import { requireLoginAction } from '@/hooks/useLoginIntercept'
const { t } = useI18n()
const router = useRouter()
const globalStore = GlobalStore()
const settingS = SettingStore()
const userInfo = computed(() => {
    return globalStore.userInfo as UserInfo
})
interface MenuItem {
    icon: string
    title: string
    link: string
    isopen: string
    haspermission?: number
}
const props = defineProps({
    type: {
        type: String as PropType<string>,
        default: 'default'
    }
})
const isAppDownload = computed(() => settingS.getIsCanAppDownload)
const settingPanelItems = computed<MenuItem[]>(() => {
    if (props.type !== 'default')
        return [
            {
                icon: 'Language',
                title: t('switchLanguages'),
                link: 'Language',
                isopen: '1'
            },
            {
                icon: 'notificationCenter',
                title: t('noti'),
                link: 'Notification',
                isopen: '1'
            },
            {
                icon: 'server',
                title: t('wholeTimeService'),
                link: 'CustomerService',
                isopen: '1'
            },
            {
                icon: 'guide',
                title: t('guide'),
                link: 'Guide',
                isopen: '1'
            },
            {
                icon: 'about',
                title: t('about'),
                link: 'About',
                isopen: '1'
            },
            isAppDownload.value && {
                icon: 'down',
                title: t('downloadAPP'),
                link: '',
                isopen: 1
            }
        ].filter(Boolean) as MenuItem[]
    return [
        {
            icon: 'notifyIcon',
            title: t('notifications'),
            link: 'Messages',
            isopen: '1'
        },
        {
            icon: 'inviteIcon',
            title: t('invitationBonus'),
            link: 'InvitationBonus',
            isopen: userInfo.value.isTaskState,
            haspermission: 15
        },
        {
            icon: 'giftIcon',
            title: t('giftExchange'),
            link: 'RedeemGift',
            isopen: '1'
        },
        {
            icon: 'cps',
            title: t('cpsTip6'),
            link: 'MyCps',
            isopen: userInfo.value.isOpenChampion
        },
        {
            icon: 'orderIcon',
            title: t('productOrder'),
            link: 'PointMall-MyOrders',
            isopen: userInfo.value.isOpenPointMall
        },
        {
            icon: 'laundryIcon',
            title: t('laundryAmount'),
            link: 'Laundry',
            isopen: userInfo.value.isOpenWashCode
        },
        {
            icon: 'mylottery',
            title: t('MyLottery'),
            link: 'PointMall-MyLottery',
            isopen: userInfo.value.isOpenPointMall
        },
        {
            icon: 'statsIcon',
            title: t('gameStatistics'),
            link: 'GameStats',
            isopen: '1',
            haspermission: 17
        },
        {
            icon: 'superIcon',
            title: t('superjackpot'),
            link: 'SuperJackpot',
            isopen: userInfo.value.isOpenJackpotReward
        },
        {
            icon: 'languageIcon',
            title: t('switchLanguages'),
            link: 'Language',
            isopen: '1'
        }
    ]
})
async function handleItem(item: any) {
    // 下载 APP 不在当前页直接下载，统一跳转到下载中心
    if (item.icon === 'down') {
        return router.push({
            path: '/downloadCenter'
        })
    }
    if (item.link === 'Notification') {
        return router.push({
            name: 'Messages',
            query: { tab: 'site' }
        })
    }
    if (item.link === 'SuperJackpot' && !(await requireLoginAction())) return
    router.push({
        name: item.link
    })
}
</script>

<style lang="scss" scoped>
.settingPanel__container {
    padding: 0 20px 10px;
    border-radius: 20px;
    background: var(--darkBg, var(--bg_color_L2));

    h1 {
        margin-bottom: 20px;
        color: #151515;
        font-size: 30px;
    }

	&-items {
		display: flex;
		flex-direction: column;
		color: var(--text_color_L1);

        &__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 28px;
            padding: 25px 0;
            &:last-child:after {
                display: none;
            }

            span {
                color: var(--text_color_L1);
            }
        }

        &__title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            svg {
                width: 50px;
                height: 50px;
                margin: 0 18px 0 0;
                color: var(--main-color);
            }
        }

        &-right {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            span {
                font-size: 28px;
                padding-right: 30px;
            }

            h5 {
                font-size: 24px;
                color: #ffffff;
                border-radius: 32px;
                margin-right: 30px;
                background: #fa5b5b;
                height: 32px;
                padding: 0 10px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}
</style>
