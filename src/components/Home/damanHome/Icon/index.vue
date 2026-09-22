<template>
	<span class="cms-icon" :style="{ fontSize: size }">
		<svg aria-hidden="true">
			<use :href="symbolId" :fill="color" />
		</svg>
	</span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
const props = defineProps({
	prefix: {
		type: String as PropType<string>,
		default: 'cms-icon'
	},
	name: {
		type: String as PropType<string>,
		required: true
	},
	color: {
		type: String as PropType<string>,
		default: ''
	},
	size: {
		type: String as PropType<string>,
		default: '24px'
	}
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<style scoped lang="scss">
.cms-icon {
	--color: inherit;
	height: 1em;
	width: 1em;
	line-height: 1em;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	position: relative;
	fill: currentColor;
	color: var(--color);
	font-size: inherit;
	svg {
		height: 1em;
		width: 1em;
	}
}
</style>
