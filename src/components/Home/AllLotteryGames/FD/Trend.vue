<template>
	<div class="Trend__C">
		<div class="Trend__C-body1">
			<div class="Trend__C-nav">
				<div
					v-for="(item, index) in betTypeNameMap"
					:key="index"
					:class="{ active: betType == index }"
					@click="changeType(index)"
				>
					{{ item }}
				</div>
			</div>
			<div class="Trend__C-body1-line">{{ $t('trendDesc1') }}</div>
			<div class="Trend__C-body1-line" v-if="resolvelist2">
				<div>{{ $t('trendDesc3') }}</div>
				<div class="Trend__C-body1-line-num">
					<div v-for="(value, index) in resolvelist2.list" :key="'2' + index">{{ value }}</div>
				</div>
			</div>
			<div class="Trend__C-body1-line" v-if="resolvelist4">
				<div>{{ $t('trendDesc4') }}</div>
				<div class="Trend__C-body1-line-num">
					<div v-for="(value, index) in resolvelist4.list" :key="'4' + index">{{ value }}</div>
				</div>
			</div>
			<div class="Trend__C-body1-line" v-if="resolvelist1">
				<div>{{ $t('trendDesc5') }}</div>
				<div class="Trend__C-body1-line-num">
					<div v-for="(value, index) in resolvelist1.list" :key="'5' + index">{{ value }}</div>
				</div>
			</div>
			<div class="Trend__C-body1-line" v-if="resolvelist3">
				<div>{{ $t('trendDesc6') }}</div>
				<div class="Trend__C-body1-line-num">
					<div v-for="(value, index) in resolvelist3.list" :key="'3' + index">{{ value }}</div>
				</div>
			</div>
		</div>
		<div class="Trend__C-head">
			<van-row>
				<van-col span="9">{{ $t('betIssue') }}</van-col>
				<van-col span="15">{{ $t('number') }}</van-col>
			</van-row>
		</div>
		<div class="Trend__C-body2">
			<template v-if="EmerdList.length">
				<div
					v-for="(item, index) in EmerdList"
					:key="index"
					:IssueNumber="item.issueNumber"
					:Number="item.number"
					:Colour="item.colour"
					:rowId="item.rowId"
				>
					<van-row>
						<van-col span="9">
							<div class="Trend__C-body2-IssueNumber">{{ item.issueNumber }}</div>
						</van-col>
						<van-col span="15">
							<div class="Trend__C-body2-Num">
								<canvas canvas :id="'myCanvas' + item.rowId" ref="canvas" class="line-canvas"></canvas>
								<div
									class="Trend__C-body2-Num-item"
									:class="{ action: Number(item.number) == num - 1 }"
									v-for="num in 10"
									:key="num"
								>
									{{ num - 1 }}
								</div>
								<div class="Trend__C-body2-Num-BS" :class="{ isB: Number(item.number) > 4 }">
									{{ Number(item.number) > 4 ? 'B' : 'S' }}
								</div>
								<div class="Trend__C-body2-Num-OE" :class="{ isE: Number(item.number) % 2 }">
									{{ Number(item.number) % 2 ? 'O' : 'E' }}
								</div>
							</div>
						</van-col>
					</van-row>
				</div>
			</template>
			<div v-else class="Trend__C-body2-empty">
				<Empty />
			</div>
		</div>
		<div v-if="EmerdList.length" class="Trend__C-foot">
			<div class="Trend__C-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
				<van-icon name="arrow-left" class="Trend__C-icon" size="20" />
			</div>
			<div class="Trend__C-foot-page">{{ pageNo }}/{{ totalPage }}</div>
			<div class="Trend__C-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
				<van-icon name="arrow" class="Trend__C-icon" size="20" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick, onActivated } from 'vue'
import Empty from '@/components/Empty/index.vue'
import { AwaitApiResult } from '@/utils'
import type { FD, WinGo } from '@/types/api'
import { get5DEmerdList, getNoaverage5DEmerdList } from '@/api'
const resolvelist = ref<WinGo.resolvelist[]>([])
const props = withDefaults(defineProps<{ typeid: number }>(), {})
const EmerdList = ref<WinGo.GetNoaverageEmerdList[]>([])
const resolvelist1 = ref<WinGo.resolvelist>()
// 平均多少期没开
const resolvelist2 = ref<WinGo.resolvelist>()
// 多少期没开
const resolvelist3 = ref<WinGo.resolvelist>()
const resolvelist4 = ref<WinGo.resolvelist>()
const resolvelist5 = ref<WinGo.resolvelist>()

// 投注列表
const betTypeNameMap = ref(['A', 'B', 'C', 'D', 'E'])
// 选中投注类型
const betType = ref(0)
const pageNo = ref(1)
const totalPage = ref(4)
/**
 * @description: 遍历元素执行canvas划线
 * @return {*}
 */
function getReport() {
	nextTick(() => {
		for (let i = 0; i < EmerdList.value.length; i++) {
			if (EmerdList.value[i + 1]) {
				getCanvas(EmerdList.value[i], EmerdList.value[i + 1])
			}
		}
	})
}
/**
 * @description: 切换投注类型
 * @param {*} value
 * @return {*}
 */
const changeType = (value: number) => {
	betType.value = value
	getData(true)
}
/**
 * @description: canvas画趋势线
 * @param {*} el
 * @param {*} number
 * @return {*}
 */
function getCanvas(el: any, number: any) {
	//获取Canvas对象(画布)
	let currentNum = parseInt(el.number) //当前
	let termNum = parseInt(number.number) //上一期
	var canvas: any = document.getElementById('myCanvas' + el.rowId)
	//简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
	if (canvas && canvas.getContext) {
		var ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height) //清除画线从新画
		ctx.beginPath()
		//定义直线的起点坐标为(10,10)

		ctx.moveTo(currentNum == 0 ? 14 : currentNum * 27 + 14, 0)
		//定义直线的终点坐标为(50,10)

		ctx.lineTo(termNum == 0 ? 14 : termNum * 27 + 14, canvas.height)
		ctx.strokeStyle = 'red'
		//沿着坐标点顺序的路径绘制直线
		ctx.stroke()
		// //关闭当前的绘制路径
		ctx.closePath()
	}
}
// 上一页
const pPage = () => {
	pageNo.value--
	getGetNoaverageEmerdList()
}
// 下一页
const nPage = () => {
	pageNo.value++
	getGetNoaverageEmerdList()
}

/**
 * @description: 获取游戏趋势图
 * @param {*} claarNo
 * @return {*}
 */
const getData = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	getGetNoaverageEmerdList()
	if (claarNo) {
		pageNo.value = 1
	}
	const res = await AwaitApiResult<ObjResNull<FD.resGet5DEmerdList[]>>(
		get5DEmerdList({
			typeId: props.typeid,
			typeNumber: betType.value + 1
		})
	)
	if (res) {
		const keyList = Object.keys(res.data[0]).filter((item) => item.startsWith('number_'))
		resolvelist.value = res.data
			.filter((item: any) => item.type_Number == betType.value + 1)
			.map((item: any) => {
				const Obj: { type: number; list: any[] } = {
					list: [],
					type: 0
				}
				Obj.type = item.type
				Obj.list = []
				keyList.forEach((key) => {
					Obj.list.push(item[key])
				})
				return Obj
			})
	}
	resolvelist1.value = resolvelist.value.find((item: any) => item.type == 1)
	resolvelist2.value = resolvelist.value.find((item: any) => item.type == 2)
	resolvelist3.value = resolvelist.value.find((item: any) => item.type == 3)
	resolvelist4.value = resolvelist.value.find((item: any) => item.type == 4)
	resolvelist5.value = resolvelist.value.find((item: any) => item.type == 5)
}
/**
 * @description: 获取游戏列表
 * @param {*} claarNo
 * @return {*}
 */
const getGetNoaverageEmerdList = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	if (claarNo) {
		pageNo.value = 1
	}
	const res = await AwaitApiResult<ObjResNull<MessageData<FD.resGetNoaverage5DEmerdList>>>(
		getNoaverage5DEmerdList({
			pageSize: 10,
			pageNo: pageNo.value,
			typeId: props.typeid
		})
	)
	if (res) {
		EmerdList.value =
			res.data.list.map((item: any, index: any) => {
				item.rowId = index
				item.number = item.premium[betType.value]
				return item
			}) || []
	}
	totalPage.value = res?.data.totalPage || 0
	getReport()
}
defineExpose({
	getData
})
onActivated(() => {
	getData()
})
</script>
<style lang="scss" scoped>
.Trend__C {
	width: calc(100% - 52px);
	margin: 36px auto 0;
	text-align: center;
	font-size: 24px;

	&-head {
		height: 80px;
		line-height: 80px;
		background: var(--sheet_nva_color);
		border-radius: 10px 10px 0px 0px;
		font-weight: 700;
		font-size: 26px;
		color: #fff;
	}

	&-body1 {
		background-color: var(--darkBg,var(--bg_color_L2));
		margin-bottom: 38px;
		height: 400px;
		box-shadow: var(--boxShadowColor-35);
		border-radius: 20px;
		padding: 24px;

		&-line {
			display: flex;
			font-size: 26px;
			color: var(--text_color_L1);
			height: 31px;

			& > div {
				&:first-child {
					width: 278px;
					padding-left: 20px;
					text-align: left;
				}
			}

			&-num {
				display: flex;
				justify-content: space-between;
				flex: 1;
				padding-right: 15px;

				& > div {
					width: 36px;
					height: 36px;
					line-height: 36px;
					font-size: 26px;
					color: var(--text_color_L2);
					text-align: center;
				}
			}

			&.lottery {
				.Trend__C-body1-line-num {
					& > div {
						border-radius: 50%;
						// border: 1px solid var(--main-color);
						// color: var(--main-color);
						border: 1px solid var(--LotteryTrendColor);
						color: var(--LotteryTrendColor)!important;
					}
				}
			}

			& + .Trend__C-body1-line {
				margin-top: 20px;
			}

			&:first-child {
				padding-top: 26px;
				height: 57px;
				padding-left: 20px;
			}

			&-lottery {
				height: 36px;
			}
		}
	}

	&-body2 {
		font-size: 24px;
		background-color: var(--darkBg,var(--bg_color_L2));

		& > div {
			height: 100px;
			padding: 34px 10px;
			border-top: 1px solid var(--gray-color-1);

			&.Trend__C-body2-empty {
				height: 400px;
			}
		}

		&-IssueNumber {
			color: var(--text_color_L1);
			text-align: left;
		}

		&-Num {
			display: flex;
			position: relative;
			height: 32px;

			& > div {
				width: 30px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				border-radius: 50%;
			}

			&-item {
				border: 1px solid var(--text_color_L3);
				color: var(--text_color_L3);
				margin-right: 8px;

				&.action {
					position: relative;
					z-index: 10;
					border: none;
					color: #fff;
					background: var(--norm_red-color);
				}
			}

			&-BS {
				color: #fff;
				border: 1px solid var(--norm_bule-color);
				background-color: var(--norm_bule-color);
				margin-left: 2px;

				&.isB {
					border: 1px solid var(--norm_secondary-color);
					background: var(--norm_secondary-color);
					color: #fff;
				}
			}

			&-OE {
				color: #fff;
				border: 1px solid var(--norm_green-color);
				background: var(--norm_green-color);
				margin-left: 6px;

				&.isE {
					border: 1px solid var(--norm_red-color);
					background: var(--norm_red-color);
					color: #fff;
				}
			}
		}

		.line-canvas {
			position: absolute;
			top: 50%;
			left: 0;
			height: 100px;
			width: calc(100% - 48px);
			z-index: 9;
			html:lang(ar) &{
				left: unset;
				right: 0;
				transform: scaleX(-1);
			}
		}
	}

	&-foot {
		height: 140px;
		background-color: var(--darkBg,var(--bg_color_L2));
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--darkTextW, var(--text_color_L2));

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

				.Trend__C-icon {
					color: var(--text_color_L3);
				}
			}

			.Trend__C-icon {
				color: var(--text_color_L4);
			}
		}
	}

	&-nav {
		display: flex;
		border-bottom: 1px solid var(--Dividing-line_color);
		overflow: hidden;

		& > div {
			width: 80px;
			height: 80px;
			line-height: 80px;
			background: var(--bg_color_L3);
			font-size: 36px;
			font-weight: 700;
			color: var(--text_color_L2);
			border-radius: 19px 19px 0 0;
			position: relative;
			margin-right: 20px;
			text-align: center;
			border-radius: 19px 19px 0 0;

			&:last-child {
				font-size: 32px;
			}

			&.active {
				background-color: var(--main-color);
				color: var(--text_color_L4);
				&::after {
					background:radial-gradient(circle at 100% 0, var(--bg_color_L2) 20px, var(--main-color) 20px);
				}

				&::before {
					content: '';
					width: 20px;
					height: 20px;
					position: absolute;
					bottom: 0;
					left: -20px;
					z-index: 9;
					html:lang(ar) &{
						right: -20px;
						left: unset;
					}
				}
			}

			&::after {
				content: '';
				width: 20px;
				height: 20px;
				position: absolute;
				bottom: 0;
				right: -20px;
				z-index: 9;
				background: var(--linerGradient-70);
				html:lang(ar) &{
					left: -20px;
					right: unset;
				}
			}
		}
	}
}
</style>
