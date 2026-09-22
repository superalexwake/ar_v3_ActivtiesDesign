
export interface BinguoOptions {
  odds: number;
  money_list: string[] | number[]
  bet_money: number;
  bet_item: string;
  binguoType: 1 | 2 // 1: 总桌 2: 全桌
  currentNumber: number | string; // 当前期号
  award_result: number | string // 开奖结果
  trend_result: string[]
  trend_result2: string[]
  currentMoneyIndex: number; // 当前金额
  currentBeishuIndex: number; // 当前金额
  bet_number: string; // 注数
  beishu: number; // 倍数
  beishuList: number[]; // 倍数列表
  currentBetType: number | undefined
  currentPlayId: number 
  currentSelectType: string,
  currentOdds: string
  drawIssnum: string
}

export type BetNumberItem = {
  value: number | string;
  type: number;
  beishu: number | string;
  bet_amount?: number | string;
  hot?: boolean
  range?: string
  key?: string
  groupId: number
  playId: number
}

export type BinguoConfigType = {
  betAmount: number[]
  betMultiplier: number[]
  handFee: number;
}

export type BinguoGameList = {
  gameType: string;
  betType: string;
  odds: number;
  oddsDefault: number;
  groupId: number;
  playId: number;
}[]

export type BinguoIssueType = {
  issueNumber: string;
  startTime: string;
  endTime: string;
  serviceTime: string;
}

export type BinguoResult = {
  issueNo: string;
  result: string;
  resultSum: number
}

export type BinguoAmountResult = {
  playId: number;
  amount: number
  selectType: string
}


export interface BinguoBetParams {
  issueNumber: string;
  amount:      number;
  figure:      number;
  gameType:    string;
  selectType:  string;
  playId: number;
}


export interface BinguoRecordList {
  issueNumber:   string;
  gameType:      string;
  orderNumber:   string;
  amount:        number;
  selectType:    string;
  premium:       string;
  sumCount:      number;
  realAmount:    number;
  serviceCharge: number;
  figure:        number;
  state:         number;
  profitAmount:  number;
  addTime:       Date;
  fee: number;
}

export interface Trendstatistics {
  resultSumTrend:   Trend[];
  twoSameTrend:     Trend[];
  threeSameTrend:   Trend[];
  smallAndBigTrend: SmallAndBigTrend;
}

export interface Trend {
  number:       number;
  openCount:    number;
  avgCount:     number;
  notOpenCount: number;
}

export interface SmallAndBigTrend {
  smallCount: number;
  equalCount: number;
  bigCount:   number;
}

export interface Bingo18Last50Result {
  issueTime: string;
  result: string;
  resultSum: number;
  startDate: string;
}