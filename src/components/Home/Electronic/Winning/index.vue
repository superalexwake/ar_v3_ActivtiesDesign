<template>
	<div class="winning">
		<div class="title"> {{ $t('winningDetal') }}</div>
		<div class="wrapper">
			<div ref="wrapperRef">
				<div v-for="item in getWinInfo.slice(0, 6)" class="win_item" :key="item" @click="onWinInfoClick(item)">
					<div class="avatar">
						<div class="avatar_outbg"></div>
						<img v-lazy="getAvatarUrl(item.userPhoto) || defaultAvatar" :data-img="defaultAvatar" />
						<div class="level">V1</div>
					</div>
					<div class="info">
						<div class="name">{{ desensitizeString(item?.nickName) }}</div>
						<!-- <div class="time">18:24</div> -->
					</div>
					<img v-lazy="item.imgUrl" class="winning_icon" alt="" />
					<div class="winning">
						<div>{{ currency(item['amount'] || 0) }}</div>
						<div>{{ $t('winningAmount') }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { currency } from '@/utils'
import { useAssets } from '@/hooks/useAssets'
import autoAnimate from '@formkit/auto-animate'
import { onMounted, onUnmounted, ref } from 'vue'
import { WinInfoType, useHome } from '@/hooks'

const { defaultAvatar, getAvatarUrl } = useAssets()
const {homeState, getWinInfoDetail, getWinInfo, onWinInfoClick} = useHome()
const wrapperRef = ref<HTMLElement>(null as unknown as HTMLElement)
const timer = ref(null as unknown as NodeJS.Timeout)

const desensitizeString = (str: string) => {
	if (str.length  >= 7) {
    return str.substring(0, 3) + '***' + str.substring(str.length - 3, str.length);
  } else {
    const stars = '***';
    const paddingLength = 7 - str.length;
    const padding = '*'.repeat(paddingLength);
    return str.substring(0, Math.ceil((7 - paddingLength) / 2)) + stars + padding + str.substring(Math.ceil((7 - paddingLength) / 2));
  }
}

onMounted(async () => {
	await getWinInfoDetail()
	autoAnimate(wrapperRef.value as any)
	if (homeState.winInfoList.length > 5) {
		timer.value = setInterval(async () => {
			homeState.winInfoList.unshift(homeState.winInfoList.pop() as WinInfoType)
		}, 3000)
	}
})

onUnmounted(() => {
	clearInterval(timer.value)
})
</script>
<style lang="scss" scoped>
.winning {
	margin-bottom: 30px;

	.title {
		background: url('@/assets/icons/home/win.png') no-repeat left center;
		background-size: 42px 42px;
		padding-left: 56px;
		color: var(--text_color_L1);
		font-size: 30px;
		margin-bottom: 26px;
	}

	.wrapper {
		height: 770px;
		overflow: hidden;
	}

	.win_item {
		background: url('@icon/home/winning_bg.png') no-repeat left top;
		background-size: cover;
		width: 690px;
		height: 138px;
		position: relative;
		margin-bottom: 20px;

		.avatar {
			width: 82px;
			height: 82px;
			position: absolute;
			top: 8px;
			left: 8px;
			html:lang(ar) &{
				left: unset;
				right: 8px;
			}

			.avatar_outbg {
				width: 82px;
				height: 82px;
				background-image: url('@icon/main/kBg.png');
				background-size: 100% 100%;
				position: absolute;
				z-index: 2;
				top: 0;
				left: 0;
				html:lang(ar) &{
					left: unset;
					right: 0;
				}
			}

			img {
				width: 72px;
				height: 72px;
				position: absolute;
				top: 4px;
				left: 4px;
				border-radius: 30px 30px 30px 30px;
				html:lang(ar) &{
					left: unset;
					right: 4px;
				}
			}

			.level {
				position: absolute;
				top: 43px;
				left: 54px;
				width: 36px;
				height: 36px;
				background: var(--main_gradient-color);
				box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
				text-align: center;
				line-height: 36px;
				color: #fff;
				font-size: 22px;
				border-radius: 50%;
				html:lang(ar) &{
					left: unset;
					right: 54px;
				}
			}
		}

		.info {
			position: absolute;
			top: 32px;
			left: 136px;

			.name {
				color: #ffffff;
				font-size: 24px;
				line-height: 32px;
				width: 150px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.time {
				color: #84888d;
			}
		}

		.winning_icon {
			width: 120px;
			height: 108px;
			position: absolute;
			top: 14px;
			left: 310px;
			html:lang(ar) &{
				left: unset;
				right: 310px;
			}
		}

		.winning {
			position: absolute;
			top: 36px;
			right: 18px;
			html:lang(ar) &{
				left: 18px;
				right: unset;
			}
			div {
				color: #ffffff;
				font-size: 24px;

				&:first-child {
					font-size: 34px;
					line-height: 42px;
					text-align: right;
				}

				&:last-child {
					text-align: right;
				}
			}
		}
	}
}
</style>
