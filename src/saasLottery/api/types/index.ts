export type ApiCodeEnum = 0 | 1 | 4 | 5 | 7 | 9 | 11 | 13 | 14 | -2 | -1;

export type ApiMessageEnum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 19 | 20 | 21 | 22 | 23 | 24 | 41 | 101 | 116 | 120 | 142 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 309 | 310 | 311 | 312 | 313 | 314 | 315 | 316 | 317 | 318 | 319 | 320 | 321 | 322 | 323 | 324 | 325 | 326 | 327 | 328 | 349 | 350 | 351 | 352 | 353 | 354 | 355 | 356 | 357 | 358 | 359 | 360 | 361 | 362 | 363 | 398 | 399 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 1122 | -1;

/**
 * 停止跟投 (Auth)响应
 * @api: ApiResponse
 */
export interface ApiResponse {

  serviceTime?: number;
}

export type CurrencyEnum = "ALL" | "DZD" | "ARS" | "AUD" | "BSD" | "BHD" | "BDT" | "AMD" | "BBD" | "BMD" | "BTN" | "BOB" | "BWP" | "BZD" | "SBD" | "BND" | "MMK" | "BIF" | "KHR" | "CAD" | "CVE" | "KYD" | "LKR" | "CLP" | "CNY" | "COP" | "KMF" | "CRC" | "HRK" | "CUP" | "CZK" | "DKK" | "DOP" | "SVC" | "ETB" | "ERN" | "FKP" | "FJD" | "DJF" | "GMD" | "GIP" | "GTQ" | "GNF" | "GYD" | "HTG" | "HNL" | "HKD" | "HUF" | "ISK" | "INR" | "IDR" | "IRR" | "IQD" | "ILS" | "JMD" | "JPY" | "KZT" | "JOD" | "KES" | "KPW" | "KRW" | "KWD" | "KGS" | "LAK" | "LBP" | "LSL" | "LRD" | "LYD" | "MOP" | "MWK" | "MYR" | "MVR" | "MUR" | "MXN" | "MNT" | "MDL" | "MAD" | "OMR" | "NAD" | "NPR" | "ANG" | "AWG" | "VUV" | "NZD" | "NIO" | "NGN" | "NOK" | "PKR" | "PAB" | "PGK" | "PYG" | "PEN" | "PHP" | "QAR" | "RUB" | "RWF" | "SHP" | "SAR" | "SCR" | "SLL" | "SGD" | "VND" | "SOS" | "ZAR" | "SSP" | "SZL" | "SEK" | "CHF" | "SYP" | "THB" | "TOP" | "TTD" | "AED" | "TND" | "UGX" | "MKD" | "EGP" | "GBP" | "TZS" | "USD" | "UYU" | "UZS" | "WST" | "YER" | "TWD" | "MRU" | "STN" | "CUC" | "ZWL" | "TMT" | "GHS" | "VEF" | "SDG" | "UYI" | "RSD" | "MZN" | "AZN" | "RON" | "CHE" | "CHW" | "TRY" | "XAF" | "XCD" | "XOF" | "XPF" | "XDR" | "XUA" | "ZMW" | "SRD" | "MGA" | "COU" | "AFN" | "TJS" | "AOA" | "BYR" | "BGN" | "CDF" | "BAM" | "EUR" | "MXV" | "UAH" | "GEL" | "BOV" | "PLN" | "BRL" | "CLF" | "XSU" | "USN";

export type D5BetContentEnum = "FirstNum_0" | "FirstNum_1" | "FirstNum_2" | "FirstNum_3" | "FirstNum_4" | "FirstNum_5" | "FirstNum_6" | "FirstNum_7" | "FirstNum_8" | "FirstNum_9" | "FirstBigSmall_Big" | "FirstBigSmall_Small" | "FirstOddEven_Odd" | "FirstOddEven_Even" | "SecondNum_0" | "SecondNum_1" | "SecondNum_2" | "SecondNum_3" | "SecondNum_4" | "SecondNum_5" | "SecondNum_6" | "SecondNum_7" | "SecondNum_8" | "SecondNum_9" | "SecondBigSmall_Big" | "SecondBigSmall_Small" | "SecondOddEven_Odd" | "SecondOddEven_Even" | "ThirdNum_0" | "ThirdNum_1" | "ThirdNum_2" | "ThirdNum_3" | "ThirdNum_4" | "ThirdNum_5" | "ThirdNum_6" | "ThirdNum_7" | "ThirdNum_8" | "ThirdNum_9" | "ThirdBigSmall_Big" | "ThirdBigSmall_Small" | "ThirdOddEven_Odd" | "ThirdOddEven_Even" | "FourthNum_0" | "FourthNum_1" | "FourthNum_2" | "FourthNum_3" | "FourthNum_4" | "FourthNum_5" | "FourthNum_6" | "FourthNum_7" | "FourthNum_8" | "FourthNum_9" | "FourthBigSmall_Big" | "FourthBigSmall_Small" | "FourthOddEven_Odd" | "FourthOddEven_Even" | "FifthNum_0" | "FifthNum_1" | "FifthNum_2" | "FifthNum_3" | "FifthNum_4" | "FifthNum_5" | "FifthNum_6" | "FifthNum_7" | "FifthNum_8" | "FifthNum_9" | "FifthBigSmall_Big" | "FifthBigSmall_Small" | "FifthOddEven_Odd" | "FifthOddEven_Even" | "SumBigSmall_Big" | "SumBigSmall_Small" | "SumOddEven_Odd" | "SumOddEven_Even";

/**
 * D5下注接口 (Auth)请求
 * @api: D5BetReq
 */
export interface D5BetReq {

  betContent?: D5BetContentEnum[];

  gameCode?: LotteryGameCodeEnum;

  issueNumber?: string;

  amount?: number;

  betMultiple?: number;
}

export type DeviceTypeEnum = "H5" | "Android" | "IOS" | "PC" | "UnKnow" | "Bot";

export type EnableEnum = 0 | 1;

export type FollowOrderTypeEnum = 0 | 1;

export interface FollowPlanWithRecordRsp {

  id?: number;

  name?: string;

  headImgUrl?: string;

  playType?: LotteryPlayTypeEnum;

  playBet?: string;

  isSupportDoubleBet?: IsEnum;

  followUserCount?: number;

  actualMaxOrderReturnRate?: number;

  actualTotalBetAmount?: number;

  actualTotalProfitAmount?: number;

  preIssueCount?: number;

  winIssueCount?: number;

  lossIssueCount?: number;

  totalWinLossAmount?: number;

  orderNo?: string;

  orderType?: FollowOrderTypeEnum;

  isOpenDoubleBet?: IsEnum;

  betAmount?: number;

  initMarginAmount?: number;

  stopProfitAmount?: number;

  stopLossAmount?: number;
}

export interface FollowRecordHistoryRsp {

  name?: string;

  headImgUrl?: string;

  playType?: LotteryPlayTypeEnum;

  playBet?: string;

  followPlanId?: number;

  winIssueCount?: number;

  lossIssueCount?: number;

  totalWinLossAmount?: number;

  orderNo?: string;

  orderType?: FollowOrderTypeEnum;

  startTime?: number;

  endTime?: number;
}

/**
 * 获取历史跟投策略列表 (Auth)响应
 * @api: FollowRecordHistoryRspListPageBaseResponse
 */
export interface FollowRecordHistoryRspListPageBaseResponse {

  list?: FollowRecordHistoryRsp[];

  pageNo?: number;

  totalPage?: number;

  totalCount?: number;
}

export type GameTypeEnum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 100 | 101 | 102 | 103 | 104 | 105;

export interface GetBalanceRsp {

  balance?: number;
}

export type GetBalanceRspApiResponse = GetBalanceRsp;

export interface GetBetLimitRsp {

  playType?: LotteryPlayTypeEnum;

  betContent?: string;

  maxPayoutAmount?: number;
}

/**
 * 获取彩票的跟投策略列表 (Auth)请求
 * @api: GetFollowPlanReq
 */
export interface GetFollowPlanReq {

  gameCode?: LotteryGameCodeEnum;
}

export interface GetGameInfoRsp {
	webSocketUrl:string
  state?: StatusEnum;

  betScopes?: number[];

  betMultiples?: number[];

  rates?: GetGameInfoRspPlayRate[];
}

export type GetGameInfoRspApiResponse = GetGameInfoRsp;

export interface GetGameInfoRspPlayRate {

  playTypeId?: number;

  playType?: LotteryPlayTypeEnum;

  playBet?: string;

  state?: StatusEnum;

  playRate?: number;
}

export interface GetGameIntroduceRsp {

  title?: string;

  content?: string;
}

export type GetGameIntroduceRspApiResponse = GetGameIntroduceRsp;

/**
 * 获取游戏链接(登录) 只产生一个Token请求
 * @api: GetGameLinkReq
 */
export interface GetGameLinkReq {

  account?: string;

  redirectUrl?: string;

  deviceType?: DeviceTypeEnum;

  loginTime?: number;

  loginIP?: string;

  userType?: string;

  gameCode?: LotteryGameCodeEnum;
}

export interface GetGameListRsp {

  gameType?: GameTypeEnum;

  gameTypeName?: string;

  sort?: number;

  gameList?: GetGameListRspItem[];
}

export interface GetGameListRspItem {

  gameCode?: string;

  gameName?: string;

  sort?: number;

  state?: StatusEnum;

  intervalMinute?: number;
}

/**
 * 获取历史跟投策略列表 (Auth)请求
 * @api: GetHistoryFollowRecordPageListReq
 */
export interface GetHistoryFollowRecordPageListReq {

  gameCode?: LotteryGameCodeEnum;

  pageSize?: number;

  pageNo?: number;
}

export interface GetHistoryIssuePageRsp {

  issueNumber?: string;

  number?: string;

  color?: string;

  premium?: string;

  sum?: number;

  blockId?: string;

  blockNumber?: number;

  blockTimestamp?: number;
}

export interface GetHistoryIssuePageRspListPageBaseResponse {

  list?: GetHistoryIssuePageRsp[];

  pageNo?: number;

  totalPage?: number;

  totalCount?: number;
}

export type GetHistoryIssuePageRspListPageBaseResponseApiResponse = GetHistoryIssuePageRspListPageBaseResponse;

export interface GetRecordPageRsp {

  issueNumber?: string;

  playType?: string;

  orderNo?: string;

  amount?: number;

  betMultiple?: number;

  betContent?: string;

  number?: string;

  color?: string;

  premium?: string;

  realAmount?: number;

  fee?: number;

  state?: number;

  winLoseAmount?: number;

  betTime?: number;
}

export interface GetRecordPageRspListPageBaseResponse {

  list?: GetRecordPageRsp[];

  pageNo?: number;

  totalPage?: number;

  totalCount?: number;
}

export type GetRecordPageRspListPageBaseResponseApiResponse = GetRecordPageRspListPageBaseResponse;

export interface GetTrendStatisticsRsp {

  position?: number;

  number?: number;

  missingCount?: number;

  avgMissing?: number;

  openCount?: number;

  maxContinuous?: number;
}

export interface GetUserInfoRsp {

  userId?: number;

  tenantId?: number;

  agentCode?: string;

  sysCurrency?: CurrencyEnum;

  state?: EnableEnum;

  tenantAccount?: string;

  skin?: string;

  skinColor?: string;
}

export type GetUserInfoRspApiResponse = GetUserInfoRsp;

export interface GetWinLossResultRsp {

  status?: boolean;

  winAmount?: number;
}

export type GetWinLossResultRspApiResponse = GetWinLossResultRsp;

export type IsEnum = 0 | 1;

export type K3BetContentEnum = "SumNum_3" | "SumNum_4" | "SumNum_5" | "SumNum_6" | "SumNum_7" | "SumNum_8" | "SumNum_9" | "SumNum_10" | "SumNum_11" | "SumNum_12" | "SumNum_13" | "SumNum_14" | "SumNum_15" | "SumNum_16" | "SumNum_17" | "SumNum_18" | "SumBigSmall_Big" | "SumBigSmall_Small" | "SumOddEven_Odd" | "SumOddEven_Even" | "NumSame2_11" | "NumSame2_22" | "NumSame2_33" | "NumSame2_44" | "NumSame2_55" | "NumSame2_66" | "NumSame2Mult_11_2" | "NumSame2Mult_11_3" | "NumSame2Mult_11_4" | "NumSame2Mult_11_5" | "NumSame2Mult_11_6" | "NumSame2Mult_11_2_3" | "NumSame2Mult_11_2_4" | "NumSame2Mult_11_2_5" | "NumSame2Mult_11_2_6" | "NumSame2Mult_11_2_3_5" | "NumSame2Mult_11_2_3_6" | "NumSame2Mult_11_2_4_5" | "NumSame2Mult_11_2_4_6" | "NumSame2Mult_11_2_5_6" | "NumSame2Mult_11_3_4" | "NumSame2Mult_11_3_5" | "NumSame2Mult_11_3_6" | "NumSame2Mult_11_4_5" | "NumSame2Mult_11_4_6" | "NumSame2Mult_11_5_6" | "NumSame2Mult_11_2_3_4" | "NumSame2Mult_11_3_4_5" | "NumSame2Mult_11_3_4_6" | "NumSame2Mult_11_3_5_6" | "NumSame2Mult_11_4_5_6" | "NumSame2Mult_11_2_3_4_5" | "NumSame2Mult_11_2_3_4_6" | "NumSame2Mult_11_2_3_5_6" | "NumSame2Mult_11_2_4_5_6" | "NumSame2Mult_11_3_4_5_6" | "NumSame2Mult_11_2_3_4_5_6" | "NumSame2Mult_22_1" | "NumSame2Mult_22_3" | "NumSame2Mult_22_4" | "NumSame2Mult_22_5" | "NumSame2Mult_22_6" | "NumSame2Mult_22_1_3" | "NumSame2Mult_22_1_4" | "NumSame2Mult_22_1_5" | "NumSame2Mult_22_1_6" | "NumSame2Mult_22_3_4" | "NumSame2Mult_22_3_5" | "NumSame2Mult_22_3_6" | "NumSame2Mult_22_4_5" | "NumSame2Mult_22_4_6" | "NumSame2Mult_22_5_6" | "NumSame2Mult_22_1_3_4" | "NumSame2Mult_22_1_3_5" | "NumSame2Mult_22_1_3_6" | "NumSame2Mult_22_1_4_5" | "NumSame2Mult_22_1_4_6" | "NumSame2Mult_22_1_5_6" | "NumSame2Mult_22_3_4_5" | "NumSame2Mult_22_3_4_6" | "NumSame2Mult_22_3_5_6" | "NumSame2Mult_22_4_5_6" | "NumSame2Mult_22_1_3_4_5" | "NumSame2Mult_22_1_3_4_6" | "NumSame2Mult_22_1_3_5_6" | "NumSame2Mult_22_1_4_5_6" | "NumSame2Mult_22_3_4_5_6" | "NumSame2Mult_22_1_3_4_5_6" | "NumSame2Mult_33_1" | "NumSame2Mult_33_2" | "NumSame2Mult_33_4" | "NumSame2Mult_33_5" | "NumSame2Mult_33_6" | "NumSame2Mult_33_1_2" | "NumSame2Mult_33_1_4" | "NumSame2Mult_33_1_5" | "NumSame2Mult_33_1_6" | "NumSame2Mult_33_2_4" | "NumSame2Mult_33_2_5" | "NumSame2Mult_33_2_6" | "NumSame2Mult_33_4_5" | "NumSame2Mult_33_4_6" | "NumSame2Mult_33_5_6" | "NumSame2Mult_33_1_2_4" | "NumSame2Mult_33_1_2_5" | "NumSame2Mult_33_1_2_6" | "NumSame2Mult_33_1_4_5" | "NumSame2Mult_33_1_4_6" | "NumSame2Mult_33_1_5_6" | "NumSame2Mult_33_2_4_5" | "NumSame2Mult_33_2_4_6" | "NumSame2Mult_33_2_5_6" | "NumSame2Mult_33_4_5_6" | "NumSame2Mult_33_1_2_4_5" | "NumSame2Mult_33_1_2_4_6" | "NumSame2Mult_33_1_2_5_6" | "NumSame2Mult_33_1_4_5_6" | "NumSame2Mult_33_2_4_5_6" | "NumSame2Mult_33_1_2_4_5_6" | "NumSame2Mult_44_1" | "NumSame2Mult_44_2" | "NumSame2Mult_44_3" | "NumSame2Mult_44_5" | "NumSame2Mult_44_6" | "NumSame2Mult_44_1_2" | "NumSame2Mult_44_1_3" | "NumSame2Mult_44_1_5" | "NumSame2Mult_44_1_6" | "NumSame2Mult_44_2_3" | "NumSame2Mult_44_2_5" | "NumSame2Mult_44_2_6" | "NumSame2Mult_44_3_5" | "NumSame2Mult_44_3_6" | "NumSame2Mult_44_5_6" | "NumSame2Mult_44_1_2_3" | "NumSame2Mult_44_1_2_5" | "NumSame2Mult_44_1_2_6" | "NumSame2Mult_44_1_3_5" | "NumSame2Mult_44_2_3_5" | "NumSame2Mult_44_1_3_6" | "NumSame2Mult_44_2_3_6" | "NumSame2Mult_44_1_5_6" | "NumSame2Mult_44_2_5_6" | "NumSame2Mult_44_3_5_6" | "NumSame2Mult_44_1_2_3_5" | "NumSame2Mult_44_1_2_3_6" | "NumSame2Mult_44_1_2_5_6" | "NumSame2Mult_44_1_3_5_6" | "NumSame2Mult_44_2_3_5_6" | "NumSame2Mult_44_1_2_3_5_6" | "NumSame2Mult_55_1" | "NumSame2Mult_55_2" | "NumSame2Mult_55_3" | "NumSame2Mult_55_4" | "NumSame2Mult_55_6" | "NumSame2Mult_55_1_2" | "NumSame2Mult_55_1_3" | "NumSame2Mult_55_1_4" | "NumSame2Mult_55_1_6" | "NumSame2Mult_55_2_3" | "NumSame2Mult_55_2_4" | "NumSame2Mult_55_2_6" | "NumSame2Mult_55_3_4" | "NumSame2Mult_55_3_6" | "NumSame2Mult_55_4_6" | "NumSame2Mult_55_1_2_3" | "NumSame2Mult_55_1_2_4" | "NumSame2Mult_55_1_2_6" | "NumSame2Mult_55_1_3_4" | "NumSame2Mult_55_1_3_6" | "NumSame2Mult_55_1_4_6" | "NumSame2Mult_55_2_3_4" | "NumSame2Mult_55_2_3_6" | "NumSame2Mult_55_2_4_6" | "NumSame2Mult_55_3_4_6" | "NumSame2Mult_55_1_2_3_4" | "NumSame2Mult_55_1_2_3_6" | "NumSame2Mult_55_1_2_4_6" | "NumSame2Mult_55_1_3_4_6" | "NumSame2Mult_55_2_3_4_6" | "NumSame2Mult_55_1_2_3_4_6" | "NumSame2Mult_66_1" | "NumSame2Mult_66_2" | "NumSame2Mult_66_3" | "NumSame2Mult_66_4" | "NumSame2Mult_66_5" | "NumSame2Mult_66_1_2" | "NumSame2Mult_66_1_3" | "NumSame2Mult_66_1_4" | "NumSame2Mult_66_1_5" | "NumSame2Mult_66_2_3" | "NumSame2Mult_66_2_4" | "NumSame2Mult_66_2_5" | "NumSame2Mult_66_3_4" | "NumSame2Mult_66_3_5" | "NumSame2Mult_66_4_5" | "NumSame2Mult_66_1_2_3" | "NumSame2Mult_66_1_2_4" | "NumSame2Mult_66_1_2_5" | "NumSame2Mult_66_1_3_4" | "NumSame2Mult_66_1_3_5" | "NumSame2Mult_66_1_4_5" | "NumSame2Mult_66_2_3_4" | "NumSame2Mult_66_2_3_5" | "NumSame2Mult_66_2_4_5" | "NumSame2Mult_66_3_4_5" | "NumSame2Mult_66_1_2_3_4" | "NumSame2Mult_66_1_2_3_5" | "NumSame2Mult_66_1_2_4_5" | "NumSame2Mult_66_1_3_4_5" | "NumSame2Mult_66_2_3_4_5" | "NumSame2Mult_66_1_2_3_4_5" | "NumSame3_111" | "NumSame3_222" | "NumSame3_333" | "NumSame3_444" | "NumSame3_555" | "NumSame3_666" | "NumSame3All_AAA" | "NumDiff3_1_2_3" | "NumDiff3_1_2_4" | "NumDiff3_1_2_5" | "NumDiff3_1_2_6" | "NumDiff3_1_3_4" | "NumDiff3_1_3_5" | "NumDiff3_1_3_6" | "NumDiff3_1_4_5" | "NumDiff3_1_4_6" | "NumDiff3_1_5_6" | "NumDiff3_2_3_4" | "NumDiff3_2_3_5" | "NumDiff3_2_3_6" | "NumDiff3_2_4_5" | "NumDiff3_2_4_6" | "NumDiff3_2_5_6" | "NumDiff3_3_4_5" | "NumDiff3_3_4_6" | "NumDiff3_3_5_6" | "NumDiff3_4_5_6" | "NumDiff3_1_2_3_4" | "NumDiff3_1_2_3_5" | "NumDiff3_1_2_3_6" | "NumDiff3_1_2_4_5" | "NumDiff3_1_2_4_6" | "NumDiff3_1_2_5_6" | "NumDiff3_1_3_4_5" | "NumDiff3_1_3_4_6" | "NumDiff3_1_3_5_6" | "NumDiff3_1_4_5_6" | "NumDiff3_2_3_4_5" | "NumDiff3_2_3_4_6" | "NumDiff3_2_3_5_6" | "NumDiff3_2_4_5_6" | "NumDiff3_3_4_5_6" | "NumDiff3_1_2_3_4_5" | "NumDiff3_1_2_3_4_6" | "NumDiff3_1_2_3_5_6" | "NumDiff3_1_2_4_5_6" | "NumDiff3_1_3_4_5_6" | "NumDiff3_2_3_4_5_6" | "NumDiff3_1_2_3_4_5_6" | "NumNear3All_ABC" | "NumDiff2_1_2" | "NumDiff2_1_3" | "NumDiff2_1_4" | "NumDiff2_1_5" | "NumDiff2_1_6" | "NumDiff2_2_3" | "NumDiff2_2_4" | "NumDiff2_2_5" | "NumDiff2_2_6" | "NumDiff2_3_4" | "NumDiff2_3_5" | "NumDiff2_3_6" | "NumDiff2_4_5" | "NumDiff2_4_6" | "NumDiff2_5_6" | "NumDiff2_1_2_3" | "NumDiff2_1_2_4" | "NumDiff2_1_2_5" | "NumDiff2_1_2_6" | "NumDiff2_1_3_4" | "NumDiff2_1_3_5" | "NumDiff2_1_3_6" | "NumDiff2_1_4_5" | "NumDiff2_1_4_6" | "NumDiff2_1_5_6" | "NumDiff2_2_3_4" | "NumDiff2_2_3_5" | "NumDiff2_2_3_6" | "NumDiff2_2_4_5" | "NumDiff2_2_4_6" | "NumDiff2_2_5_6" | "NumDiff2_3_4_5" | "NumDiff2_3_4_6" | "NumDiff2_3_5_6" | "NumDiff2_4_5_6" | "NumDiff2_1_2_3_4" | "NumDiff2_1_2_3_5" | "NumDiff2_1_2_3_6" | "NumDiff2_1_2_4_5" | "NumDiff2_1_2_4_6" | "NumDiff2_1_2_5_6" | "NumDiff2_1_3_4_5" | "NumDiff2_1_3_4_6" | "NumDiff2_1_3_5_6" | "NumDiff2_1_4_5_6" | "NumDiff2_2_3_4_5" | "NumDiff2_2_3_4_6" | "NumDiff2_2_3_5_6" | "NumDiff2_2_4_5_6" | "NumDiff2_3_4_5_6" | "NumDiff2_1_2_3_4_5" | "NumDiff2_1_2_3_4_6" | "NumDiff2_1_2_3_5_6" | "NumDiff2_1_2_4_5_6" | "NumDiff2_1_3_4_5_6" | "NumDiff2_2_3_4_5_6" | "NumDiff2_1_2_3_4_5_6";

/**
 * K3下注接口 (Auth)请求
 * @api: K3BetReq
 */
export interface K3BetReq {

  betContent?: K3BetContentEnum[];

  gameCode?: LotteryGameCodeEnum;

  issueNumber?: string;

  amount?: number;

  betMultiple?: number;
}

export type LanguageEnum = "en" | "id" | "vi" | "pt" | "th" | "zh" | "zhw" | "my" | "bn" | "hi" | "ms" | "ur" | "ar" | "ab" | "aa" | "af" | "ak" | "sq" | "am" | "an" | "hy" | "av" | "ae" | "ay" | "az" | "bm" | "ba" | "eu" | "be" | "bh" | "bi" | "bs" | "br" | "bg" | "ca" | "ch" | "ce" | "ny" | "cv" | "kw" | "co" | "cr" | "hr" | "cs" | "da" | "dv" | "nl" | "dz" | "eo" | "et" | "ee" | "fo" | "fj" | "fi" | "fr" | "ff" | "gl" | "ka" | "de" | "el" | "gn" | "gu" | "ht" | "ha" | "he" | "hz" | "ho" | "hu" | "ia" | "ie" | "ga" | "ig" | "ik" | "io" | "it" | "iu" | "ja" | "jv" | "kl" | "kn" | "kr" | "ks" | "kk" | "km" | "ki" | "rw" | "ky" | "kv" | "kg" | "ko" | "ku" | "kj" | "la" | "lb" | "lg" | "li" | "ln" | "lo" | "lt" | "lu" | "lv" | "gv" | "mk" | "mg" | "ml" | "mt" | "mi" | "mr" | "mh" | "mn" | "na" | "nv" | "nd" | "ne" | "ng" | "nb" | "nn" | "no" | "ii" | "nr" | "oc" | "oj" | "cu" | "om" | "or" | "os" | "pa" | "pi" | "fa" | "pl" | "ps" | "qu" | "rm" | "rn" | "ro" | "ru" | "sa" | "sc" | "sd" | "se" | "sm" | "sg" | "sr" | "gd" | "sn" | "si" | "sk" | "sl" | "so" | "st" | "es" | "su" | "sw" | "ss" | "sv" | "ta" | "te" | "tg" | "ti" | "bo" | "tk" | "tl" | "tn" | "to" | "tr" | "ts" | "tt" | "tw" | "ty" | "ug" | "uk" | "uz" | "ve" | "vo" | "wa" | "cy" | "wo" | "fy" | "xh" | "yi" | "yo" | "za" | "zu";

/**
 * 新增跟投策略 (Auth)请求
 * @api: LotteryFollowRecordAddReq
 */
export interface LotteryFollowRecordAddReq {

  followPlanId?: number;

  betAmount?: number;

  preIssueCount?: number;

  initMarginAmount?: number;

  stopProfitAmount?: number;

  stopLossAmount?: number;

  isOpenDoubleBet?: IsEnum;

  orderType?: FollowOrderTypeEnum;
}

/**
 * 停止跟投 (Auth)请求
 * @api: LotteryFollowRecordStopReq
 */
export interface LotteryFollowRecordStopReq {

  orderNo?: string;
}

export type LotteryGameCodeEnum = "WinGo_30S" | "WinGo_1M" | "WinGo_3M" | "WinGo_5M" | "WinGo_10M" | "K3_1M" | "K3_3M" | "K3_5M" | "K3_10M" | "TrxWinGo_1M" | "TrxWinGo_3M" | "TrxWinGo_5M" | "TrxWinGo_10M" | "D5_1M" | "D5_3M" | "D5_5M" | "D5_10M" | "VideoWinGo_1M" | "MotoRace_1M";

export type LotteryPlayTypeEnum = "Num" | "Color" | "BigSmall" | "OddEven" | "SumNum" | "SumBigSmall" | "SumOddEven" | "NumDiff2" | "NumSame2Mult" | "NumSame2" | "NumSame3" | "NumSame3All" | "NumDiff3" | "NumNear3All" | "FirstNum" | "FirstBigSmall" | "FirstOddEven" | "SecondNum" | "SecondBigSmall" | "SecondOddEven" | "ThirdNum" | "ThirdBigSmall" | "ThirdOddEven" | "FourthNum" | "FourthBigSmall" | "FourthOddEven" | "FifthNum" | "FifthBigSmall" | "FifthOddEven";

export type MotoRaceBetContentEnum = "FirstNum_1" | "FirstNum_2" | "FirstNum_3" | "FirstNum_4" | "FirstNum_5" | "FirstNum_6" | "FirstNum_7" | "FirstNum_8" | "FirstNum_9" | "FirstNum_10" | "FirstBigSmall_Big" | "FirstBigSmall_Small" | "FirstOddEven_Odd" | "FirstOddEven_Even" | "SecondNum_1" | "SecondNum_2" | "SecondNum_3" | "SecondNum_4" | "SecondNum_5" | "SecondNum_6" | "SecondNum_7" | "SecondNum_8" | "SecondNum_9" | "SecondNum_10" | "SecondBigSmall_Big" | "SecondBigSmall_Small" | "SecondOddEven_Odd" | "SecondOddEven_Even" | "ThirdNum_1" | "ThirdNum_2" | "ThirdNum_3" | "ThirdNum_4" | "ThirdNum_5" | "ThirdNum_6" | "ThirdNum_7" | "ThirdNum_8" | "ThirdNum_9" | "ThirdNum_10" | "ThirdBigSmall_Big" | "ThirdBigSmall_Small" | "ThirdOddEven_Odd" | "ThirdOddEven_Even";

/**
 * 摩托赛车下注接口 (Auth)请求
 * @api: MotoRaceBetReq
 */
export interface MotoRaceBetReq {

  betContent?: MotoRaceBetContentEnum;

  gameCode?: LotteryGameCodeEnum;

  issueNumber?: string;

  amount?: number;

  betMultiple?: number;
}

export type StatusEnum = 0 | 1 | 2;

/**
 * TrxWinGo下注接口 (Auth)请求
 * @api: TrxWinGoBetReq
 */
export interface TrxWinGoBetReq {

  betContent?: WinGoBetContentEnum;

  gameCode?: LotteryGameCodeEnum;

  issueNumber?: string;

  amount?: number;

  betMultiple?: number;
}

export type VideoWinGoBetContentEnum = "Num_0" | "Num_1" | "Num_2" | "Num_3" | "Num_4" | "Num_5" | "Num_6" | "Num_7" | "Num_8" | "Num_9" | "Color_Red" | "Color_Green" | "Color_Violet" | "BigSmall_Big" | "BigSmall_Small";

/**
 * 视频 WinGo下注接口 (Auth)请求
 * @api: VideoWinGoBetReq
 */
export interface VideoWinGoBetReq {

  betContent?: VideoWinGoBetContentEnum;

  gameCode?: LotteryGameCodeEnum;

  issueNumber?: string;

  amount?: number;

  betMultiple?: number;
}

export type WinGoBetContentEnum = "Num_0" | "Num_1" | "Num_2" | "Num_3" | "Num_4" | "Num_5" | "Num_6" | "Num_7" | "Num_8" | "Num_9" | "Color_Red" | "Color_Green" | "Color_Violet" | "BigSmall_Big" | "BigSmall_Small";

/**
 * WinGo下注接口 (Auth)请求
 * @api: WinGoBetReq
 */
export interface WinGoBetReq {

  betContent?: WinGoBetContentEnum;

  gameCode?: LotteryGameCodeEnum;

  issueNumber?: string;

  amount?: number;

  betMultiple?: number;
}

