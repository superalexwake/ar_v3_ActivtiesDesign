<template>
	<div class="vip-content-recordVsrule">
		<NavBar :title="$t('record')" left-arrow @click-left="router.go(-1)" />
		<List :api="GetPageListVipUserRecord" v-model:list="vipLogList" v-model:page-query="pageQuery" ref="listRef">
			<template #content>
				<div class="vip-content-recordVsrule-con">
					<div class="item ar-1px-b" v-for="(item, index) in vipLogList" :key="index">
						<template v-if="item.type == 1 || item.type == 2">
							<div class="item-left">
								<span class="green">{{ getArrayKey(rootConfig.VipType, item.type) }}</span>
								<span>{{ setRemark(item.type, item.remark) }}</span>
								<span>{{ item.createTime }}</span>
							</div>
							<div class="item-right">
								<p><img src="@icon/main/gold.png" />{{ currency(item.awardAmount, ' ', 0) }}</p>
								<p><img src="@icon/main/love.png" />{{ currency(item.bonusPoints, ' ', 0) }}</p>
							</div>
						</template>
						<template v-if="item.type == 3 || item.type == 4">
							<div class="item-left">
								<span class="red">{{ getArrayKey(rootConfig.VipType, item.type) }}</span>
								<span>{{ setRemark(item.type, item.remark) }}</span
								><span>{{ item.createTime }}</span>
							</div>
							<div class="item-right">
								<span></span>
								<span></span>
								<span>{{ item.experience }} EXP</span>
							</div>
						</template>
						<template v-if="item.type == 5">
							<div class="item-left">
								<span class="yellow">{{ getArrayKey(rootConfig.VipType, item.type) }}</span>
								<span>{{ setRemark(item.type, item.remark) }}</span
								><span>{{ item.createTime }}</span>
							</div>
						</template>
						<template v-if="item.type == 6">
							<div class="item-left">
								<span class="blue">{{ getArrayKey(rootConfig.VipType, item.type) }}</span
								><span>{{ setRemark(item.type, item.remark) }}</span
								><span>{{ item.createTime }}</span>
							</div>
							<div class="item-right">
								<span></span>
								<span></span>
								<span class="green">{{ item.experience}} EXP</span>
							</div>
						</template>
						<template v-if="[7,8].includes(item.type)">
							<div class="item-left">
								<span class="yellow">{{ getArrayKey(rootConfig.VipType, item.type) }}</span
								><span>{{ setRemark(item.type, item.remark) }}</span
								><span>{{ item.createTime }}</span>
							</div>
						</template>
					</div>
				</div>
			</template>
		</List>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { rootConfig } from '@/utils/selectArr/rootConfig'
import { getArrayKey, currency } from '@/utils'
import { useRouter } from 'vue-router'
import { GetPageListVipUserRecord } from '@/api'
import List from '@/components/common/ListSimply.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const pageQuery = reactive<any>({
	pageSize: 20
})
const vipLogList = ref<any[]>([])

//翻译remark
function setRemark(type: number, remark: string) {
	switch (type) {
		case 1:
			return t('vipTip12')
		case 2:
			return t('vipTip13')
		case 3:
			return t('vipTip10')
		case 4:
			return t('vipTip11', [remark])
		case 5:
			return t('vipTip6', [remark])
		case 6:
			return t('vipTip7')
		case 7:
			return t('vipTip15', [remark])
		case 8:
			return t('vipTip17', [remark])
	}
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/VIP/vip.scss';

.vip-content-recordVsrule {
	font-family: 'Roboto';
	font-style: normal;
	font-weight: 400;
	font-size: 24px;
	padding: 0 24px;
	margin-top: 24px;
	&-con {
		display: flex;
		flex-direction: column;
		background-color: var(--bg_color_L2);
		border-radius: 14px;

		/**记录 */
		.item {
			display: flex;
			flex-direction: row;
			margin-top: 20px;
			padding-block:10px;
			margin-inline: 30px;
			justify-content: space-between;
			&:last-of-type{
				&::after{
					display:none
				}
			}

			> div {
				display: flex;
				flex-direction: column;
			}

			span.yellow {
				color: var(--norm_secondary-color);
			}

			span.red {
				color: var(--main-color);
			}

			span.blue {
				color: var(--norm_bule-color);
			}

			span.green {
				color: var(--norm_green-color);
			}

			&-left {
				> span {
					margin-bottom: 20px;
					// white-space: nowrap;
					// overflow: hidden;
					// text-overflow: ellipsis;
					&:last-of-type{
						color:var(--text_color_L1) ;
					}
				}

				> span:nth-of-type(1) {
					font-size: 30px;
				}

				> span:nth-of-type(2) {
					color: var(--text_color_L2);
				}
			}

			&-right {
				justify-content: space-around;
				> p {
					background-color: transparent;
					border: 1px solid var(--main-color);
					border-radius: 10px;
					min-width: 150px;
					font-size: 26px;
					padding: 4px 10px;
					align-items: center;
					display: flex;
					color: var(--main-color);
					margin-left: auto;
					text-align: right;

					> img {
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

				> span {
					margin-left: auto;
					text-align: right;
					min-width: 150px;
					&:last-of-type{
						color:var(--text_color_L1) ;
					}
				}
			}
		}
	}
}
</style>
