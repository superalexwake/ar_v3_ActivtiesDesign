<template>
    <div class="lobbyItem">
        <div class="h">
			<slot name="head"></slot>
        </div>
        <Swipe class="my-swipe" ref="swipeRef" :autoplay="false" :lazy-render="false"
            :show-indicators="false">
            <SwipeItem v-for="(item, x) in picList" :key="x">
                <div class="b">
					<div v-for="(game, i) in item" :key="i">
						<div class="b-img">
							<img  v-lazy="game.img" @click="handleClick(game)" />
							<Maintain :item="game"/>
						</div>

						<p>{{gameType || game.vendorCode}}</p>
						<div>{{getSlotTitle(game.gameNameEn || game.slotsName)}}</div>

					</div>
                </div>
            </SwipeItem>
        </Swipe>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    import { splitIntoGroups,getSlotTitle } from '@/utils';
    import { Swipe, SwipeItem } from 'vant';
    import { computed, ref } from 'vue';
    const swipeRef = ref()
    // 定义 props 接收父组件的 listData 和 isMore 属性
    const props = withDefaults(
        defineProps<{
            listData: Array<{ img: string;[key: string]: any }>;
            isMore?: boolean; // 可选属性 isMore
            isLeft?: boolean;
			gameType?: string;
        }>(),
        {
            isMore: true, // 默认值设置为 true
            isLeft: true,
			gameType:''
        }
    );

    const picList = computed(() => {
        return splitIntoGroups(props.listData || [], 3)
    })
    // 定义 Emits
    const emit = defineEmits<{
        (e: 'item-click', item: any): void;
        (e: 'more-click'): void;
    }>();
    // 处理点击事件
    function handleClick(item: any) {
        emit('item-click', item); // 向父组件发送事件和数据
    }
</script>

<style lang="scss" scoped>

    .lobbyItem {
        .h {
            display: flex;
            justify-content: space-between;
            align-content: center;
            height: 44px;

        }

        .b {
            margin-top: 32px;
            display: flex;
            gap: 12px;
            overflow-x: auto;
            &>div {
				position: relative;
				margin-top: 16px;
				width: calc((100% - 24px) / 3);
				.b-img{
					width: 222px;
					height:304px;
					position: relative;
					left: 1px;
					img{
						width: 100%;
						height: 100%;

					}
				}
				&> p{
					color: var(--text_color_L1);
					font-size: 20px;
					margin:6px 0;
				}
				&> div{
					color: var(--text_color_L1);
					font-size: 22px;
					font-weight: 700;
				}
            }
        }
    }

</style>
