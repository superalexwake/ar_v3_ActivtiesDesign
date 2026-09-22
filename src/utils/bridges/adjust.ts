let adjustToken = ''
const log = console.log.bind(console, '[AdjustBridge]');


async function ensureAdjustReady(times = 10) {
    for (let i = 0; i < times; i++) {
        let token = await getAdjustAdid()
        if (token) {
            log('终于拿到了token', token);
            return true
        }
        await new Promise(r => setTimeout(r, 500))
    }
    throw new Error('TomNativeBridge 获取不到adjust 的id')
}


export const getAdjustAdid = async (token?: string) => {
    if (token) {
        adjustToken = token
    }
    if (adjustToken) return Promise.resolve(adjustToken)
    return (window as any)?.TomNativeBridge?.getAdjustId?.() || Promise.resolve('');
}

export const initAdjust = async () => {
    try {
        log('初始化adjust');
        if ((window as any)?.TomNativeBridge?.initAdjust) {
            (window as any).TomNativeBridge.initAdjust("getAdjustAdid")
            await ensureAdjustReady()
        }
    } catch (error) {
        log('initAdjust error', error);
    }
}


export const trackEvent = async (options: { eventToken: string, [key: string]: any }) => {
    try {
        if (!adjustToken) {
            await initAdjust()
            await new Promise(resolve => setTimeout(resolve, 800))
        }
        const eventToken = options.eventToken
        const params: any = { ...options }
        delete params?.eventToken
        if ((window as any)?.TomNativeBridge?.trackAdjustEvent) {
            (window as any).TomNativeBridge.trackAdjustEvent(eventToken, JSON.stringify(params) || '')
        }
    } catch (error) {
        log('trackAdjustEvent error', error);
    }
}


(window as any).getAdjustAdid = getAdjustAdid