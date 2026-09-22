<template>
    <div class="allGame">
        <div class="head" @click="showPopup = true">{{  getSlotTitle(activeGame.slotsName)}}</div>
        <div class="body">
            <div class="body-item" v-for="(i, k) in listData" :key="k" @click="onItemClick(i)">
				<img v-lazy="i.img"  />
				<Maintain  :item="i"/>
			</div>
        </div>
        <div class="btn" @click="goleve2">{{ $t('viewAll') }}</div>
    </div>
    <van-popup v-model:show="showPopup" round position="bottom">
        <div class="list">
            <div v-for="(i, k) in typeList" :key="k" :class="[(activeGame.vendorId == i.vendorId) && 'active']"
                @click="selectType(i)">
                <div>{{ getSlotTitle(i.slotsName) }}</div>
                <svg-icon :name="i.slotsName" class="gameIcon" />
            </div>
        </div>
    </van-popup>
</template>
<script setup lang="ts">
    import { getThirdGameList } from '@/api';
    import { AwaitApiResult ,getSlotTitle} from '@/utils';
    import { computed, inject, onMounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    // 使用 inject 接收父组件传递的实例
    const useHomeHook: any = inject('useHomeHook');
    const { homeState, onItemClick } = useHomeHook;

    const router = useRouter()
    // 定义 props 接收父组件的 activeType
    const props = defineProps<{
        activeType: string;
    }>();
    const showPopup = ref(false)
    const listData = ref([])
    const typeList = computed(() => {
        return homeState.allGameList[props.activeType.toLocaleLowerCase()] || [];
    })

    const getList = async (type: number) => {
        const res = await AwaitApiResult(getThirdGameList({ type }))
        if (res) {
            listData.value = res.data.gameLists || [];
        }
        activeGame.value = typeList.value.find(((i: any) => i.vendorId == type))
    }
    const selectType = (i: any) => {
        showPopup.value = false;
        getList(i.vendorId)
    }
    watch(
        () => props.activeType,
        (newValue) => {
            if (typeList.value[0]) {
                getList(typeList.value[0].vendorId)
            }
        },
        { immediate: true }
    );
    const activeGame = ref({});

    const goleve2 = (value: any) => {
        sessionStorage.setItem('slotGamesList', JSON.stringify(typeList.value))
        sessionStorage.setItem('gameType', JSON.stringify(props.activeType.toLocaleLowerCase()))
        sessionStorage.setItem('clickedItem', JSON.stringify(activeGame.value))
        router.push({
            name: 'AllOnlineGames'
        })
    }
    onMounted(() => {
        getList(typeList.value[0].vendorId)
    })
</script>
<style lang="scss" scoped>
    .allGame {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .head {
            border-radius: 8px;
            background: #FFF;
            box-shadow: 0px 4px 10px 0px rgba(30, 38, 55, 0.05);
            display: flex;
            height: 72px;
            padding: 0px 24px;
            justify-content: space-between;
            align-items: center;
            color: #696F7A;
            font-family: "Alibaba PuHuiTi 3.0";
            font-size: 28px;
            font-weight: 600;

            &::after {
                content: '';
                display: flex;
                width: 10px;
                height: 6px;
                background-image: url(./svg/down.svg);
                background-repeat: no-repeat;
                background-size: cover;
            }
        }

        .body {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
			.body-item{
				width: 222px;
				height: 300px;
				position: relative;
				img {
					width: 222px;
					height: 300px;
				}
			}

        }

        .btn {
            border-radius: 12px;
            background: #FFF;
            box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
            display: flex;
            height: 80px;
            justify-content: center;
            align-items: center;
            color: #1E2637;
            font-family: "Alibaba PuHuiTi 3.0";
            font-size: 28px;
            font-style: normal;
            font-weight: 500;
        }
    }

    .list {
        padding: 30px 24px;

        &>div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 120px;
            color: #000;
            text-align: center;
            font-family: "PingFang SC";
            font-size: 26.923px;
            font-weight: 500;
            padding-inline-start: 46px;
            background-size: 30px;
            background-repeat: no-repeat;
            background-position: left center;
            background-image: url(./svg/select.svg);

            &.active {
                background-image: url(./svg/active.svg);
            }

            &:not(:first-child) {
                border-top: 2px solid #F2F2F2;
            }
        }

        .gameIcon {
            width: 100px;
            height: 50px;
            color: #696F7A;
        }
    }
</style>