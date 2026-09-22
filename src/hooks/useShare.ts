import { useToast } from "./useToast.hook";
import {native} from "@/utils/bridges";
export type SharePlatform = "Facebook" | "Whatsapp" | "Telegram" | "Twitter";

export interface ShareOptions {
  platform: SharePlatform;
  text?: string;
  sharePage?: string;
  base64Text?: string; // 用于 Telegram 的 base64 图片
}

export function useShare() {
  const toast = useToast();
  const shareApp: SharePlatform[] = [
    "Whatsapp",
    "Telegram",
    "Facebook",
    "Twitter",
  ];
  /**
   * 分享主方法
   */
  async function share(options: ShareOptions) {
    const { platform, sharePage } = options;
    const urlMap: Record<string, string> = {
      Telegram: `https://telegram.me/share/url?url=${encodeURIComponent(sharePage || "")}`,
      Whatsapp: `https://wa.me/?text=${encodeURIComponent(sharePage || "")}`,
      Twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(sharePage || "")}`,
      // facebook: `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${sharePage}`
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePage || "")}`
    };
    // ✅ 优先调用 App 原生方法
    if (native.isFullapk() || native.isEmbeddedApk()) {
		shareAppContent(urlMap[platform])
	} else {
		shareContent(urlMap[platform])
	}
  }

  async function shareAppContent(shareLink: string) {
    native.openExternalUrl(shareLink);
  }

  async function shareContent(
    shareLink: string
  ) {

    try {
      window.location.href = shareLink
    } catch (err) {
      // 最终兜底
      window.open(shareLink, "_blank");
    }
  }

  function saveToPureBase64(file) {
    // console.log("saveToPureBase64", file);
    const raw = file.trim();
    if (!raw) throw new Error("Please paste dataURL or pure base64 text first");
    // dataURL -> 提取 mime 与纯 base64
    if (raw.startsWith("data:")) {
      const m = raw.match(/^data:(.*?);base64,(.*)$/);
      if (!m)
        throw new Error(
          "dataURL format is incorrect, please confirm it is like data:image/png;base64,...."
        );
      const filename = `img_${Date.now()}.png`;
      console.log("calling...");
      const ret = native.saveBase64(
        filename,
        m[1],
        m[2].replace(/\s+/g, "")
      );
      // 原生如果返回字符串（建议返回 JSON 字符串）
      toast.success("save success");
      if (typeof ret === "string") {
        console.log("completed: " + ret, true, false);
      } else {
        console.log("completed: " + JSON.stringify(ret), true, false);
      }
    }
  }

  return { share, shareApp, saveToPureBase64 };
}