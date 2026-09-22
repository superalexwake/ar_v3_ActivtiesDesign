<template>
	<div class="MyGameRecord__C">
		<div v-if="hasHead" class="MyGameRecord__C-head">
			<div class="MyGameRecord__C-head-moreB" @click="goPath(goPathName)">
        {{ $t('more') }}
        <svg-icon name="rightCircle" />
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
import MyGameRecordList from '@/components/Home/AllLotteryGames/WinGo/MayrecordList.vue'
import { useRouter } from 'vue-router'
import { ref, onActivated } from 'vue'
import type { WinGo } from '@/types/api'
import { AwaitWrap } from '@/utils'

const router = useRouter()
const totalPage = ref(4)
const pageSize = ref(20)
const pageNo = ref(1)
const props = withDefaults(defineProps<{ typeid: number; ApiFun: Function; goPathName: string; hasHead: boolean }>(), {
	hasHead: true
})
const mayrecord = ref<WinGo.GetMyEmerdList[]>([])
// 跳转路由
const goPath = (name: string) => {
	router.push({ name })
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
// 获取参数
const getData = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	if (claarNo) {
		pageNo.value = 1
	}
	const [err, res] = await AwaitWrap<any>(
		props.ApiFun({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			typeId: props.typeid
		})
	)
	if (res) {
		mayrecord.value = res?.list || []
		totalPage.value = res?.totalPage || 0
	}
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

      svg{
        height: 32px;
        width: 32px;
      }
		}
	}

	&-body {
		background-color:var(--darkBg,var(--bg_color_L2));
		padding: 0 24px;

		&-empty {
			height: 400px;
		}
	}

	&-foot {
		height: 140px;
		background: var(--darkBg,var(--bg_color_L2));
		padding: 35px 178px;
		margin-top: 36px;
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
      		color: var(--text_color_L4);
			display: flex;
			align-items: center;
			justify-content: center;

			&.disabled {
				background: var(--bg_color_L3);
				pointer-events: none;
        		color: var(--text_color_L2);

				.MyGameRecord__C-icon {
					color: var(--saveTextColor-7);
				}
			}

			.MyGameRecord__C-icon {
				color: #fff;
			}
		}
	}
}
</style>
