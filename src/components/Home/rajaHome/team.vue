<template>
	<div class="payMethod">
		<div class="title">{{ $t('supportedMethods') }}</div>
		<div class="pay-cont"></div>
	</div>
	<div class="payMethod">
		<div class="title">{{ $t('followUs') }}</div>
		<ul>
			<li v-for="item in followItems" :key="item.name" :class="item.name">
				<a :href="item.link" target="_blank"></a>
			</li>
		</ul>
	</div>
<!--	<div class="payMethod">-->
<!--		<div class="titleImg"></div>-->
<!--		<p class="titleText">RAJA GAMES is owned and operated by Medium Rare India Pvt. Ltd., registration number: U12345KA2024PTC123456, registered address: 123 MG Road, Bengaluru, Karnataka, India. Contact us at support@rajagames.com. Payment agent company is Medium Rare Limited with address 45 Park Street, Level 3, Kolkata, West Bengal, India, and Registration number: HE 410775.</p>-->
<!--	</div>-->
</template>
<script setup lang="ts">
import { computed } from 'vue'

const followItems: any = computed(() => {
	return [
		{
			name: 'insta',
			link: 'https://www.instagram.com/rajagames.world/'
		},
		{
			name: 'facebook',
			link: 'https://www.facebook.com/rajagames.in'
		},
		{
			name: 'x',
			link: 'https://x.com/rajagames_'
		},
		{
			name: 'youtob',
			link: 'https://www.youtube.com/@rajagames_india'
		},
		{
			name: 'tg',
			link: 'https://t.me/RajaGamesChannel'
		},
		{
			name: 'whatApp',
			link: 'https://whatsapp.com/channel/0029VaRngf0EFeXoRwLmiI3S'
		}
	]
})
</script>

<style scoped lang="scss">
.payMethod{
	margin:8px 0 32px;
	.title{
		color: #FFF;
		text-align: center;
		font-size: 37px;
		font-style: normal;
		font-weight: 700;
		line-height: 46px;
		width:70%;
		margin: 0 auto;
	}
	.pay-cont{
		background: url('./svg/supportBg.svg') no-repeat center center;
		background-size:auto 437px;
		height:437px;
		margin: 0 auto;
	}
	> ul{
		display:flex;
		width:100%;
		height:65px;
		margin-top: 32px;
		li{
			flex:1;
			a{
				display: block;
				height: 100%;
			}
		}
		.insta{
			background:url('./svg/insta.svg') no-repeat center center;
			background-size:65px auto;
		}
		.facebook{
			background:url('./svg/facebook.svg') no-repeat center center;
			background-size:60px auto;

		}
		.x{
			background:url('./svg/x.svg') no-repeat center center;
			background-size:60px auto;
		}
		.youtob{
			background:url('./svg/ytb.svg') no-repeat center center;
			background-size:60px auto;
		}
		.tg{
			background:url('./svg/tg.svg') no-repeat center center;
			background-size:60px auto;
		}
		.whatApp{
			background:url('./svg/whats.svg') no-repeat center center;
			background-size:60px auto;
		}
	}
	.titleImg{
		background: url('./svg/ragaLogo.svg') no-repeat center center;
		background-size:cover;
		margin: 0 auto;
		width: 108px;
		height: 85px;
	}
	.titleText{
		color: #FFF;
		text-align: center;
		font-size: 18px;
		font-style: normal;
		font-weight: 400;
		line-height: 1.4;
	}
}
</style>
