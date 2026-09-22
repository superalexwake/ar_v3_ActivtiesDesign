<template>
	<div />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

router.replace({
	name: 'Messages',
	query: {
		...route.query,
		tab: 'site'
	}
})
</script>
