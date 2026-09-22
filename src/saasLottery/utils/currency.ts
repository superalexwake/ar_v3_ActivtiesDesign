export {currency} from '@/utils'
// // 货币过滤器
// export const currency = (value: any, _currency = '', decimals = 2) => {
//     var digitsRE = /(\d{3})(?=\d)/g
//     value = parseFloat(value)
//     if (!isFinite(value) || (!value && value !== 0)) return ''
//     decimals = decimals != null ? decimals : 2
//     var stringified = Math.abs(value).toFixed(decimals)
//     var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
//     var i = _int.length % 3
//     var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
//     var _float = decimals ? stringified.slice(-1 - decimals) : ''
//     var sign = value < 0 ? '-' : ''
//     var Language = '1';
//     if (Language == '2') {
//         return sign + head + _int.slice(i).replace(digitsRE, '$1,') + _float + _currency
//     } else {
//         return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
//     }
// }
