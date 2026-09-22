<template>
    <van-floating-bubble v-model:offset="offset" v-if="isOpenInvitedWheel" axis="xy" class="invite_turntable_box">
	    <img class="invite_turntable" src="@/assets/icons/home/turntable_icon.png"  @click="goInvaiteWheel" alt="invite Wheel" />
    </van-floating-bubble>
</template>

<script setup lang="ts">
import { useHome } from '@/hooks/useHome.hook';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const {isOpenInvitedWheel} = useHome()
const offset = ref({x: 30, y: 580}) // 设置浮动按钮的位置

const goInvaiteWheel = () => {
  // 跳转到邀请转盘页面
  router.push({
    path: 'turntable'
  })
}

</script>

<style lang="scss" scoped>

.invite_turntable {
	width: 140px;
	height: 140px;
	// background-repeat: no-repeat;
	// background-position: center;
	// background-size: 112px;
	// background-image: url('@icon/blueHome/changlong.svg');
	border-radius: 50%;

}
</style>
