<template>
	<div class="notice-domain">
		<span></span>
		<div class="notice-domain-body">
			<div class="notice-domain-body-text" v-if="noticeList && noticeList[0] && noticeList[0].siteMessage">
				{{ noticeList[0]?.siteMessage }}
			</div>
		</div>
		<button @click="goNotice">
			<span class="notify"> </span>
			{{ $t('more') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotice } from '@/hooks'

const { getNotice, noticeList, goNotice } = useNotice()
onMounted(() => getNotice())
</script>

<style lang="scss" scoped>
.notice-domain {
    margin-top: 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 80px;
	padding-inline: 20px;
	color: #303a4c;
	font-size: 24px;
	border-radius: 99rem;
	background: #fff;
	line-height: 30px;
	
    
	span {
		background: url('@icon/public/greenNotify.svg') no-repeat center center;
		background-size: 40px;
		width: 48px;
		height: 48px;
	}
	.cms-icon {
		color: #fff;
		width: 40px;
		height: 40px;
	}
	&-body {
		flex: 1;
		overflow: hidden;
		position: relative;
		height: 60px;
		line-height: 72px;
		display: flex;
		align-items: center;
		padding: 0 20px;

		&-text {
			width: 100%;
			height: fit-content;
			max-height: 74px;
			line-height: 37px;
			animation: marquee 7s linear infinite;
			display: flex;
			overflow: hidden;
			text-overflow: ellipsis;
			word-wrap: break-word;
			word-break: break-all;
		}

		@keyframes marquee {
			0% {
				transform: translateY(100%);
				/* 初始位置：向上平移0 */
			}

			10% {
				transform: translateY(0);
				/* 中间停顿5秒，保持位置不变 */
			}

			90% {
				transform: translateY(0);
				/* 中间停顿5秒，保持位置不变 */
			}

			100% {
				transform: translateY(-100%);
				/* 终止位置：向上平移100% */
			}
		}
	}

	& > svg {
		width: 32px;
		flex-shrink: 0;
		height: auto;
		margin-right: 17px;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		gap: 5px;
		width: 150px;
		height: 50px;
		margin-left: auto;
		color: #fff;
		border: none;
		border-radius: 40px;
		background: linear-gradient(180deg, #49C755 0%, #0F9957 98.5%);

		// &::before{
		// 	display: block;
		// 	content: '';
		// 	background: url('@icon/public/hot.svg') no-repeat center center;
		// 	background-size: cover;
		// 	width: 24px;
		// 	height: 24px;
		// }
		.notify {
			background: url('@icon/public/hot.svg') no-repeat center center;
			background-size: cover;
			width: 24px;
			height: 24px;
		}
		.point {
			position: absolute;
			top: 1px;
			right: 0;
		}
	}
}
</style>
