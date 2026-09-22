<template>
  <div class="Xg-page">
    <NavBar :title="$t('superjackpot')" left-arrow @click-left="goBack" />
    <div class="Xg-info">
      <div>
        <h3 class="tit">{{ $t("superjackpot") }}</h3>
        <p class="tip">{{ $t("tip") + $t("txt") }}</p>
        <p class="txt">{{ $t("superJackpotTxt", [getRewardValidityTime]) }}</p>
      </div>
    </div>
    <div class="Xg-page-wrap">
      <div class="receive-all" @click="onRecivedAll" :class="{ 'no-receive': isRecived }">
        <svg-icon class="icon" name='super_no'/>
        <!-- <svg-icon class="icon" v-else  name='super_1' /> -->
        <span>{{ $t("receiveAll") }}</span>
      </div>
      <ul class="tab">
        <li class="tab-item" @click="goRule">
          <svg-icon name="rule" />
          <span>{{ $t("ruleillustrate") }}</span>
        </li>
        <li class="tab-item" @click="goStar">
          <svg-icon name="winningStar" />
          <span>{{ $t("winningstar") }}</span>
        </li>
      </ul>
      <!-- 列表 -->
      <List
        :api="GetThirdGameRewardsRecordPageList"
        v-model:list="RewardsRecordPageList"
        v-model:page-query="pageQuery"
        ref="listRef"
      >
        <template #content>
          <div class="Xg-list">
            <div
              class="item m-b-20"
              v-for="(item, index) in RewardsRecordPageList"
              :key="index"
            >
              <div class="header c-row c-row-between">
                <div
                  class="tit"
                  :class="{
                    action: item.isReceive == 0,
                    action2: item.isReceive == 2,
                  }"
                >
                  {{
                    item.isReceive == 1
                      ? $t("received")
                      : item.isReceive == 2
                      ? $t("rewardExpired")
                      : $t("unaccalimed")
                  }}
                </div>
                <div class="time">
                  <div>{{ item.createTime }}</div>
                  <div class="red" v-if="item.expirationFormatTime">
                    {{ item.expirationFormatTime }}<span>{{ $t("expiredTime") }}</span>
                  </div>
                </div>
              </div>
              <div class="c-row body c-row-middle">
                <!-- <img class="img" :src="require('@/assets/images/game/1.png')" /> -->
                <img class="img" v-lazy="item.imgUrl" />
                <div class="info">
                  <p class="name">{{ item.gameName }}</p>
                  <p class="lab">
                    <span>{{ item.orderNo }}</span>
                  </p>
                </div>
              </div>
              <div class="line"></div>
              <div class="numbox">
                <div class="citem">
                  <p class="num">{{ item.multiple }}X</p>
                  <span class="txt">{{ $t("Winningmultiple") }}</span>
                </div>
                <div class="citem">
                  <p class="num red">{{ currency(item.bonusAmount) }}</p>
                  <span class="txt">{{ $t("Additionalrewards") }}</span>
                </div>
              </div>
              <div class="box">
                <van-button
                  v-if="item.isReceive === 0"
                  class="Xg-btn"
                  round
                  type="primary"
                  block
                  @click="onRecived(item.orderId)"
                  >{{ $t("receive") }}</van-button
                >
                <van-button
                  v-else-if="item.isReceive === 1"
                  class="Xg-btn-received"
                  round
                  type="primary"
                  block
                  >{{ $t("received") }}</van-button
                >
                <van-button v-else class="Xg-btn-expired" round block>{{
                  $t("rewardExpiredTime")
                }}</van-button>
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <Empty>
            <template #text>
              <p>{{ $t("notAmegaJackpot") }}</p>
            </template>
          </Empty>
        </template>
      </List>
      <div class="go-bet" @click="router.push('/')">{{ $t("goBetting") }}</div>
    </div>

		<Dialog v-model:show="DialogShow" img-url="succeed" @confirm="onLaundy" :show-cancel-btn="false" confirmText="OK" :title="$t('succTip1')">
			<template #content>
				<div class="Laundry-Con">
					<div class="Laundry-Con_tip" v-if="recivedAll.type == -1">
						{{ $t('succTip2') }}
					</div>
					<div class="Laundry-Con_tip" v-else>{{ $t('receiveAllSuccess') }}</div>
					<ul v-if="recivedAll.type == 1">
						<li>
							<h3>{{ recivedAll.orderCount }}</h3>
							<p>{{ $t('awardCount') }}</p>
						</li>
						<li>
							<h3>{{ currency(recivedAll.totalReceiveAmount) }}</h3>
							<p>{{ $t('awardAmount') }}</p>
						</li>
					</ul>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { currency } from '@/utils'
import Dialog from '@/components/common/Dialog.vue'
import Empty from '@/components/Empty/index.vue'
import { GetThirdGameRewardsRecordPageList } from '@/api'
import List from '@/components/common/ListSimply.vue'
import { useJackpot } from '@/hooks'
import { SettingStore } from '@/stores'

const { getRewardValidityTime } = SettingStore()
const {
	goRule,
	goStar,
	RewardsRecordPageList,
	listRef,
	DialogShow,
	pageQuery,
	recivedAll,
	isRecived,
	onLaundy,
	onRecived,
	goBack,
	onRecivedAll
} = useJackpot()
const router = useRouter()
</script>

<style scoped lang="scss">
.Xg-page {
	overflow: hidden;

	.Xg-info {
		padding: 0 25px;
		display: flex;
		justify-content: space-between;
		background-image: url('@/assets/icons/main/superJackpot.png');
		background-repeat: no-repeat;
		background-size: cover;
		min-height: 370px;
		> div {
			max-width: 384px;
		}

		.tit {
			color: #fff;
			font-size: 42px;
			font-weight: bold;
			margin: 40px 0 50px;
		}
	}

	.tip,
	.txt {
		color: #fff;
		margin-bottom: 20px;
	}

	.img {
		width: 280px;
	}

	&-wrap {
		padding: 20px 24px;
	}

	.tab {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88px;
		color: var(--darkTextW, var(--text_color_L1));
		font-family: Poppins;
		font-size: 26px;
		font-weight: 400;
		line-height: 22px;
		margin-bottom: 30px;

    &-item {
      display: flex;
      width: 340px;
      background: var(--bg_color_L2);
      border-radius: 12px;
      height: 100%;
      background-size: 48px;
      background-repeat: no-repeat;
      background-position: 24px center;
      display: flex;
      color: var(--darkTextW);
      align-items: center;
      justify-content: center;
      gap:20px;
      svg {
        width: 48px;
        height: 48px;     
      }
    }
  }

	:deep(.empty__container) {
		background: var(--bg_color_L2);
		border-radius: 16px;
		padding: 20px;

		p {
			color: var(--text_color_L2);
			margin: 10px 0;
		}
	}

  .go-bet {
    width: 662px;
    height: 70px;
    background: var(--main_gradient-color);
    color: var(--bg_color_L2);
    text-align: center;
    line-height: 70px;
    font-size: 30px;
    letter-spacing: 1.2px;
    border-radius: 100px;
    margin: 0 auto;
  }
  .receive-all {
    height: 70px;
    border: 1px solid var(--main-color);
    border-radius: 60px;
    line-height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 12px;
    text-align: center;
    margin-bottom: 30px;
    color: var(--main-color);
    padding-left: 48px;
    svg {
      width: 48px;
      height: 48px;
    }
    &.no-receive {
	  border:none;
      padding-left: 48px;
      color: var(--text_white,var(--text_color_L3));
      background: var(--button_dis_color);
    }
  }
  .Laundry-Con {
    text-align: center;
    ul {
      display: flex;
      width: 540px;
      margin: 10px 0;
    }
    li {
      width: 50%;
      text-align: center;
      h3 {
        color: var(--main-color);
        font-size: 34px;
        margin-bottom: 10px;
      }
      p {
        color: var(--text_color_L1);
      }
    }
  }
}

.Xg-list {
	.m-b-20 {
		margin-bottom: 40px;
	}

	.item {
		background-color: var(--bg_color_L2);
		border-radius: 20px;
		overflow: hidden;

		.header {
			position: relative;
			height: 80px;
			line-height: 80px;
			padding-right: 30px;
			&::after {
				content: '';
				position: absolute;
				inset-inline-end: 0;
				bottom: 0;
				width: 60%;
				height: 1px;
				background: var(--Dividing-line_color);
			}

			.tit {
				background: var(--button_dis_color);
				text-align: center;
				border-radius: 20px 0 50px 0;
				color: #FFF;
				width: 260px;
				font-size: 30px;
				&.action {
					background: var(--norm_red-color) !important;
				}
				&.action2 {
					background: var(--norm_secondary-color);
				}
				html:lang(ar) & {
					border-radius: 0 20px 0 50px;
				}
			}

			.time {
				color: var(--text_color_L2);
				font-size: 24px;
				line-height: 30px;
				padding: 11px 0;
				text-align: right;

				.red span {
					margin-left: 10px;
				}
			}
			.red {
				color: var(--norm_red-color);
			}
		}

		.body {
			padding: 30px;

			.img {
				width: 100px;
				height: 100px;
			}

			.info {
				padding-left: 10px;
				flex: 1;
				overflow: hidden;

				.name {
					color: var(--text_color_L1);
					margin-bottom: 10px;
					font-size: 26px;
				}

				.lab {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24px;
					color: var(--text_color_L2);
					line-height: 30px;
					background: var(--bg_color_L3);
					border-radius: 80px;
					min-height: 45px;
					width: 100%;
					text-align: center;
					padding: 0 10px;
					span {
						width: 100%;
						display: inline-block;
					}
				}
			}
		}

		.line {
			width: 90%;
			margin: 0 auto;
			position: relative;
			border-top: 1px dashed var(--Dividing-line_color);

			&::after,
			&::before {
				content: '';
				display: block;
				height: 40px;
				width: 40px;
				border-radius: 40px;
				background-color: var(--bg_color_L1);
				position: absolute;
				top: -20px;
			}

			&::after {
				left: -50px;
			}

			&::before {
				right: -50px;
			}
		}

		.numbox {
			padding: 30px;
			display: flex;
			text-align: center;

			.citem {
				flex: 1;
				&:first-of-type {
					position: relative;
					&::after {
						content: '';
						position: absolute;
						inset-inline-end: 0;
						bottom: 0;
						width: 1px;
						height: 90%;
						background: var(--Dividing-line_color);
					}
				}

				.num {
					color: var(--norm_secondary-color);
					font-size: 32px;
					margin-bottom: 10px;
					&.red {
						color: var(--norm_red-color);
					}
				}

				.txt {
					font-size: 26px;
					color: var(--text_color_L2);
				}
			}
		}

		.box {
			padding: 0 30px 30px;
			.Xg-btn,
			.Xg-btn-received,
			.Xg-btn-expired {
				height: 80px;
			}
			.Xg-btn {
				background: var(--main_gradient-color);
				border: none;
				font-size: 30px;
			}

			.Xg-btn-received {
				background: var(--button_dis_color);
				border: none;
				color: #fff;
				font-size: 30px;
			}
			.Xg-btn-expired {
				background: transparent;
				border: 1px solid var(--main-color);
				color: var(--main-color);
				font-size: 30px;
			}
		}
	}
}
</style>
