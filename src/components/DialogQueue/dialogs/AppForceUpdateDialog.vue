<template>
	<div class="app-force-update-dialog" :class="{ 'app-force-update-dialog--forced': forced }">
		<div class="app-force-update-dialog__decor-back-wrap">
			<div class="app-force-update-dialog__decor-back"></div>
		</div>
		<svg class="app-force-update-dialog__decor" viewBox="0 0 660 700" aria-hidden="true" focusable="false">
			<path
				class="app-force-update-dialog__panel-shape"
				d="M75 41H398C432 41 451 58 469 94C483 121 503 129 535 129H585C613 129 635 151 635 179V610C635 638 612 661 584 661H76C48 661 25 638 25 610V91C25 63 48 41 75 41Z"
			/>
		</svg>

		<div class="app-force-update-dialog__rocket-wrap">
			<img class="app-force-update-dialog__rocket" src="@public/common/appForceUpdateRocket.png" alt="" />
		</div>

		<h2 class="app-force-update-dialog__title">{{ $t('appUpdateTitle') }}</h2>
		<svg
			class="app-force-update-dialog__title-mark"
			viewBox="0 0 150.474 30.6324"
			fill="none"
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M73.5 0C46.3 0 13.1667 7.33333 0 11C0.333333 13.1667 1.3 18.5 2.5 22.5C41.3 13.7 59 12.5 63 13C60.6667 13.8333 54.8 16.1 50 18.5C44 21.5 44.5 34.5 57.5 29.5C81.5 20.5 135.5 16 143.5 15.5C151.5 15 153 6.5 146 5C125 2 92 8.5 87 9.5C87.5 8 86.5 0 73.5 0Z"
				fill="url(#app-force-update-title-mark-gradient)"
			/>
			<defs>
				<linearGradient
					id="app-force-update-title-mark-gradient"
					x1="0"
					y1="15.3162"
					x2="150.474"
					y2="15.3162"
					gradientUnits="userSpaceOnUse"
				>
					<stop class="app-force-update-dialog__title-mark-stop" />
					<stop class="app-force-update-dialog__title-mark-stop" offset="1" stop-opacity="0" />
				</linearGradient>
			</defs>
		</svg>

		<ul class="app-force-update-dialog__list">
			<li>{{ $t('appUpdateFeature1') }}</li>
			<li>{{ $t('appUpdateFeature2') }}</li>
			<li>{{ $t('appUpdateFeature3') }}</li>
		</ul>

		<button v-if="!forced" type="button" class="app-force-update-dialog__cancel" @click="cancel">
			{{ $t('appUpdateLater') }}
		</button>

		<button type="button" class="app-force-update-dialog__confirm" @click="download">
			{{ $t('appUpdateConfirm') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { isHybridApp, openHybrid } from '@/utils/jsBridge'

interface Props {
	/** APK 下载地址（原始，无 query） */
	url: string
	/** 最新版本号，下载时会自动拼成 `<url>?version=<v>` 让 catchall.js 走版本化文件查找 */
	version?: string
	/** 强制更新模式：producer 端用 policy 把 closeOnClickOverlay/ESC 禁掉 */
	forced?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	version: '',
	forced: false,
})

const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'dismiss-today'): void
}>()

/**
 * 给下载地址安全拼接 `?version=<v>`。URL API 自动处理 ?/& 边界；解析失败时降级字符串拼接。
 */
function buildDownloadUrl(url: string, version: string): string {
	if (!version) return url
	try {
		const u = new URL(url)
		u.searchParams.set('version', version)
		return u.toString()
	} catch {
		const sep = url.includes('?') ? '&' : '?'
		return `${url}${sep}version=${encodeURIComponent(version)}`
	}
}

function download() {
	const finalUrl = buildDownloadUrl(props.url, props.version)
	if (isHybridApp()) {
		openHybrid('downloadAPK', { url: finalUrl })
	} else {
		window.location.href = finalUrl
	}
	if (!props.forced) emit('confirm')
}

function cancel() {
	emit('dismiss-today')
}
</script>

<style scoped lang="scss">
.app-force-update-dialog {
	position: relative;
	isolation: isolate;
	box-sizing: border-box;
	width: 660px;
	height: 700px;
	overflow: hidden;
	color: var(--text_color_L1);
	font-family: Poppins, Inter, sans-serif;
	text-align: left;

	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	&__decor {
		position: absolute;
		inset: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	&__decor-back-wrap {
		position: absolute;
		z-index: 0;
		left: -4px;
		top: -5px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 668.635px;
		height: 709.574px;
		pointer-events: none;
	}

	&__decor-back {
		flex: none;
		width: 604px;
		height: 650px;
		border-radius: 50px;
		background: var(--main_gradient-color2, var(--main_gradient-color));
		transform: rotate(6deg);
		transform-origin: center;
	}

	&__panel-shape {
		fill: var(--darkBg, var(--bg_color_L2));
	}

	&__rocket-wrap {
		position: absolute;
		left: 464.646px;
		top: -2.674px;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 211.969px;
		height: 201.05px;
		pointer-events: none;
	}

	&__rocket {
		flex: none;
		width: 188px;
		height: 175px;
		display: block;
		transform: rotate(-8.5deg);
		transform-origin: center;
	}

	&__title {
		position: absolute;
		left: 65px;
		top: 121px;
		z-index: 2;
		margin: 0;
		color: var(--text_color_L1);
		font-size: 36px;
		font-weight: 600;
		line-height: normal;
		white-space: nowrap;
		word-break: break-word;
	}

	&__title-mark {
		position: absolute;
		left: 308px;
		top: 159px;
		z-index: 2;
		width: 150.474px;
		height: 30.632px;
		overflow: visible;
		display: block;
	}

	&__title-mark-stop {
		stop-color: var(--main-color);
	}

	&__list {
		position: absolute;
		left: 65px;
		top: 215px;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 530px;
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			position: relative;
			width: 530px;
			margin: 0;
			padding: 0 0 0 18px;
			color: var(--text_color_L1);
			font-size: 28px;
			font-weight: 400;
			line-height: normal;
			word-break: break-word;

			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 15px;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background: var(--main-color);
			}
		}
	}

	&__cancel,
	&__confirm {
		position: absolute;
		top: 513px;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 259px;
		height: 84px;
		padding: 18px 0;
		appearance: none;
		border: 0;
		border-radius: 60px;
		font-family: inherit;
		font-size: 32px;
		font-weight: 600;
		line-height: normal;
		white-space: nowrap;
	}

	&__cancel {
		left: 55px;
		background: #e4e4e4;
		color: #959595;
	}

	&__confirm {
		left: 346px;
		background: var(--main_gradient-color2, var(--main_gradient-color));
		color: #fff;
	}

	&--forced {
		.app-force-update-dialog__confirm {
			left: 135px;
			width: 400px;
			padding: 18px 89px;
		}
	}
}
</style>
