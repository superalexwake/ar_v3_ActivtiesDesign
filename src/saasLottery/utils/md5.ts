import SparkMD5 from "spark-md5";
export const encrypt = (data: string) => {
  const encryptedData = SparkMD5.hash(data)
  const encryptedDataHex = encryptedData.toString()
  return encryptedDataHex.toUpperCase().slice(0, 32)
}
export function randomInt(n:number) {
  if (n <= 0) return -1;
  const limit = Math.pow(10, n);
  let value = Math.floor(Math.random() * limit);
  if (value < (limit / 10) && value !== 0) {
    return randomInt(n);
  }
  return value
}

/**
 * 注入请求公共字段。
 *
 * @remarks 原型环境不计算请求签名（空实现）：假数据层不校验签名，真实后端会拒绝这些请求，
 * 因此这份代码不能直接拿去连接真实服务器。
 * @param data - 请求参数，会被原地修改。
 * @returns 补上随机数与时间戳后的同一个对象。
 */
export const signData = (data:Record<string, any>) => {
  data['random'] = randomInt(12);
  delete data['signature'];
  data['timestamp'] = Math.floor(Date.now() / 1000);
  return data;
};
