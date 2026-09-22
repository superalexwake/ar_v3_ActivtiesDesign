import { showToast } from 'vant';
import { useClipboard } from '@vueuse/core';
import  i18n from '@/languages'
const { copy } = useClipboard();

/** ArUpi 充值渠道的 payTypeID 集合，用于判断订单或渠道是否走 ArUpi 流程 */
export const arUpiPayTypeList = [26000, 26001, 26010, 26011]

export function getFormatAmount(money:string|number|undefined,symbol:string='₹',decimal:number=2){
	let amount='0.00';
	if (!money) return symbol+ amount
	if(typeof money === 'number' ){
		amount= new Intl.NumberFormat('en-US', {
			minimumFractionDigits: decimal,
			maximumFractionDigits: decimal,
			useGrouping: true, // 启用千位分隔符
		}).format(money);
	}else{
		amount= new Intl.NumberFormat('en-US', {
			minimumFractionDigits: decimal,
			maximumFractionDigits: decimal,
			useGrouping: true, // 启用千位分隔符
		}).format(parseInt(money as string));
	};
	return symbol+ amount
}
export const getFileNameUUID = () => {
	function rx() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
	}
	return `${+new Date()}_${rx()}${rx()}`
}
export const getFileType =(fileType:string)=> {
	switch (fileType) {
		case 'image/jpeg':
			return 'jpg';
		case 'image/png':
			return 'png';
		case 'image/gif':
			return 'gif';
		case 'image/bmp':
			return 'bmp';
		case 'image/webp':
			return 'webp';
		case 'image/svg+xml':
			return 'SVG';
		case 'image/tiff':
			return 'tiff';
		case 'image/x-icon':
			return 'ico';
		case 'video/mp4':
			// 处理 MP4 格式的视频
			return 'mp4';
		case 'video/webm':
			// 处理 WebM 格式的视频
			return 'webm';
		case 'video/ogg':
			// 处理 Ogg 格式的视频
			return 'ogg';
		case 'video/mpeg':
			// 处理 mpeg 格式的视频
			return 'mpeg';
		case 'video/quicktime':
			// 处理 mpeg 格式的视频
			return 'mov';
		case 'video/3gpp':
			// 处理 mpeg 格式的视频
			return '3gp';
		case 'video/x-msvideo':
			// 处理 mpeg 格式的视频
			return 'avi';
		case 'video/x-flv':
			// 处理 mpeg 格式的视频
			return 'flv';
		case 'video/x-matroska':
			// 处理 mpeg 格式的视频
			return 'mkv';
	}
}
export function getCopy(content:string) {
	const t = i18n.global.t
	copy(content)
	showToast({
		message: t('arupiCopy'),
		icon: 'success',
	});
}
export function formatUpiTime(seconds: number) {
	if(seconds <= 0) {
		return '00:00';
	}
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedTime = `${String(
		minutes
	).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
	return formattedTime;
}
