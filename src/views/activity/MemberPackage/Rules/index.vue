<template>
	<NavBar :title="$t('eventDetails')" left-arrow @click-left="router.go(-1)" />
	<div class="member-package-rule">
		<div class="first-list-item" v-if="store.firstDepositConfig">
			<div class="head">
				<div class="title">
					{{ $t('newMenberRule') }}
				</div>
			</div>
			<div class="description">
				{{ $t('activityTime') }}<span>{{ time }}</span
				>，{{ $t('newMemberDeposit') }}<span class="number">{{firstDepositTimeLiness}}</span>{{ $t('newMemberDepositTime') }}
				<span v-html="$t('platformBonus', [firstDeposiSendBonust])"></span>，{{ $t('bonusLimit')
				}} <span class="number">{{ currency(bonusLimit) }}</span
				>，{{ $t('receiveTips') }}.
			</div>
		</div>
		<div class="member-package-rule-bonus">
			<div class="member-package-rule-bonus-title">
				{{ $t('newMemberPlayGame') }}
			</div>
			<div>
				<RulesTable :giftPackConfigList="giftPackConfigList" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { usePackage } from '@/hooks'
import { currency } from '@/utils'
import RulesTable from '@/components/common/RulesTable.vue'

const { t: $t } = useI18n()
const router = useRouter()
const { getConfig,store, time,firstDepositTimeLiness,bonusLimit, firstDeposiSendBonust, giftPackConfigList } = usePackage()
onMounted(() => {
	getConfig()
})
</script>

<style lang="scss" scoped>
.first_list {
	padding: 24px;
}

.member-package-rule {
	padding: 24px;

	:deep(.number) {
		color: var(--norm_red-color);
	}

	.first-list-item {
		padding: 20px;
		border-radius: 20px;
		background: var(--bg_color_L2);

		&.space {
			margin-top: 0.3rem;

			.head {
				justify-content: start !important;

				.title {
					color: var(--norm_red-color);
				}
			}
		}

		.head {
			display: flex;
			justify-content: center;
			margin-bottom: 14px;

			.title {
				color: var(--norm_red-color);
				font-size: 30px;
				line-height: 36px;
			}
		}

		.description {
			font-size: 22px;
			color: var(--text_color_L2);
			margin-bottom: 20px;

			.number {
				color: var(--norm_red-color);
			}
		}
	}

	&-bonus {
		.table-head {
			padding-top: 0.5rem;	
			
		}
		

		&-title {
			display: flex;
			justify-content: center;
			color: var(--norm_red-color);
			font-size: 30px;
			line-height: 36px;
			margin-top: 0.5rem;
			
		}
	}
}
</style>
