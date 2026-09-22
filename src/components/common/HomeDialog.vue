<template>
	<div class="dialog" :class="{ active: show, inactive: !show }">
		<div class="dialog__container" role="dialog" tabindex="0">
			<div class="dialog__container-img">
				<slot name="header">
					<img v-lazy="picname" alt="" />
				</slot>
			</div>

			<div class="dialog__container-title">
				<slot name="title">
					<h1>{{ t(title) }}</h1>
				</slot>
			</div>

			<div class="dialog__container-content">
				<slot name="content"></slot>
			</div>

			<div class="dialog__container-footer">
				<slot name="footer">
					<button
						v-if="showCancelBtn"
						@click="
							() => {
								emits('update:show', false)
							}
						"
					>
						{{ $t(cancelText) }}
					</button>

					<button
						@click="
							() => {
								emits('confirm')
							}
						"
					>
						{{ $t(confirmText) }}
					</button>
				</slot>
			</div>
		</div>
		<div class="dialog__outside" @click="closeOnClickOutSide"></div>
	</div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import superjackpotHomeIcon from '@icon/public/superjackpotHome.png'

const { t } = useI18n()

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: ''
	},
	confirmText: {
		type: String,
		default: 'comfirm'
	},
	showCancelBtn: {
		type: Boolean,
		default: true
	},
	cancelText: {
		type: String,
		default: 'cancel'
	},
	clickOutSide: {
		type: Boolean,
		default: false
	},
	picname: {
		type: String,
		default: () => superjackpotHomeIcon
	}
})
watch(
	() => props.show,
	(val) => {
		if (val) window.addEventListener('touchmove', preventScroll, { passive: false })
		else window.removeEventListener('touchmove', preventScroll)
	}
)

const emits = defineEmits<{
	(e: 'update:show', val: boolean): void
	(e: 'confirm'): void
}>()

function closeOnClickOutSide(e: Event) {
	// prevent from scrolling
	if (props.clickOutSide) {
		emits('update:show', false)
	}
}

const preventScroll = (e: Event) => {
	if (props.show) e.preventDefault()
}
</script>

<style lang="scss" scoped>
.dialog {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bgcolor-32);
	transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
	z-index: 2004;

	&.active {
		opacity: 1;
		visibility: visible;

		.dialog__container {
			transform: scale(1);
			opacity: 1;
		}
	}

	&.inactive {
		opacity: 0;
		visibility: hidden;

		.dialog__container {
			transform: scale(0.3);
			opacity: 0;
		}
	}

	&__container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 600px;
		min-height: 500px;
		border-radius: 20px;
		background: var(--bg_color_L2);
		transition: opacity 0.3s, transform 0.3s ease-in-out;
		z-index: 2003;

		padding: 40px 20px;
		border-radius: 20px;

		&-img {
			width: 280px;
			height: 180px;
			margin-top: -80px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		&-title {
			margin-top: 26px;
			font-size: 36px;
			font-weight: bold;
			color: var(--text_color_L1);
		}

		&-content {
			margin-top: 18px;
			color: var(--text_color_L2);
			font-size: 24px;
			font-weight: 400;
		}

		&-footer {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 21px;
			width: 100%;
			height: 80px;
			margin-top: 150px;
			padding: 0 20px;

			button {
				width: 234px;
				height: 80px;
				color: var(--main-color);
				font-size: 32px;
				text-align: center;
				border-radius: 9rem;
				border: 1px solid var(--main-color);
				background: transparent;

				&:last-of-type {
					width: 326px;
					color: var(--text_color_L4);
					background: var(--main_gradient-color);
				}
			}
		}
	}

	&__outside {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		cursor: default;
		z-index: 2002;
		background: rgba(0,0,0,.6);
	}
}
</style>
