<!-- 号码选择 -->
<template>
	<div class="NumberSelectContainer">
		<div v-show="isShowMark" class="NumberSelectContainer-mark">
			<div>{{ $t('nomorebet') }}</div>
		</div>
		<NavTab
			:list="tabList"
			v-model:active="active"
			tabClassName="NumberTab"
			@onClickTab="tabupdate"
			v-slot="{ item, index }"
			v-if="tabList.length>0"
		>
			<div class="tabitem" :class="{ active: item.value === activeTab }">
				{{item.name}}
			</div>
		</NavTab>
		<div class="NumberTabContent">
			<div v-show="activeTab === 1">
				<!--选择号码-->
				<div class="selectcontainer" v-if="betconfig?.includes('4')">
					<div class="selectbutton">
						<div class="selectall" @click="getselect('Thousand', 0, 9, 'all')">{{ $t('all') }}</div>
						<div class="selectbig" @click="getselect('Thousand', 0, 9, 'big')">{{ $t('big') }}</div>
						<div class="selectsmall" @click="getselect('Thousand', 0, 9, 'small')">{{ $t('small') }}</div>
						<div class="selectodd" @click="getselect('Thousand', 0, 9, 'odd')">{{ $t('xosoTxt71') }}</div>
						<div class="selecteven" @click="getselect('Thousand', 0, 9, 'even')">{{ $t('xosoTxt70') }}</div>
					</div>
					<div class="selectcontent">
						<div class="selectheader">{{ $t('xosoTxt87') }}</div>
						<div class="selectball">
							<div v-for="(item, index) in number" :key="index" @click="betNum('Thousand', item)">
								<div :class="thousandnumList.includes(item) ? 'ball action ' : 'ball'">
									{{ item }}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="selectcontainer" v-if="betconfig?.includes('3')">
					<div class="selectbutton">
						<div class="selectall" @click="getselect('hundred', 0, 9, 'all')">{{ $t('all') }}</div>
						<div class="selectbig" @click="getselect('hundred', 0, 9, 'big')">{{ $t('big') }}</div>
						<div class="selectsmall" @click="getselect('hundred', 0, 9, 'small')">{{ $t('small') }}</div>
						<div class="selectodd" @click="getselect('hundred', 0, 9, 'odd')">{{ $t('xosoTxt71') }}</div>
						<div class="selecteven" @click="getselect('hundred', 0, 9, 'even')">{{ $t('xosoTxt70') }}</div>
					</div>
					<div class="selectcontent">
						<div class="selectheader">{{ $t('xosoTxt88') }}</div>
						<div class="selectball">
							<div v-for="(item, index) in number" :key="index" @click="betNum('Hundred', item)">
								<div :class="hundrednumList.includes(item) ? 'action ball' : 'ball'">
									{{ item }}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="selectcontainer" v-if="betconfig?.includes('2')">
					<div class="selectbutton">
						<div class="selectall" @click="getselect('ten', 0, 9, 'all')">{{ $t('all') }}</div>
						<div class="selectbig" @click="getselect('ten', 0, 9, 'big')">{{ $t('big') }}</div>
						<div class="selectsmall" @click="getselect('ten', 0, 9, 'small')">{{ $t('small') }}</div>
						<div class="selectodd" @click="getselect('ten', 0, 9, 'odd')">{{ $t('xosoTxt71') }}</div>
						<div class="selecteven" @click="getselect('ten', 0, 9, 'even')">{{ $t('xosoTxt70') }}</div>
					</div>
					<div class="selectcontent">
						<div class="selectheader">{{ $t('xosoTxt89') }}</div>
						<div class="selectball">
							<div v-for="(item, index) in number" :key="index" @click="betNum('ten', item)">
								<div :class="tennumList.includes(item) ? 'action ball' : 'ball'">
									{{ item }}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="selectcontainer" v-if="betconfig?.includes('1')">
					<div class="selectbutton">
						<div class="selectall" @click="getselect('Indivual', 0, 9, 'all')">{{ $t('all') }}</div>
						<div class="selectbig" @click="getselect('Indivual', 0, 9, 'big')">{{ $t('big') }}</div>
						<div class="selectsmall" @click="getselect('Indivual', 0, 9, 'small')">{{ $t('small') }}</div>
						<div class="selectodd" @click="getselect('Indivual', 0, 9, 'odd')">{{ $t('xosoTxt71') }}</div>
						<div class="selecteven" @click="getselect('Indivual', 0, 9, 'even')">{{ $t('xosoTxt70') }}</div>
					</div>
					<div class="selectcontent">
						<div class="selectheader">{{ $t('xosoTxt90') }}</div>
						<div class="selectball">
							<div v-for="(item, index) in number" :key="index" @click="betNum('Indivual', item)">
								<div :class="indicualnumList.includes(item) ? 'ball action' : 'ball'">
									{{ item }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--输入号码-->
			<div v-show="activeTab === 2">
				<van-field
					class="custom-field"
					v-model="numberselect"
					rows="4"
					autosize
					type="textarea"
					:placeholder="$t('xosoTxt86')"
					@input="inputblur"
				/>
			</div>
			<!--快捷选号-->
			<div v-show="activeTab === 3">
				<div class="quickcontainer">
					<div class="intervalcontainer" v-if="isthreenumber === 1">
						<div
							class="intervalitem"
							v-for="(item, index) in intervalnumber"
							:class="[intervalTab === index ? 'active' : '']"
							:key="index"
							@click="selectinterval(item, index)"
						>
							{{ item }}
						</div>
					</div>
					<div class="randomcontainer" v-if="randomtype === 1">
						<div class="randomheader">
							<div class="redline"></div>
							<div class="font30">{{ $t('xosoTxt83') }}</div>
						</div>
						<div class="randombutton">
							<div
								v-for="(item, index) in randomList"
								:class="[groupTab === index ? 'active' : '']"
								:key="index"
								@click="selectgroup(item, index, isthreenumber)"
							>
								{{ item }}{{ $t('xosoTxt84') }}
							</div>
						</div>
					</div>
					<div class="specialcontainer" v-if="specialtype === 1">
						<div class="specialheader">
							<div class="redline"></div>
							<div class="font30">{{ $t('xosoTxt97') }}</div>
						</div>
						<div class="specialbutton">
							<div v-if="speciaSelectNo.includes('1')" class="specialsame" @click="getquick(isthreenumber, 'same')">
								{{ $t('xosoTxt85') }}
							</div>
							<div v-if="speciaSelectNo.includes('4')" class="specialbig" @click="getquick(isthreenumber, 'big')">
								{{ $t('big') }}
							</div>
							<div
								v-if="speciaSelectNo.includes('5')"
								class="specialsmall"
								@click="getquick(isthreenumber, 'small')"
							>
								{{ $t('small') }}
							</div>
							<div v-if="speciaSelectNo.includes('2')" class="specialodd" @click="getquick(isthreenumber, 'odd')">
								{{ $t('xosoTxt71') }}
							</div>
							<div v-if="speciaSelectNo.includes('3')" class="specialeven" @click="getquick(isthreenumber, 'even')">
								{{ $t('xosoTxt70') }}
							</div>
						</div>
					</div>
					<div v-if="activeTab === 3" class="numbercontainer" v-for="(item, cindex) in 10" :key="item">
						<div class="Ntit">
							<div>{{ hundred }}{{ cindex }}0<br />/<br />{{ hundred }}{{ cindex }}9</div>
						</div>
						<div class="list">
							<div class="item" v-for="(item, index) in 10" :key="item">
								<div @click="betQuickNum(hundred, cindex, index)">
									<div
										:class="
											quicknumList.includes(hundred + '' + cindex + '' + index) ? 'number action' : 'number'
										"
									>
										{{ hundred }}{{ cindex }}{{ index }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, ref,watch,nextTick} from 'vue'
import { useI18n } from 'vue-i18n'
import NavTab from "@/components/FunTab/NavBar.vue";
const emit = defineEmits([
	'tabupdate',
	'selectgroup',
	'selectspecial',
	'betNum',
	'betQuickNum',
	'getselect',
	'getquick',
	'selectinterval'
])
const { t: $t } = useI18n()
const props = defineProps({
	methodList: {
		type: String,
		default: ''
	},
	activeTab: {
		type: Number,
		default: 0
	},
	randomList: {
		type: Array,
		default: () => {
			;[]
		}
	},
	randomtype: {
		type: Number,
		default: 0
	},
	specialtype: {
		type: Number,
		default: 0
	},
	isthreenumber: {
		type: Number,
		default: 0
	},
	speciaSelectNo: {
		type: String,
		default: ''
	},
	isShowMark: {
		type: Boolean,
		default: false
	},
	hundred: {
		type: String,
		default: ''
	},
	betconfig: {
		type: String,
		default: ''
	},
	groupTab: {
		type: Number,
		default: 30
	},
	//千位数组
	thousandnumList: {
		type: Array,
		default: []
	},
	//百位数组
	hundrednumList: {
		type: Array,
		default: []
	},
	//十位数组
	tennumList: {
		type: Array,
		default: []
	},
	//个位数组
	indicualnumList: {
		type: Array,
		default: []
	},
	//快捷选号数组
	quicknumList: {
		type: Array,
		default: []
	},
	//随机选号三位数区间
	intervalnumber: {
		type: Array,
		default: []
	},
	// 随机选号默认区间
	intervalTab: {
		type: Number,
		default: 0
	}
})
const tab=[
	{
		name:$t('selectNo'),
		value:1
	},
	{
		name:$t('xosoTxt81'),
		value:3
	},
	{
		name:$t('xosoTxt80'),
		value:2
	}
]
const  tabList=computed(()=>tab.filter((item)=>props.methodList?.includes(item.value+'')))
const active=ref(0)
const numberselect = ref('')
const number = ref(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])

const tabupdate = ({item}:any) => {
	emit('tabupdate', item.value)
}
const selectgroup = (item: string, index: number, isthreenumber: number) => {
	emit('selectgroup', item, index, isthreenumber)
}
const betNum = (digits: string, ball: string) => {
	emit('betNum', digits, ball)
}
const betQuickNum = (hundred: string, cindex: number, index: number) => {
	emit('betQuickNum', hundred, cindex, index)
}
const getselect = (method: string, num: number, digit: number, methods: string) => {
	emit('getselect', method, num, digit, methods)
}
const getquick = (digit: number, method: string) => {
	emit('getquick', digit, method)
}
const selectinterval = (item: string, index: number) => {
	emit('selectinterval', item, index)
}
const inputblur = (item: any) => {
	//const inputBox = item.target;
	//const inputValue = inputBox.value;
	// 使用正则表达式匹配并替换掉非数字和分号的字符
	//const filteredValue = inputValue.replace(/[^0-9,|]/g, '');
	// 更新输入框的值为过滤后的值
	//inputBox.value = filteredValue;
	if (item.target.value == '') {
		return
	} else {
		emit('inputblur', item.target.value)
	}
}
const cleardata = () => {
	numberselect.value = ''
}
watch(()=>props.activeTab,async()=>{
    await nextTick()
	const index=tabList.value.findIndex((item)=>item.value==props.activeTab)
	if(index===-1)return;
	active.value=index
})
defineExpose({
	cleardata
})
</script>
<style lang="scss" scoped>
.NumberSelectContainer {
	padding: 20px 24px;
	position: relative;
	&-mark {
		width: 100%;
		height: 100%;
		background: var(--bgcolor-32);
		position: absolute;
		z-index: 99;
		top: 0;
		left: 0;
		color: #fff;
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		html:lang(ar) &{
			right: 1px;
			left: unset;
			direction: ltr;
		}
		& > div {
			min-width: 440px;
			height: 100px;
			line-height: 100px;
			display: inline-block;
			text-align: center;
			border-radius: 20px;
			padding: 0 20px;
			//background-color: var(--norm_red-color);
			border: 1px solid var(--textBlueLight,var(--bg_color_L2));
			font-weight: 700;
			font-size: 32px;
			color: var(--textBlueLight,var(--bg_color_L2));
			font-weight: 700;
		}
	}

	.NumberTab {
		margin-bottom: 20px;
		border-radius: 10px;
		.tabitem {
			width: 280px;
			height: 88px;
			line-height: 88px;
			text-align: center;
			background: var(--darkBg,var(--bg_color_L2));
			
			font-size: 30px;
			color: var(--text_color_L2);
			flex: none;
		}
		:deep(.fun-tab-item){
			padding: 0;
		}
		.active {
			background: var(--linerGradien-94,var(--main_gradient-color2));
			color: #fff;
			border-radius: 10px;
		}
	}

	.NumberTabContent {
		display: flex;
		flex-direction: column;
		.intervalcontainer {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-bottom: 20px;
			.intervalitem {
				width: 130px;
				height: 70px;
				line-height: 70px;
				background: var(--bg_color_L2);
					/*box-shadow: var(--BoxShadowColor-25);*/
				border-radius: 20px;
				font-size: 26px;
				color: var(--text_color_L2);
				text-align: center;
				margin-right: 10px;
				margin-bottom: 10px;
			}
			.active {
				font-weight: 700;
				color: #fff;
				background: var(--main_gradient-color2);
			}
		}
		.selectcontainer {
			display: flex;
			flex-direction: column;
			width: 702px;
			height: 389px;
			background: var(--darkBg,var(--bg_color_L2));
			
			margin-bottom: 20px;
		}
		.selectcontainer:last-child {
			margin-bottom: 0;
		}
		.selectbutton {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 20px 16px;
			.basicbutton {
				width: 126px;
				height: 70px;
				font-size: 24px;
				color: #fff;
				line-height: 70px;
				text-align: center;
			}
			.selectall {
				@extend .basicbutton;
				background: var(--norm_red-color);
				/*	box-shadow: 0var(--BoxShadowColor-10);*/
				border-top-right-radius: 20px;
				border-bottom-left-radius: 20px;
			}
			.selectbig {
				@extend .basicbutton;
				background: var(--norm_secondary-color);
				border-radius: 20px;
			}
			.selectsmall {
				@extend .basicbutton;
				background: var(--norm_bule-color);
			/*	box-shadow: var(--BoxShadowColor-5);*/
			border-radius: 20px;
			}
			.selectodd {
				@extend .basicbutton;
				background: var(--norm_Purple-color);
				border-radius: 20px;
			}
			.selecteven {
				@extend .basicbutton;
				background: var(--norm_red-color);
			/*	box-shadow: var(--BoxShadowColor-5);*/
				border-top-right-radius: 20px;
				border-bottom-left-radius: 20px;
			}
		}
		.selectcontent {
			width: 670px;
			height: 260px;
			background: var(--bgDark-3,var(--bg_color_L3));
			display: flex;
			flex-direction: column;
			margin: 0 16px;
		}
		.selectheader {
			font-size: 32px;
			color: var(--text_color_L2);
			padding: 20px;
		}
		.selectball {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
		.ball {
			width: 70px;
			height: 70px;
			font-size: 32px;
			line-height: 70px;
			text-align: center;
			font-weight: 700;
			color: var(--text_color_L2);
			background: url('@/assets/icons/svg/nbg.svg') no-repeat center center;
			background-size: cover;
			margin-bottom: 20px;
			&.action {
				color: var(--main-color);
				background: url('@icon/public/anbg.svg') no-repeat center center;
				background-size: cover;
			}
		}
		.ball:nth-child(1),
		.ball:nth-child(6) {
			margin-left: 50px;
		}
		.quickcontainer {
			display: flex;
			flex-direction: column;
			.redline {
				width: 6px;
				height: 30px;
				background: var(--main-color);
				margin-top: 4px;
				margin-right: 20px;
			}
			.randomcontainer {
				display: flex;
				flex-direction: column;
				.randomheader {
					display: flex;
					flex-direction: row;
					margin-bottom: 20px;
					.font30 {
						font-size: 30px;
						font-weight: 700;
						color: var(--darkTextW,var(--text_color_L1));
					}
				}
				.randombutton {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					margin-bottom: 20px;
					& > div {
						width: 130px;
						height: 70px;
						line-height: 70px;
						background: var(--darkBg,var(--bg_color_L2));
						font-size: 26px;
						color: var(--text_color_L2);
						text-align: center;
						border-radius: 20px;
					}
					.active {
						background: var(--main_gradient-color2);
						color: #fff;
					}
				}
			}
			.specialcontainer {
				display: flex;
				flex-direction: column;
				.specialheader {
					display: flex;
					flex-direction: row;
					margin-bottom: 20px;
					.font30 {
						font-size: 30px;
						color: var(--darkTextW,var(--text_color_L1));
						font-weight: 700;
					}
				}
				.specialbutton {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					.basic {
						width: 130px;
						height: 70px;
						line-height: 70px;
						font-size: 24px;
						color: #fff;
						text-align: center;
					}
					.specialsame {
						@extend .basic;
						background: var(--main_gradient-color2);
						border-radius: 20px;
					}
					.specialbig {
						@extend .basic;
						background: var(--norm_secondary-color);
						border-radius: 20px;
					}
					.specialsmall {
						@extend .basic;
						background: var(--norm_bule-color);
						border-radius: 20px;
					}
					.specialodd {
						@extend .basic;
						background: var(--norm_Purple-color);
						border-radius: 20px;
					}
					.specialeven {
						@extend .basic;
						background: var(--norm_red-color);
						border-top-right-radius: 20px;
						border-bottom-left-radius: 20px;
					}
				}
			}
		}
		.numbercontainer {
			display: flex;
			background: var(--darkBg,var(--bg_color_L2));
			
			border-radius: 24px;
			padding: 20px;
			margin-top: 30px;
			.Ntit {
				display: flex;
				align-items: center;
				line-height: 56px;
				font-size: 32px;
				color: var(--text_color_L3);
				font-weight: 400;
			}
			.list {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				.item {
					width: 20%;
					display: flex;
					justify-content: center;
					align-items: center;
					.number {
						width: 80px;
						height: 80px;
						line-height: 80px;
						text-align: center;
						font-size: 32px;
						font-weight: 700;
						color: var(--text_color_L2);
						background: url('@/assets/icons/svg/nbg.svg') no-repeat center center;
						background-size: cover;

						&.action {
							color: var(--main-color);
							background: url('@icon/public/anbg.svg') no-repeat center center;
							background-size: cover;
						}
					}
				}
			}
		}
	}
}
::-webkit-scrollbar {
	height: 5px;
}
::-webkit-scrollbar-thumb {
	border-radius: 5px;
	background: var(--borderColor-5);
}
::-webkit-scrollbar-track {
	border-radius: 5px;
}
::-webkit-scrollbar {
	position: absolute;
	bottom: 10px;
}
</style>
