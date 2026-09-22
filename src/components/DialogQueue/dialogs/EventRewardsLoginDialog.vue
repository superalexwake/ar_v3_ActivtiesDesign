<template>
	<div class="event-rewards-login-dialog" role="document" aria-labelledby="event-rewards-login-title">
		<div class="event-rewards-login-dialog__panel" aria-hidden="true">
			<div class="event-rewards-login-dialog__panel-mask" />
		</div>

		<img class="event-rewards-login-dialog__gift" :src="giftUrl" alt="" />

		<div class="event-rewards-login-dialog__title-wrap">
			<span class="event-rewards-login-dialog__title-decor" aria-hidden="true" />
			<h2 id="event-rewards-login-title" class="event-rewards-login-dialog__title">
				{{ t('eventRewardsLoginTitle') }}
			</h2>
			<span class="event-rewards-login-dialog__title-decor event-rewards-login-dialog__title-decor--right" aria-hidden="true" />
		</div>

		<p class="event-rewards-login-dialog__description">
			<span>{{ t('eventRewardsLoginDescriptionPrefix') }}</span>
			<span class="event-rewards-login-dialog__highlight">{{ t('eventRewardsLoginDescriptionHighlight') }}</span>
			<span>{{ t('eventRewardsLoginDescriptionSuffix') }}</span>
		</p>

		<button type="button" class="event-rewards-login-dialog__primary" @click="emit('confirm')">
			{{ t('eventRewardsLoginPrimary') }}
		</button>

		<button type="button" class="event-rewards-login-dialog__secondary" @click="emit('close')">
			{{ t('eventRewardsLoginSecondary') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import giftUrl from '@public/common/eventRewardsLogin/gift.png?url'

const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'close'): void
}>()
const { t } = useI18n()
</script>

<style scoped lang="scss">
.event-rewards-login-dialog {
	position: relative;
	width: min(750px, 100vw);
	height: 750px;
	overflow: hidden;
	color: var(--text_color_L1);
	font-family: 'Poppins', $font-family, sans-serif;
	text-align: center;

	&__panel {
		position: absolute;
		left: 0;
		top: 96px;
		width: 750px;
		height: 654px;
		overflow: hidden;
		border-radius: 40px 40px 0 0;
		background: var(--bg_color_L2);
	}

	&__panel-mask {
		position: absolute;
		left: 0;
		top: 0;
		width: 750px;
		height: 160px;
		background: var(--main_gradient-color);
		opacity: 0.35;
		mask-image: linear-gradient(180deg, var(--text_color_L1) 0%, transparent 100%);
		-webkit-mask-image: linear-gradient(180deg, var(--text_color_L1) 0%, transparent 100%);
		pointer-events: none;
	}

	&__gift {
		position: absolute;
		left: 210px;
		top: 0;
		width: 330px;
		height: 284px;
		object-fit: contain;
		pointer-events: none;
	}

	&__title-wrap {
		position: absolute;
		left: 0;
		top: 306px;
		width: 750px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	&__title-decor {
		position: relative;
		width: 38px;
		height: 48px;
		display: block;
		pointer-events: none;

		&::before,
		&::after {
			content: '';
			position: absolute;
			display: block;
			background: var(--main_gradient-color);
			border-radius: 50%;
		}

		&::before {
			left: 2px;
			top: 0;
			width: 17px;
			height: 22px;
			transform: rotate(-38deg);
		}

		&::after {
			left: 0;
			top: 20px;
			width: 27px;
			height: 13px;
			transform: rotate(18deg);
		}

		&--right {
			transform: scaleX(-1);
		}
	}

	&__title-decor::after {
		box-shadow: 12px 17px 0 var(--main-color);
	}

	&__title {
		max-width: 600px;
		margin: 0 0 4px;
		font-size: 40px;
		line-height: 60px;
		font-weight: 600;
		color: var(--text_color_L1);
		white-space: nowrap;
	}

	&__description {
		position: absolute;
		left: 40px;
		top: 408px;
		width: 670px;
		margin: 0;
		font-size: 28px;
		line-height: 42px;
		font-weight: 400;
		color: var(--text_color_L1);
		word-break: break-word;
	}

	&__highlight {
		color: var(--main-color);
	}

	&__primary {
		position: absolute;
		left: 75px;
		top: 552px;
		width: 600px;
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 60px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 32px;
		line-height: 48px;
		font-weight: 600;
		white-space: nowrap;
	}

	&__secondary {
		position: absolute;
		left: 136px;
		top: 668px;
		width: 478px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		padding: 0;
		background: transparent;
		color: var(--text_color_L1);
		font-size: 28px;
		line-height: 42px;
		font-weight: 400;
		white-space: nowrap;
	}
}
</style>
