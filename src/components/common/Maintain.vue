<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
	item:{
		type: Object,
		default: () => ({})
	},
	size:{
		type: Boolean,
		default: false
	}
});
const maintain = computed(() => {
	if (props.item.isMaintain===1) return 1
	if (props.item.isGameSaasMaintain ===1)  return 2
	return 0
})
</script>

<template>
   <div class="maintain" v-if="maintain">
	   <img v-if="maintain===2" src="@/assets/icons/main/saasMaintain.png" alt="">
	   <img v-if="maintain===1" src="@/assets/icons/main/maintain.png" alt="">
	   <p :class="{maintainSize:size}">{{$t('GameMaintenance')}}</p>
   </div>
</template>

<style scoped lang="scss">
.maintain{
	position: absolute;
	top:0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height:100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	border-radius: 12px;
	z-index: 1;
	pointer-events: none;
	&:after{
		content: '';
		position: absolute;
		width: 100%;
		height:100%;
		opacity: 0.6;
		background: #000;
		border-radius: 12px;
	}
	img{
		position: relative;
		z-index: 1;
		width: 56px;
		height: 56px;
	}

	p{
		position: relative;
		z-index: 1;
		color: #FCD01C;
		text-align: center;
		font-family: Poppins;
		font-size: 28px;
		font-style: normal;
		font-weight: 500;
		line-height: 116.715%;
		&.maintainSize{
			font-size: 20px;
		}
	}
}
</style>
