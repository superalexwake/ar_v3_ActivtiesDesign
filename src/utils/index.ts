// 公用方法集体调用路径
export * from './formatters'
export * from './util'
export * from './basic'
export * from './inviteCode'
export * from './couponNum'
export * from './lazy'
export * from './arupi'
// 原 './pwa' 拆成两个领域文件，调用方签名不变：
export * from './native-bridge'
export * from './indexdb-storage'
import * as filters from './filter'
export const filter: any = filters
