<template>
	<div>
		<div class="right" @click="show = true" v-if="languagesShow">
			<img class="img" v-lazy="getLangFlag(locale)" />
			<span class="languageName">{{ getLangName(locale) }}</span>
		</div>

		<van-popup v-model:show="show" class="popup" position="bottom" teleport="body">
			<LangList :type="2" />
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import LangList from '@/components/Main/LanguageList/index.vue'
import { useLang } from '@/hooks/useLanguage.hook'
import { useAssets } from '@/hooks/useAssets'
const { getLangName,  locale, show } = useLang()
const { getLangFlag } = useAssets()
import { SettingStore } from '@/stores'
import { computed } from 'vue'
const settingS = SettingStore()
const languagesShow = computed(() => Boolean(settingS.getLoginChangeLanguage == '1'))
</script>

<style lang="scss" scoped>
.right {
	display: flex;
	align-items: center;
	font-size: 30px;
	color: var(--text_color_L4);
	.img {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		margin-right: 10px;
		overflow: hidden;
	}
}
.popup {
	border-radius: 20px 20px 0 0;
}
</style>
