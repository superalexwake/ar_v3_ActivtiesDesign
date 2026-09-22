<template>
    <div class="playBox">
        <NavBar left-arrow :title="$t('lotteryManual')" @click-left="() => router.back()">
        </NavBar>
        <van-tabs v-model:active="active" type="card" :swipe-threshold="3">
            <van-tab :title="item.title" v-for="(item, index) in list" :key="index">
                <div class="con">
                    <h1><van-icon name="play" class="icon" size="20" />{{$t('betting')  }}</h1>
                    <div class="tip">{{ item.tip1 }}</div>
                    <h1><van-icon name="play" class="icon" size="20" />{{ $t('winningconditions') }}</h1>
                    <div class="tip"><span v-html="item.tip2"></span></div>
                    <div class="txt">
                        <div>{{$t('example')  }}</div>
                        <div>{{$t('betting')  }}:&nbsp;&nbsp;&nbsp;{{ item.txt.tip1 }}</div>
                        <div>{{ item.txt.tip2 }}</div>
                        <div class="num" v-if="item.txt.tip3.length > 0">
                            <span v-for="(item1, index) in item.txt.tip3" :key="index">{{ item1 }}</span>
                        </div>
                        <div>{{ $t('result') }}:&nbsp;&nbsp;&nbsp;<span v-html="item.txt.tip4"></span></div>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t:$t } = useI18n()
const router = useRouter()
const active = ref(0)
const list = ref([
    {
        title:$t('d4gamePay1'), //四位直选
        tip1: $t('Play4DTip2'),
        tip2: $t('Play4DTip4'),
        txt: {
            tip1: '[1234]',
            tip2: '',
            tip3: [],
            tip4: $t('Play4DTip1', ['1234']),
        }

    },
    {
        title: $t('d4gamePay5'), //四位R选
        tip1: $t('Play4DTip5'),
        tip2: $t('Play4DTip6'),
        txt: {
            tip1: '[123R]',
            tip2: $t('Play4DTip10', [10]),
            tip3: ['1230', '1231', '1232', '1233', '1234', '1235', '1236', '1237', '1238', '1239'],
            tip4: $t('Play4DTip1', ['1234']),
        }
    },
    {
        title: $t('d4gamePay2'), //四位全保
        tip1: $t('Play4DTip7'),
        tip2: $t('Play4DTip8'),
        txt: {
            tip1: '[1122]',
            tip2: $t('Play4DTip11'),
            tip3: ['1122', '1212', '1221','2112', '2121', '2211'],
            tip4: $t('Play4DTip1', ['1212']),
        }
    },
    {
        title: $t('d4gamePay3'), //四位包字
        tip1: $t('Play4DTip9'),
        tip2: $t('Play4DTip8'),
        txt: {
            tip1: '[1122]',
            tip2: $t('Play4DTip10', [6]),
            tip3: ['1122', '1212', '1221', '2112', '2121', '2211'],
            tip4: $t('Play4DTip1', ['1212']),
        }
    },
    {
        title: $t('d4gamePay4'), //四位来回
        tip1: $t('Play4DTip3'),
        tip2: $t('Play4DTip4'),
        txt: {
            tip1: '[1234]',
            tip2: $t('Play4DTip10', [2]),
            tip3: ['1234', '4321'],
            tip4: $t('Play4DTip1', ['1234']),
        }
    }
])
</script>
<style lang="scss" scoped>
.playBox {
    height: 100vb;

    .con {
        background: var(--bg_color_L2);
        box-shadow:var(--BoxShadowColor-9);
        padding: 20px;
        margin: 0 30px;
        border-radius: 10px;
        min-height: 100%;

        h1 {
            color: var(--main-color);
            font-size: 32px;
            margin: 10px 0;

            .icon {
                margin-right: 5px;
            }
        }

        .tip {
            color: var(--text_color_L2);
            font-size: 26px;
            padding-left: 40px;
            margin-bottom: 50px;
        }

        .txt {
            border: 1px solid var(--gray-color-1);
            border-radius: 20px;
            padding: 20px 40px;
            color: var(--text_color_L2);

            >div {
                margin-bottom: 20px;
            }

            .num {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;

                span {
                    border-radius: 6px;
                    background: var(--bg_color_L3);
                    padding: 5px 15px;
                    color: var(--text_color_L2);
                    font-size: 26px;
                }
            }
        }

    }

}

:deep(.red) {
    color: var(--norm_red-color);
}

:deep(.van-tabs) {
    height: calc(100% - 120px);

    .van-tabs__content {
        height: calc(100% - 120px);

        .van-tab__panel {
            height: 100%;
        }
    }
}


:deep(.van-tabs__wrap) {
    margin: 20px 0;
    height: 80px;
    line-height: 80px;

    .van-tabs__nav {
        height: 80px;
        line-height: 80px;
        background: var(--bg_color_L2);
        border: 1px solid var(--textW);
        border-radius: 10px;
        overflow: hidden;
    }

    .van-tab--card {
        color: var(--text_color_L2);
        font-size: 28px;
        border-right: none;
        min-width: 200px;
    }

    .van-tab--active {
        border-radius: 10px;
        background: var(--main_gradient-color2);
        border-right: 1px solid var(--walletBgColor-1);
        color: var(--textW);
        font-weight: 700;
    }
}
</style>