<script setup lang="ts">
import {useHome} from "@/hooks";
import router from "@/router";
import {isHybridApp} from "@/utils/jsBridge";
import {useAssets} from "@/hooks/useAssets";
import {useLang} from "@/hooks/useLanguage.hook";
import LangList from "@/components/Main/LanguageList/index.vue";

const { projectIcon,onDown } = useHome()
const { locale, show } = useLang()
const { getLangFlag } = useAssets()
function onClickRightH() {
	router.push({
		name: 'Messages'
	})
}

</script>

<template>
	<div class="ok_header">
		<van-image :src="projectIcon" class="logo" />

		<div class="right">
			<img class="right_btn" @click="onClickRightH" src="@/assets/icons/home/okwinHome/message.png" alt="" />

			<img class="right_btn"
				src="@/assets/icons/home/okwinHome/download.png"
						v-if="!isHybridApp()" @click.stop="onDown"  alt=""/>

			<img class="right_btn" v-lazy="getLangFlag(locale)" @click="show = true" />
		</div>
		<van-popup v-model:show="show" class="popup" position="bottom" teleport="body">
			<LangList :type="2" />
		</van-popup>
	</div>
</template>

<style scoped lang="scss">
.ok_header {
	display: flex;
	justify-content: space-between;
	height: 80px;
	align-items: center;
	z-index: 99;
	margin-bottom: 27px;
	.logo {
    width: 218px;
    max-height: 80px;
	}
	.right {
		display: flex;
		align-items: center;
		.right_btn {
			position: relative;
			z-index: 2;
			margin-left: 24px;
		}
		.right_btn:first-child {
			width: 44px;
			height: 40px;
		}
		.right_btn:nth-child(2) {
			width: 44px;
			height: 44px;
		}

		.right_btn:nth-child(3) {
			width: 40px;
			height: 40px;
		}
	}
}
</style>