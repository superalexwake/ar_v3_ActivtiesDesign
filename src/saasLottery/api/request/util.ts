export function isFunction(value: unknown) {
  return typeof value === 'function'
}
export function Delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
export function deepClone(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj // 如果是基本数据类型或null，则直接返回
  }

  if (Array.isArray(obj)) {
    const newArray = []
    for (let i = 0; i < obj.length; i++) {
      newArray[i] = deepClone(obj[i]) // 递归克隆数组的每个元素
    }
    return newArray
  }

  const newObj = Object.create(null)
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key]) // 递归克隆对象的每个属性
    }
  }

  return newObj
}
export function isString(value: unknown) {
  return typeof value === 'string'
}
export function throttle(func: (...args: any[]) => void, limit: number): (...args: any[]) => void {
  let inThrottle: boolean;

  return function(): void {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const context = this as any;

    if (!inThrottle) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export function debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
  let debounceTimer: NodeJS.Timeout;

  return function(): void {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;

    clearTimeout(debounceTimer);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}
