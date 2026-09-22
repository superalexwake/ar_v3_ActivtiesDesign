<template>
	<div class="Trend__C">
		<div class="Trend__C-head">
			<van-row>
				<van-col span="9">{{ $t('trendNumber') }}</van-col>
				<van-col span="5">{{ $t('trendResult') }}</van-col>
				<van-col span="10">{{ $t('trendNum') }}</van-col>
			</van-row>
		</div>
		<div class="Trend__C-body">
			<template v-if="emerdList.length">
				<van-row v-for="(item, index) in emerdList" :key="index">
					<van-col span="10">{{ item.issueNumber }}</van-col>
					<van-col span="5">
						<div class="Trend__C-body-premium">
							<div v-for="(num, index) in item.premium" :key="index" :class="'number' + num"></div>
						</div>
					</van-col>
					<van-col span="9">
						<div class="Trend__C-body-gameText">
							<span>{{ checkNumberType(item.premium) }}</span>
						</div>
					</van-col>
				</van-row>
			</template>
			<div v-else class="Trend__C-body-empty">
				<Empty />
			</div>
		</div>
		<div v-if="emerdList.length" class="Trend__C-foot">
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
import { ref, watch, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {GetHistoryIssuePageRsp, getLotteryHistoryIssue} from '@/saasLottery/api'
import {useGlobalContext} from "@/saasLottery/hooks";
import { useK3Context} from "../../hooks";
import Empty from '@/components/Empty/index.vue'
// 后台有优化需求 第一页取oss 第二页取接口
const {gameCode}=useGlobalContext();
const {t}=useI18n();
const {historyIssues,historyIssuesTotalPage}=useK3Context()
const NoaverageEmerdList = ref<GetHistoryIssuePageRsp[]>([]);
const loading=ref(false)
const emerdList=computed(()=>NoaverageEmerdList.value.length?NoaverageEmerdList.value:historyIssues.value)
const totalPage = ref(historyIssuesTotalPage.value);
const pageSize = ref(10);
const pageNo = ref(1);
// 上一页
const pPage = () => {
  if (pageNo.value<2) {
    return
  };
  pageNo.value--;
  getData();
};

// 下一页
const nPage = () => {
  pageNo.value++;
  if (pageNo.value>totalPage.value) return;
  getData();
};
//获取记录
const getData = async () => {
  try {
    loading.value=true;
    const {result,data,}=await getLotteryHistoryIssue({
      gameCode:gameCode.value,
      pageNo:pageNo.value,
      pageSize:pageSize.value,
    });
    if (result){
      NoaverageEmerdList.value=data.list||[];
      pageNo.value=data.pageNo||1;
      totalPage.value=data.totalPage||0
    }
  }catch (e){

  }finally {
    loading.value=false;
  }
};

watch(historyIssues,()=>{
  NoaverageEmerdList.value=[];
  pageNo.value=1;
});
watch(historyIssuesTotalPage,()=>{
  totalPage.value=historyIssuesTotalPage.value;
})
function checkNumberType(num:string) {
  const digits = `${num}`.split('').map(Number);
  if (digits[0] === digits[1] && digits[1] === digits[2]) {
    return t('trendTXT4');
  }
  if ((digits[0] === digits[1] && digits[1] !== digits[2]) ||
      (digits[1] === digits[2] && digits[0] !== digits[1]) ||
      (digits[0] === digits[2] && digits[0] !== digits[1])) {
    return t('trendTXT3');
  }

  const sortedDigits = [...digits].sort((a, b) => a - b);
  if (sortedDigits[1] === sortedDigits[0] + 1 && sortedDigits[2] === sortedDigits[1] + 1) {
    return t('betPopDesc7');
  }
  return t('trendTXT1');
}

</script>
<style lang="scss" scoped>
.Trend__C {
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
    .van-col{
      text-align: center;
    }
	// &::after{
	// 		content: '';
	// 		background: #E5E5E5;
	// 		transform: scale(.5);
	// 		width: calc(200% - 40px);
	// 		height: 1px;
	// 		position: absolute;
	// 		bottom: 0;
	// 		left: calc(-50% + 20px);
	// 		right: 0;
	// 	}
	}

	&-body {
		line-height: 80px;
		background: var(--darkBg, var(--bg_color_L2));
		&-empty {
			height: 400px;
		}
    .van-col{
      text-align: center;
    }
		&-empty {
			height: 400px;
		}

		& > div {
			color: var(--darkTextW, var(--text_color_L1));
			text-align: left;
			position: relative;
		}

		&-premium {
			display: flex;
			height: 100%;
			align-items: center;
			justify-content: space-between;
			padding: 0 8px;

			& > div {
				width: 36px;
				height: 36px;
				background-repeat: no-repeat;
				background-size: 36px;
				background-position: center;
			}

		}

		&-gameText {
			font-size: 24px;
			color: var(--darkTextW, var(--text_color_L1));
			font-weight: 400;
			// display: flex;
			// align-items: center;
			// justify-content: center;
			// height: 100%;
			// line-height: 1;
			// width: 100%;
			// word-break: break-all;
		}
	}

	&-foot {
		height: 140px;
		background: var(--bg_color_L2);
		padding: 35px 178px;
		margin-top: 36px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--text_color_L1);
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
					color: var(--saveTextColor-7);
				}
			}

			.Trend__C-icon {
				color: var(--text_color_L4);
			}
		}
	}
}
</style>
