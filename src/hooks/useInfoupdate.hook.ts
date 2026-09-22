import { SetUserLanguage } from '@/api'
import { GlobalStore } from '@/stores'
export function useLanguageUpdate() {
    // 上报用户语言
    async function upUserLanguage() {
        // 前提是用户已经登陆
        const globalStore = GlobalStore()
        if (!globalStore.getToken) return
        try {
            const res = await SetUserLanguage()
            console.log('SetUserLanguage ---->', res)
        } catch (error) {
            console.error('Error setting user language:', error)
        }
    }
    return { upUserLanguage }
}
