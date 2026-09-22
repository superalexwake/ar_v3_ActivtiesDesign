<template>
    <div class="maintenace">
        <NavBar>
            <template #center>
                <img :src="projectIcon" alt="" style="height: 100%;"/>
            </template>
        </NavBar>
        <div class="maintenace-body">
            <svg-icon name="maintenace" class="main-svg"/>
            <div class="text1">Under Maintenance
                <div class="text2">Server is expected to be launched in</div>
            </div>
            <div class="count-down">
                <div>{{ countDown.h1 }}</div>
                <div>{{ countDown.h2 }}</div>:
                <div>{{ countDown.m1 }}</div>
                <div>{{ countDown.m2 }}</div>:
                <div>{{ countDown.s1 }}</div>
                <div>{{ countDown.s2 }}</div>
            </div>
            <div v-if="notesList" class="notes">
                <div class="notes-head">Update Notes</div>
                <div class="notes-body">
                    <div v-html="notesList"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks/useHome.hook';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios'
import router from '@/router'

const baseURL = window.CONFIG?.VITE_API_URL||import.meta.env.VITE_API_URL as string
const extendURL = '/api/webapi'
const { projectIcon } = useHome();
const countDownS = ref(0)
const countDown = computed(()=>{
    // 计算小时、分钟和秒
    const hours = Math.floor(countDownS.value / 3600);
    const minutes = Math.floor((countDownS.value % 3600) / 60);
    const seconds = Math.floor(countDownS.value % 60);

    // 将小时、分钟和秒补齐为两位数
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    return {
        h1: parseInt(hoursStr[0], 10),
        h2: parseInt(hoursStr[1], 10),
        m1: parseInt(minutesStr[0], 10),
        m2: parseInt(minutesStr[1], 10),
        s1: parseInt(secondsStr[0], 10),
        s2: parseInt(secondsStr[1], 10)
    }
})
const notesList = ref('')
let timer: any = null
const getData = async()=>{
    axios.get( baseURL + extendURL + '/GetMaintenanceInfo').then(res=>{
        if(res.data.enabled === false) {
			return router.push({
				name: "login"
			})
        }
        notesList.value = res.data?.notifyTip || '';
        countDownS.value = calculateTimeDifference(res.data?.serverTime, res.data?.endTime);
        if(countDownS.value > 0) {
            countDownF()
        } else {
			router.push({
				name: "login"
			})
        }
    }).catch(err=>{
        console.log('err', err);
    })
}
const countDownF = ()=>{
	clearInterval(timer)
    timer = setTimeout(()=>{
        countDownS.value--
        console.log('countDownS.value', countDownS.value)
        if(countDownS.value > 0) countDownF()
    }, 1000)
}
const calculateTimeDifference = (addTime:any, endTime:any)=> {
  // 将时间字符串转换为 Date 对象
  const addTimeDate = new Date(addTime.replace(" ", "T"));
  const endTimeDate = new Date(endTime.replace(" ", "T"));
  // 计算时间差（毫秒）
  const timeDifferenceMs = endTimeDate - addTimeDate;
  // 将毫秒转换为秒
  const timeDifferenceSeconds = timeDifferenceMs / 1000;
  return timeDifferenceSeconds;
}
onMounted(()=> {
    getData()
})

onUnmounted(() => {
	clearInterval(timer)
	console.log('离开页面，清空定时器')
})
</script>
<style lang="scss" scoped>
.maintenace {
    background: #F2F2F1;
    height: 100vh;
    overflow: auto;
    padding-bottom: 100px;
    .content__right {
        svg {
            width: 48px;
            height: 48px;
        }
    }
    &-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 56px;
        margin-top: 100px;
        .main-svg {
            width: 464px;
            height: 324px;
            margin-bottom: 56px;
        }
        .count-down {
            display: flex;
            gap: 8px;
            align-items: center;
            justify-content: center;
            font-size: 58px;
            color:  var(--norm_red-color);
            margin-bottom: 56px;
            &> div {
                background: var(--norm_red-color);
                color: #F2F2F1;
                width: 64px;
                height: 70px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .text1 {
            color: #626262;
            font-size: 36px;
            font-weight: 700;
            text-align: center;
            .text2 {
                color: #9E9E9E;
                font-size: 28px;
                padding-top: 10px;
            }
        }
        .notes {
            width: 640px;
            height: fit-content;
            border-radius: 16px;
            border: 2px solid #DDE1EB;
            background: #FFF;
            overflow: hidden;
            &-head {
                background: #DDE1EB;
                height: 64px;
                line-height: 64px;
                color: #626262;
                font-size: 28px;
                text-align: center;
            }
            &-body {
                padding: 30px 46px;
                color: #9E9E9E;
                font-size: 26px;
                &>div {
                    min-height: 34px;
                    line-height: 34px;
                }
            }
        }
    }
    :deep(.navbar__content-center) {
        height: 100%;
    }
}
</style>