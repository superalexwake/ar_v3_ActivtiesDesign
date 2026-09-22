import { CustomerService } from "@/api";
import { partyUrl } from "@/utils";
import { useThrottleFn } from "@vueuse/core";
import { ref } from "vue";
const LiveChatWidget = ref();

interface OptionTs{
  type:number //1 ,2
}
export function useCustomService(option:OptionTs) {
  const { type } = option;
  // let type = 2;
  /**
   * @description: 初始化聊天sdk
   * @return {*}
   */
  const init = async () => {
    // @ts-ignore
    window.__lc = window.__lc || {};
    // @ts-ignore
    window.__lc.license = 15861567;
    // @ts-ignore
    window.__lc.asyncInit = true;

    (function (n, t, c) {
      // @ts-ignore
      function i(n) {
        // @ts-ignore
        return e._h ? e._h.apply(null, n) : e._q.push(n);
      }
      var e = {
        _q: [],
        _h: null,
        _v: "2.0",
        on: function () {
          i(["on", c.call(arguments)]);
        },
        once: function () {
          i(["once", c.call(arguments)]);
        },
        off: function () {
          i(["off", c.call(arguments)]);
        },
        get: function () {
          if (!e._h)
            throw new Error(
              "[LiveChatWidget] You can't use getters before load."
            );
          return i(["get", c.call(arguments)]);
        },
        call: function () {
          i(["call", c.call(arguments)]);
        },
        init: function () {
          var n = t.createElement("script");
          (n.async = !0),
            (n.type = "text/javascript"),
            (n.src = "https://cdn.livechatinc.com/tracking.js"),
            t.head.appendChild(n);
        },
      };
      // @ts-ignore
      !n.__lc.asyncInit && e.init(), (n.LiveChatWidget = n.LiveChatWidget || e);
    })(window, document, [].slice);
  };

  const handleCustom = (id: string, amount: number) => {
    // @ts-ignore
    (window.Tawk_API as any).toggle(); // 唤起客服
    // @ts-ignore
    window.Tawk_API.setAttributes(
      {
        userid: id,
        vv075mxt0i: amount,
      },
      function (error: any) {
        console.log("error", error);
      }
    );
  }
  const handleLoginCustom = (path: string) => {
    // @ts-ignore
    (window.Tawk_API as any).toggle(); // 唤起客服
    // @ts-ignore
    window.Tawk_API.setAttributes(
      {
        wizmpunyhe: path,
      },
      function (error: any) {
        console.log("error", error);
      }
    );
  }
  //tawk客服
  const getTawk = () => {
    if (!document.getElementById("tawk-chatjs")) {
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
      var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://embed.tawk.to/6452138631ebfa0fe7fbb175/1hjs089gi';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode?.insertBefore(s1,s0);
      })();
    }
    // if (!document.getElementById("tawk-chatjs")) {

      // var Tawk_API:any=Tawk_API||{}, Tawk_LoadStart=new Date();
      // (function(){
      // var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      // s1.async=true;
      // s1.src='https://embed.tawk.to/6452138631ebfa0fe7fbb175/1hb0ug9qm';
      // s1.charset='UTF-8';
      // s1.setAttribute('crossorigin','*');
      // s0.parentNode?.insertBefore(s1,s0);
      // })();
      // var Tawk_API: any = Tawk_API || {};
      // var s1 = document.createElement("script");
      // var s0 = document.getElementsByTagName("script")[0];
      // s1.async = true;
      // s1.src = "https://embed.tawk.to/6452138631ebfa0fe7fbb175/1hb0ug9qm";
      // s1.charset = "UTF-8";
      // s1.setAttribute("crossorigin", "*");
      // s1.id = "tawk-chatjs";
      // s0.parentNode?.insertBefore(s1, s0);
    // }
};

  function onVisibilityChanged(data: { visibility: string }) {
    switch (data.visibility) {
      case "maximized":
        break;
      case "minimized":
        window.LiveChatWidget?.call("hide");
        break;
      case "hidden":
        break;
    }
  }
 
  const handleOpen = useThrottleFn(async (id?: string, amount?: number) => {
    if(type === 1){
      LiveChatWidget.value.call("set_session_variables", {
        userId: id,
        balance: amount,
      });
      LiveChatWidget.value.call("maximize");
    }else if(type === 2){
      handleCustom(id,amount)
    }else if(type === 3){
      getCustomerService()
    }
  },2000);

  const handleLoginOpen = useThrottleFn(async (path: string) => {
    if(type === 1){
      LiveChatWidget.value.call("set_session_variables", {
        routhPath: path
      });
      LiveChatWidget.value.call("maximize");
    }else if(type === 2){
      handleLoginCustom(path)
    }else if(type === 3){
      getCustomerService()
    }
    
  },2000)

  const onReady = async () => {
    if(type === 3) return;
    if(type == 1){
      if (window.LiveChatWidget) return;
      await init();
      LiveChatWidget.value = window.LiveChatWidget as any;
      await LiveChatWidget.value.init();
      LiveChatWidget.value.call("hide");
      LiveChatWidget.value.on("visibility_changed", onVisibilityChanged);
    }else{
      getTawk()
    }
  };

  const getCustomerService = async() =>{
      const res = await CustomerService({
		  antCustomer:"2"
	  });
      if(res.code === '1'){
        partyUrl(res.data.serviceSystemUrl,0)
      }
  }

  return {
    LiveChatWidget,
    onReady,
    handleOpen,
    handleLoginOpen
  };
}
