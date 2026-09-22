import { onMounted, reactive, ref } from 'vue'
import { GetGameCategoryList, getAllGameList } from '@/api'
import { AwaitApiResult } from '@/utils'

export function useGames() {
	const gameData = reactive({
		Original: [],
		HotGames: [],
		Lottery: [],
		Slot: [],
		Casino: [],
		Chess:[],
		Fish:[],
		Sport:[]
	})
	const gameTypeList = ref([]);
	const fetchData = async () => {
		try {
			const { data } = await AwaitApiResult(getAllGameList())
			if (data) {
				gameData.Original = data.flash
				gameData.HotGames = data.popular.platformList
				gameData.Lottery = data.lottery
				gameData.Casino = data.video
				gameData.Slot = data.slot
				gameData.Chess=data.chess
				gameData.Fish = data.fish
				gameData.Sport=data.sport
			}
		} catch (err) {
			console.log('Error fetching Data', err)
		}
	}
	const getGameTypeList = async () => {
		const res = await AwaitApiResult<any>(GetGameCategoryList())
		if (res) {
			gameTypeList.value = res.data;
		}
	}
	onMounted(() => {
		fetchData()
		getGameTypeList()
	})
	return {
		gameData,
		gameTypeList
	}
}

