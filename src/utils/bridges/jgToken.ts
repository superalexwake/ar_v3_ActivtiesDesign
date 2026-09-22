type ResolveFn = (t: string) => void;
type RejectFn = (e?: any) => void;

let latestToken: string | null = null;
let configCache: string | null = null;

let initCalled = false;
let pendingResolvers: ResolveFn[] = [];
let pendingRejectors: RejectFn[] = [];
let retryCount = 0;
const MAX_RETRIES = 2;

const log = console.log.bind(console, '[JgToken]');

async function ensureJPushReady() {
  for (let i = 0; i < 10; i++) {
    if ((window as any).TomNativeBridge?.initJPush) return true
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error('TomNativeBridge.initJPush not ready')
}

/**
 * Global callback the native side will call.
 * Keep the name stable (TomNativeBridge expects this string from your Kotlin).
 */
export const globalJPushTokenListener = (payload: any) => {
  log('[globalJPushTokenListener] payload:', payload);

  if (payload) {
    latestToken = payload;
    pendingResolvers.forEach(fn => {
      try { fn(latestToken as string); } catch (_) { /* ignore */ }
    });
    pendingResolvers = [];
    pendingRejectors = [];
  } else {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      (window as any)?.TomNativeBridge?.fetchJPushToken();
      return;
    }

    const reason = payload ?? 'JPush init error';
    pendingRejectors.forEach(fn => {
      try { fn(reason); } catch (_) { /* ignore */ }
    });
    pendingResolvers = [];
    pendingRejectors = [];
  }

  return latestToken;
};

// attach to window so native side can call it by name
(window as any).globalJPushTokenListener = globalJPushTokenListener;

/**
 * Request JPush registration ID.
 *
 * @param config optional config object (will be JSON-stringified and cached on first call)
 * @param opts optional: { timeoutMs?: number } - how long to wait before rejecting
 * @returns Promise<string>
 */
export async function getJgToken(config?: any, opts?: { timeoutMs?: number }): Promise<string> {
  await ensureJPushReady()

  if (!configCache && config && typeof config === 'object') {
    try {
      configCache = JSON.stringify(config);
    } catch {
      configCache = String(config);
    }
  }
  if (configCache && typeof config === 'object') {
    config = configCache;
  } else if (configCache) {
    config = configCache;
  }

  if (latestToken) return Promise.resolve(latestToken);

  if (!initCalled) {
    initCalled = true;
    if ((window as any)?.TomNativeBridge?.initJPush) {
      try {
        (window as any)?.TomNativeBridge?.initJPush(config ?? null, 'globalJPushTokenListener');
      } catch (e) {
        initCalled = false;
        return Promise.reject(e);
      }
    } else {
      initCalled = false;
      return Promise.reject('TomNativeBridge.initJPush not available');
    }
  }

  return new Promise<string>((resolve, reject) => {
    pendingResolvers.push(resolve);
    pendingRejectors.push(reject);

    const timeoutMs = opts?.timeoutMs ?? 30_000;
    if (timeoutMs > 0) {
      const timer = setTimeout(() => {
        pendingResolvers = pendingResolvers.filter(r => r !== resolve);
        pendingRejectors = pendingRejectors.filter(r => r !== reject);
        if (pendingResolvers.length === 0 && !latestToken) {
          initCalled = false;
        }
        reject(new Error(`getJgToken timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      const wrapResolve = (t: string) => { clearTimeout(timer); resolve(t); };
      const wrapReject = (e: any) => { clearTimeout(timer); reject(e); };

      pendingResolvers[pendingResolvers.length - 1] = wrapResolve;
      pendingRejectors[pendingRejectors.length - 1] = wrapReject;
    }
  });
}

/**
 * Helper: force-refresh JPush token.
 */
export function refreshJgToken(config?: any): Promise<string> {
  latestToken = null;
  initCalled = false;
  return getJgToken(config);
}
