<template>
	<div class="MyGameRecord__C">
		<div v-if="hasHead" class="MyGameRecord__C-head">
			<div class="MyGameRecord__C-head-moreB" @click="goPath(goPathName)">
        {{ $t('more') }}
        <svg-icon name="rightCircle"/>
      </div>
		</div>
		<div class="MyGameRecord__C-body">
			<MyGameRecordList v-if="mayrecord.length" :mayrecord="mayrecord"></MyGameRecordList>
			<div v-else class="MyGameRecord__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="mayrecord.length" class="MyGameRecord__C-foot">
			<div class="MyGameRecord__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="MyGameRecord__C-icon" size="20" />
			</div>
			<div class="MyGameRecord__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="MyGameRecord__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="MyGameRecord__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Empty from '@/components/Empty/index.vue'
import MyGameRecordList from './MayrecordList.vue'
import { useRouter } from 'vue-router'
import { ref, onActivated } from 'vue'
import type { K3 } from '@/types/api'
import { AwaitApiResult } from '@/utils'
import { getMyK3EmerdList } from '@/api'

const router = useRouter()
const totalPage = ref(4)
const pageSize = ref(20)
const pageNo = ref(1)
const props = withDefaults(defineProps<{ typeid: number; goPathName: string; hasHead: boolean }>(), {
	hasHead: true
})
const mayrecord = ref<K3.resGetMyK3EmerdList[]>([])

const goPath = (name: string) => {
	router.push({ name })
}
const pPage = () => {
	pageNo.value--
	getData()
}

const nPage = () => {
	pageNo.value++
	getData()
}

const getData = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	if (claarNo) {
		pageNo.value = 1
	}
	const res = await AwaitApiResult<ObjResNull<MessageData<K3.resGetMyK3EmerdList>>>(
		getMyK3EmerdList({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			typeId: props.typeid
		})
	)
	const dataList = res?.data.list || []
	for (let i = 0; dataList.length > i; i++) {
		let list = []
		let gameType = dataList[i].gameType.split(',')
		let item = dataList[i].selectType.split(',')
		list.push(gameType, item)
		for (let j = 0; gameType.length > j; j++) {
			if (gameType[j] == '1' || gameType[j] == '2' || gameType[j] == '3') {
				dataList[i].gameType = '1'
				dataList[i].oneList = item
			} else if (gameType[j] == '5' || gameType[j] == '6') {
				let oneList = []
				let towList = []
				let threeList = []
				for (let t = 0; item.length > t; t++) {
					if (
						item[t] == '|11|' ||
						item[t] == '|22|' ||
						item[t] == '|33|' ||
						item[t] == '|44|' ||
						item[t] == '|55|' ||
						item[t] == '|66|'
					) {
						let oneItme = item[t].split('|')
						oneItme.pop()
						oneItme.shift()
						oneList.push(oneItme.join())
					}
					if (
						item[t] == ':11:' ||
						item[t] == ':22:' ||
						item[t] == ':33:' ||
						item[t] == ':44:' ||
						item[t] == ':55:' ||
						item[t] == ':66:'
					) {
						let towItme = item[t].split(':')
						towItme.pop()
						towItme.shift()
						towList.push(towItme.join())
					}
					if (
						item[t] == ':1:' ||
						item[t] == ':2:' ||
						item[t] == ':3:' ||
						item[t] == ':4:' ||
						item[t] == ':5:' ||
						item[t] == ':6:'
					) {
						let threeItme = item[t].split(':')
						threeItme.pop()
						threeItme.shift()
						threeList.push(threeItme.join())
					}
				}
				dataList[i].gameType = '2'
				dataList[i].oneList = oneList
				dataList[i].towList = selectNum(towList, threeList)
			} else if (gameType[j] == '7' || gameType[j] == '8') {
				let oneList = []
				let towList = false
				for (let t = 0; item.length > t; t++) {
					if (
						item[t] == '|111|' ||
						item[t] == '|222|' ||
						item[t] == '|333|' ||
						item[t] == '|444|' ||
						item[t] == '|555|' ||
						item[t] == '|666|'
					) {
						let oneItme = item[t].split('|')
						oneItme.pop()
						oneItme.shift()
						oneList.push(oneItme.join())
					}
					if (item[t] == '|AAA|') {
						towList = true
					}
					dataList[i].oneList = oneList
					dataList[i].towList = towList
					dataList[i].gameType = '3'
				}
			} else if (gameType[j] == '9' || gameType[j] == '10' || gameType[j] == '4') {
				let oneList = []
				let towList = false
				let threeList = []
				for (let t = 0; item.length > t; t++) {
					if (
						item[t] == '|1|' ||
						item[t] == '|2|' ||
						item[t] == '|3|' ||
						item[t] == '|4|' ||
						item[t] == '|5|' ||
						item[t] == '|6|'
					) {
						let oneItme = item[t].split('|')
						oneItme.pop()
						oneItme.shift()
						oneList.push(oneItme.join())
					}
					if (item[t] == '|ABC|') {
						towList = true
					}
					if (
						item[t] == '.1.' ||
						item[t] == '.2.' ||
						item[t] == '.3.' ||
						item[t] == '.4.' ||
						item[t] == '.5.' ||
						item[t] == '.6.'
					) {
						let threeItme = item[t].split('.')
						threeItme.pop()
						threeItme.shift()
						threeList.push(threeItme.join())
					}
				}
				dataList[i].oneList = oneList
				dataList[i].towList = towList
				dataList[i].threeList = threeList
				dataList[i].gameType = '4'
			}
		}
	}
	mayrecord.value = dataList || []
	totalPage.value = res?.data.totalPage || 0
}

const selectNum = (numTow: any, numOne: any) => {
	let list = []
	for (var i = 0; numTow.length > i; i++) {
		let item = numTow[i]
		let arr = []
		for (var j = 0; numOne.length > j; j++) {
			arr.push(numOne[j])
		}
		if (arr.length > 0) {
			let con = arr.sort().join(',')
			list.push(item + '|' + con)
		}
	}
	return list.sort()
}
defineExpose({
	getData
})
onActivated(() => {
	getData()
})
</script>
<style lang="scss" scoped>
.MyGameRecord__C {
	width: calc(100% - 52px);
	margin: 24px auto 0;
	background-color: var(--bg_color_L2);
	border-radius: 16px;

	&-head {
		display: flex;
		justify-content: flex-end;
		padding: 24px 24px 0;

		&-moreB {
			border: 1px solid var(--main-color);
			height: 60px;
			line-height: 60px;
			border-radius: 20px;
			padding: 0 18px 0 18px;
			color: var(--main-color);
			font-size: 24px;
			position: relative;
      svg{
        width: 30px;
        height: 30px;
      }
		}
	}

	&-body {
		padding: 0 24px;

		&-empty {
			height: 400px;
		}
	}

	&-foot {
		height: 140px;
		background: var(--darkBg,var(--bg_color_L2));
		color: var(--text_color_L2);
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&-page {
			font-size: 24px;
			color:var(--text_color_L1);
		}

		&-previous,
		&-next {
			width: 70px;
			height: 70px;
			border-radius: 10px;
			background: var(--main-color);
			display: flex;
			align-items: center;
			justify-content: center;

			&.disabled {
				background: var(--button_dis_color);
				pointer-events: none;

				.MyGameRecord__C-icon {
					color: var(--text_color_L2);
				}
			}

			.MyGameRecord__C-icon {
				color: var(--text_color_L4);
			}
		}
	}
}
</style>
