<template>
	<div v-if="isBraFooter" class="bottomLogoText" :class="wrapClass">
		<ul>
			<li>{{ $t('braTips1') }}</li>
			<li>{{ $t('braTips2', [brandDomain]) }}</li>
			<li>{{ $t('braTips3', ['support@onpyg.com']) }}</li>
		</ul>
	</div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { getProjectName } from '@/utils'

const projectName = getProjectName()
const BRA_DOMAIN_MAP: Record<string, string> = {
	poppg: 'POPPG', // AR040
	pop: 'POPBRA', // AR003
	ar002: 'POP678', //  AR002
	ar019: 'POP555', // AR019
	ar082: 'POPCEU' // AR082
}

const isBraFooter = computed(() => projectName in BRA_DOMAIN_MAP)
const brandDomain = computed(() => BRA_DOMAIN_MAP[projectName] || '')
const wrapClass = computed(() => ({
	popText: projectName === 'pop',
	mt40: projectName === 'ar019',
	wa: projectName === 'ar082'
}))
</script>
<style lang="scss" scoped>
.bottomLogoText {
	margin: 40px 0 0;
	text-align: center;
	padding-bottom: 60px;

	&.mt40 {
		margin-bottom: 60px;
	}

	&.popText {
		padding: 0 28px;
		margin-bottom: 30px;
	}
	&.wa {
		ul {
			li {
				font-size: 22px; /* 覆盖默认字体大小 */
			}
		}
	}

	img {
		width: 200px;
		margin-bottom: 10px;
	}

	ul {
		li {
			text-align: left;
			font-size: 28px;
			color: var(--text_color_L1);
			margin-bottom: 24px;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}


}
</style>
