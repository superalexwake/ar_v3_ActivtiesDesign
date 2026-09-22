import {request} from '../request';
import {K3BetReq} from "@/saasLottery/api";
export  function getK3Bet(data:K3BetReq){
    return request.post('/Lottery/K3Bet',data)
}