import {request} from '../request';
import {MotoRaceBetReq} from "@/saasLottery/api";
export  function motoRaceBet(data:MotoRaceBetReq){
    return request.post('/Lottery/MotoRaceBet',data)
}