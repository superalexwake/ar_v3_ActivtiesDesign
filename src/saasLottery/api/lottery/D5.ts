import {request} from '../request';
import {D5BetReq} from "@/saasLottery/api";
export  function getD5Bet(data:D5BetReq){
    return request.post('/Lottery/D5Bet',data)
}