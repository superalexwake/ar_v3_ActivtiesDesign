/* 登录接口参数类型 */
export interface IResponse<T=any> {
    code: string;
    data: T;
    msg: string;
    total:null
}
/**
 * 登录
 */
export namespace Login{
    
    export interface apiRqs {
        username?: string
        password?: string
        remember?: boolean
        grant_type: string
        refresh_token?:string | null
    }
    export interface formData{
        headers: {
            'Content-Type': string;
        };
    }
    export interface apiHeader{
        headers: {
            authorization: string;
            'Content-Type': string;
        };
    }
    export interface apiRes {
        [x: string]: any;
        access_token: string
        expires_in: number
        jti: string
        refresh_token: string
        scope: string
        token_type: string
        username: string
        memberId:string
    }
}
/**
 * 注册
 */
export namespace Register{
    export interface apiRqs{
        emailAccount?:string
        mobileNumber?:string
        invitationCode:string
        password:string
        verificationCode:string
    }
}
/**
 * 修改密码
 */
export namespace Forgot{
    export interface apiRqs{
        memberAccount:string
        password:string
        verificationCode:string
    }
}
/**
 * 收款信息
 */
export namespace Collection{
    export interface addapiRqs{
        upiName?:string  //收款人
        upiId:string //PUPI账号
        verificationCode:string //验证码
        bankCardNumber?:string //银行卡号
        bankCardOwner?:string //持卡人姓名
        bankCode?:string  //银行编码
        bankName?:string //银行名称
        email?:string //邮箱账号
        ifscCode?:string  //ifscCode
        mobileNumber?:string  //手机号码
        type:number //1: 印度银行卡, 3: 印度UPI
    }

    export interface ListRes{
        id:number //收款信息ID
        mobileNumber:string //手机号码
        upiId:string  //UPI_ID
        upiName:string  //UPI_Name
    }[]
}

/**
 * @description: 用户中心
 * @return {*}
 */


export interface UserInfoRes{
    balance:number, //余额
    email:null, //邮箱
    idCardNumber:null //证件号
    inrBalance:number //INR余额
    memberAccount:string //会员账号
    memberId:string //会员ID
    memberType:string //会员类型  1: 内部商户会员, 2: 商户会员, 3: 钱包会员
    mobileNumber:string //手机号码
    notificationCount:number //通知数
    realName:null //真实姓名
    walletAddress:string //钱包地址
    avatar:number //头像id
    nickname:string //昵称
    hasPaymentPassword:number //是否有支付密码  0: 未设置, 1:已设置
    realNameVerificationTime:string //认证时间
    authenticationStatus:string //是否实名 0 未实名 1已实名
    paymentPasswordHint:string //密码提示
    quickAmount:string //快捷金额
    merchantName:string 
    merchantIcon:string
    taskSwitch:string
    creditScore:number //信用分
    tradeCreditScoreLimit:number
    level:number //等级
    totalBuyCount: number;  // 总购买次数
    totalBuySuccessCount: number;  // 总成功购买次数
    totalSellSuccessCount: number;  // 总成功出售次数
    quickBuyMaxLimit:string //快捷最大买入金额
    quickBuyMinLimit:string //快捷最小买入金额
    buyGuideStatus:number //是否完成买入教程
    sellGuideStatus:number //是否完成卖出教程
    selfSelectionBuy:number //可否自选买入
    sellStatus:string
    buyStatus:string
    frozenAmount:number
    biFrozenAmount:number
    isCashBack:number
    bankCardNumberLengthLimit:string
    userSig:string
    kycBankName:string
    kycBankCode:string
    compulsionKycSwitch:string //kyc强制开关是否开启 字段  0 未开启  1 开启
    buyRewardRatio:number //买入奖励比例
    emailAccount:string //邮箱账号
    enableForcedEmail:boolean // 是否强制开启邮箱
}
/**
 * 实名认证
 */
export interface VerifiedData{
    idCardNumber:string,
    realName:string
    file:any
}
// 修改支付密码
export namespace PayPwd{
    export interface apiURqs{
        newPaymentPassword:string, //新支付密码
        oldPaymentPassword:string, //旧支付密码
        paymentPasswordHint:string //支付密码提示语
    }
    export interface apiSRqs{
        paymentPassword:string, //支付密码
        paymentPasswordHint:string //支付密码提示语
    }
    export interface apiRRqs{
        paymentPassword:string, //支付密码
        paymentPasswordHint:string //支付密码提示语
        verificationCode:string //验证码 
    }
    
    // export interface apiRes{
    //     balance:number, //余额
    //     email:null, //邮箱
    //     idCardNumber:null //证件号
    // }
}
// 我的申诉

export namespace ViewMyAppeal{
    export interface apiRqs{
        pageNo:number, //查询第一页
        pageSize:number //查询10条记录
    }
    export interface apiRes{
        list:list[],
        pageNo:number,
        pageSize:number,
        total:number
    }
    export interface list{
        appealStatus:number,  //申诉状态: 1-申诉中 2-申诉成功 3-申诉失败
        appealType:number  //申诉类型: 1-卖出申诉 2-买入申诉
        createTime:string //订单时间
        orderAmount:string //订单金额
        platformOrder:string //订单号
        utr:string //utr
    }
}
export namespace Transaction{
    export interface apiRqs{
        date:string, //查询时间 (格式: YYYY-MM-DD)
        pageNo:number, //查询第一页
        pageSize:number //查询10条记录
        transactionType:string  //交易类型, 取值说明: 1: 买入, 2: 卖出, 3: USDT买入, 9: 卖出奖励
    }
    export interface apiRes{
        list:list[],
        pageNo:number,
        pageSize:number,
        total:number
    }
    export interface list{
        amount:number,  //金额
        createTime:string  //时间
        transactionType:string //1: 买入, 2: 卖出, 3: USDT买入, 9: 卖出奖励
        platformOrder:string //平台订单号
        amountType:string //金额类型 1: USDT  2: ARB
    }
}


// 团队
export namespace Team {
    export interface TeamRes{
        buyCommission:number //买入佣金
        buyReward:number //买入奖励
        buyRewardRatio:number //买入奖励比例
        invitationCount:number //邀请数量
        memberId:number //会员ID
        sellCommission:number //卖出佣金
        sellReward:number //卖出奖励
        sellRewardRatio:number //卖出奖励比例
        totalCommission:number //总佣金
        totalReward:number //总奖励
        invitationCode:string //邀请码
    }
    export interface MyGroupRes{
        list:MyGroupList[]
        pageNo:number
        pageSize:number
        total:number
    }

    export interface MyGroupList{
        buyCommission:number //买入佣金
        childCount:number //下级数量
        onlineFlag:string //是否在线 0-不在线 1-在线
        sellCommission:number //卖出佣金
        totalCommission:number //累计返佣
        userId:number //用户ID
        avatar:number //
    }



}
