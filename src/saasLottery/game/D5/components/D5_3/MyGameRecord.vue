<template>
	<div class="MyGameRecord__C">
		<!-- 更多：跳转投注记录页，图标/文案对齐旧版；长龙等嵌入场景 hasHead=false 隐藏 -->
		<div v-if="hasHead" class="MyGameRecord__C-head">
			<div class="MyGameRecord__C-head-moreB" @click="goRecord">
				{{ $t('more') }}
				<svg-icon name="rightCircle" />
			</div>
		</div>
		<div class="MyGameRecord__C-body">
			<MyGameRecordList v-if="mayrecord.length" :mayrecord="mayrecord" :gameCode="gameCode"></MyGameRecordList>
			<div v-if="!mayrecord.length&&!loading" class="MyGameRecord__C-body-empty">
				<Empty />
			</div>
			<section class="flex-center " style="height: 4rem" v-if="loading">
				<van-loading  type="spinner" color="var(--main-color)" />
			</section>
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
import {ref, onActivated,watch,onDeactivated,onMounted} from 'vue'
import { useRouter } from 'vue-router'
import Empty from '@/components/Empty/index.vue'
import MyGameRecordList from './MayrecordList.vue'
import { getLotteryRecord} from '@/saasLottery/api'
import {useGlobalContext} from "@/saasLottery/hooks";
const router = useRouter()
// hasHead：是否显示头部「更多」入口。游戏内 MyRecord tab 默认显示；长龙等嵌入场景传 false 隐藏
withDefaults(defineProps<{ hasHead?: boolean }>(), { hasHead: true })
const {trigger,gameCode}=useGlobalContext()
const totalPage = ref(4)
const pageSize = ref(10)
const pageNo = ref(1)

const mayrecord = ref<any[]>([]) // 游戏记录列表
const loading=ref(false)
// 跳转投注记录页
const goRecord = () => {
	router.push({ name: 'D5Record' })
}
// 上一页
const pPage = () => {
	pageNo.value--
	getData()
}
// 下一页
const nPage = () => {
	pageNo.value++
	getData()
}
/**
 * 获取数据
 * @param claarNo 重置页码
 */
const getData = async (claarNo: Boolean = false) => {
	if (gameCode.value == null) return
	try {
		loading.value = true
		const res = await getLotteryRecord({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			gameCode: gameCode.value
		});
		if (res.result){
			mayrecord.value = res?.data?.list || []
			totalPage.value = res?.data?.totalPage || 0
			pageNo.value =claarNo?1:pageNo.value
		}

	}catch (e) {

	}finally {
		loading.value = false
	}
}


const getComponentNum=ref(1)
const lock = ref(false);
watch(()=>getComponentNum.value,
    (val)=>{
      if(val>0) {
        if(lock.value) return;
        getData()
      }
    }
)

watch(() => gameCode.value, (newGameCode) => {
  if (newGameCode) {
    getData(true)
  }
})

onDeactivated(()=>{
  lock.value = true;
  trigger.reset()
})
onActivated(() => {
  lock.value = false;
  getData()
  trigger.on(()=>{
    getData();
  })
})
onMounted(()=>{
	  getData()
})

</script>
<style lang="scss" scoped>
.MyGameRecord__C {
	width: calc(100% - 52px);
	margin: 24px auto 0;

	&-head {
		display: flex;
		justify-content: flex-end;
		background-color: var(--darkBg,var(--bg_color_L2));
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
			display: flex;
			align-items: center;
			gap: 8px;
      svg{
        width: 30px;
        height: 30px;
      }
		}
	}

	&-body {
		background-color: var(--darkBg,var(--bg_color_L2));
		padding: 0 24px;

		&-empty {
			height: 400px;
		}
	}

	&-foot {
		//height: 140px;
		background: var(--darkBg,var(--bg_color_L2));
		padding: 24px 178px;
		//margin: 24px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&-page {
			font-size: 24px;
			color:var(--text_color_L2);
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
				background:var(--bg_color_L3);
				pointer-events: none;

				.MyGameRecord__C-icon {
					color: var(--text_color_L3);
				}
			}

			.MyGameRecord__C-icon {
				color: var(--text_color_L4);
			}
		}
	}
}
</style>
