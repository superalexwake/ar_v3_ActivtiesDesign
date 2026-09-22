<template>
	<div class="TeamReportDetail__C">
		<NavBar :title="$t('details')" left-arrow @click-left="onClick" />
		<div class="TeamReportDetail__C-head">
			<div class="TeamReportDetail__C-head-top">
				{{ reportDetail.name }}
				<span>8729837</span>
			</div>
			<div class="TeamReportDetail__C-head-detail">
				<div class="TeamReportDetail__C-head-detail-lv">
					{{ $t('friendsGrade') }}<span>{{ reportDetail.level }}</span>
				</div>
				<div class="TeamReportDetail__C-head-detail-commission">
					{{ $t('commissionAmount') }}<span>{{ currency(reportDetail.commission) }}</span>
				</div>
				<div class="TeamReportDetail__C-head-detail-time">
					{{ $t('time') }}<span>{{ reportDetail.time }}</span>
				</div>
			</div>
		</div>
		<div class="TeamReportDetail__C-img"></div>
		<div class="TeamReportDetail__C-detail">
			<div v-for="(item, index) in reportDetail.list" :key="index" class="TeamReportDetail__C-detail-item">
				{{ item.name }}
				<span>{{ currency(item.money) }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currency } from '@/utils'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $route = useRoute()
const router = useRouter()

console.log('routes', router.options.routes[41].meta)

const reportDetail = ref({
	name: 'ace***@gmail.com',
	level: 1,
	commission: 100000,
	time: '2022-05-87',
	list: [
		{ name: t('commissionLottery'), money: 88888.88 },
		{ name: t('commissionElectric'), money: 88888.88 },
		{ name: t('commissionLive'), money: 88888.88 }
	]
})

const onClick = () => {
	router.go(-1)
}
onMounted(() => {
	console.log($route.query.id)
})
</script>

<style lang="scss" scoped>
.TeamReportDetail__C {
	padding: 0 24px;

	&-head {
		border-radius: 10px 10px 0 0;
		background-color: #fff;
		height: 260px;
		padding: 0 20px;

		&-top {
			height: 80px;
			border-bottom: 1px solid #d6d6d6;
			display: flex;
			font-size: 28px;
			justify-content: space-between;
			align-items: center;
			color: #333333;

			&-btn {
				width: 225px;
				height: 42px;
				line-height: 42px;
				border: 1px solid #f95959;
				border-radius: 20px;
				font-size: 24px;
				color: #f95959;
				text-align: center;
			}
		}

		&-detail {
			padding: 22px 0;
			color: 666;
			font-size: 26px;
			color: #666;

			& > div {
				height: 30px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				& + div {
					margin-top: 22px;
				}
			}

			&-time {
				span {
					font-size: 24px;
					color: #aeb0c6;
				}
			}

			&-commission {
				span {
					color: #ff7f22;
				}
			}
		}
	}

	&-img {
		height: 42px;
		width: 100%;
		background-image: url('@/assets/icons/main/moonBar.png');
		background-repeat: no-repeat;
		background-size: cover;
	}

	&-detail {
		border-radius: 0 0 10px 10px;
		background-color: #fff;
		height: 280px;
		padding: 30px 24px;

		&-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 28px;
			font-size: 26px;
			color: #7e829f;
			padding-left: 36px;
			background-image: url('@icon/promotion/roundIcon.png');
			background-size: 20px;
			background-position: left center;
			background-repeat: no-repeat;
			position: relative;

			&:last-child {
				&::before {
					content: normal;
				}
			}

			&::before {
				content: '';
				position: absolute;
				display: block;
				height: calc(100% + 30px);
				width: 0;
				border-left: 1px dashed #ff7172;
				left: 8px;
				top: 50%;
			}

			& + div {
				margin-top: 30px;
			}

			span {
				color: #333333;
			}
		}
	}
}
</style>