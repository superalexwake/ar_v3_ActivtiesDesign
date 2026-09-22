type ResolveFn = (t: string) => void;
type RejectFn = (e?: any) => void;

let latestToken: string | null = null;
let configCache: string | null = null;

let initCalled = false;
let pendingResolvers: ResolveFn[] = [];
let pendingRejectors: RejectFn[] = [];
let retryCount = 0;
const MAX_RETRIES = 2;

const log = console.log.bind(console, '[FcmToken]');

async function ensureFirebaseReady(config: any) {
  for (let i = 0; i < 10; i++) {
    if ((window as any).TomNativeBridge?.initFirebase) return true
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error('TomNativeBridge not ready')
}


/**
 * Global callback the native side will call.
 * Keep the name stable (TomNativeBridge expects this string from your Kotlin).
 */
export const globalFirebaseTokenListener = (payload: any) => {
  log('[globalFirebaseTokenListener] payload:', payload);

  if (payload) {
    latestToken = payload;
    // resolve pending promises
    pendingResolvers.forEach(fn => {
      try { fn(latestToken as string); } catch (_) { /* ignore */ }
    });
    pendingResolvers = [];
    pendingRejectors = [];
  } else {

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      (window as any)?.TomNativeBridge?.fetchFirebaseToken();
      return;
    }

    // treat as error: reject pending promises with reason
    const reason = payload ?? 'Firebase init error';
    pendingRejectors.forEach(fn => {
      try { fn(reason); } catch (_) { /* ignore */ }
    });
    pendingResolvers = [];
    pendingRejectors = [];
  }

  // return token for legacy callers expecting a return value (keeps compatibility)
  return latestToken;
};

// attach to window so native side can call it by name
(window as any).globalFirebaseTokenListener = globalFirebaseTokenListener;

/**
 * Request FCM token.
 *
 * @param config optional config object (will be JSON-stringified and cached on first call)
 * @param opts optional: { timeoutMs?: number } - how long to wait before rejecting
 * @returns Promise<string>
 */
export async function getFcmToken(config?: any, opts?: { timeoutMs?: number }): Promise<string> {
  await ensureFirebaseReady(config)
  // cache config (stringified) on first provided config
  if (!configCache && config && typeof config === 'object') {
    try {
      configCache = JSON.stringify(config);
    } catch {
      configCache = String(config);
    }
  }
  if (configCache && typeof config === 'object') {
    // if caller passed object again, prefer cached string
    config = configCache;
  } else if (configCache) {
    config = configCache;
  }

  if (latestToken) return Promise.resolve(latestToken);

  if (!initCalled) {
    initCalled = true;
    if ((window as any)?.TomNativeBridge?.initFirebase) {
      try {
        // pass the stringified config (or null)
        (window as any)?.TomNativeBridge?.initFirebase(config ?? null, 'globalFirebaseTokenListener');
      } catch (e) {
        // If call itself throws, reject all existing waiters later
        // and allow subsequent calls to try again by resetting initCalled.
        initCalled = false;
        return Promise.reject(e);
      }
    } else {
      initCalled = false;
      return Promise.reject('TomNativeBridge not available');
    }
  }

  // create a promise and push resolvers into queue
  return new Promise<string>((resolve, reject) => {
    pendingResolvers.push(resolve);
    pendingRejectors.push(reject);

    // optional timeout
    const timeoutMs = opts?.timeoutMs ?? 30_000; // default 30s
    if (timeoutMs > 0) {
      const timer = setTimeout(() => {
        // remove this pair from queues if still there
        pendingResolvers = pendingResolvers.filter(r => r !== resolve);
        pendingRejectors = pendingRejectors.filter(r => r !== reject);
        // if nobody is waiting and no token, allow retry next time by resetting initCalled = false
        if (pendingResolvers.length === 0 && !latestToken) {
          initCalled = false;
        }
        reject(new Error(`getFcmToken timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      // once resolved/rejected clear timer to avoid leaks
      const wrapResolve = (t: string) => { clearTimeout(timer); resolve(t); };
      const wrapReject = (e: any) => { clearTimeout(timer); reject(e); };

      // replace last pushed with wrapped versions
      pendingResolvers[pendingResolvers.length - 1] = wrapResolve;
      pendingRejectors[pendingRejectors.length - 1] = wrapReject;
    }
  });
}

/**
 * Helper: force-refresh token (call initFirebase again).
 * Use only when you know you need a fresh token.
 */
export function refreshFcmToken(config?: any): Promise<string> {
  // clear cached token and allow init to be called again
  latestToken = null;
  initCalled = false;
  return getFcmToken(config);
}