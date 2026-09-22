<template>
	<div class="GameRecord__C">
		<div class="GameRecord__C-head">
			<van-row>
				<van-col span="8">{{ $t('betSerial') }}</van-col>
				<van-col span="10">{{ $t('result') }}</van-col>
				<van-col span="6">{{ $t('time') }}</van-col>
			</van-row>
		</div>
		<div class="GameRecord__C-body">
			<template v-if="resGetXosoResultList?.length">
				<van-row v-for="(item, index) in resGetXosoResultList" :key="index" @click="Emerd(index)">
					<van-col span="8">
						<div class="c-tc goItem">{{ item.issueNumber }}</div>
					</van-col>
					<van-col span="10" class="c-row c-row-middle-center">
						<div class="c-row">
							<div class="c-row c-row-middle-center">
								<template v-if="item.openingResult">
									<div
										class="li circle-black c-row c-row-middle-center c-tc"
										v-for="(num, index) in item.openingResult[0].result"
										:key="index"
									>
										<div>{{ num }}</div>
									</div>
								</template>
							</div>
						</div>
					</van-col>
					<van-col span="6">
						<div class="c-row c-row-middle-center time">
							<div v-if="gVSs=='1'">{{ item.openingTime.substr(0, 10) }}</div>
							<div v-else>{{ item.openingTime }}</div>
						</div>
					</van-col>
					<div class="details" v-if="index == prizeIndexRe">
						<div class="detailLi" v-if="item.openingResult">
							<div :class="`selectItem${selectItem.resultType}`" class="prize" v-for="(selectItem, index) in newArr(item.openingResult)" :key="index">
									<div class="prize-tit" >{{ setPrizeTip(selectItem.resultType) }}</div>
									<div v-if="[0,1,2].includes(selectItem.resultType)">|</div>
									<div class="prize-box c-row c-flex-warp" >
										<span class="prize-box-item action">{{ setResult(selectItem.result)}}</span>
									</div>
								</div>							
						</div>
					</div>
				</van-row>
			</template>

			<div v-else class="GameRecord__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="resGetXosoResultList?.length" class="GameRecord__C-foot">
			<div class="GameRecord__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="GameRecord__C-icon" size="20" />
			</div>
			<div class="GameRecord__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="GameRecord__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="GameRecord__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { AwaitApiResult } from '@/utils'
import { ref, onActivated,readonly} from 'vue'
import Empty from '@/components/Empty/index.vue'
import { xosoGetXosoResult,GetFXosoResultPageList } from '@/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const resGetXosoResultList = ref<any>([])
const props = withDefaults(defineProps<{ areId: number; cityCode: string;gVSs?:string }>(), {})
const totalPage = ref(4)
const pageSize = ref(10)
const pageNo = ref(1)
const prizeIndexRe = ref(-1)
//获取记录
const getData = async (claarNo: Boolean = false,existsList?:any) => {
	if(existsList?.list.length>0){
		resGetXosoResultList.value=readonly(existsList?.list) || []
		totalPage.value = existsList?.totalPage
		pageNo.value = existsList?.pageNo
	}else{
		if (props.cityCode === '') return
		let res;
		if(props.gVSs == '1'){
			res = await AwaitApiResult<any>(
			xosoGetXosoResult({
				pageSize: pageSize.value,
				pageNo: pageNo.value,
				areId: props?.areId,
				cityCode: props?.cityCode
			}))
		} else if(props.gVSs == '2'){
			console.log('aaaaaa')
			res = await AwaitApiResult<any>(
				GetFXosoResultPageList({
					pageSize: pageSize.value,
					pageNo: pageNo.value,
					areId: props.areId,
					typeId: Number(props.cityCode)
			}))
		}
		resGetXosoResultList.value = res.data?.list || []
		totalPage.value = res.data?.totalPage
		pageNo.value = res.data?.pageNo
	}
}
//处理数据
const newArr = (list: any) => {
	var newArr = []
	for (var i = 0; i < list.length; i++) {
		var index = newArr.findIndex(function (item) {
			return item.resultType === list[i].resultType
		})
		if (index !== -1) {
			newArr[index].result.push(list[i].result)
		} else {
			newArr.push({
				resultType: list[i].resultType,
				result: [list[i].result]
			})
		}
	}
	return newArr
}

function setResult(result:any){
	return result.join('-')
}
function setPrizeTip(typeR:number){
	switch(typeR){
		case 0:
			return t('GrandPrize');
		case 1:
			return t('firstprize');
		case 2:
			return t('secondprize');
		case 3:
			return t('thirdprize');
		case 4:
			return t('fourprize');
		case 5:
			return t('fiveprize');
		case 6:
			return t('sixprize');
		case 7:
			return t('sevenprize');
		case 8:
			return t('eightprize');
	}
}
const pPage = () => {
	pageNo.value--
	getData()
}
const Emerd = (index: number) => {
	if (prizeIndexRe.value == index) {
		prizeIndexRe.value = -1
	} else {
		prizeIndexRe.value = index
	}
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
	prizeIndexRe.value = -1
})
</script>
<style lang="scss" scoped>
@import '@/assets/styles/xoxs.scss';
</style>
