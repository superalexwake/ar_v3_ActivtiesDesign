<template>
	<div class="treasure__container__treasure-item">
		<div class="treasure__container__treasure-item__header">
			<div
				:style="{
					background: getStatusBackground(item.status, 2)
				}"
				class="treasure-state"
			>
				<span
					:style="{
						background: getStatusBackground(item.status, 1)
					}"
					>{{ getStatus(item.status) }}</span
				>
			</div>
			<img v-lazy="images[0]" />
		</div>
		<div class="treasure__container__treasure-item__footer">
			<h1 class="treasure__container__treasure-item__footer-title">
				{{ item.name }}
			</h1>

			<div class="treasure__container__treasure-item__footer-progressTitle">
				<span> {{ $t('progress') }} </span>
				<span> {{ $t('totalActivity') }} </span>
			</div>

			<van-progress stroke-width="8px" color="#DD9138" :percentage="progress(item.redeemedNumber,item.totalNumber)" :show-pivot="false" />

			<div class="treasure__container__treasure-item__footer-progressDetails">
				<span>{{ progress(item.redeemedNumber,item.totalNumber).toFixed(2) }}%</span>
				<div><span>{{item.totalNumber}}</span>{{ $t('sheets') }}</div>
			</div>

			<div class="treasure__container__treasure-item__footer-ending">
				<span> {{ $t('requiredBeforeEnd') }} </span>
				<div>
					<span> {{item.totalNumber-item.redeemedNumber}} </span>
					{{ $t('sheets') }}
				</div>
			</div>

			<div class="treasure__container__treasure-item__footer-cost">
				<span> {{ $t('priceOfUnits') }} </span>
				<div>
          <svg-icon name="point" />
					{{item.unit}}.00
				</div>
			</div>

			<div class="treasure__container__treasure-item__footer-button" @click="onClickDetail">
				{{ $t('viewDetail') }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useActivityStore} from '@/stores'
import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {PointItem} from "@/types/api";

const { t } = useI18n()

const router = useRouter()
const activityStore = useActivityStore()

const props = withDefaults(
	defineProps<{
		item: PointItem,
	}>(),
	{}
)

const activeTab = ref(0)
const images=computed(()=>[
	props.item.img_Five,
	props.item.img_Four,
	props.item.img_One,
	props.item.img_Three,
	props.item.img_Two,
].filter(Boolean))

const progress=(num1:number,num2:number)=>{
	if (num1==0&&num2==0)return 100
	return ((num1 / num2 )*100) ;
}
function getStatusBackground(isOngoing: string, type: number) {
	if (type === 1) {
		switch (isOngoing) {
			case '2':
				return 'linear-gradient(270deg, #40C693 18.36%, #45BA8D 89.84%, #59E2AE 96.48%, #23976C 100%)'
			case '1':
				return 'linear-gradient(270deg, #FF5353 27.64%, #FF4141 91%, #FF9495 96.88%, #EB2426 100%)'
			case '0':
				return 'linear-gradient(270deg, #9FAAD2 18.36%, #A3B0DE 89.84%, #D5E1FF 96.48%, #7884B0 100%)'
		}
	} else {
		switch (isOngoing) {
			case '1':
				return 'linear-gradient(90deg, #FF9C3A -3.24%, #FFE55C 4.63%, #FFB936 13.43%, #FFF962 76.75%)'
			default:
				return 'linear-gradient(90deg, #FF9C3A -3.24%, #FFE55C 4.63%, #FFB936 13.43%, #FFF962 76.75%)'
		}
	}
}

function getStatus(status: string) {
	switch (status) {
		case '2':
			return t('about2start')
		case '1':
			return t('ongoing')
		case '0':
			return t('ended')
	}
}

function onClickDetail() {
	const item = props.item
	router.push({
		name: 'PointMall-LotteryDetail',
		query:{
			pointsLotteryID:item.pointsLotteryID
		}
	})
}
</script>

<style lang="scss" scoped>
.treasure__container {
	&__treasure {
		&-item {
			width: 100%;

			&__header,
			&__footer {
				position: relative;
				width: 100%;
			}

			&__header {
				display: flex;
				align-items: center;
				justify-content: center;
				padding-block: 20px;
				color: #fff;
				border-top-left-radius: 24px;
				border-top-right-radius: 24px;
				background: var(--sheet_nva_color);

				.treasure-state {
					position: absolute;
					top: 20px;
					left: 0;
					padding: 3px 3px 3px 0;
					font-size: 22px;
					height: 44px;
					line-height: 36px;
					border-top-right-radius: 9rem;
					border-bottom-right-radius: 9rem;
					z-index: 2;
					html:lang(ar) &{
						right: 0;
						left: unset;
					}

					span {
						display: block;
						height: 100%;
						border-top-right-radius: 9rem;
						border-bottom-right-radius: 9rem;
						padding: 0 20px 0 33px;
						color: var(--text_color_L1);
						white-space: nowrap;
						z-index: 1;
					}
				}
				img{
					width: 472px;
					height: 473px;
				}
			}

			&__footer {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				padding: 28px 15px 40px 15px;
				border-bottom-left-radius: 24px;
				border-bottom-right-radius: 24px;
				background: var(--bg_color_L2);

				&-title {
					margin-bottom: 25px;
					color: var(--text_color_L1);
					font-family: Inter;
					font-size: 30px;
					font-style: normal;
					font-weight: 400;
					line-height: 36px;

					& > span {
						color: var(--main-color);
						font-weight: 700;
					}
				}

				&-progressTitle {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					color: var(--text_color_L3);
					font-size: 24px;
				}

				.van-progress {
					width: 100%;
					margin-block: 10px;
				}

				&-progressDetails {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					color: var(--text_color_L1);
					margin-bottom: 20px;

					& > span {
						color: var(--text_color_L2);
						font-size: 24px;
					}

					& > div {
						span {
							font-size: 24px;
							font-weight: 600;
						}
					}
				}

				&-ending,
				&-cost {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					height: 60px;
					margin-block: 5px;
					border: 1px solid var(--bgColor-6);
					background: var(--bg_color_L3);
					color: var(--text_color_L1);

					& > span,
					& > div {
						display: flex;
						align-items: center;
						height: 100%;
						padding: 5px 10px;
						
					}

					& > span {
						flex: 0.6;
						background: var(--bg_color_L3);
						clip-path: polygon(0 0, 100% 0%, 90% 100%, 0% 100%);
					}

					& > div {
						flex: 0.4;
						
						background:var(--bg_color_L3);
						justify-content: flex-end;
						color: var(--norm_secondary-color);
						font-size: 30px;
						font-weight: 600;
					

						img {
							width: 30px;
							height: 30px;
							margin-inline: 5px;
						}
					}
				}
				&-cost {
					> div{
						column-gap: 9px;
					}
				}

				&-ending {
					& > div {
						color: var(--text_color_L1);
						font-size: 28px;
						font-weight: 500;

						& > span {
							font-weight: 600;
						}
					}
				}

				&-button {
					margin-top: 45px;
					width: 100%;
					height: 80px;
					color: var(--text_white, var(--text_color_L4));
					text-align: center;
					border-radius: 9rem;
					background: var(--main_gradient-color);
					line-height: 80px;
				}
			}
		}
	}
}
</style>
