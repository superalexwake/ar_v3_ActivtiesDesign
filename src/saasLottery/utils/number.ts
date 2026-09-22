export function getRandom(min: number, max: number) {
    return Math.floor(Math.random() * max) + min;
}

/** 投注数量最大值 */
export const MAX_BET_COUNT = 999999999;

/**
 * @description: 投注数量输入约束——去除小数与负号,只保留正整数并封顶
 * @return 有效值返回正整数;空串返回 null(表示保持为空,便于清空重输,失焦时再纠正)
 */
export const clampBetCountInput = (raw: string | number | null | undefined): number | null => {
    if (raw === '' || raw === null || raw === undefined) return null;
    const num = Number(raw);
    if (isNaN(num)) return null;
    const val = Math.floor(Math.abs(num));
    return val > MAX_BET_COUNT ? MAX_BET_COUNT : val;
};

/**
 * @description: 处理原生数字输入框(<input type="number">)的投注数量输入。
 *               清洗为正整数,并把规范化后的字符串写回 DOM——以消除前导0/小数残留
 *               (Vue 在聚焦且数值相等时不会刷新输入框,如输入 0001 模型虽为1但显示不变)
 * @return 清洗后的正整数;输入为空时返回 null(保持为空,失焦时再纠正)
 */
export const sanitizeBetCountInput = (e: Event): number | null => {
    const target = e.target as HTMLInputElement;
    const val = clampBetCountInput(target.value);
    if (val !== null && target.value !== String(val)) {
        target.value = String(val);
    }
    return val;
};

/**
 * @description: 将超过1000的数字转换为1K
 */
export const formatNum = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        return num + '';
    }
};


/**
 * @description: 将字符串转换为数字
 */
export const convertStringsToNumbers = (obj: any): any => {
	const result: any = {};
	for (const key in obj) {
		if (typeof obj[key] === 'string' && !isNaN(Number(obj[key]))) {
			result[key] = Number(obj[key]);
		} else if (typeof obj[key] === 'object' && obj[key] !== null) {
			result[key] = convertStringsToNumbers(obj[key]);
		} else {
			result[key] = obj[key];
		}
	}
	return result;
};