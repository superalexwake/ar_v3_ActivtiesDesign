<template>
	<div class="vip-content-weal">
		<transition mode="out-in">
			<div class="slide" :key="level">
				<div class="vip-content-weal-head ar-1px-b" v-if="vipLevelList.length">
					<svg-icon name="diamond" />
					<h1>VIP{{ showLevel }} {{ $t("wealTXT1") }}</h1>
				</div>
				<div :class="`${showBox(item)?'isShow':'vip-content-weal-con'}`" :key="index" v-for="(item, index) in vipLevelList">
					<div>
						<img :src="getVipWealIcon(item.id)" />
					</div>
					<div>
						<h2 v-if="item.id != 3">{{ $t(`wealName${item.id}`) }}</h2>
						<h2 v-else>{{ $t(`wealName${item.id}_1`) }}</h2>
						<span>{{ $t(`wealDescription${item.id}`) }}</span>
					</div>
					<div v-if="item.id == 1 || item.id == 2">
						<p>
							<img src="@icon/main/gold.png" />{{ currency(item.balance, " ", 0) }}
						</p>
						<p>
							<svg-icon name="love" />{{ currency(item.integral, " ", 0) }}
						</p>
					</div>
					<div v-else>
						<p class="max">
							<svg-icon :name="`weal${item.id}`" />{{ item.rate }}%
						</p>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script setup lang="ts">
import { AwaitApiResult, currency } from "@/utils";
import { getVipWealIcon } from "@/utils/assetIcons";
import { ref, computed } from "vue";
import { GetListVipLevel } from "@/api";
import type { ResGetListVipLevel } from "@/types/api";
import { useCommonStore } from "@/stores";

const { setLoading } = useCommonStore();
const level = ref(0);
const showLevel = computed(() => {
	return level.value == 0 ? 1 : level.value;
});
const vipLevelList = ref<ResGetListVipLevel[]>([]);
async function getListVipLevel(levelG: number) {
	setLoading(true);
	const res = await AwaitApiResult(
		GetListVipLevel({ vipLevel: levelG == 0 ? 1 : levelG })
	);
	if (res) {
		vipLevelList.value = res.data.filter((item: any) => {
			return (item.id > 2 && item.rate > 0) || item.id <= 2;
		});
	}
	setLoading(false);
}

const showBox=(item:any)=>{
	const validIds = [1, 2];
	return validIds.includes(item.id) && item.balance === 0 && item.integral === 0
}

defineExpose({
	getListVipLevel,
	level,
});
</script>
<style lang="scss" scoped>
@import "@/assets/styles/VIP/vip.scss";


.isShow{
	display: none;
}

.vip-content-weal {
	@include bg;
	padding: 30px 10px;
	overflow: hidden;
	min-height: 380px;
	&-head {
		@include fr;

		img, .svg-icon {
			width: 48px;
			height: 48px;
			margin-right: 10px;
		}

		h1 {
			width: 87%;
			color: var(--text_color_L1);
			font-weight: 600;
			font-size: 32px;
			padding-bottom: 20px;
		}
	}

	/* 进入之前和离开后的样式 */
	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}
	/* 离开和进入过程中的样式 */
	.v-enter-active,
	.v-leave-active {
		/* 添加过渡动画 */
		transition: opacity 0.5s ease;
	}
	/* 进入之后和离开之前的样式 */
	.v-enter-to,
	.v-leave-from {
		opacity: 1;
	}

	&-con {
		margin-top: 30px;
		@include fr;
		justify-content: space-between;

		> div:nth-of-type(1) {
			width: 100px;
			margin-right: 10px;
			display: flex;
			align-items: center;
			justify-content: center;

			> img {
				width: 100px;
				height: 100px;
			}
		}

		> div:nth-of-type(2) {
			width: 100%;
			@include fc;
			justify-content: space-around;

			> h2 {
				color: var(--text_color_L1);
				font-size: 30px;
			}

			> span {
				color: var(--text_color_L2);
			}
		}

		> div:nth-of-type(3) {
			@include fc;
			justify-content: center;

			> p {
				background-color: transparent;
				border: 1px solid var(--main-color);
				border-radius: 10px;
				min-width: 150px;
				height: 40px;
				line-height: 40px;
				font-size: 26px;
				padding: 2px 10px;
				align-items: center;
				display: flex;
				justify-content: center;
				color: var(--main-color);

				> img,.svg-icon {
					width: 30px;
					height: 30px;
					margin-right: 10px;
				}
			}

			> p:nth-of-type(1) {
				color: var(--norm_secondary-color);
				margin-top: 5px;
				margin-bottom: 10px;
				border-color: var(--norm_secondary-color);
			}
			> p.max {
				min-height: 60px;
				color: var(--main-color);
				background-color: transparent;
				border: 1px solid var(--main-color);
				> img,.svg-icon {
					width: 30px;
					height: 30px;
					margin-right: 10px;
					object-fit: contain;
				}
			}
		}
	}
}
</style>
