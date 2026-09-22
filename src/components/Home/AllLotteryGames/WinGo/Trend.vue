<template>
	<div class="Trend__C">
		<div class="Trend__C-head">
			<van-row>
				<van-col span="8">{{ $t('betIssue') }}</van-col>
				<van-col span="16">{{ $t('number') }}</van-col>
			</van-row>
		</div>
		<div class="Trend__C-body1">
			<div class="Trend__C-body1-line">{{ $t('trendDesc1') }}</div>
			<div class="Trend__C-body1-line lottery">
				<div>{{ $t('trendDesc2') }}</div>
				<div class="Trend__C-body1-line-num" v-if="resolvelist1">
					<div v-for="item in 10" :key="item">{{ item - 1 }}</div>
				</div>
			</div>
			<div class="Trend__C-body1-line" v-if="resolvelist4 && resolvelist4.type == 2">
				<div>{{ $t('trendDesc3') }}</div>
				<div class="Trend__C-body1-line-num">
					<div v-for="(value4, r4I) in resolvelist4.list" :key="'4' + r4I">{{ value4 }}</div>
				</div>
			</div>
			<div class="Trend__C-body1-line" v-if="resolvelist2 && resolvelist2.type == 4">
				<div>{{ $t('trendDesc4') }}</div>
				<div class="Trend__C-body1-line-num">
					<div v-for="(value2, r2I) in resolvelist2.list" :key="'2' + r2I">{{ value2 }}</div>
				</div>
			</div>
			<div class="Trend__C-body1-line" v-if="resolvelist5 && resolvelist5.type == 1">
				<div>{{ $t('trendDesc5') }}</div>
				<div class="Trend__C-body1-line-num">
					<div v-for="(value5, r5I) in resolvelist5.list" :key="'5' + r5I">{{ value5 }}</div>
				</div>
			</div>
			<div class="Trend__C-body1-line" v-if="resolvelist3 && resolvelist3.type == 3">
				<div>{{ $t('trendDesc6') }}</div>
				<div class="Trend__C-body1-line-num">
					<div v-for="(value3, r3I) in resolvelist3.list" :key="'3' + r3I">{{ value3 }}</div>
				</div>
			</div>
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
									:class="Number(item.number) == num - 1 ? 'action' + (num - 1) : ''"
									v-for="num in 10"
									:key="num"
								>
									{{ num - 1 }}
								</div>
								<div class="Trend__C-body2-Num-BS" :class="{ isB: Number(item.number) > 4 }">
									{{ Number(item.number) > 4 ? 'B' : 'S' }}
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
import { AwaitWrap } from '@/utils'
import type { WinGo } from '@/types/api'
const resolvelist = ref([])
const props = withDefaults(defineProps<{ typeid: number; listApi: Function; EmerdApi: Function }>(), {})
const EmerdList = ref<WinGo.GetNoaverageEmerdList[]>([])
const resolvelist1 = ref<WinGo.resolvelist>()
// 平均多少期没开
const resolvelist2 = ref<WinGo.resolvelist>()
// 最大连开期数
const resolvelist3 = ref<WinGo.resolvelist>()
// 多少期没开
const resolvelist4 = ref<WinGo.resolvelist>()
// 出现的频率
const resolvelist5 = ref<WinGo.resolvelist>()

const pageNo = ref(1)
const totalPage = ref(4)
// 遍历元素，划线
function getReport() {
	nextTick(() => {
		for (let i = 0; i < EmerdList.value.length; i++) {
			if (EmerdList.value[i + 1]) {
				getCanvas(EmerdList.value[i], EmerdList.value[i + 1])
			}
		}
	})
}
const emits = defineEmits<{
	(e: 'changefive', val: any): void
}>()
// canvas画图
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

		ctx.moveTo(currentNum == 0 ? 15 : currentNum * 29 + 15, 0)
		//定义直线的终点坐标为(50,10)

		ctx.lineTo(termNum == 0 ? 15 : termNum * 29 + 15, canvas.height)
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
	getWinGoGetNoaverageEmerdList()
}
// 下一页
const nPage = () => {
	pageNo.value++
	getWinGoGetNoaverageEmerdList()
}
// 获取开奖相关数据
const getData = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	if (claarNo) {
		pageNo.value = 1
		getWinGoGetNoaverageEmerdList(claarNo)
	}
	const [err, res] = await AwaitWrap<any>(
		props.EmerdApi({
			typeId: props.typeid
		})
	)
	if (res.length) {
		const keyList = Object.keys(res[0]).filter((item) => item.startsWith('number_'))
		resolvelist.value = res.map((item: any) => {
			const Obj: { type?: number; list: any[] } = {
				list: []
			}
			Obj.type = item.type
			Obj.list = []
			keyList.forEach((key) => {
				Obj.list.push(item[key])
			})
			return Obj
		})
	}
	resolvelist1.value = resolvelist.value[0]
	resolvelist2.value = resolvelist.value[1]
	resolvelist3.value = resolvelist.value[2]
	resolvelist4.value = resolvelist.value[3]
	resolvelist5.value = resolvelist.value[4]
}
// 获取趋势图参数
const getWinGoGetNoaverageEmerdList = async (claarNo: Boolean = false) => {
	if (props.typeid == null) return
	if (claarNo) {
		pageNo.value = 1
	}
	const [err, res] = await AwaitWrap<any>(
		props.listApi({
			pageSize: 10,
			pageNo: pageNo.value,
			typeId: props.typeid
		})
	)
	if (res.list) {
		EmerdList.value =
			res.list.map((item: any, index: any) => {
				item.rowId = index
				return item
			}) || []
	} else if (res.data.gameslist) {
		EmerdList.value =
			res.data.gameslist.map((item: any, index: any) => {
				item.rowId = index
				return item
			}) || []
	}
	totalPage.value = res.totalPage
	if (claarNo) {
		const l = res.data?.gameslist || res.list || []
		emits(
			'changefive',
			l.slice(0, 5).map((item: any) => {
				return item.number
			})
		)
	}
	getReport()
}
defineExpose({
	getData
})
onActivated(() => {
	getData()
	getWinGoGetNoaverageEmerdList()
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
		background: var(--bgDark-2, var(--bg_color_L2));
		padding-bottom: 28px;

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
					color: var(--text_color_L3);
					text-align: center;
				}
			}

			&.lottery {
				.Trend__C-body1-line-num {
					& > div {
						border-radius: 50%;
						width: 36px;
						height: 36px;
						font-size: 26px;
						font-weight: 400;
						text-align: center;
						font-family: Roboto;
						// border: 1px solid var(--textBlueLight,var(--promotionbtnText1));
						border: 1px solid var(--norm_red-color);
						// color: var(--textBlueLight,var(--promotionbtnText1)) !important;
						color: var(--norm_red-color)!important;
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
		background-color: var(--bg_color_L2, var(--text_color_L1));

		& > div {
			height: 100px;
			padding: 34px 10px;
			border-top: 1px solid var(--text_color_L3);

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

				&.action0 {
					position: relative;
					z-index: 10;
					border: none;
					color: #fff;
					background-image: linear-gradient(135deg, var(--norm_red-color) 0%, var(--norm_red-color) 50.37%,
                  var(--norm_Purple-color) 50.38%, var(--norm_Purple-color) 100%) !important;
				}

				&.actionB {
					border: none;
					color: #fff;
					background-color: var(--norm_secondary-color);
				}

				&.actionS {
					border: none;
					color: #fff;
					background-color: var(--bgColor-13);
				}

				&.action5 {
					border: none;
					color: #fff;
					background-image: linear-gradient(to bottom right, var(--norm_green-color) 50%, var(--norm_Purple-color) 0)!important;
					position: relative;
					z-index: 10;
				}

				&.action1,
				&.action3,
				&.action7,
				&.action9 {
					border: none;
					color: #fff;
					background-color: var(--norm_green-color);
					position: relative;
					z-index: 10;
				}

				&.action2,
				&.action4,
				&.action6,
				&.action8 {
					border: none;
					color: #fff;
					background-color: var(--norm_red-color);
					position: relative;
					z-index: 10;
				}
			}

			&-BS {
				color: #fff;
				background: var(--norm_bule-color);
				margin-left: 14px;

				&.isB {
					background: var(--norm_secondary-color);
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

	&-origin {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		&-I {
			width: 20px;
			height: 20px;
			border-radius: 50%;

			&.violet {
				background-color: var(--bgcolor-21);
			}

			&.red {
				background: var(--norm_red-color);
			}

			&.green {
				background: var(--bgcolor-22);
			}
		}
	}

	&-foot {
		height: 140px;
		background: var(--drakBg,var(--bg_color_L2));
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;

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
				background: var(--bg_color_L3);
				pointer-events: none;

				.Trend__C-icon {
					color: var(--text_color_L2);
				}
			}

			.Trend__C-icon {
				color: var(--text_color_L4);
			}
		}
		&-page{
			color: var(--darkTextW, var(--text_color_L2));
		}
	}
}
</style>
