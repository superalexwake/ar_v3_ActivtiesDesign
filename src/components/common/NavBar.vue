<template>
	<div class="navbar" ref="navbar">
		<div class="navbar-fixed">
			<div class="navbar__content">
				<div class="navbar__content-left" @click="onClickLeft">
					<slot name="left">
						<van-icon v-if="leftArrow" name="arrow-left" />
					</slot>
				</div>
				<div class="navbar__content-center">
					<div
						v-if="headLogo"
						class="headLogo"
						:style="{ backgroundImage: 'url(' + (headerUrl || headDfaultUrl) + ')' }"
					></div>
					<slot name="center">
						<div class="navbar__content-title">{{ title }}</div>
					</slot>
				</div>

				<div class="navbar__content-right" @click="onClickRight">
					<slot name="right"> </slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SettingStore } from '@/stores'
import { computed } from 'vue'
const navbar = ref<HTMLElement>()
const settingS = SettingStore()
const headDfaultUrl = computed(() => settingS.getHeadLogo)
defineProps({
	title: {
		type: String,
		default: ''
	},
	placeholder: {
		type: Boolean,
		default: true
	},
	leftArrow: {
		type: Boolean,
		default: false
	},
	backgroundColor: {
		type: String,
		default: '#f7f8ff'
	},
	classN: {
		type: String,
		default: ''
	},
	headLogo: {
		type: Boolean,
		default: false
	},
	headerUrl: {
		type: String,
		default: ''
	}
})

const emits = defineEmits<{
	(e: 'click-left'): void
	(e: 'click-right'): void
}>()
const onClickLeft = () => {
	emits('click-left')
}

const onClickRight = () => {
	emits('click-right')
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.navbar {
	height: 92px;
	z-index: 100;
	flex: none;
	&.activity {
		.navbar-fixed {
			background: var(--main_gradient-color);
			.navbar__content-left {
				.van-icon {
					color: var(--text_color_L1);
				}
			}
		}
	}
	&.lottery {
		.navbar-fixed {
			background: var(--bg_color_L2);
			.navbar__content-left {
				.van-icon {
					color: var(--text_color_L1);
				}
			}
			.navbar__content-center {
				color: var(--text_color_L1);
			}
		}
	}
	&.main {
		.navbar-fixed {
			background: var(--light-main_gradient-color,var(--bg_color_L2));
			.navbar__content-left {
				.van-icon {
					color: #fff;
				}
			}
			.navbar__content-center {
				color: #fff;
				
			}
		}
	}
	&-fixed {
		position: fixed;
		top: 0;
		left: 50%;
		width: 750px;
		transform: translateX(-50%);
		user-select: none;
		z-index: 101;
		background: var(--bg_color_L2);
		color: var(--text_color_L1);
	}

	&__content {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 92px;
		color: var(--text_color_L1);
		

		&-left {
			position: absolute;
			left: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			top: 0;
			
			
			
			.van-icon {
				color: var(--text_color_L1);
				font-size: 36px;
				
				
			}
		}

		&-center {
			font-size: 36px;
			line-height: 36px;
		
			.headLogo {
				width: 224px;
				height: 84px;
				background-repeat: no-repeat;
				background-size: contain;
				background-position: center;
			}
		}

		&-right {
			position: absolute;
			right: 24px;
			
		}
	}
}

@media screen and (max-width: 500px) {
	.navbar {
		&-fixed {
			width: 100%;
			left: 0;
			transform: translateX(0);
		}
	}
}
</style>
