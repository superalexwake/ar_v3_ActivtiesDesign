import {request} from '../request';
import {WinGoBetReq} from "@/saasLottery/api";
export  function getWinGoBet(data:WinGoBetReq){
    return request.post('/Lottery/WinGoBet',data)
}
export  function getVideoWinGoBet(data:WinGoBetReq){
	return request.post('/Lottery/VideoWinGoBet',data)
}