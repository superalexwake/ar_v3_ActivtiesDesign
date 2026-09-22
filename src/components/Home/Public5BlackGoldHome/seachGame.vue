<template>
    <div class="allGame">
		<div class="head">
			<img :src="itemTitle[activeType]?.icon" alt="">
			<span>{{itemTitle[activeType]?.lable}}</span>
		</div>
		<van-tabs v-model:active="active" animated class="tabs-nav">
			<van-tab v-for="(type, i) in soltGameType" :key="i" :name="type">
				<template #title>
					<div class="tabs-btn"><svg-icon class="gameIcon" :name="type" />{{ getSlotTitle(type) }}</div>
				</template>
				<div class="slotsPic">
					<template v-if="soltGameList[active]">
						 <div v-for="(game, i) in soltGameList[active]" :key="i" @click="onItemClick(game)">
							 <img  v-lazy="game.img" alt=""  />
							 <Maintain :item="game" />
						 </div>
					</template>
				</div>
			</van-tab>
		</van-tabs>
        <div class="btn" @click="goleve2">{{ $t('viewAll') }}</div>
    </div>
</template>
<script setup lang="ts">
import iconHomeSlots from '@icon/home/Slots.png'
    import { getThirdGameList } from '@/api';
	import {AwaitApiResult, getSlotTitle} from '@/utils';
    import { computed, inject, onMounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	const { t } = useI18n();
    // 使用 inject 接收父组件传递的实例
    const useHomeHook: any = inject('useHomeHook');
    const { homeState, onItemClick,getSlotList } = useHomeHook;

    const router = useRouter()
    // 定义 props 接收父组件的 activeType
    const props = defineProps<{
        activeType: string;
    }>();
    const listData = ref([])
	const activeGame = ref({});
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

    watch(
        () => props.activeType,
        (newValue) => {
            if (typeList.value[0]) {
                getList(typeList.value[0].vendorId)
            }
        },
        { immediate: true }
    );

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

	const itemTitle= {
		Slot: {lable: t('electronicGame'), icon: iconHomeSlots},
	}

	const active = ref('');
	const soltGameType: any = ref([])
	const soltGameList: any = ref({})
	onMounted(async () => {
		await getSlotList()
		soltGameType.value = homeState.slotsGame.map((item:any) => {
			soltGameList.value[item.vendorCode] = item.childList.slice(0, 6)
			return item.vendorCode
		})

	})
</script>
<style lang="scss" scoped>
    .allGame {
        display: flex;
        flex-direction: column;
        gap: 24px;
		background:linear-gradient(180deg, #231C21 42.3%, rgba(35, 28, 33, 0.00) 100%);
		border-radius: 24px;
		padding:40px 24px;
		.head{
			color: var(--text_color_L1, #FDE4BC);
			font-family: "Alibaba PuHuiTi 3.0";
			font-size: 28px;
			font-style: normal;
			font-weight: 900;
			display: flex;
			align-items: center;
			img{
				width: 40px;
				height:40px;
				margin-right: 16px;
			}
		}
		:deep(.van-tabs__wrap) {
			margin-bottom: 20px;
			.van-tabs__nav {
				background: linear-gradient(180deg, rgba(232, 142, 52, 0.50) 0%, rgba(106, 94, 86, 0.20) 100%);
				stroke-width: 1px;
				stroke: #FDE4BC;
				border-radius: 12px;
				box-sizing: border-box;
				padding: 0;
				.van-tab--active {
					background:var(--main_gradient-color, linear-gradient(180deg, #FED358 0%, #FFB472 100%));;
					border-radius: 8px;
					.tabs-btn {
						color: #05012b;
					}
				}
				.tabs-btn {
					color:var(--text_color_L2);
					//transform: skewX(4deg);
				}
			}
			.van-tabs__line {
				background: transparent;
			}
		}

		.slotsPic {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			height: fit-content;
			padding: 0 1px;
			&>div{
				position: relative;
				width: calc((100% - 24px) / 3);
				height: 300px;
				img {
					width: 100%;
					height: 100%;
				}
			}

		}
		.gameIcon {
			width: 100px;
			height: 50px;
		}

        .btn {
			border-radius: 40px;
			background: var(--main_gradient-color, linear-gradient(180deg, #FED358 0%, #FFB472 100%));
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
</style>
