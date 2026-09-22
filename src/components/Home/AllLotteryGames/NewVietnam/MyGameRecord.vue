<!-- 我的比赛记录 -->
<template>
	<div class="MyGameRecord__C">
		<div class="MyGameRecord__C-body">
			<div v-if="hasHead" class="MyGameRecord__C-head">
				<div class="MyGameRecord__C-head-moreB" @click="goPath(goPathName || '')">{{ $t('more') }}</div>
			</div>
			<MyGameRecordList v-if="resGetXosoRecordList?.length" :mayrecord="resGetXosoRecordList" @click-cance="onClickCance" :gVSs="gVSs">
			</MyGameRecordList>
			<div v-else class="MyGameRecord__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="resGetXosoRecordList?.length" class="MyGameRecord__C-foot">
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
import { computed, onActivated, ref } from 'vue'
import Empty from '@/components/Empty/index.vue'
import MyGameRecordList from '@/components/Home/AllLotteryGames/NewVietnam/MyRecordList.vue'
import { useRouter } from 'vue-router'
import type { XOSO } from '@/types/api'
import { AwaitApiResult } from '@/utils'

const router = useRouter()
const totalPage = ref(0)
const pageSize = ref(10)
const pageNo = ref(1)
const props = withDefaults(
	defineProps<{ parmas?: object; ApiFun: Function; cityCode?: Array<string>; hasHead?: boolean;gVSs?:string;areId?:string }>(),
	{
		hasHead: true
	}
)
const resGetXosoRecordList = ref<XOSO.resGetXosoRecordList[]>([])
// 获取参数
const getData = async () => {
	const newParmas = handleEmptyObj(props.parmas)
	if(props?.gVSs == '2'){
		if(props?.areId) newParmas.areId = props?.areId
		if(props?.cityCode) newParmas.typeId =Number(props?.cityCode)
	}
	const res = await AwaitApiResult<any>(
		props.ApiFun({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			...newParmas
		})
	)
	if (res) {
		resGetXosoRecordList.value = res.data?.list || []
		totalPage.value = res.data?.totalPage || 0
		pageNo.value = res.data?.pageNo
	}
}
//
function handleEmptyObj(obj: any) {
	const newObj = {} as any
	for (const i in obj) {
		if (obj[i] !== '') {
			newObj[i] = obj[i]
		}
	}
	return newObj
}
const onClickCance = () => {
	getData()
}
const goPathName = computed(()=>{
	if(props.gVSs == '1') return 'AllLotteryGames-XoSoRecord'
	else if(props.gVSs == '2') return 'AllLotteryGames-XoSoRecordF'
	return ''
})
// 跳转路由
const goPath = (name: string) => {
	router.push({ name,query:{
		areId:props.areId,
		typeId:props.cityCode
	} })
}
//处理数据
const pPage = () => {
	pageNo.value--
	getData()
}
// 下一页
const nPage = () => {
	pageNo.value++
	getData()
}
defineExpose({
	getData
})
onActivated(() => {
	getData()
})
</script>
<style lang="scss" scoped>
@import '@/assets/styles/xoxs.scss';
</style>
