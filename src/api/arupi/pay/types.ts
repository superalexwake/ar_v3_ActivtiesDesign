/* 登录接口参数类型 */

export interface IResponse<T=any> {
    statuscode: string;
    data: T;
    msg: string;
    total:null
    code:string
}


export namespace Pay{
    
    export interface confirmPaymentRqs {
        utr:string //utr
        token:string //订单token
    }
    export interface confirmPaymentRes {
        amount:number  //金额
        minimumAmount:number //最小金额
        maximumAmount:number //最大金额
        platformOrder:string  //订单号
        avatar:string
        payType:string
    }[]

    export interface paymentDetailsRes{
        amount:number  //订单金额
        createTime:string //订单时间
        memberId:string  //会员id
        merchantCode:string  //商户号
        merchantName:string  //商户名称
        merchantOrder:string  //商户订单号
        paymentExpireTime:number //支付剩余时间 秒
        paymentPasswordHint:string  //支付密码提示语
        platformOrder:string  //平台订单号
        returnUrl:string //返回地址
        orderStatus:string //订单状态  1:待支付, 2: 已支付, 3: 已取消
        upiId:string
        wakeupParamsBO:any
        utr:string
		randomCode:string
		tid:string

    }
    export interface paymentUDetailsRes{
        amount:number  //订单金额
        createTime:string //订单时间
        memberId:string  //会员id
        merchantCode:string  //商户号
        merchantName:string  //商户名称
        merchantOrder:string  //商户订单号
        paymentExpireTime:number //支付剩余时间 秒
        paymentPasswordHint:string  //支付密码提示语
        platformOrder:string  //平台订单号
        returnUrl:string //返回地址
        orderStatus:string //订单状态  1:待支付, 2: 已支付, 3: 已取消
        usdtAddr:string
        networkProtocol:string
        minimumAmount:number
    }

    export interface orderStatusRes{
        utr:string
        orderStatus:string,
        syncNotifyAddress:string
        
    }
}