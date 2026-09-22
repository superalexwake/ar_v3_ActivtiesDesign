import { isIOS } from "./is"
import {native} from './bridges'
export function clearCache() {
	let u = navigator.userAgent
	let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
	 if (isIOS) {
		window.webkit.messageHandlers.clearCache.postMessage(null)
	}
}

export function isHybridApp() {

	if (window.webkit?.messageHandlers?.callNativeMethod) return true;
	if (window.external&&window.external?.callNativeMethod) return true
	return false;
}
export function isAnalysisHybridApp() {
	if (window.webkit?.messageHandlers?.callAnalysisEvents) return true;
	if (window.external&&window.external?.callAnalysisEvents) return true
	return false;
}
export function openAnalysisHybrid(type: string, data: any){
	if (isIOS) {
		window.webkit.messageHandlers.callAnalysisEvents.postMessage({
			type,
			data
		});
	}else {
		window.external.callAnalysisEvents(JSON.stringify({type,data}))
	}
}
export function openHybrid(type: string, data: any){
	if (isIOS) {
		window.webkit.messageHandlers.callNativeMethod.postMessage({
			type,
			data
		});
	}else {
		window.external.callNativeMethod(JSON.stringify({type,data}))
	}
}
export function openBrowser(type: string, data: any) {
	if (!type || !data.url) return;
	if (!isHybridApp()) window.location.href = data.url;
	openHybrid(type,data)
}

export function getAdjustDeviceId(type: string) {
    try {
        if (window.external && window.external?.dataFromNative) {
            return window.external.dataFromNative(JSON.stringify({
                data: { type }
            }));
        }
    } catch (error) {
        console.error('Error calling dataFromNative:', error);
    }
    return null;
}

export function apkParamsUpdate(type: string, event?: any, value?: any) {
	try {
		if (window.external && window.external?.dataFromNative) {
			return window.external.dataFromNative(JSON.stringify({
				data: {
					type,
					event,
					value
				}
			}));
		}
	} catch (error) {
		console.error('Error calling dataFromNative:', error);
	}
	return null;
}
export function isHybridApk(){
	if (isHybridApp()) return true;
	if (isAnalysisHybridApp()) return true;
	if(native.isFullapk() || native.isEmbeddedApk()) return true;
	return  false;
}