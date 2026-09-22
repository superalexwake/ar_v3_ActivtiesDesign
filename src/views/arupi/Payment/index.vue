<template>
    <div class="x-payment x-row x-column x-row-middle">
		<NavBar title="ARPAY"  :placeholder="false" left-arrow @click-left="onClick" />
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M36 6.96774C19.9659 6.96774 6.96774 19.9659 6.96774 36C6.96774 52.0341 19.9659 65.0323 36 65.0323C52.0341 65.0323 65.0323 52.0341 65.0323 36C65.0323 19.9659 52.0341 6.96774 36 6.96774ZM0 36C0 16.1177 16.1177 0 36 0C55.8822 0 72 16.1177 72 36C72 55.8822 55.8822 72 36 72C16.1177 72 0 55.8822 0 36Z" fill="#2CC660"/>
            <path d="M54.7514 25.142L32.124 47.7694L19.3726 35.018" stroke="#2CC660" stroke-width="7"/>
        </svg>
        <h3 class="mt16">{{$t('paymentSuccessful')}}</h3>
        <p class="mt6 x-tc"> {{$t('paymentCompleted')}}</p>
        <van-button round block type="primary" class="x-btn btn mt40" @click="onClick"> {{$t('rechargeDetailDesc7')}} </van-button>
    </div>
</template>
<script lang="ts" setup>
import {useRouter} from "vue-router";
const router = useRouter();
function onClick() {
	router.push({
		name:'Recharge'
	})
}
</script>
<style lang="scss" scoped>
    .x-payment{
        padding:198px 20px 0;
        &>h3{
            font-size: 48px;
            font-weight: 600;
            letter-spacing: -0.64px;
			color: var(--darkTextW, var(--text_color_L1));
        }
        &>p{
			color: var(--text_color_L2);
            font-weight: 400;
        }
        .x-btn{
            width: 460px;
            border-radius: 42px;
			background: var(--main_gradient-color);
			color: var(--text_color_L4);
        }
    }
</style>