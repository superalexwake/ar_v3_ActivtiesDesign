const log = console.log;

/**
 * @function firstFrameSuccess
 * @description 通知原生端首帧渲染成功
 *
 */ 
export function firstFrameSuccess() {
  (window as any)?.postFirstFrame?.();
}


/**
 * @function firstFrameSuccess
 * @description 通知原生端首帧渲染成功
 *
 */
// 1) 先看看原生是不是已经丢过一个路由进来了
export function getNotifyPage(): Promise<string> {
  // @ts-ignore
  const cached = (window as any).__nativeOpenUrl as string | undefined;
  if (cached) {
    log('getNotifyPage: use cached', cached);
    // 用完就清掉，避免重复用旧的
    // @ts-ignore
    // (window as any).__nativeOpenUrl = '';
    return Promise.resolve(cached);
  }

  // 2) 如果还没缓存，就等原生调用 AndroidOpenUrlFromNative
  return new Promise<string>(async (resolve) => {
    let called = false;
    (window as any).AndroidOpenUrlFromNative = (openUrl: string) => {
      log('AndroidOpenUrlFromNative', openUrl);
      const finalUrl = openUrl || '';

      // 把这次的值也写回缓存，方便其它地方要用
      // @ts-ignore
      (window as any).__nativeOpenUrl = finalUrl;

      resolve(finalUrl);

      // 如果你只希望用一次，可以顺便删掉回调
      // delete (window as any).AndroidOpenUrlFromNative;
    };

    if (await new Promise((r) => setTimeout(r, 100)), !called) {
      log('getNotifyPage: timeout, resolve empty');
      resolve('');
    }
  });
}