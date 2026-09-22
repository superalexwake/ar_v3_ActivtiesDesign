<template>
	<div class="languages">
		<NavBar :title="$t('selectLanguage')" left-arrow @click-left="router.go(-1)" />
		<LangList />
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import LangList from '@/components/Main/LanguageList/index.vue'
const router = useRouter()
</script>

<style lang="scss" scoped>
.languages {
	padding-bottom: 30px;
}
</style>
