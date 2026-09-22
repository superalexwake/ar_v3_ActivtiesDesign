<template>
	<div class="chooseBank__container">
		<div class="search">
			<van-icon name="search" size="35" />
			<input :placeholder="$t('phSearchBank')" v-model.trim="bankName" />
		</div>

		<div class="chooseBank__container-content">
			<div class="chooseBank__container-content-items">
				<div class="ar-1px-b">{{ $t('selectBank') }}</div>
				<div
					v-for="item in fillist"
					:key="item.bankID"
					class="chooseBank__container-content-items__item ar-1px-b"
					@click="onSelectItem(item)"
				>
					<div class="chooseBank__container-content-items__title">
						<img :src="item.bankLogo" alt="" />
						<span>{{ item.bankName }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue'
import { AwaitApiResult } from '@/utils'
import { GetBankList } from '@/api'
import type { ResBankList } from '@/types/api'

const bankName = ref('')
let originalBankList = reactive<ResBankList[]>([])
let fillist = ref<any>([])

const emits = defineEmits<{
	(e: 'onSelectItem', item: any): void
}>()

function onSelectItem(item: any) {
	emits('onSelectItem', item)
}

const props = defineProps<{
	bankList: Array<ResBankList>
}>()

async function getBankList() {
	console.log('----------->', Array.isArray(props.bankList))
	if (Array.isArray(props.bankList) && props.bankList.length > 0) {
		originalBankList = props.bankList
		fillist.value = originalBankList
		return
	}
	const res = await AwaitApiResult(
		GetBankList({
			withdrawid: 1
		})
	)
	if (res) {
		originalBankList = res.data.banklist
		fillist.value = originalBankList
	}
}

watch(bankName, () => {
	//模糊搜索
	if (originalBankList.length > 0) {
		fillist.value = originalBankList.filter((p) => {
			return p.bankName.toLowerCase().indexOf(bankName.value.toLowerCase()) !== -1
		})
	}
})

onMounted(() => {
	getBankList()
})
</script>
<style lang="scss" scoped>
.chooseBank__container {
	padding-inline: 24px;
	padding-block: 0 30px;
	padding-top: 10px;

	@mixin flex {
		display: flex;
		align-items: center;
	}

	.search {
		z-index: 100;
		height: 80px;
		width: 88%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		top: 90px;
		left: 50%;
		transform: translateX(-50%);
		max-width: 750px;
		padding: 0 24px;
		border-radius: 10px;
		background: var( --bgDark-2,var(--bg_color_L2));

		:deep(.van-icon) {
			font-weight: bold;
			color: var(--main-color);
		}

		input {
			border: none;
			width: calc(100% - 60px);
			font-size: 28px;
			background: var(--bg_color_L2);

			&::placeholder {
				color: var(--text_color_L3);
			}

			&:focus {
				outline: none;
				user-select: text;
			}
		}
	}

	&-content {
		margin-top: 90px;
		background: var(--darkBg,var(--bg_color_L2));
		border-radius: 10px;
		padding: 10px 30px;

		&-items {
			display: flex;
			flex-direction: column;
			color: var(--text_color_L2);
			padding-bottom: 20px;

			> div:first-of-type {
				font-weight: 400;
				font-size: 28px;
				padding: 10px 0;
				margin-bottom: 40px;
			}

			&__item {
				@include flex;
				justify-content: space-between;
				font-size: 28px;
				font-weight: 500;
				padding: 30px 0;

				img {
					width: 48px;
					height: auto;
					margin: 0 18px 0 0;
				}
			}

			&__title {
				@include flex;
				justify-content: flex-start;
			}
		}
	}
}
</style>
