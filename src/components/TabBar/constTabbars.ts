import { GlobalStore, SettingStore } from "@/stores"
import { pushEventRewardsLoginDialog } from '@/components/DialogQueue/producers'
import wheelIcon from '@public/common/wheel.png'
import { computed } from "vue"
import type { Router } from "vue-router"
import { useRouter } from "vue-router"

export const newTabBars = [
	{
		name: 'home'
	},
	{
		name: 'activity'
	},
	{
		name: 'turntable'
	},
	{
		name: 'promotion'
	},
	{
		name: 'main'
	}
]

const LOGIN_DIALOG_TAB_NAMES = new Set(['wallet', 'main'])

export async function handleTabBarClick(name: string, router: Router) {
    if (LOGIN_DIALOG_TAB_NAMES.has(name) && !GlobalStore().token) {
        await pushEventRewardsLoginDialog()
        return
    }
    await router.push({ name: name })
}

export const useTabBar = () => {
    const router = useRouter()
    async function handleClick(name: string) {
        await handleTabBarClick(name, router)
    }
    const settingS: any = SettingStore()
    const getInvitedWheelImgUrl = computed(() => {
        let url = settingS.getInvitedWheelImgUrl ? settingS.getInvitedWheelImgUrl : wheelIcon
        return `url(${url})`
    })
    const getInvitedWheelTotalPrizeAmount = computed(() => {
        return settingS.getInvitedWheelTotalPrizeAmount
    })
    const isTurntable = computed(() => {
        return settingS.getIsOpenInvitedWheel
    })

    return {
        isTurntable,
        getInvitedWheelImgUrl,
        getInvitedWheelTotalPrizeAmount,
        handleClick
    }
}
