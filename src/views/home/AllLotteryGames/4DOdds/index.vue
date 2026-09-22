<template>
    <div class="oddsBox">
        <NavBar left-arrow :title="$t('odds')" @click-left="() => router.back()">
        </NavBar>
        <div class="items" v-for="(items) in oddsList" :key="items.playTypeId">
            <div class="title">
				<div class="words">{{ $t(`d4gamePay${items.playTypeId}`) }}</div>
				<svg-icon name="oddBg" class="odd" />
			</div>
            <template v-if="items.playTypeId != 2">
                <div class="tabHead">
                    <span>{{ $t('d4gameType1') }}</span>
                    <span>{{ $t('d4gameType2') }}</span>
                </div>
                <div class="tabCon1">
                    <div v-for="item in items.lists?.filter((i)=>[1,2].includes(i.type))" :key="item.type">
                        <div class="item" v-for="(item_1) in item.list" :key="item_1.playId">
                            <div>{{ $t(`d4gameType${item_1.code}`) }}</div>
                            <div>{{ item_1.odds > 0 ? item_1.odds : item_1.oddsDefault }}</div>
                        </div>
                        <div class="item" v-if="item.list.length<5" v-for="i in 2">
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <div class="tabHead h2">
                    <span v-for="item in items.lists?.filter((i)=>[3].includes(i.type))[0]?.list" :key="item.playId">{{ $t(`d4gameType${item.playId}`) }}</span>
                </div>
                <div class="tabCon2">
                    <div v-for="item in items.lists?.filter((i)=>[3].includes(i.type))[0]?.list" :key="item.playId">{{ item.odds > 0 ? item.odds : item.oddsDefault }}</div>
                </div>
            </template>
            <template v-else>
                <template v-for="item in items.lists">
                    <div class="tabHead h2">
                    <span v-if="item.type==1">{{ $t('d4gameType1') }}</span>
                    <span v-if="item.type==2">{{ $t('d4gameType2') }}</span>
                    <span v-if="item.type==3">{{ $t('d4Tip3') }}</span>
                    <span>{{ $t('d4Tip4') }}<br>24</span>
                    <span>{{ $t('d4Tip4') }}<br>12</span>
                    <span>{{ $t('d4Tip4') }}<br>6</span>
                    <span>{{ $t('d4Tip4') }}<br>4</span>
                </div>
                <div class="tabCon1 c2">
                    <div class="itemR item" v-for="item_1 in item.list" :key="item_1.playId">
                        <div>{{ $t(`d4gameType${item_1.code}`) }}</div>
                        <div>{{ item_1.odds24 > 0 ? item_1.odds24 : item_1.oddsDefault24 }}</div>
                        <div>{{ item_1.odds12 > 0 ? item_1.odds12 : item_1.oddsDefault12 }}</div>
                        <div>{{ item_1.odds6 > 0 ? item_1.odds6 : item_1.oddsDefault6 }}</div>
                        <div>{{ item_1.odds4 > 0 ? item_1.odds4 : item_1.oddsDefault4 }}</div>
                    </div>
                </div>
                </template>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { use4D } from '@/hooks/use4D.hook'

const { t: $t } = useI18n()
const router = useRouter()
const { getOddsList, oddsList } = use4D()
onMounted(() => {
    getOddsList()
})
</script>
<style lang="scss" scoped>
.oddsBox {
    padding: 0 20px 30px;

    .items {
        margin-bottom: 50px;
        .title {
            min-height: 62px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--text_color_L4);
            font-size: 32px;
            font-weight: 600;
			position: relative;
			.words{
				position:absolute;
			}
			.odd{
				height: 70px;
				width: 702px;
			}
        }

        .tabHead {
            margin-top: 20px;
            /*background: linear-gradient(125deg, #FF8E89 12.38%, #FFC3A2 87.13%);*/
			background:var(--sheet_nva_color);
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: center;
            min-height: 80px;
            span {
                flex: 1;
                color: #fff;
                font-size: 30px;
                font-weight: 700;
                text-align: center;

                &:not(:last-of-type) {
                    border-right: 1px solid var(--borderColor-5);
                }
            }
        }

        .tabHead.h2 {
            span {
                font-size: 24px;
            }
        }

        .tabCon1 {
            box-shadow:var(--BoxShadowColor-9);
            border-radius: 0px 0px 10px 10px;
            overflow: hidden;
            margin-bottom: 30px;
            display: flex;
            >div{
                width: 50%;
                display: flex;
                flex-direction: column;
                &:not(:last-of-type) {
                        border-right: 1px solid var(--gray-color-1);
                }
            }
            .item {
                display: flex;


                >div {
                    flex: 1;
                    color: var(--text_color_L1);
                    font-size: 26px;
                    min-height: 80px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;

                    &:not(:last-of-type) {
                        border-right: 1px solid var(--gray-color-1);
                    }
                }

                >div:nth-child(2n) {
                    font-size: 28px;
                    font-weight: 500;
                }
            }

            .item:nth-child(1n) {
                background-color: var(--textW);
            }

            .item:nth-child(2n) {
                background-color: var(--sheet_detail_bg_color);
            }
        }

        .tabCon1.c2 {
            flex-wrap: wrap;
            .itemR {
                flex-direction: row;
                width: 100%;
                >div {
                    font-size: 28px;
                    font-weight: 500;
                }

                >div:first-of-type {
                    color:var(--main-color);
                    font-size: 24px;
                }
            }
        }

        .tabCon2 {
            box-shadow:var(--BoxShadowColor-9);
            display: flex;
            border-radius: 0px 0px 10px 10px;
            overflow: hidden;

            >div {
                flex: 1;
                color: var(--text_color_L2);
                font-size: 28px;
                min-height: 80px;
                font-weight: 500;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            >div:nth-child(1n) {
                background-color: var(--textW);
            }

            >div:nth-child(2n) {
                background-color:var(--sheet_detail_bg_color);
            }
        }
    }
}
</style>