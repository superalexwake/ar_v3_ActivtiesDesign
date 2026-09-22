import {request} from '../request';
import {TrxWinGoBetReq} from "@/saasLottery/api";
export  function getTrxWingoBet(data: TrxWinGoBetReq){
    return request.post('/Lottery/TrxWinGoBet',data)
}