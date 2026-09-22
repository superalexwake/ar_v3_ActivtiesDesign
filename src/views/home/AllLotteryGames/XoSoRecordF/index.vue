<template>
	<div class="TeamReport__C">
		<NavBar
			left-arrow
			@click-left="backGo"
			background-color="linear-gradient(90deg, #F95959 0%, #FF9A8E 100%)"
			:title="$t('fXosoTitle')"
		>
		</NavBar>
		
		<van-sticky :offset-top="46" class="bet-container-sticky">
			<div style="background-color: #f7f8ff">
				<NavTab
					:list="xosoListF"
					v-model:active="active"
					tabClassName="tabs"
					v-slot="{ item, index }"
					activeClassName="tab_active"
					ref="tabRefs"
					tabItemClassName="funtab_item"
					@onClickTab="onClickTab"
				>
					<div class="tab_item" :class="{ tab_active: index === active }">
						<p>{{$t(`code${item.nameCode}`)}}</p> 
					</div>
				</NavTab>
			</div>
		</van-sticky>
		<!-- list -->
		<div class="TeamReport__C-list">
			<KeepAlive>
				<MyGameRecord ref="RecordComponent" :parmas="pageQuery" 
				:ApiFun="GetFXosoRecordPageList" :hasHead="false" gVSs="2"/>
			</KeepAlive>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import NavTab from '@/components/FunTab/NavBar.vue'
import MyGameRecord from '@/components/Home/AllLotteryGames/NewVietnam/MyGameRecord.vue'
import { GetFXosoRecordPageList } from '@/api'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
const router = useRouter()
//返回上一页
const backGo = () => {
	router.go(-1)
}

const active = ref(0)
const xosoListF=ref<any>([])
const RecordComponent = ref()
let areId= router.currentRoute.value.query.areId
let typeId= router.currentRoute.value.query.typeId

interface PageQuery {
	bettingParentType: string | Number
	startDate: string
	endDate: string
	areId:string | Number
	typeId:string | Number
}
const pageQuery = reactive<PageQuery>({
	bettingParentType: '',
	startDate: '',
	endDate: '',
	areId: '',
	typeId: ''
})
const onClickTab = (val: any) => {
	pageQuery.areId=val.item.areId
	pageQuery.typeId=val.item.typeId
	RecordComponent.value.getData()
}

//设置头部数据
async function GetXosoBase(){
	let xosoList = JSON.parse(sessionStorage.getItem('xosoList') || '')
	let data = []
	for (let i = 0; i < xosoList.areInfos.length; i++) {
		for(let j = 0;j<xosoList.areInfos[i].areIssueNos.length;j++){
			if(xosoList.areInfos[i].areIssueNos[j].type == 2){
				data.push({
				areId : xosoList.areInfos[i].areId,
				typeId : xosoList.areInfos[i].areIssueNos[j].code,
				nameCode : xosoList.areInfos[i].areIssueNos[j].nameCode
				})
			}
		}
	}
	xosoListF.value = data
	if(xosoListF.value.length>0){
		active.value = xosoListF.value.findIndex((el:any)=>el.areId == areId && el.typeId == typeId)
	}
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
			background-color: var(--bg_color_L2);
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
				background-color: var(--textW);
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

:deep(.van-sticky) {
		padding-top: 20px;
		background-color: var(--bg_color_L2);
		.tabs {
			background-color: var(--bg_color_L2);
			height: 130px;
			.fun-tab-item {
				min-width: 220px;
				min-height: 88px;
				padding: 0 40px;
				color: var(--text_color_L2);
				background-size: 100%;
				border-radius: 12px;
				background: var(--bgDark-2, var(--bg_color_L2));
				box-shadow: var(--BoxShadowColor-25);
				font-size: 26px;
				margin-right: 12px;
				p {
					margin-top: 5px;
				}
				&.activeClassName {
					background: var(--main_gradient-color2);
					box-shadow: var(--BoxShadowColor-20);
					box-shadow: var(--BoxShadowColor-25);
					color: var(--textW) !important;
					background-size: 100%;
					z-index: 2;
				}
			}
			.funtab_item{
				color: var(--text_color_L2) !important;
			}
		}
	}
</style>
