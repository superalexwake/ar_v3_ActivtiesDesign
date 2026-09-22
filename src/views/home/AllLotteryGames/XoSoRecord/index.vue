<template>
	<div class="TeamReport__C">
		<NavBar
			left-arrow
			@click-left="backGo"
			background-color="linear-gradient(90deg, #F95959 0%, #FF9A8E 100%)"
			:title="$t('xosoTxt73')"
		>
		</NavBar>
		<div class="TeamReport__C-head">
			<div class="TeamReport__C-head-fixed">
				<div class="TeamReport__C-head-line1">
					<div @click="showCity = true">
						<span v-if="cityName" class="default">{{ cityName }}</span>
						<span v-else class="default"> {{ t('all') }} </span>
						<van-icon name="arrow-down" />
					</div>
				</div>
				<div class="TeamReport__C-head-line2">
					<div @click="showLevel = true">
						<span v-if="gameName" class="default">{{ gameName }}</span>
						<span v-else class="default"> {{ t('all') }} </span>
						<van-icon name="arrow-down" />
					</div>
					<!--日期选择组件-->
					<div>
						<Calendar ref="calendar" @confirm="onConfirmDateC" />
					</div>
				</div>
			</div>
		</div>
		<!-- list -->
		<div class="TeamReport__C-list">
			<KeepAlive>
				<MyGameRecord ref="RecordComponent" :parmas="pageQuery" :ApiFun="xosoGetXosoUserRecord" :hasHead="false" gVSs="1"/>
			</KeepAlive>
		</div>

		<van-popup v-model:show="showLevel" round position="bottom">
			<van-picker
				:columns-field-names="customFieldName"
				:columns="selectList"
				@cancel="showLevel = false"
				@confirm="onItemClickTime"
			/>
		</van-popup>
		<van-popup v-model:show="showCity" round position="bottom">
			<van-picker
				:columns-field-names="customFieldName"
				:columns="selectCity"
				@cancel="showCity = false"
				@confirm="onClickCity"
			/>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Calendar from '@/components/common/Calendar.vue'
import MyGameRecord from '@/components/Home/AllLotteryGames/NewVietnam/MyGameRecord.vue'
import { AwaitApiResult } from '@/utils'
import { xosoGetXosoUserRecord } from '@/api'
import { useRouter,useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { getXosoBase } from '@/api'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
//返回上一页
const backGo = () => {
	router.go(-1)
}

// 城市
interface selectList {
	nameCode: string
	value: string
}
const selectCity = ref<Array<selectList>>([])

// 玩法
const selectList = ref<Array<selectList>>([])

const customFieldName = {
	text: 'nameCode',
	value: 'value'
}

const calendar = ref() // 日历组件

// 状态
const showLevel = ref(false)
const showCity = ref(false)

interface PageQuery {
	bettingParentType: string | number
	areId: string | number
	startDate: string
	endDate: string
}
const pageQuery = reactive<PageQuery>({
	bettingParentType: '',
	areId: '',
	startDate: '',
	endDate: ''
})

const RecordComponent = ref()
const gameName = ref()
const onItemClickTime = ({ selectedOptions }: any) => {
	pageQuery.bettingParentType = Number(selectedOptions[0].value)
	gameName.value = selectedOptions[0].nameCode
	RecordComponent.value.getData()
	showLevel.value = false
}
const cityName = ref()
const onClickCity = ({ selectedOptions }: any) => {
	pageQuery.areId = Number(selectedOptions[0].value)
	cityName.value = selectedOptions[0].nameCode
	RecordComponent.value.getData()
	showCity.value = false
}

/**
 * @description: 确认日期
 * @return {*}
 */
async function onConfirmDateC() {
	let newEndDate = calendar.value.endDateValue !== '' ? `${calendar.value.endDateValue} 23:59:59` : ''
	pageQuery.startDate = `${dayjs(calendar.value.startDateValue).format('YYYY-MM-DD')} 23:59:59`
	pageQuery.endDate = `${dayjs(newEndDate).format('YYYY-MM-DD')} 23:59:59`
	RecordComponent.value.getData()
	console.log(pageQuery.startDate, pageQuery.endDate)
}
// 获取下拉选项得数据
const GetXosoBase = async () => {
	const areId = Number(route.query.areId) | 0;
	const res = await AwaitApiResult<any>(getXosoBase({areId}))

	selectList.value = dataFilter(res.data.categorys)
	selectList.value.unshift({ value: '', nameCode: t('all') })

	selectCity.value = dataFilter(res.data.ares)
	selectCity.value.unshift({ value: '', nameCode: t('all') })
}
const dataFilter = (cont: any) => {
	const codeName = cont.map((item: any) => {
		let obj = { value: '', nameCode: '' }
		obj.value = item.value
		obj.nameCode = t('code' + item.nameCode)
		return obj
	})
	return codeName
}

GetXosoBase()
</script>

<style scoped lang="scss">
:deep(.MyGameRecord__C) {
	margin-top: 0;
	.MyGameRecordList__C {
		margin: 0 -24px;
	}
}
:deep(.ar-searchbar__selector) {
	& > div {
		padding: 0;
		box-shadow: none;
		span {
			color: var(--text_color_L2);
		}
	}
}
.TeamReport__C {
	padding: 0 24px 40px;

	&-head {
		height: 220px;
		&-fixed {
			height: 215px;
			position: fixed;
			top: 92px;
			width: 100%;
			left: 50%;
			transform: translateX(-50%);
			max-width: 750px;
			background-color: var(--bgDark-4,var(--bg_color_L2));
			padding: 0 24px;
			z-index: 9;
		}
		&-line1,
		&-line2 {
			height: 80px;
			width: 100%;
			display: flex;
			justify-content: space-between;
			color: var(--text_color_L2);
			font-size: 28px;
			margin-top: 20px;
			& > div {
				
				border-radius: 10px;
				line-height: 80px;
				width: calc(100% - 10px);
				padding: 0 20px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: var(--darkBg,var(--bg_color_L2));
				& + div {
					margin-left: 20px;
				}
			}
			.default {
				color: var(--text_color_L2);
			}
		}
		&-line1 {
			& > div {
				width: 100%;
			}
		}
	}
	&-list {
		background-color: var(--darkBg,var(--bg_color_L2));
		border-radius: 10px;
	}
}
</style>
