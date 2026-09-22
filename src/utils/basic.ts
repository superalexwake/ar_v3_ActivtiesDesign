// import { showFailToast } from 'vant'

export const extend = Object.assign
export const splitStr = (str: string) => {
	return str.slice(1, str.length)
}
export function encodeToBase64(string:string) {
	const encoder = new TextEncoder();
	const bytes = encoder.encode(string);
	let binary = '';
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary);

}
export function decodeFromBase64(encodedString:string) {
	return atob(encodedString);
}
export function updateHostname(newSubdomain: string,origin:string): string {
	const url = new URL(origin);
	const currentHostname = url.hostname; // 获取当前的主机名
	const domainParts = currentHostname.split('.'); // 拆分域名
	if (domainParts.length > 2) {
		domainParts[0] = newSubdomain; // 修改二级域名
	} else {
		domainParts.unshift(newSubdomain); // 如果没有二级域名，添加一个
	}
	return `${url.protocol}//${domainParts.join('.')}`; // 拼接成新的域名
}
export function getHashParams():any {
	let fragment = window.location.hash;
	if (!fragment.includes('?'))fragment=location.search;
	function parseHashParams(fragment) {
		if (fragment) {
			const queryStart = fragment.indexOf('?');

			if (queryStart !== -1) {
				// 如果存在问号，则截取问号后的部分
				fragment = fragment.substring(queryStart + 1);
			}
			var queryParams = fragment.split('&');
			var params = {};

			queryParams.forEach(function (param) {
				var keyValue = param.split('=');
				params[keyValue[0]] = decodeURIComponent(keyValue[1]);
			});

			return params;
		} else {
			return {};
		}
	}

	return parseHashParams(fragment);
}
export function capitalize(str = "") {
	if (!str) return ''
	return str.charAt(0).toUpperCase() + str.slice(1);
}