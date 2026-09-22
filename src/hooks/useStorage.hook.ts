/**
 * 本地缓存
 */
export function useStorage() {
  const localStore = {
    set(key: string, value: any, expires = -1) {
      if (expires !== -1) {
        expires = Date.now() + expires * 1000
      }
      window.localStorage.setItem(key, JSON.stringify({ value, expires }))
    },
    get<T = string>(key: string): T | null {
      const result = window.localStorage.getItem(key)
      if (result) {
        const store = JSON.parse(result)
        if (store.expires !== -1 && store.expires < Date.now()) {
          localStore.remove(key)
          return null
        }
        return store.value
      }
      return null
    },
    remove(key: string) {
      window.localStorage.removeItem(key)
    },
  }
  const cookie = {
    // 设置 Cookie
    setCookie: function(
        name: string,
        value: string,
        days?: number,
        options: { path?: string; domain?: string; secure?: boolean; sameSite?: 'Lax' | 'Strict' | 'None' } = {
          sameSite:'None',
          secure:true,
          domain:location.hostname
        }
    ) {
      let expires = "";

      // 设置过期时间
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      const path = options.path ? `; path=${options.path}` : "; path=/";
      const domain = options.domain ? `; domain=${options.domain}` : "";
      const secure = options.secure ? "; Secure" : "";
      const sameSite = options.sameSite ? `; SameSite=${options.sameSite}` : "";

      try {
        // 拼接最终的 Cookie 字符串
        document.cookie = `${name}=${encodeURIComponent(value)}${expires}${path}${domain}${secure}${sameSite}`;
      } catch (error) {
        console.error("Failed to set cookie:", error);
      }
    },

    // 获取 Cookie
    getCookie: function(name:string) {
      const nameEQ = name + "=";
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
        }
      }
      return null;
    },

    // 删除 Cookie
    remove: function(name:string) {
      this.setCookie(name, "", -1); // 设置为过去时间以删除 Cookie
    }
  };
  return { localStore,cookie }
}
