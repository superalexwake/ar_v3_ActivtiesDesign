<template>
    <div id="trxwingo">
        <LotteryInfo @change-select-game="changeSelectGame" @setVoice="setVoice" :VoiceType="VoiceType" />
        <tf />
        <bet :currentGame="currentGame?.gameName"/>
        <div class="nav">
            <div :class="{ active: gameComponent == 'Record' }" @click="gameComponent = 'Record'">
                {{ $t('gameRecords') }}
            </div>
            <div :class="{ active: gameComponent == 'Trend' }" @click="gameComponent = 'Trend'">
                {{ $t('chartTrends') }}
            </div>
            <div :class="{ active: gameComponent == 'MyRecord' }" @click="gameComponent = 'MyRecord'">
                {{ $t('myRecord') }}
            </div>
        </div>
        <KeepAlive>
            <Suspense>
                <template #default>
                    <component :is="currentComponent" />
                </template>
                <template #fallback>
                    <p style="height: 200px"> </p>
                </template>
            </Suspense>
        </KeepAlive>
    </div>
    <WinningTips ref="winner">
        <template v-slot="{ data }">
            <div class="winner_box">
                <span>{{ $t('winTips3') }}</span>
                <div class="winner_result" :class="`color_${data.color.replace(/,/g, '_')}`">
                    <div>
						<span v-for="item of data.color.split(',')">{{ $t(item) }}</span>
                    </div>
                    <div>{{ data.number }}</div>
                    <div>{{ data.number > 4 ? $t('big') : $t('small') }}</div>
                </div>
            </div>

        </template>
    </WinningTips>
    <audioVue />
</template>

<script setup lang="ts">
    import { computed, defineAsyncComponent, onMounted, provide, ref } from 'vue'
    import { LotteryInfo, WinningTips } from "@/saasLottery/components";
    import tf from '../../components/trx2/timeleft.vue';
    import bet from '../../components/trx2/bet.vue';
    import { useTrx } from '../../hooks';
    import { useGlobalContext } from '@/saasLottery/hooks';
    import audioVue from '../../components/trx2/audio.vue';

    // 动态组件ref
    const Record = defineAsyncComponent(() => import('../../components/trx2/record.vue'));
    const Trend = defineAsyncComponent(() => import('../../components/trx2/trend.vue'));
    const MyRecord = defineAsyncComponent(() => import('../../components/trx2/myRecord.vue'));
    const { getWebData, currentGame,onLotteryJump } = useGlobalContext()
    const trxWinHook = useTrx();
    const { getIssue,onClearBet, getHistoryIssues, winner, setVoice, VoiceType, getlotteryissue } = trxWinHook;
    provide('trxWinHook', trxWinHook);

    const currentComponent = computed(() => {
        switch (gameComponent.value) {
            case 'Record':
                return Record;
            case 'Trend':
                return Trend;
            case 'MyRecord':
                return MyRecord;
            default:
                return null;
        }
    });
	const look=ref(false)
    const changeSelectGame = async (item:any) => {
		if (look.value)return;
		try {
			look.value=true
			onClearBet(true);
			onLotteryJump(item)
			await getlotteryissue();
		}catch (e) {

		}finally {
			look.value=false
		}
    }

    // 动态组件展示
    const gameComponent = ref('Record');
    onMounted(async () => {
		getWebData()
        getIssue()
        getHistoryIssues()
    })
</script>

<style lang="scss" scoped>
    #trxwingo {
        position: relative;
        background-color: var(--bg_color_L1);
        &::before {
            content: "";
            display: block;
            width: 100%;
            height: 250px;
            background: var(--light-main_gradient-color, var(--bg_color_L2));
            border-radius: 0 0 1.53333rem 1.53333rem;
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
        }

        &>*:not(.van-popup) {
            position: relative;
        }

        .nav {
            width: calc(100% - 52px);
            height: 72px;
            line-height: 72px;
            display: flex;
            justify-content: space-between;
            margin: 24px auto 0;

            &>div {
                width: calc((100% - 38px) / 3);
                height: 100%;
                background: var(--bg_color_L2);
                border-radius: 16px;
                font-size: 28px;
                color: var(--text_color_L2);
                text-align: center;
                overflow: hidden;

                &.active {
                    background: var(--main_gradient-color, var(--main_gradient-color));
                    font-weight: 600;
                    color: var(--text_color_L4);
                }
            }
        }
    }

    .winner_box {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        height: 100%;
        padding: 0 20px;
        gap: 12px;

        >span {
            flex: none;
        }
    }

    .winner_result {
        flex: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        >div {
            border-radius: 10px;
            min-width: 78px;
            padding: 0 8px;
            height: 44px;
            color: #fff;
            font-size: 24px;
            text-align: center;
            line-height: 44px;
			span{
				margin:0 6px;
			}
        }
		>div:nth-child(2) {
			flex: none;
			width: 40px;
			min-width:40px;
			height: 40px;
			padding: 0;
			line-height: 40px;
			border-radius: 50%;
		}

        &.color_green >div {
            background: #40AD72;
        }

        &.color_red >div {
            background: #F85050;
        }

        &.color_violet >div {
            background: #A56BFF;
        }

        &.color_red_violet >div {
            background: linear-gradient(135deg, #F85050 50.96%, #A56BFF 50.97%);
        }

        &.color_green_violet >div {
            background: linear-gradient(135deg, #40AD72 51.48%, #A56BFF 51.49%);
        }
    }
</style>