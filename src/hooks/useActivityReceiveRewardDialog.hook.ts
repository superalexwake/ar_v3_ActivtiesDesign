import { createDialogQueueItem } from '@/components/DialogQueue/registry'
import { useDialogQueue } from '@/components/DialogQueue/useDialogQueue'
import { ACTIVITY_RECEIVE_REWARD_DIALOG_KEY } from './dialogKeys'

export interface ActivityReceiveRewardDialogProps extends Record<string, unknown> {
	/** 领取成功后展示的奖励金额，交由弹窗按当前站点货币格式渲染。 */
	amount: number | string
}

/** 创建活动领奖成功队列项。 */
const createActivityReceiveRewardDialog = (amount: number | string) => {
	return createDialogQueueItem<ActivityReceiveRewardDialogProps>(ACTIVITY_RECEIVE_REWARD_DIALOG_KEY, {
		props: { amount },
	})
}

/** 活动领奖成功弹窗入口。 */
export const useActivityReceiveRewardDialog = () => {
	const queue = useDialogQueue()

	/** 打开活动领奖成功弹窗。 */
	const openActivityReceiveRewardDialog = async (amount: number | string): Promise<boolean> => {
		const item = createActivityReceiveRewardDialog(amount)
		if (!item) return false
		return queue.push(item)
	}

	return {
		openActivityReceiveRewardDialog,
	}
}
