import {onBeforeUnmount, ref} from "vue";
import {useEventListener} from '@vueuse/core'
import {useWorkerIntervalFn} from "./useWorkerIntervalFn.hook";
import {useStorage} from "./useStorage.hook";
import {STORAGE_TOKEN} from "./constant";
import {parseJWT} from "@/saasLottery/utils";
import {useGlobalState} from "./useGlobal.hook";
const TIMEOUT_THRESHOLD = 3*60*1000;
let lastActivityTime = Date.now();
export function useJwt(){
    const {localStore}=useStorage();
    const {triggerTimer}=useGlobalState()
    const idle=ref(false)
    const {start,pause, resume} = useWorkerIntervalFn(async () => {
            const token=localStore.get(STORAGE_TOKEN);
            const currentTime=Date.now();
            const {payload}=parseJWT(token||'');
            const exp=payload.exp;
            if (!token)return;
            if ((currentTime - lastActivityTime) >= TIMEOUT_THRESHOLD) {
                idle.value=true;
                triggerTimer.emit('stop')
                console.log(exp,'过期时间')
            }

    }, 5000, {
        immediate: false
    });
    function resetTimer() {
        lastActivityTime = Date.now();
    }
    const visibilitychange = () => {
        if (document.visibilityState === 'visible') {

        } else {
            idle.value=true;
            triggerTimer.emit('stop')
        }
    }
    const events=[
        useEventListener(document, 'click', resetTimer),
        useEventListener(document, 'touchend', resetTimer),
        useEventListener(document, 'touchmove', resetTimer),
        useEventListener(document, 'touchstart', resetTimer),
        useEventListener(document, 'mousemove', resetTimer),
        useEventListener(document, 'mousedown', resetTimer),
        useEventListener(document, 'mouseup', resetTimer),
        useEventListener(document, 'visibilitychange', visibilitychange),
    ];
    onBeforeUnmount(()=>{
        events.forEach((cleanup)=>{
            cleanup();
        })
    });
    return {
        idle,
        start,
        pause,
        resume,
    }
}