/*
 * @Author: Jason s1017349071@163.com
 * @Date: 2023-06-09 11:05:47
 * @LastEditors: Jason s1017349071@163.com
 * @LastEditTime: 2023-08-24 18:54:54
 * @FilePath: \ar_v2_vue\src\plugins\validate.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const validate = {
	moneyup: /^(?!0+$)(?!0*\.0*$)\d{1,11}(\.\d{1,2})?$/, //最小为0.01
	redNum: /^([1-9]\d{0,2}|1000)$/, //红包个数1-1000
	requiredNum: /^.{0,20}$/, //0-20个字符
	// passReg: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![a-zA-Z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,20}$/, //6~20位字母数字组合
	passReg2: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, //密码必须包含大小写字母、数字,最少6位字符    密码为： Aa1234. ~格式
	//passReg3: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, //密码必须包含大小写字母、数字,最少8位字符
	passReg3: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/, //密码必须包含字母、数字,最少8位字符
	outmoneypwd: /^\d{6}$/, // 6位数字
	name: /^[^~`!@#$%^&*+-/=/_()|<\{\}\[\],.:'"//\?\\/>》《]{1,30}$/, //1-30位非特殊字符
	tuiName: /^[a-zA-Z\s\u4e00-\u9fa50-9][a-zA-Z0-9\s\u4e00-\u9fa5]{1,23}$/, //1～24个字符，包括、英文字母大小写、汉字、空格
	// endSpace: /.*(?<! )$/,
	yaoma: /^[A-Za-z0-9|A-Za-z|0-9]{6}$/, // 6位 字母与数字的组合 可纯数字或纯字母
	httpCheck: /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/,
	password: /^[A-Za-z0-9~`!@#$%^&*()_+-='",;.?/|]{6,12}$/, //6～12位字母、数字、特殊符号的组合
	account: /^(?![a-zA-Z]+$)[a-zA-Z0-9|0-9]{7,11}$/, //为7～11位字母数字的组合 字母数字-数字
	email: /^[0-9A-Za-zd]+([-_.][0-9A-Za-zd]+)*@([0-9A-Za-zd]+[-.]{0,1})[A-Za-zd]{1,5}$/, // @0355.net；@163.com；@gmail.com；@yeah
	email1: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	length1: /^.{6,30}$/, //6-30个字符
	phone: /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/, //国际号码
	phone1: /^(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
	moneys2: /^(-?)\d{1,9}(\.\d{1,2})?$/, //0.00～999999999.99
	moneys21: /^\d{1,4}(\.\d{1,2})?$/, //0.00-9999.99的金额
	ip: /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/,
	int: /^[1-9]\d*$/, //正整数
	//verifyname: /^[A-Z]+(\s[A-Z]+)*$/ //越南个死变态，输入验证和别的国家不一样
	verifyname: /[^a-zA-Z\s+$]/g,
	inputrule: /^[0-9,|]+$/ //判断输入的正则
}

export const validateText = {
	moneyup: 'validateDesc1',
	redNum: 'validateDesc2',
	requiredNum: 'validateDesc3',
	passReg2: 'pswRequirements',
	outmoneypwd: 'validateDesc5',
	name: 'validateDesc6',
	tuiName: 'validateDesc7',
	endSpace: 'validateDesc8',
	yaoma: 'validateDesc9',
	httpCheck: 'validateDesc10',
	password: 'validateDesc11',
	account: 'validateDesc13',
	email: 'validateDesc14',
	length1: 'validateDesc15',
	phone: 'validateDesc16',
	moneys2: 'validateDesc17',
	moneys21: 'validateDesc18',
	ip: 'validateDesc19',
	int: 'validateDesc20',
	verifyname: 'validateDesc21',
	inputtip: 'validateDesc22'
}
