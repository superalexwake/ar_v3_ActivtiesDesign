<template>
	<div class="p5tg-terms">
		<div class="p5tg-terms__icons">
			<div class="p5tg-terms__icons-item">
				<div class="p5tg-terms__icons-plus18">+18</div>
			</div>
			<div
				class="p5tg-terms__icons-item"
				v-for="(item, index) in contactList.slice(0, 2)"
				:key="index"
				@click="onItemClick(item.typeID)"
			>
				<img v-lazy="getCsTypeIcon(item.typeID)" alt="" />
			</div>
		</div>

		<div class="p5tg-terms__divider"></div>

		<div class="p5tg-terms__rules">
			<p class="p5tg-terms__rules-item">
				<i></i>
				<span>{{ t('damanRule', [store.getProjectName]) }}</span>
			</p>
			<p class="p5tg-terms__rules-item">
				<i></i>
				<span>{{ t('damanRule2', [store.getProjectName]) }}</span>
			</p>
			<p class="p5tg-terms__rules-item">
				<i></i>
				<span>{{ t('damanRule3', [store.getProjectName]) }}</span>
			</p>
			<p class="p5tg-terms__warning">{{ t('damanWarn') }}</p>
			<p class="p5tg-terms__warning">{{ t('damanWarn2', [store.getProjectName]) }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { AwaitApiResult } from '@/utils'
import { useRouter } from 'vue-router'
import { GetCustomerServiceTypelist } from '@/api'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SettingStore } from '@/stores'
import csType1 from '@icon/main/CStype1.png'
import csType2 from '@icon/main/CStype2.png'
import csType3 from '@icon/main/CStype3.png'
import csType4 from '@icon/main/CStype4.png'
import csType5 from '@icon/main/CStype5.png'
import csType6 from '@icon/main/CStype6.png'
import csType7 from '@icon/main/CStype7.png'

const csTypeIconMap: Record<string | number, string> = {
	1: csType1, 2: csType2, 3: csType3, 4: csType4,
	5: csType5, 6: csType6, 7: csType7
}
const getCsTypeIcon = (typeID?: string | number): string =>
	typeID == null ? '' : csTypeIconMap[typeID] ?? ''

const { t } = useI18n()
const router = useRouter()
const store = SettingStore()

const contactList = ref<any>([])

function onItemClick(itemId: any) {
	router.push({
		name: 'CustomerService-ServiceCollection',
		state: { itemId }
	})
}

const getList = async () => {
	const res = await AwaitApiResult(GetCustomerServiceTypelist())
	if (res) {
		contactList.value = res.data || []
	}
}

onMounted(() => {
	getList()
})
</script>

<style lang="scss" scoped>
.p5tg-terms {
	&__icons {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24px 0 20px 0;
	}

	&__icons-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80px;

		img {
			width: 70px;
			height: 70px;
			object-fit: contain;
		}
	}

	&__icons-plus18 {
		width: 70px;
		height: 70px;
		border-radius: 50%;
		background: var(--main-color);
		color: #fff;
		font-size: 26px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__divider {
		height: 2px;
		background: var(--Dividing-line_color);
		margin-bottom: 24px;
	}

	&__rules {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__rules-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;

		i {
			display: inline-block;
			width: 8px;
			height: 8px;
			background: var(--main-color);
			border-radius: 1px;
			transform: rotate(45deg);
			flex-shrink: 0;
			margin-top: 12px;
		}

		span {
			font-size: 24px;
			color: var(--text_color_L1);
			line-height: 1.5;
		}
	}

	&__warning {
		font-size: 24px;
		color: var(--main-color);
		padding-left: 28px;
	}
}
</style>
