<script setup lang="ts">
import { ref } from 'vue'
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
const router=useRouter()
const {t}=useI18n()
const introduceList = ref([
	{
		title:t('introduceTitle'),
		content: t('introduceContent')
	},
	{
		title:t('introduceTitle2'),
		content: t('introduceContent2')
	},
	{
		title:t('introduceTitle3'),
		content: t('introduceContent3')
	}
])
</script>

<template>
	<div class="turntable-rules">
		<NavBar :title="$t('firstSaveRule')" :placeholder="false" left-arrow @click-left="router.go(-1)" />
	<div class="turntable-introduce">
		<div class="promotion-box" v-for="(item, index) in introduceList" :key="index">
			<div class="promotion-box__splitBorder">
				<span><svg-icon name = "activityRulesBackground" /><span>0{{ index + 1 }}</span></span>
			</div>
			<div class="promotion-txt">
				<h3>{{ item.title }}</h3>
				<p>{{ item.content }}</p>
			</div>
		</div>
	</div>
	</div>
</template>

<style scoped lang="scss">
.turntable-introduce {
	padding: 30px  20px;
	.promotion-box {
		position: relative;
		padding: 43px 18px 25px;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: var(--darkBg,var(--bg_color_L2));
		margin-bottom: 50px;

       span{
		   position: absolute;
		   top:0;
		   left: 30%;
		   display: flex;
			align-items: center;
			justify-content: center;
			color: var(--text_white, var(--text_color_L1));
			span{
				position: absolute;
				font-size: 26px;
				font-weight: 600;
				line-height: 56px;
				margin-left: 45px; 
			}
		   svg{
			width: 294px;
			height: 60.067px;		
		   }
	   }

		.promotion-txt {
			color: var(--text_color_L1);
			font-size: 24px;
			letter-spacing: 1px;
			line-height: 38px;
			h3{
				margin-top: 24px;
				color: var(--darkTextW,--text_color_L1);
				margin-bottom: 16px;
			}
			p{
				color: var(--text_color_L2);
			}
		}

		&:nth-of-type(6) {
			margin-bottom: 0;
			border-bottom: none;
		}
	}
}
</style>
