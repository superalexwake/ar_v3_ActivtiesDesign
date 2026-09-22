<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { AwaitApiResult, getHashParams } from '@/utils'
import {
	canInstallPWA,
	installPWA,
	isInstalled,
	isStandalone,
	isIOSDevice as isIOS,
	pwaStore as store,
	redirectToChromeIfNeeded,
} from '@/hooks/usePwa'
import { getHomePwaSettingPageInfo } from '@/api'

onMounted(() => {
	// 原 useWebAppDetection.onMounted 里在内置浏览器（FB / 微信 ...）跳 Chrome，这里接管。
	redirectToChromeIfNeeded()
})
const recommend=computed(()=>{
	const list=store.pwaJumpDomainList||[];
	return list.find(
		(i: any) => i.isRecommended
	)
})
// 跳转地址
const jumpUrl = computed(()=>recommend.value?.jumpDomain||'');
// apk下载地址
const apkUrl = computed(()=>recommend.value?.apkUrl||'');
// 是否展示遮罩
const showMark = ref(false);
// 进度条数
const progress = ref(0);
// 是否展示进度条按钮
const showProgress = ref(false);
// 获取页面数据
const getPageData = async () => {
	if (store.id) {
		if (isStandalone.value) {
			jumpToUrl();
		}
		return
	} ;
	const result= await  AwaitApiResult(getHomePwaSettingPageInfo({
		domainUrl:window.location.origin,
		deviceCode:''
	}));
	if (result){
		const { code, data } = result;
		if (code == 0) {
			Object.assign(store,data);
			const recommend = data.pwaJumpDomainList.find(
				(i: any) => i.isRecommended
			);
			jumpUrl.value = recommend?.jumpDomain || "";
			apkUrl.value = recommend?.apkUrl || "";
			console.log(apkUrl.value,'apkUrl.value');
			if (isStandalone.value) {
				jumpToUrl();
			}
		}
	}
};
// 进度条动画function
const startProgress = () => {
	progress.value = 0;
	showProgress.value = true;
	const start = Date.now();
	const timer = setInterval(() => {
		const elapsed = Date.now() - start;
		const percent = Math.min((elapsed / 4000) * 100, 100);
		progress.value = percent;

		if (percent >= 100) {
			showProgress.value = false;
			clearInterval(timer);
		}
	}, 16); // 每帧约 60fps
};
// 安装pak
const installapk = () => {
	// 下载apk
	window.open(apkUrl.value);
};
const install = () => {
	if (canInstallPWA.value) return installPWA();
	 startProgress();
	 if (apkUrl.value && !isInstalled.value) return installapk();
};
const joinLink = (link: string) => {
	if (!link) return ''
	const query=getHashParams();
	const url=new URL(link);
	Object.keys(query).forEach((key:string) => {
		if (url.searchParams.has(key)) {
			url.searchParams.delete(key);
		}
		url.searchParams.append(key,query[key])
	})
	return  url.toString();

}
// 跳转jumpUrl
const jumpToUrl = () => {
    if (!jumpUrl.value) return;
	// 跳转到新的 URL
	window.location.href = joinLink(jumpUrl.value);
};
const imgageList = computed(() => store.appPics.split(","));

getPageData();
</script>

<template>
	<div v-if="showMark" class="mark">
		<div class="mark-content">
			<div class="l1">{{ $t('m1') }}</div>
			<div class="l2">{{ $t('m2') }}</div>
			<div class="l3">{{ $t('m3') }}</div>
			<div v-if="showProgress" class="progress">
				<div class="progress-bar" :style="{ width: progress + '%' }"></div>
				<div class="progress-text">{{ Math.round(progress) }}%</div>
			</div>
			<div v-else class="l4" @click="install">{{ $t('m4') }}</div>
		</div>
	</div>
	<div v-if="isStandalone" class="loading-container">
		<div class="loading-spinner"></div>
	</div>
	<div v-else class="googlePlay">
		<div class="googlePlay-head">
			<img src="@/assets/icons/google/google.png" alt="" />
			<img src="@/assets/icons/google/top.png" alt="" />
		</div>
		<div class="l1">
			<img :src="store.logo" alt="" class="logo" />
			<div class="l1-r">
				<div class="l1-r-1">
					{{ store.appName }}<img src="@/assets/icons/google/icon_01.svg?url" alt="" class="icon01" />
				</div>
				<div class="l1-r-2">{{ store.appIntroduction }}</div>
				<div class="l1-r-3">
					<img src="@/assets/icons/google/icon_veri.svg?url" alt="" class="veri" /> {{ $t('gpV') }}
				</div>
			</div>
		</div>
		<div class="l2">
			<div>
				{{ store.score }}<span>{{ store.scoreCount }} {{ $t('l2R') }}</span>
			</div>
			<div>
				{{ store.downloadCount }}<span>{{$t('l2D')}}</span>
			</div>
			<div>
				<img src="@/assets/icons/google/icon_03.svg?url" alt="" class="icon03" /><span>{{
					$t('l2EC')
				}}</span>
			</div>
		</div>
		<div v-if="isIOS" class="l3" @click="jumpToUrl()">
			<div class="i">{{ $t('l3GP') }}</div>
			<div class="d">{{ $t('l3DW') }}</div>
		</div>
		<div
			v-else-if="canInstallPWA || (apkUrl && !isInstalled)"
			@click="showMark = true"
			class="l3"
		>
			<div class="i">{{ $t('l3GP') }}</div>
			<div class="d">{{ $t('l3DW') }}</div>
		</div>
		<div v-else class="l3" @click="jumpToUrl()">
			<div class="i">{{ $t('l3GP') }}</div>
			<div class="d">{{ $t('l3DW') }}</div>
		</div>
		<div class="l4">
			<img src="@/assets/icons/google/icon_05.svg?url" alt="" />
			{{ $t('l4S') }}
			<img src="@/assets/icons/google/add.svg?url" alt="" class="left" />
			{{ $t('l4AW') }}
		</div>
		<div class="l5">
			<img v-for="(item, k) in imgageList" :key="k" :src="item" alt="" />
		</div>
		<div class="title">
			{{ $t('aboutAPP') }}
			<img src="@/assets/icons/google/icon_06.svg?url" alt="" />
		</div>
		<div class="text">{{ store.aboutApp }}</div>
		<div class="title1">{{ $t('upd') }}</div>
		<div class="slots">{{ $t('slots') }}</div>
		<div class="title">
			{{ $t('ds') }}
			<img src="@/assets/icons/google/icon_06.svg?url" alt="" />
		</div>
		<div class="text">{{ $t('dsT') }}</div>
		<div class="l6">
			<div>
				<img src="@/assets/icons/google/icon_share.svg?url" alt="" />
				<div>
					{{ $t('dsND') }}<br />
					<div>{{ $t('dsLM') }}</div> {{ $t('dsLR') }}
				</div>
			</div>
			<div>
				<img src="@/assets/icons/google/icon_download.svg?url" alt="" />
				<div>{{ $t('dsC') }}</div>
			</div>
			<div>
				<img src="@/assets/icons/google/icon_lock.svg?url" alt="" />
				<div>{{ $t('dsE') }}</div>
			</div>
			<div>
				<img src="@/assets/icons/google/icon_delete.svg?url" alt="" />
				<div>{{ $t('dsD') }}</div>
			</div>
		</div>
		<div class="title">{{ $t('rt') }}</div>
		<div class="text">{{ $t('rtT') }}</div>
		<div class="l7">
			<div class="l">
				<img src="@/assets/icons/google/icon_phone.svg?url" alt="" />{{ $t('devP')}}
			</div>
			<div class="r">
				<img src="@/assets/icons/google/icon_phone1.svg?url" alt="" />{{ $t('devT') }}
			</div>
		</div>
		<div class="l8">
			<div class="l">
				{{ store.score }}
				<img src="@/assets/icons/google/start4.svg?url" alt="" />
				<span>{{ $t('rCount') }}</span>
			</div>
			<img src="@/assets/icons/google/point.svg?url" alt="" class="r" />
		</div>
		<div class="u">
			<div class="h">
				<div class="l">
					<img src="@/assets/icons/google/u1.png" alt="" class="pic" />
					<div class="n">{{ $t('r1N') }}</div>
				</div>
				<img src="@/assets/icons/google/rpoint.svg?url" alt="" class="p" />
			</div>
			<div class="m">
				<img src="@/assets/icons/google/start5.svg?url" alt="" />
				{{ $t('r1D') }}
			</div>
			<div class="text">
				{{ $t('r1T') }}
			</div>
		</div>
		<div class="u">
			<div class="h">
				<div class="l">
					<img src="@/assets/icons/google/u2.png" alt="" class="pic" />
					<div class="n">{{ $t('r2N') }}</div>
				</div>
				<img src="@/assets/icons/google/rpoint.svg?url" alt="" class="p" />
			</div>
			<div class="m">
				<img src="@/assets/icons/google/start5.svg?url" alt="" />
				{{ $t('r2D') }}
			</div>
			<div class="text">
				{{ $t('r2T') }}
			</div>
		</div>
		<div class="u">
			<div class="h">
				<div class="l">
					<img src="@/assets/icons/google/u1.png?url" alt="" class="pic" />
					<div class="n">{{ $t('r3N') }}</div>
				</div>
				<img src="@/assets/icons/google/rpoint.svg?url" alt="" class="p" />
			</div>
			<div class="m">
				<img src="@/assets/icons/google/start5.svg?url" alt="" />
				{{ $t('r3D') }}
			</div>
			<div class="text">{{ $t('r3T') }}</div>
		</div>
		<div class="line"></div>
		<div class="bottom">
			<div>
				<div>{{ $t('b1') }}</div>
				<div>{{ $t('b2') }}</div>
				<div>{{ $t('b3') }}</div>
				<div>{{ $t('b4') }}</div>
				<div>{{ $t('b5') }}</div>
			</div>
			<div>
				<div>{{ $t('b6') }}</div>
				<div>{{ $t('b7') }}</div>
				<div>{{ $t('b8') }}</div>
			</div>
			<div>{{ $t('b9') }}</div>
			<div>{{ $t('b10') }}</div>
		</div>
		<img src="@/assets/icons/google/footer.svg?url" alt="" class="footer" />
	</div>
</template>
<style scoped lang="scss">

.googlePlay {
	padding: 106px 40px 142px 40px;
	font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
	font-weight: 400;
	color-scheme: light dark;
	color: rgba(255, 255, 255, 0.87);
	&-head {
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 750px;
		display: flex;
		justify-content: space-between;
		padding: 20px 40px;
		box-sizing: border-box;
		background: #fff;
		z-index: 10;

		img {
			height: 66px;
			width: auto;
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 750px;
	}

	.l1 {
		display: flex;
		height: fit-content;
		gap: 30px;
		margin-top: 20px;

		&-r {
			display: flex;
			flex-direction: column;
			gap: 16px;

			.veri {
				width: 24px;
				height: 24px;
			}

			&-1 {
				color: #333;
				font-family: Poppins;
				font-size: 36px;
				font-style: normal;
				font-weight: 600;
				line-height: normal;
				height: 54px;
				display: flex;
				align-items: center;
				gap: 16px;

				.icon01 {
					width: 32px;
					height: 32px;
					position: relative;
					top: -6px;
				}
			}

			&-2 {
				color: #237c57;
				font-family: Poppins;
				font-size: 28px;
				font-style: normal;
				font-weight: 600;
				line-height: 36px;
			}

			&-3 {
				color: #666;
				text-align: center;
				font-family: Poppins;
				font-size: 24px;
				font-style: normal;
				font-weight: 400;
				line-height: 28px;
				display: flex;
				align-items: center;
				gap: 8px;
				/* 116.667% */
			}
		}

		img {
			width: 160px;
			height: 160px;
		}
	}

	.l2 {
		display: flex;
		margin-top: 72px;

		&>div {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 12px;
			color: #333;
			text-align: center;
			font-family: Poppins;
			font-size: 28px;
			font-style: normal;
			font-weight: 600;
			line-height: 36px;
			align-items: center;
			position: relative;

			/* 128.571% */
			span {
				color: #666;
				text-align: center;
				font-family: Poppins;
				font-size: 24px;
				font-style: normal;
				font-weight: 400;
				line-height: 28px;
				/* 116.667% */
			}

			.icon03 {
				width: 32px;
				height: 32px;
			}

			&:not(:first-of-type) {
				&::after {
					content: "";
					display: block;
					height: 58px;
					width: 1px;
					background: #e1e1e1;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
	}

	.l3 {
		border-radius: 16px;
		background: #237c57;
		height: 108px;
		margin-top: 72px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;

		&::before {
			content: "";
			animation: shiny 6s ease-in-out infinite;
			background: #fff;
			display: inline-block;
			height: 100%;
			left: 0;
			position: absolute;
			top: -180px;
			width: 30px;
		}

		@keyframes shiny {
			0% {
				opacity: 0;
				transform: scale(0) rotate(45deg);
			}

			80% {
				opacity: 0.5;
				transform: scale(0) rotate(45deg);
			}

			81% {
				opacity: 1;
				transform: scale(4) rotate(45deg);
			}

			to {
				opacity: 0;
				transform: scale(50) rotate(45deg);
			}
		}

		.i {
			color: #fcdf42;
			font-family: Poppins;
			font-size: 28px;
			font-style: normal;
			font-weight: 500;
			line-height: 36px;
			/* 128.571% */
		}

		.d {
			color: #fff;
			font-family: Poppins;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 32px;
			/* 133.333% */
		}
	}

	.l4 {
		display: flex;
		justify-content: center;
		color: #237c57;
		font-family: Poppins;
		font-size: 28px;
		font-style: normal;
		font-weight: 500;
		line-height: 36px;
		gap: 12px;
		margin-top: 72px;

		/* 128.571% */
		.left {
			margin-left: 38px;
		}

		img {
			width: 32px;
			height: 32px;
		}
	}

	.l5 {
		width: 100%;
		overflow-x: auto;
		display: flex;
		gap: 24px;
		height: 398px;
		margin-top: 72px;

		img {
			flex: none;
			width: 250px;
			height: 100%;
		}
	}

	.title {
		display: flex;
		justify-content: space-between;
		color: #333;
		font-family: Poppins;
		font-size: 32px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		margin-top: 40px;

		img {
			width: 32px;
			height: 32px;
		}
	}

	.text {
		color: #666;
		font-family: Poppins;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: 36px;
		/* 150% */
		margin-top: 17px;
	}

	.title1 {
		color: #333;
		font-family: Poppins;
		font-size: 28px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
		margin-top: 40px;
		margin-bottom: 24px;
	}

	.slots {
		width: fit-content;
		padding: 10px 24px;
		color: #666;
		font-family: Poppins;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		border-radius: 50px;
		border: 1px solid #e0e0e0;
	}

	.l6 {
		border-radius: 16px;
		border: 2px solid #e0e0e0;
		display: flex;
		padding: 44px 32px;
		flex-direction: column;
		align-items: flex-start;
		gap: 32px;
		margin-top: 24px;

		img {
			width: 32px;
			height: 32px;
		}

		&>div {
			display: flex;
			align-items: flex-start;
			color: #666;
			gap: 12px;
			font-family: Poppins;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 32px;
			/* 133.333% */
		}
	}

	.l7 {
		display: flex;
		gap: 24px;
		margin-top: 36px;

		img {
			width: 32px;
			height: 32px;
		}

		.l {
			display: flex;
			padding: 10px 24px;
			justify-content: center;
			align-items: center;
			gap: 10px;
			border-radius: 50px;
			background: #e6f3ef;
			color: #237c57;
			font-family: Poppins;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		.r {
			border-radius: 50px;
			border: 1px solid #e0e0e0;
			display: flex;
			padding: 10px 24px;
			justify-content: center;
			align-items: center;
			gap: 10px;
			color: #666;
			font-family: Poppins;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}
	}

	.l8 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 56px;

		.l {
			color: #000;
			font-family: Poppins;
			font-size: 120px;
			font-style: normal;
			font-weight: 400;
			line-height: 160px;
			display: flex;
			flex-direction: column;
			gap: 12px;

			/* 133.333% */
			img {
				height: 32px;
			}

			span {
				color: #999;
				font-family: Poppins;
				font-size: 24px;
				font-style: normal;
				font-weight: 400;
				line-height: 28px;
				/* 116.667% */
			}
		}

		.r {
			width: 335px;
		}
	}

	.u {
		margin-top: 40px;

		.h {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 24px;

			.pic {
				width: 60px;
			}

			.p {
				width: 6px;
			}

			.l {
				display: flex;
				gap: 32px;
			}

			.n {
				color: #666;
				font-family: Poppins;
				font-size: 28px;
				font-style: normal;
				font-weight: 400;
				line-height: 36px;
				/* 128.571% */
			}
		}

		.m {
			height: 36px;
			display: flex;
			align-items: center;
			color: #666;
			font-family: Poppins;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 36px;

			/* 150% */
			img {
				height: 24px;
				margin-right: 24px;
			}
		}
	}

	&>.line {
		margin: 64px 0;
		height: 1px;
		background: #e0e0e0;
	}

	&>.bottom {
		display: flex;
		flex-direction: column;
		gap: 64px;

		&>div {
			display: flex;
			flex-direction: column;
			gap: 24px;
			color: #666;
			font-family: Poppins;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 36px;
		}
	}
}

@media screen and (max-width: 500px) {
	.googlePlay {

		&-head,
		.footer {
			max-width: none;
		}
	}
}

/* 居中容器 */
.loading-container {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background: rgba(255, 255, 255, 0.8);
	/* 半透明背景 */
}

/* 旋转 Loading */
.loading-spinner {
	width: 50px;
	height: 50px;
	border: 5px solid rgba(0, 0, 0, 0.1);
	border-top-color: #3498db;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

/* 旋转动画 */
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.mark {
	width: 100vw;
	height: 100vh;
	position: fixed;
	background: rgba(0, 0, 0, 0.8);
	z-index: 1000;
	left: 0;
	top: 0;

	&-content {
		width: 614px;
		height: fit-content;
		background: #fff;
		color: #000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 40px 30px;
		border-radius: 32px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;

		.l1 {
			display: flex;
			font-size: 56px;
			font-weight: 500;
			font-weight: bold;
			padding-inline-start: 70px;
			background-image: url("@/assets/icons/google/img/image3.png");
			background-size: 55px 60px;
			background-repeat: no-repeat;
			background-position: left;
		}

		.l2 {
			height: 48px;
			border-radius: 4px;
			border: 2px solid #666;
			font-size: 32px;
			color: #666;
			line-height: 48px;
			margin: auto;
			margin-top: 32px;
			margin-bottom: 39px;
			padding: 0 35px;
			width: fit-content;
		}

		.l3 {
			border-radius: 26px;
			border: 2px solid #028760;
			height: 50px;
			font-size: 32px;
			color: #028760;
			background: #ebf4f0;
			font-weight: 600;
			padding: 0 37px 0 80px;
			width: fit-content;
			margin: auto;
			line-height: 50px;
			background-image: url("@/assets/icons/google/img/image4.png");
			background-size: 32px 38px;
			background-repeat: no-repeat;
			background-position: 37px center;
		}

		.l4 {
			border-radius: 16px;
			background: rgb(2, 135, 96);
			font-size: 32px;
			font-style: normal;
			font-weight: 600;
			color: #fff;
			height: 86px;
			line-height: 86px;
			margin-top: 40px;
			width: 422px;
		}
		.progress {
			width: 422px;
			height: 86px;
			border-radius: 50px;
			background: rgba(2, 135, 96, 0.3);
			border: 2xp solid #028760;
			margin-top: 40px;
			position: relative;
			overflow: hidden;
			&-bar {
				height: 100%;
				position: absolute;
				z-index: 1;
				background: #028760;
			}
			&-text {
				color: #FFF;
				position: relative;
				z-index: 10;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
</style>
