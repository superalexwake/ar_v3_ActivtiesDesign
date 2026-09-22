<template>
  <div class="betting-strategy">
    <div class="page-header">
      <div class="title-container">
        <h1 class="title">{{ title }}</h1>
        <van-icon name="question-o" class="info-icon" @click="onClickRule" />
      </div>
      <div class="history-btn" @click="onClickOverlay">
        <van-icon name="clock-o" class="history-icon" />
        <span>{{$t('strategyHistory')}}</span>
      </div>
    </div>

	  <!-- 加载中提示组件 -->
	  <div class="flex-center" style="height:215px" v-if="isLoading">
		  <van-loading type="spinner" color="#FD565C"  />
	  </div>
	  <!-- 空状态提示组件 -->
	  <EmptyState v-else-if="isEmpty" />
	  <!--当前跟投的信息-->
	  <BetStrategy v-else :info="currentStrategy[0] as Object"  @prohibit="handleStop" />
  </div>

  <!--历史记录弹框 -->
  <FollowBetPop
      :show="showPop"
      :title="$t('hstrage')"
      @close="showPop=false"
      @PaginatChange="handePageChange"
      :totalCount="totalCount"
      :totalPage="totalPage"
      :pageNo="pageNo"
      :isClose="true"
      :isPagina="true"
  >
	  <div class="flex-center" style="height: 200px" v-if="loading">
		  <van-loading type="spinner" color="#FD565C" />
	  </div>
	  <History :list="historyStrategiesList" v-else />
  </FollowBetPop>

  <!--跟单规则-->
  <FollowBetPop
      :show="rulePop"
      :title="followRule.content1"
      @close="rulePop=false"
      :isClose="true"
  >
	  <div class="flex-center" style="height: 100%" v-if="!followRule.content2">
		  <van-loading type="spinner" color="#FD565C" />
	  </div>
    <div v-else v-html="followRule.content2"></div>
  </FollowBetPop>
</template>

<script setup lang="ts">
import {ref, watch,PropType,onMounted,computed} from 'vue';
import {Icon as VanIcon} from 'vant';
import EmptyState from "./EmptyState.vue";
import History from "./History.vue";
import BetStrategy from "./BetStrategy.vue";
import FollowBetPop from "./FollowBetPop.vue";
import {useWinGoStrategy} from "../../hooks";
const { totalCount,pageNo,totalPage,getHistoryStrategiesList,historyStrategiesList,getFollowBetRule,followRule} = useWinGoStrategy();
const props =  defineProps({
  title: {
    type: String,
    required: true
  },
  currentStrategy:{
	  type: Array as PropType<any[]>,
	  required: true
  }
});
const emit= defineEmits(['stopBet']);
const defalutPage = ref<Number>(pageNo.value);
const handePageChange=(item:Number)=>{
  defalutPage.value=item
}

const isLoading = ref(true);
const isEmpty = computed(() => {
	return !isLoading.value&&(props.currentStrategy?.length === 0 || props.currentStrategy[0]?.state === 0);
});

watch(() => props.currentStrategy, () => {
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
	}, 100); // Reduced timeout for better UX
}, { immediate: true });

onMounted(() => {
	setTimeout(() => {
		isLoading.value = false;
	}, 200);
});


/*监听历史记录这个加个loading*/
const loading = ref(true)
watch(()=>defalutPage.value,()=>{
	getHistoryStrategiesList({pageSize: 10,pageNo: defalutPage.value as number})
})

/*点击停止跟投信息*/
const handleStop=async ()=>{
	/*回调取新的跟新跟投信息接口*/
	await getHistoryStrategiesList({pageSize: 10,pageNo: 1})
	emit('stopBet')
}

/*历史记录*/
const showPop=ref(false);
const onClickOverlay = () => {
	showPop.value = true;
	getHistoryStrategiesList({pageSize: 10,pageNo: 1})
	// setTimeout(()=>{
	// 	loading.value=false
	// },1000)
};
watch(()=>historyStrategiesList.value,()=>{
  if(historyStrategiesList.value){
    loading.value=false
  }
})

/*跟单规则*/
const rulePop=ref(false);
const onClickRule = () => {
	getFollowBetRule()
  	rulePop.value = !rulePop.value;
};
</script>

<style lang="scss" scoped>
.betting-strategy {
  background: var(--bg_color_L3, #F6F6F6);
  //min-height: 100vh;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-radius: 16px;
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: var(--bg_color_L3, #F6F6F6);
    border-bottom: 1px solid var(--Dividing-line_color);
    border-radius: 14px 14px 0 0;
    .title-container {
      display: flex;
      align-items: center;

      .title {
        font-size: 28px;
        font-weight: 600;
        color: var(--text_color_L1, #1E2637);
        margin: 0 6px 0 0;
      }

      .info-icon {
        color: #999;
        font-size: 32px;
      }
    }

    .history-btn {
      display: flex;
      align-items: center;
      background: rgba(6, 179, 106, 0.16);
      padding: 6px 12px;
      border-radius: 20px;
      color: var(--main_green-color, #06B36A);
	  //background: rgba(253, 86, 92, 0.16);
	  //color: var(--main-color);
      font-size: 24px;

      .history-icon {
        margin-right: 4px;
        font-size: 32px;
      }
    }
  }
}

</style>