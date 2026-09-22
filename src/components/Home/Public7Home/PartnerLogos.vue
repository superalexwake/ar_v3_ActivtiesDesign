<template>
	<div class="partner-logos">
		<div class="partner-logos__grid">
			<div class="partner-logos__grid-item" v-for="(item, index) in partners" :key="index" @click="onPartnerClick(item)">
				<img v-if="item.logo" :src="item.logo" :alt="item.name" />
				<span v-else>{{ item.name }}</span>
			</div>
		</div>

		<div class="partner-logos__text">
			<p class="partner-logos__text-item" v-for="(text, i) in descriptions" :key="i">
				<span class="dot"></span>
				<span>{{ text }}</span>
			</p>
			<p class="partner-logos__text-warning">
				{{ t('damanWarn') }}<br />
				{{ t('damanWarn2', [settingS.getProjectName]) }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SettingStore } from '@/stores'

import logoPG from '@/assets/public7PurpleBlack/icons/home/partners/PG.svg?url'
import logoJDB from '@/assets/public7PurpleBlack/icons/home/partners/JDB.svg?url'
import logoJILI from '@/assets/public7PurpleBlack/icons/home/partners/JILI.svg?url'
import logoARpay from '@/assets/public7PurpleBlack/icons/home/partners/ARpay.svg?url'
import logoEvo from '@/assets/public7PurpleBlack/icons/home/partners/Evo.svg?url'
import logoCQ9 from '@/assets/public7PurpleBlack/icons/home/partners/CQ9.svg?url'
import logo9G from '@/assets/public7PurpleBlack/icons/home/partners/9G.svg?url'
import logoPP from '@/assets/public7PurpleBlack/icons/home/partners/PP.svg?url'
import logoAG from '@/assets/public7PurpleBlack/icons/home/partners/AG.svg?url'

const router = useRouter()
const { t } = useI18n()
const settingS = SettingStore()

// 合作厂商列表
const partners = [
	{ name: 'PG', logo: logoPG, vendorCode: 'PG', game: 'slot' },
	{ name: 'JDB', logo: logoJDB, vendorCode: 'JDB', game: 'slot' },
	{ name: 'JILI', logo: logoJILI, vendorCode: 'JILI', game: 'slot' },
	{ name: 'TB', logo: logoARpay, vendorCode: 'TB_Chess', game: 'flash' },
	{ name: 'AG', logo: logoAG, vendorCode: 'AG', game: 'slot' },
	{ name: 'Evo', logo: logoEvo, vendorCode: 'Evolution', game: 'casino' },
	{ name: 'CQ9', logo: logoCQ9, vendorCode: 'CQ9', game: 'slot' },
	{ name: '9G', logo: logo9G, vendorCode: '9G', game: 'slot' },
	{ name: 'PP', logo: logoPP, vendorCode: 'PP', game: 'slot' }
]

// 点击跳转到老虎机游戏列表
const onPartnerClick = (item: any) => {
	if (item.noLink) return
	router.push({
		name: 'AllGames',
		query: {
			type: item.game
		}
	})
}

// 平台描述文案：与其余版面共用同一套 i18n，品牌名取后台下发的站点名
const descriptions = computed(() => [
	t('damanRule', [settingS.getProjectName]),
	t('damanRule2', [settingS.getProjectName]),
	t('damanRule3', [settingS.getProjectName])
])
</script>

<style lang="scss" scoped>
.partner-logos {
	background: #272036;
	border-radius: 15px;
	padding: 32px;

	&__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;

		&-item {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 84px;
			border-radius: 12px;
			box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 2px 0 0 #2e384a inset;
			z-index: 0;

			// 渐变边框（伪元素实现）
			&::before {
				content: '';
				position: absolute;
				inset: 0;
				border-radius: 12px;
				padding: 2px;
				background: linear-gradient(
					135deg,
					#a1edff,
					#3131b9,
					#fcf5ff,
					#363bb5,
					#3d49be,
					#4a64b4,
					#efe0ff,
					#6363da,
					#ffb184
				);
				-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
				-webkit-mask-composite: xor;
				mask-composite: exclude;
				z-index: -1;
			}

			// 内部背景
			&::after {
				content: '';
				position: absolute;
				inset: 2px;
				border-radius: 10px;
				background: linear-gradient(268deg, #221d2d 0.62%, #373143 98.29%);
				z-index: -1;
			}

			img {
				max-width: 140px;
				max-height: 56px;
				object-fit: contain;
			}

			span {
				font-size: 28px;
				font-weight: 500;
				color: rgba(255, 255, 255, 0.4);
			}
		}
	}

	&__text {
		margin-top: 32px;
		display: flex;
		flex-direction: column;
		gap: 24px;

		&-item {
			position: relative;
			display: flex;
			gap: 16px;
			font-size: 22px;
			line-height: 38px;
			color: #d7d7d7;

			.dot {
				display: block;
				width: 14px;
				height: 14px;
				min-width: 14px;
				border-radius: 50%;
				background: linear-gradient(135deg, #fb8466 0%, #bd5bd4 27.46%, #7473fa 62.62%, #53b2fa 100%);
				margin-top: 12px;
			}
		}

		&-warning {
			margin-top: 8px;
			font-size: 22px;
			line-height: 34px;
			color: #f8bf61;
		}
	}
}
</style>
