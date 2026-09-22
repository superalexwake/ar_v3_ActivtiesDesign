import {  onDeactivated, onUnmounted, reactive } from "vue"
import { useRouter } from "vue-router"
import { getOrderStatus ,getStayTime} from "@/api";
import { Pay } from "@/api/arupi/types";
const pageData = reactive<{
    info:Pay.orderStatusRes
}>({
    info:{
        utr: "",
        orderStatus: "",
        syncNotifyAddress: ""
    }
})
export function useOrderStatus(){
    const router = useRouter();

    let timer: { [key: number]: any } = {};
    

    const orderStatus = async (token:string) =>{
        const res = await getOrderStatus({token});
        if(res.code == '1'){
            //1-支付中 2-已完成 3-代收失败
            pageData.info = res.data;
            // console.log(pageData.info)
            if(res.data.orderStatus === '2'){
                router.replace('/Payment')
            }else if(res.data.orderStatus === '3'){
                router.replace('/Fail')
            }
        }else{
            stopFun();
        }
    }

    const startFun = (token:string,type:number) =>{
        let time = type == 0 ? 10000 : 2000;
        // 先清除旧的定时器，避免重复创建
        if (timer[type]) {
            clearInterval(timer[type]);
        }
        timer[type] = setInterval(()=>{
            type == 0?orderStatus(token):getStayTime({token});
        },time)
    }

    const stopFun = () =>{
        Object.keys(timer).forEach((key) => {
            clearInterval(timer[Number(key)]);
        });
        Object.keys(timer).forEach((key) => delete timer[Number(key)]);
    }
    

    onUnmounted(()=>{
        stopFun()
    })
    
    onDeactivated(() => {

    });
    return{
        orderStatus,
        startFun,
        stopFun,
        pageData,
    }
}