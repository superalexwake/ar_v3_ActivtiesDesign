import {request} from '../request';
import {GetBalanceRspApiResponse, GetUserInfoRsp} from "@/api";
/*
 获取用户信息
 */
export  function getLotteryUserInfo(){
    return request.get<GetUserInfoRsp>('/Lottery/GetUserInfo')
}

/*
 获取用户余额
 */
export  function getUserBalance(){
    return request.get<GetBalanceRspApiResponse>('/Lottery/GetBalance')
}