<!--
 * @Author: Seven
 * @Date: 2023-06-09 17:34:53
 * @LastEditTime: 2024-03-25 18:12:15
 * @LastEditors: Seven
 * @Description: 
-->
<template>
	<div class="instructions" :class="{mtdesc: !desc}">
		<div class="instructions_img">
			<img src="@public/home/u18.png" alt="" class="u18" />
			<img :src="headDfaultUrl" class="logo" />
		</div>
		<div class="desc" v-if="!desc">
			<template v-if="['ar074','ar038'].includes(projectName)">
				<p class="tips">{{ $t('braTips1') }}</p>
				<p class="tips">{{ $t('braTips2',[`${settingS.projectName}`]) }}</p>
				<p class="tips">{{ $t('braTips3',[`${'support@onpyg.com'}`]) }}</p>
			</template>
			<template v-else>
				{{ $t('damanRule', [settingS.getProjectName]) }}<br />
				{{ $t('damanRule2', [settingS.getProjectName]) }}
				{{ $t('damanRule3', [settingS.getProjectName]) }}<br />
				{{ $t('damanWarn') }}
				{{ $t('damanWarn2', [settingS.getProjectName]) }}
			</template>
		</div>
	</div>
	<!-- 巴西站底部logo文字 -->
	<BottomLogoText/>
</template>
<script lang="ts" setup>
import BottomLogoText from '@/components/common/BottomLogoText.vue'
import { SettingStore } from '@/stores';
import { computed } from 'vue';
const settingS = SettingStore()
// 部分站点需要使用内页logo，大部分使用首页logo
const useHeadLogo = ['ar038'];
const projectName = import.meta.env.VITE_BASE_PROJECTNAME;
const headDfaultUrl = computed(()=> useHeadLogo.includes(projectName) ? settingS.getHeadLogo : settingS.getProjectLogo);
const desc = computed(() => {
	return ['poppg', 'pop', 'ar002', 'ar019', 'ar082'].includes(projectName);
})
</script>
<style lang="scss" scoped>
.instructions {

	&.mtdesc{
		margin-bottom:180px;
	}
	.instructions_img {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 24px;
		.u18 {
			width: 44px;
			height: 44px;
			margin-right: 16px;
		}
		.logo {
			width: auto;
			height: 60px;
		}
	}
	.desc {
		color: #848486;
		font-size: 24px;
		.tips{
			margin-bottom:20px;
		}
	}
}
</style>
