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
import type { FD } from '@/types/api'
import { AwaitApiResult } from '@/utils'
import { getMy5DEmerdList } from '@/api'

const router = useRouter()
const totalPage = ref(4)
const pageSize = ref(20)
const pageNo = ref(1)
const props = withDefaults(defineProps<{ typeid: number; goPathName: string; hasHead: boolean }>(), {
	hasHead: true
})
const mayrecord = ref<FD.resGetMy5DEmerdList[]>([]) // 游戏记录列表
/**
 * 跳转路径
 * @param name 路由名字
 */
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
/**
 * 获取数据
 * @param claarNo 重置页码
 */
const getData = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	if (claarNo) {
		pageNo.value = 1
	}
	const res = await AwaitApiResult<ObjResNull<MessageData<FD.resGetMy5DEmerdList>>>(
		getMy5DEmerdList({
			pageSize: pageSize.value,
			pageNo: pageNo.value,
			typeId: props.typeid
		})
	)
	mayrecord.value = res?.data.list || []
	totalPage.value = res?.data.totalPage || 0
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
			display: flex;
			align-items: center;
			justify-content: center;

			&.disabled {
				background: var(--button_dis_color);
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
