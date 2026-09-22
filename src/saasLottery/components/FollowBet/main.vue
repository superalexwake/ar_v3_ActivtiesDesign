<script setup lang="ts">
import {onActivated, watch, ref, inject, Ref} from 'vue';
import PageHeader from './PageHeader.vue';
import StrategyCard from './StrategyCard.vue';
import ConfirmPromptPop from "./ConfirmPromptPop.vue";
import {useWinGoStrategy} from "../../hooks";
const {
	strategiesList,
	getStrategiesList,
	getCurrentStrategy,
	currentStrategy,
	getFollowBetAll,
	addStrategy,
	stopStrategy,
	orderNo
} = useWinGoStrategy();
import {useGlobalContext} from '../../hooks'
const {gameCode,updateBalance} = useGlobalContext()

const defineTime = inject<{ countdown:Ref<any>,betScopes:Ref<any> }>('WinHook');
const {countdown,betScopes } = defineTime || {countdown: ref({}),betScopes:ref([]) };

/*倒计时结束后的15秒刷新跟投信息*/
watch(() => countdown.value, (value) => {
	if (orderNo.value && value.total === 0) {
		setTimeout(async () => {
			await getCurrentStrategy(orderNo.value);
		}, 5000);
	}
}, { deep: true });

//监听新增策略操作
const followStrategy = async (item:any) => {
	await addStrategy(item).then(()=>{
		getStrategiesList()
		/*是否存在保证金*/
		if(item.initMarginAmount){
			updateBalance()
		}
	})
	// 滚动到页面顶部或指定位置
	setTimeout(() => {
		window.scrollTo({
			top: 600, // 或者设置为其他固定位置的像素值
			behavior: 'smooth' // 平滑滚动
		})
	}, 300) // 短暂延迟确保DOM更新完成
};

/*停止策略*/
const stopCurrentStrategy = async () => {
	if (!orderNo.value)return;
	const newValue = currentStrategy.value[0]?.initMarginAmount
	await getCurrentStrategy(orderNo.value).then(()=>{
		getStrategiesList();
		if(newValue!==0){
			updateBalance()
		}
	})
};

/*终止跟单*/
const promptPop=ref(false);
const onClickRule = async () => {
	promptPop.value = !promptPop.value;
	if (!orderNo.value)return;
	await stopStrategy(orderNo.value);
	await stopCurrentStrategy();
};

watch(()=>gameCode.value, async ()=>{
	await getFollowBetAll()
})

onActivated(async ()=>{
	await getStrategiesList()
})


</script>
<template>
  <div class="content12">
    <!-- 头部及空状态组件 -->
    <PageHeader
        :title="$t('strategyTitle')"
		:currentStrategy="currentStrategy"
		@stopBet="stopCurrentStrategy"
    />

	  <StrategyCard
		  v-for="(strategy) in strategiesList"
		  :key="`${strategy.id}-${strategy.orderNo}-${strategy.name}`"
		  :strategy="strategy"
		  :defineAmount="betScopes[1]"
		  :minAmount="betScopes[0]"
		  :orderNo="orderNo"
		  @follow="followStrategy"
		  @cancelBet="promptPop=true"
	  />

	<!--跟单更换确认弹框-->
	<ConfirmPromptPop
		:show="promptPop"
		:title="$t('promptT')"
		@cancel="promptPop=false"
		@confirm="onClickRule"
	/>
  </div>
</template>
<style scoped lang="scss">
.content12 {
  padding: 32px 20px;
  background: var(--bg_color_L2);
  border-radius: 14px;
	min-height: 300px;
}
</style>