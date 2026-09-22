<template>
    <van-popup v-model:show="betDialog" position="bottom" round>
        <div class="lottery-container">
            <!-- Curved Header -->
            <div class="header" :class="betBgColor">
                <h1>{{ currentGame }}</h1>
                <div class="selection-text">
                    <span>{{ t('selectMay') }} {{ isNaN(Number(playBet)) ? t('bet' + (playBet.charAt(0).toUpperCase() + playBet.slice(1))) : playBet }}</span>
                </div>
            </div>

            <!-- Main Content -->
            <div class="content">
                <!-- Amount Section -->
                <div class="amount-section">
                    <div class="section-header">
                        <span class="label">{{ t('amount') }}</span>
                        <div class="amount-buttons">
                            <div
                                v-for="amt in betScopes"
                                :key="amt"
                                :class="amount === amt ? `primary n_${playBet}` : 'default'"
                                @click="amount = amt"
                            >
                                {{ amt }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Multiplier Section -->
                <div class="multiplier-section">
                    <div class="section-header">
                        <span class="label">{{ $t('quantity') }}</span>
                        <div class="m">
                            <div :class="[`n_${playBet}`]" @click="Stepper(1)">-</div>
                            <input v-model="betMultiple" type="number" @input="enforceMaxValue" />
                            <div :class="[`n_${playBet}`]" @click="Stepper(2)">+</div>
                        </div>
                    </div>

                    <div class="multiplier-buttons">
                        <div
                            v-for="mult in betMultiples"
                            :key="mult"
                            :class="betMultiple === mult ? `primary n_${playBet}` : 'default'"
                            @click="betMultiple = mult"
                        >
                            X{{ mult }}
                        </div>
                    </div>
                </div>

                <!-- Agreement Section -->
                <div class="agreement">
                    <van-checkbox v-model="agreed" checked-color="var(--main-color)">
                        {{ $t('agree') }}
                        <span class="rules" @click.stop="showPreSale = true">{{ $t('presaleRules') }}</span>
                    </van-checkbox>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <van-button class="cancel" @click="onClearBet"> {{ t('cancel') }}</van-button>
                <van-button :class="`bet-amount n_${playBet}`" :disabled="!agreed || !canSubmit" @click="betting">
                    {{ t('totalAmount') }} {{ currency(betMultiple * amount || 0) }}
                </van-button>
            </div>
        </div>
    </van-popup>

    <!-- 预售规则弹层 begin-->
    <van-popup v-model:show="showPreSale" :close-on-click-overlay="false" round>
        <BetRule :title="t('presaleRules')" @close="showPreSale = false">
            {{ $t('betPopTXT') }}
        </BetRule>
    </van-popup>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { showToast } from 'vant'
import { useWinGo3Context } from '@/saasLottery/game/WinGo/hooks'
import { useGlobalContext, useToast } from '@/saasLottery/hooks'
import { currency } from '@/utils'
import { sanitizeBetCountInput, clampBetCountInput } from '@/saasLottery/utils'
import { useI18n } from 'vue-i18n'
import { BetRule } from '@/saasLottery/components'
const { t } = useI18n()

defineProps({
    currentGame: {
        type: String,
        default: ''
    }
})

// 份数加减
const Stepper = (e: number) => {
  const cur = clampBetCountInput(betMultiple.value) ?? 0
  if (e === 1) {
    if (cur > 1) betMultiple.value = cur - 1
  } else {
    betMultiple.value = clampBetCountInput(cur + 1) as number
  }
};
const multiplier = ref('1')
const agreed = ref(true)
const { betDialog, betMultiples, betMultiple, amount, onBetting, betScopes, playBet, onClearBet } = useWinGo3Context()
const { balance } = useGlobalContext()
const showPreSale = ref(false)

const betBgColor = computed(() => {
    let green = [1, 3, 7, 9]
    let red = [2, 4, 6, 8]
    if (playBet.value === 'violet') {
        return 'violet_bg'
    } else if (playBet.value === 'small') {
        return 'small_bg'
    } else if (playBet.value === 'big') {
        return 'big_bg'
    } else if (playBet.value === 0) {
        return 'zero_bg'
    } else if (playBet.value === 5) {
        return 'five_bg'
    } else if (green.includes(playBet.value as number) || playBet.value === 'green') {
        return 'green_bg'
    } else if (red.includes(playBet.value as number) || playBet.value === 'red') {
        return 'red_bg'
    }
})

const message = useToast()

const handleCancel = () => {
    showToast('已取消')
}

// 输入过程中:只保留正整数(去小数、去负号、去前导0)并限制上限,允许清空以便重新输入
const enforceMaxValue = (e: Event) => {
  const val = sanitizeBetCountInput(e)
  if (val !== null) betMultiple.value = val
}

const canSubmit = computed(() => Number(betMultiple.value) >= 1)

const betting = () => {
    if (!canSubmit.value) return
    if (betMultiple.value * amount.value > balance.value) {
        return message.error(t('wfDesc3'))
    }
    onBetting()
}
</script>

<style lang="scss" scoped>
.lottery-container {
    background-color: var(--bg_color_L2);
    height: 650px;
    font-size: 14px;

    .header {
        position: relative;
        height: 190px;
        background: linear-gradient(to right, #52b788, #3a9866); /* 绿色渐变 */
        clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
        text-align: center;
        padding-top: 30px;
        margin-bottom: 60px;

        h1 {
            color: #fff;
            font-size: 24px;
            margin-bottom: 16px;
        }

        .selection-text {
            margin: 0 auto;
            width: 560px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            background-color: #fff;
            border-radius: 10px;
            font-size: 26px;
        }
    }

    .content {
        padding: 0 26px;
        background-color: transparent !important;
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            .label {
                font-size: 32px;
                color: var(--text_color_L1);
            }
        }

        .amount-buttons {
            display: flex;
            gap: 8px;
            div {
                padding: 14px 24px;
                color: #262626;
                font-size: 24px;
                font-weight: 400;
                text-align: center;
            }

            .primary {
                color: #fff;
            }
            .default {
                border-radius: 10px;
                background-color: var(--bg_color_L3);
                color: var(--text_color_L2);
            }
        }

        .multiplier-section {
            margin-top: 24px;

            .multiplier-input {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .m {
                display: flex;
                gap: 12px;
                height: 56px;
                line-height: 56px;
                font-size: 32px;

                & > div {
                    padding: 0 16px;
                    color: var(--text_color_L4);
                    border-radius: 10px;
                }

                & > input {
                    border: 1px solid var(--bg_color_L3);
                    background-color: var(--bg_color_L1);
                    padding: 2px 20px;
                    width: 158px;
                    margin: 0 12px;
                    text-align: center;

                    :deep(.van-field__control) {
                        text-align: center;
                        font-size: 28px;
                        line-height: 54px;
                    }
                }
            }
            .multiplier-buttons {
                display: flex;
                flex-direction: row;
                justify-content: end;
                gap: 12px;
                margin-top: 16px;
                div {
                    padding: 14px 24px;
                    color: #262626;
                    font-size: 24px;
                    font-weight: 400;
                    text-align: center;
                }

                .primary {
                    color: #fff;
                }

                .default {
                    border-radius: 10px;
                    background-color: var(--bg_color_L3);
                    color: var(--text_color_L2);
                }
            }
        }

        .agreement {
            margin-top: 24px;
            font-size: 24px;

            .rules {
                color: #fd565c;
                font-size: 24px;
                text-decoration: none;
            }
        }
    }

    .footer {
        position: fixed;
        height: 72px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        :deep(.van-button) {
            border: none;
            border-radius: 0;
        }
        .cancel {
            width: 250px;
            height: 72px;
            border-radius: 0;
            font-size: 26px;
            background: var(--bg_color_L3);
            color: var(--text_color_L2);
        }
        .bet-amount {
            width: calc(100% - 250px);
            height: 72px;
            font-size: 26px;
            color: #fff;
            opacity: 1;

            &.van-button--disabled {
                opacity: 0.5;
            }
        }
    }

    .green_bg {
        background: linear-gradient(90deg, #3faa70 0%, #47ba7c 100%);
    }
    .red_bg {
        background: linear-gradient(90deg, #fc5050 0%, #ff646c 100%);
    }
    .zero_bg {
        background: linear-gradient(to bottom right, var(--norm_red-color) 50%, var(--norm_Purple-color) 0);
    }
    .five_bg {
        background: linear-gradient(to bottom right, var(--norm_green-color) 50%, var(--norm_Purple-color) 0);
    }

    .violet_bg {
        background: var(--norm_Purple-color);
    }

    .big_bg {
        background: var(--norm_secondary-color);
    }

    .small_bg {
        background: linear-gradient(90deg, #6ca6f3 0%, #87bcf5 100%);
    }

    .n_1,
    .n_3,
    .n_7,
    .n_9,
    .n_5,
    .n_green {
        background: var(--norm_green-color);
    }
    .n_2,
    .n_4,
    .n_6,
    .n_8,
    .n_0,
    .n_red {
        background: var(--norm_red-color);
    }

    .n_small {
        background: var(--norm_bule-color);
    }

    .n_big {
        background: var(--norm_secondary-color);
    }

    .n_violet {
        background: var(--norm_Purple-color);
    }
}
</style>