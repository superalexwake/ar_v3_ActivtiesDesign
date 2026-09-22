import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSiteMessageList } from '@/api'
import type { MessageDataList } from '@/types'
import { useRouter } from 'vue-router'

const store = reactive<{ list: MessageDataList[]; timer: NodeJS.Timer | number }>({
	list: [],
	timer: -1
})
export function useNotice() {
	const router = useRouter()
	const noticeList = computed(() => store.list)
	const goNotice = () => router.push({ name: 'Messages', query: { tab: 'site' } })
	const clearTimer = () => {
		clearInterval(store.timer)
	}
	const startTimer = () => {
		clearTimer()
		store.timer = setInterval(() => {
			store.list.push(store.list.shift() as MessageDataList)
		}, 7000)
	}
	const getNotice = async () => {
		try {
			const { data } = await getSiteMessageList({ pageNo: 1, pageSize: 5 })
			store.list = data.list || []
			if (store.list.length) {
				startTimer()
			}
		} catch (e) {
			console.log(e)
		}
	}

	// 公告内容由后端按语言返回，切换语言后需重新拉取
	watch(useI18n().locale, getNotice)

	return {
		noticeList,
		startTimer,
		getNotice,
		clearTimer,
		goNotice
	}
}
