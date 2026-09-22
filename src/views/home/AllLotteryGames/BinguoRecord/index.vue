<template>
	<div class="record-container">
		<NavBar left-arrow @click-left="backGo" background-color="#0a4529" :title="$t('xosoTxt73')">
			<template #right>
				<div class="WinTrx__C-head-more">
					<div @click="goPath()"></div>
					<div :class="{ disableVoice: VoiceType == '2' }" @click="setVoice"></div>
				</div>
			</template>
		</NavBar>
		<List v-model:list="list" v-model:pageQuery="query" :api="GetMyBingo18HistoryBetting" :distance="100" ref="listRef" :isAutoLoad="true">
      <template #content>
			  <bingo :mayrecord="list" />
      </template>
		</List>
	</div>
</template>
<script setup lang="ts">
import { GetMyBingo18HistoryBetting } from '@/api/modules/games/bingo'
import bingo from '@/components/Home/AllLotteryGames/Bingo/RecordList.vue'
import {  ref } from 'vue'
import { useRouter } from 'vue-router'
import List from '@/components/common/List.vue'

const router = useRouter()
const backGo = () => {
	router.back()
}
const list = ref([])

const query = ref({
  pageSize: 20
})

const goPath = () => {}
const setVoice = () => {}
const VoiceType = ref('')

</script>
<style lang="scss" scoped>
.record-container {
	min-height: 100vh;
	width: 100%;
	background-color: #0a4529;
}
</style>
