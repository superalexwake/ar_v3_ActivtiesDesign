<template>
	<div class="wallet_header" >
    <div class="no_active" v-if="!isActive">
      {{$t('arNoActive2')}}
    </div>
		<div class="ar_logo">
			<div class="logo">
				<img src="@public/common/ar_wallet.png" alt="" />
				AR{{$t('wallet')}}
			</div>

			<div class="go_wallet" @click="emit('goWallet')">{{$t('comminWallet')}}</div>
		</div>

		<div class="ar_amount_txt">{{$t('walletBalance')}}</div>
		<div class="ar_amount">{{ isActive? arWallet?.balance : 0 }} <span>ARB</span></div>
    <div class="divider"></div>
		<!-- <div class="ar_address">
			<div class="ad_title">
				<div>{{$t('walletAddress')}}:</div>
				<div>{{ isActive? arWallet?.walletAddress : '' }} </div>
			</div>

			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none" @click="copy(arWallet?.walletAddress)">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M3.5 1.125C3.5 0.572716 3.94772 0.125 4.5 0.125H13C13.5523 0.125 14 0.572715 14 1.125V11.375C14 11.9273 13.5523 12.375 13 12.375H11.375V4.25C11.375 3.42157 10.7034 2.75 9.875 2.75H3.5V1.125ZM1 3.625C0.447715 3.625 0 4.07272 0 4.625V14.875C0 15.4273 0.447715 15.875 1 15.875H9.5C10.0523 15.875 10.5 15.4273 10.5 14.875V4.625C10.5 4.07272 10.0523 3.625 9.5 3.625H1Z"
					fill="#B6BAC5"
				/>
			</svg>
		</div> -->
	</div>
</template>

<script setup lang="ts">

defineProps({
	isActive: {
		type: Boolean,
    default: false,
	},
	arWallet: {
		type: Object,
    default: () => {},
	}
})

const emit = defineEmits(['goWallet']);

</script>

<style scoped lang="scss">
/* Add some style here */
.wallet_header {
	width: 100%;
	padding: 24px;
	border-radius: 16px;
	background: var(--bgcolor-53);
	color: var(--colorText-66);
  	position: relative;
  	margin-bottom: 48px;

	box-shadow: var(--boxShadowColor-52);
  .divider {
			border-top: 1px solid var(--borderColor-22);
			margin-block: 24px;
		}
	.ar_logo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		.logo {
			display: flex;
			align-items: center;
			img {
				width: 72px;
				height: 72px;
        margin-right: 16px;
			}
			font-size: 40px;
			color: var(--textW);
			font-weight: 600;
		}
		.go_wallet {
			width: 160px;
			height: 60px;
			border-radius: 8px;
			border: 1px solid var(--borderColor-23);
			color: var(--borderColor-23);
			text-align: center;
			line-height: 60px;
		}
	}
  .ar_amount_txt {
    font-size: 24px;
  }
	.ar_amount {
		color: var(--borderColor-23);
		font-family: Roboto;
		font-size: 44px;
		font-style: normal;
		font-weight: 900;
		line-height: normal;
		span {
			font-size: 32px;
		}
	}
	.ar_address {
		display: flex;
		justify-content: space-between;
		align-items: center;
    .ad_title {
      div:nth-child(1) {
        margin-bottom: 4px;
      }
    }
	}
}
.no_active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bgColor-53);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: var(--textW);
}
</style>
