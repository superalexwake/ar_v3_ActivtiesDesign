import { ref } from 'vue'
import { GetTreasureChestPopupItems, OpenTreasureChest} from "@/api";
import { AwaitApiResult } from "@/utils";
import { useGlobalDialog } from './useGlobalDialog.hook'

const treasureChestList = ref<any[]>([]);
const currentChest = ref<any>(null);
const rewardAmount = ref<number>(0);

export const resetTreasureChestState = () => {
	treasureChestList.value = [];
	currentChest.value = null;
	rewardAmount.value = 0;
};

export const useTreasureChest = () => {
    const { store } = useGlobalDialog();

	// 获取宝箱列表
	const fetchTreasureChestList = async () => {
		const result = await AwaitApiResult(GetTreasureChestPopupItems());
		if (result && Array.isArray(result.data) && result.data.length > 0) {
			// 如果数组里面isshow=0的不要显示
			treasureChestList.value = result.data.filter((item: any) => item.isShow === 1);
			showNextChest();
		}
	};
	const showNextChest = () => {
		if (treasureChestList.value.length > 0) {
			currentChest.value = treasureChestList.value[0];
			store.isShowTreasureChest = true;
		} else {
			currentChest.value = null;
			store.isShowTreasureChest = false;
		}
	};

	// 打开宝箱
    const openChest = async () => {
		await AwaitApiResult(OpenTreasureChest({
			rewardConfigId: currentChest.value.rewardConfigId,
			taskType: currentChest.value.taskType
		}));
		rewardAmount.value = currentChest.value.rewardAmount;
		return { success: true, data: { amount: rewardAmount.value } };
	};

	// 关闭当前宝箱，显示下一个
	const closeCurrentChest = () => {
		treasureChestList.value.shift();
		rewardAmount.value = 0;
		showNextChest();
	};

	const initTreasureChest = async() => {
		// const isShowResult = await AwaitApiResult(IsShowTreasureChestPopup());
		// if (!isShowResult || isShowResult.data !== 1) {
		// 	return;
		// }
		if (treasureChestList.value.length > 0) {
			return;
		}
		await fetchTreasureChestList();
	};

	return {
		treasureChestList,
		currentChest,
		rewardAmount,
		openChest,
		closeCurrentChest,
		initTreasureChest
	};
};
