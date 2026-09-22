<template>
    <div class="LR">
        <NavBar left-arrow @click-left="() => router.back()" :title="$t('d4Tip2')"></NavBar>
        <div class="lotterys">
            <div class="main" :class="{ active: showIndex === index }" @click="onTabSelect(item, index)"
                v-for="(item, index) in list" :key="index">
                <img v-lazy="item.typeImg" alt="">
            </div>
        </div>
        <div class="date">
            <div class="dateBox">
				<svg-icon name="arrLeft"  />
                <ArSelect @click-select="showDataPick = true" :selectName="dateValue"> </ArSelect>
				<svg-icon name="arrLeft"  />
			</div>
        </div>
        <div class="result">
            <h1>{{ $t('betResult') }}</h1>
            <ShowResult v-if="JSON.stringify(gameResultByTypeO) !== '{}'" :data="gameResultByTypeO"></ShowResult>
            <Empty v-else />
        </div>

            <van-calendar v-model:show="showDataPick" @cancel="() => showDataPick = false" @confirm="onConfirmDataPick"
                :min-date="minDate" :max-date="maxDate" />
    </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { dateRange } from '@/utils'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import ShowResult from '@/components/Home/AllLotteryGames/4D/showResult.vue'
import { use4D } from '@/hooks/use4D.hook'
import Empty from '@/components/Empty/index.vue'

const { typeList, getTypeList, gameResultByType, gameResultByTypeO } = use4D();
getTypeList()
const { t } = useI18n()
const router = useRouter()
const showIndex = ref(0)
const list = computed(() => {
    return typeList.value ? typeList.value.slice(1) : []
})
const { minDate, maxDate } = dateRange(0)
const nowDate = dayjs(maxDate).startOf('day')
const showDataPick = ref(false)

const pageQuery = reactive<any>({
    type: 0,
    date: nowDate.format('YYYY-MM-DD'),
})
watch(()=>list,
()=>{
    if(list.value.length>0) {
        pageQuery.type = list.value[0].typeId
        gameResultByType(pageQuery)
    }

},{deep:true,immediate:true})

const dateValue = computed(() => {
    return dayjs(pageQuery.date).format('YYYY-MM-DD') + ' ' + t(`${dayjs(pageQuery.date).format('dddd')}`)
})

const onConfirmDataPick = (value: any) => {
    showDataPick.value = false
    pageQuery.date = dayjs(value).format('YYYY-MM-DD')
    gameResultByType(pageQuery)
}
function onTabSelect(item: any, index: number) {
    showIndex.value = index
    pageQuery.type = item.typeId
    gameResultByType(pageQuery)
}
</script>
<style lang="scss" scoped>
.LR {
    padding: 30px 20px;

    .lotterys {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 20px;

        .main {
			margin: auto;
            width: 120px;
            height: 120px;
            border-radius: 80px;
            background: var(--bg_color_L2);
            img {
                width: 100%;
				height: 120px;
                border-radius: 50%;
                overflow: hidden;
                object-fit: cover !important;
				background-color: #fff;
				filter: grayscale(100%);
            }

            &.active {
                //background: linear-gradient(125deg, #FF8E89 12.38%, #FFC3A2 87.13%);
				background: var(--main_gradient-color2);
				img {
					filter: grayscale(0%);
				}
            }
        }
    }

    .date {
        margin: 40px 0 30px;
        height: 88px;
        background: var(--main_gradient-color);
        
        border-radius: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        .dateBox {
            border-top: 1px solid var(--text_color_L4);
            border-bottom: 1px solid var(--text_color_L4);
            position: relative;
            height: 55px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 60%;

			svg {
				width: 20px;
				height: 54px;
			}
			svg:nth-child(1) {
				margin-left:-20px;
			}
			svg:last-child {
				margin-right: -20px;
				transform: rotate(180deg);
			}

            //&::after {
            //    left: -19px;
            //    background: url(@/assets/icons/home/AllLotteryGames/4D/arr-left.svg) no-repeat left top;
            //    background-size: cover;
            //}

            //&::before {
            //    right: -19px;
            //    background: url(@/assets/icons/home/AllLotteryGames/4D/arr-right.svg) no-repeat left top;
            //    background-size: cover;
            //}


            :deep(.ar-searchbar__selector) {
                color: var(--textW);
                font-size: 28px;
                font-weight: 500;

                >div {
                    background: transparent;
                    box-shadow: none;
                }
            }
        }


    }

    .result {
        padding: 20px;
        background: var(--bg_color_L2);
        
        border-radius: 10px;

        h1 {
            font-size: 30px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
			color: var(--text_color_L1);

            &::before {
                content: '';
                display: block;
                width: 6px;
                height: 30px;
                background-color: var(--main-color);
            }
        }
    }
	:deep(.van-calendar__selected-day){
		border: 1px solid var(--main-color);
		color: var(--main-color);
		background: none;
	}
}</style>