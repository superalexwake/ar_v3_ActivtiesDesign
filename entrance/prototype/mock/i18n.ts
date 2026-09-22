import type { MockContext } from './types'

/**
 * 按当前 H5 语言选取假数据文案。
 *
 * @param ctx - 请求上下文，提供当前语言。
 * @param zh - 中文文案。
 * @param en - 英文文案。
 * @param hd - 印地语文案。
 * @returns 与 `ctx.lang` 对应的文案。
 */
export const pick = (ctx: MockContext, zh: string, en: string, hd: string): string => ({ zh, en, hd })[ctx.lang]
