<template>
	<div class="notice-domain">
		<div class="notice-domain-body">
			<div class="notice-domain-body-text" v-if="noticeList && noticeList[0] && noticeList[0].siteMessage">
				{{ noticeList[0]?.siteMessage }}
			</div>
		</div>
		<button @click="goNotice">
			<svg xmlns="http://www.w3.org/2000/svg" width="25" height="17" viewBox="0 0 25 17" fill="none">
			<path d="M24.1173 14.1177C24.1173 15.1962 23.2347 16.0799 22.1552 16.0799H3.26975C2.19025 16.0799 1.30762 15.1962 1.30762 14.1177V2.95041C1.30762 1.87042 2.19025 0.988281 3.26975 0.988281H22.1552C23.2347 0.988281 24.1173 1.87042 24.1173 2.95041V14.1177Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M11.4962 8.69812L2.40161 15.7215" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M23.023 15.7214L13.9249 8.69604" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M23.0231 1.38513L12.7121 9.3477L2.40161 1.38513" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
      <Point/>
	</button>
	</div>
</template>

<script setup lang="ts">
import Point from '@/components/common/Point.vue'
import {onMounted} from 'vue'
import { useNotice } from '@/hooks'
const { getNotice, noticeList, goNotice } = useNotice()
onMounted(() => getNotice())

</script>

<style lang="scss" scoped>
.notice-domain {
	display: flex;

	align-items: center;
	justify-content: space-between;
	width: 100%;
	font-family: Inter;
	height: 67px;
	margin-top: -13px ;
	letter-spacing: -0.11px;
	padding-inline: 20px;
	color: var(--Grey-White, #E4E7ED);
	font-size: 22px;
	line-height: 26px;
	background: var(--Medium-blue-700, #262B48);
	backdrop-filter: blur(4.5px);
	border-bottom-left-radius: 26px;
	border-bottom-right-radius: 26px;
	;
    // .cms-icon{
	// 	width: 40px;
	// 	height: 40px;
	// }
	&-body {
		flex: 1;
		overflow: hidden;
		position: relative;
		height: 60px;
		line-height: 72px;
		display: flex;
		align-items: center;
		padding:0 20px;

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
		padding: 0;
		position: relative;
		border:none;
		background:transparent;
		svg{
			width: 48px;
			height: 48px;
		}
		.point {
			position: absolute;
			top:1px;
			right: 0;
		}
	}
}
</style>
