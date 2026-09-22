<template>
	<div class="GameRecord__C">
		<div class="GameRecord__C-head">
			<van-row>
				<van-col span="10">{{ $t('FDNumber') }}</van-col>
				<van-col span="10">{{ $t('FDResult') }}</van-col>
				<van-col span="4">{{ $t('gameRecordTotal') }}</van-col>
			</van-row>
		</div>
		<div class="GameRecord__C-body">
			<template v-if="emerdList.length!=0">
				<van-row v-for="(item, index) in emerdList" :key="index">
					<van-col span="10">{{ item.issueNumber }}</van-col>
					<van-col span="10">
						<div class="numList">
							<div class="numItem" v-for="(num, index) in [...item.premium]" :key="index">{{ num }}</div>
						</div>
					</van-col>
					<van-col span="4">
						<div class="sumBs">
							<span class="sumBs__ball" :class="isSumBig(item.sum) ? 'is-big' : 'is-small'">{{ isSumBig(item.sum) ? 'B' : 'S' }}</span>
							<span class="sumBs__ball" :class="isSumOdd(item.sum) ? 'is-odd' : 'is-even'">{{ isSumOdd(item.sum) ? 'O' : 'E' }}</span>
						</div>
					</van-col>
				</van-row>
			</template>
			<div v-if="emerdList?.length==0&&!loading" class="GameRecord__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="emerdList.length" class="GameRecord__C-foot">
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
import {ref,watch, computed} from 'vue'
import Empty from '@/components/Empty/index.vue'
import {getLotteryHistoryIssue} from '@/saasLottery/api'
import {useD5Context} from "@game/D5/hooks/useD5_3";
const props = withDefaults(defineProps<{ gameCode: any}>(), {})
const {historyIssues,historyIssuesTotalPage}=useD5Context();
const NoaverageEmerdList = ref<any[]>([]) // 游戏记录列表
const emerdList=computed(()=>NoaverageEmerdList.value.length?NoaverageEmerdList.value:historyIssues.value)

// 和值大小单双(D5 SUM 官方规则:大 High 23-45 / 小 Low 0-22;单双按奇偶)
const SUM_BIG_MIN = 23
const isSumBig = (sum?: number) => Number(sum) >= SUM_BIG_MIN
const isSumOdd = (sum?: number) => Number(sum) % 2 === 1
const loading=ref(false)
const totalPage = ref(historyIssuesTotalPage) // 总页数
const pageSize = ref(10) // 页面条数
const pageNo = ref(1) // 页数

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
 * @param claarNo 是否需要清理数据
 */
const getData = async (claarNo: Boolean = false) => {
  try {
    loading.value=true;
    if (props.gameCode == null) return
    const{result,data}= await getLotteryHistoryIssue({
      pageSize: pageSize.value,
      pageNo: pageNo.value,
      gameCode: props.gameCode
    })
    if (result){
      NoaverageEmerdList.value=data.list||[];
      pageNo.value=claarNo?1:pageNo.value;
      totalPage.value=data.totalPage||0
    }
  }catch (e) {
    loading.value=false;
  }
}

// defineExpose({
// 	getData
// })
//
// onActivated(() => {
// 	getData()
// })

watch(historyIssues,()=>{
  NoaverageEmerdList.value=[];
  pageNo.value=1;
});

watch(historyIssuesTotalPage,()=>{
  totalPage.value=historyIssuesTotalPage.value;
})

watch(props.gameCode, ()=>{
  getData(true)
})


</script>
<style lang="scss" scoped>
.GameRecord__C {
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

	&-body {
		line-height: 80px;
		color: var(--darkTextW, var(--text_color_L1));

		&-empty {
			height: 400px;
		}

		& > div {
			background: var(--darkBg,var(--bg_color_L2));
			color: var(--text_color_L1);

			& + div {
				border-top: 1px solid var(--bgDark-2,var(--gray-color-1));
			}
		}

		&-premium {
			display: flex;
			height: 100%;
			align-items: center;
			justify-content: space-between;

			& > div {
				width: 40px;
				height: 40px;
				background-repeat: no-repeat;
				background-size: 40px;
				background-position: center;
			}

			$list: 1 2 3 4 5 6;

			@each $i in $list {
				.n#{$i} {
					background-image: url('@icon/AllGames/n#{$i}.png');
				}
			}
		}

		.numList {
			height: 100%;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			& > .numItem {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				border: 1px solid var(--darkLight,var(--text_color_L2));
				text-align: center;
				line-height: 40px;
				font-size: 24px;
				color: var(--darkLight,var(--text_color_L1));
				

				& + .numItem {
					margin-left: 8px;
				}
			}
		}


		.sumBs {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 6px;

			&__ball {
				width: 36px;
				height: 36px;
				border-radius: 50%;
				line-height: 36px;
				text-align: center;
				font-size: 22px;
				color: #fff;

				&.is-big { background: var(--norm_secondary-color); }
				&.is-small { background: var(--norm_bule-color); }
				&.is-odd { background: var(--norm_red-color); }
				&.is-even { background: var(--norm_green-color); }
			}
		}
	}

	&-foot {
		background: var(--darkBg,var(--bg_color_L2));
		color: var(--text_color_L2);
		padding:24px 178px;
		//margin: 24px 0;
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

				.GameRecord__C-icon {
					color: var(--text_color_L3);
				}
			}
			.GameRecord__C-icon {
				color: var(--text_color_L4);
			}
		}
	}
}
</style>
