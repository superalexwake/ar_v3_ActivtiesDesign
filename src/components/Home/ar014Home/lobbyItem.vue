<template>
    <div class="lobbyItem">
        <div class="h">
            <div class="t">
                <slot name="head"></slot>
            </div>
            <div v-if="isLeft" class="d">
                <div v-if="isMore" @click="more" class="more">{{ $t('more') }}</div>
                <div class="left" @click="handleOffset('left')"></div>
                <div class="right" @click="handleOffset('right')"></div>
            </div>
        </div>

        <Swipe class="my-swipe" ref="swipeRef" :autoplay="0" :lazy-render="false"
            :show-indicators="false">
            <SwipeItem v-for="(item, x) in picList" :key="x">
                <div class="b">
                    <div class="b-item" v-for="(game, i) in item" :key="i" @click="handleClick(game)">
						<img   v-lazy="game.img"  />
						<Maintain :item="game"/>
					</div>
                </div>
            </SwipeItem>
        </Swipe>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    import { splitIntoGroups } from '@/utils';
    import { Swipe, SwipeItem } from 'vant';
    import { computed, ref } from 'vue';
	import Maintain from '@/components/common/Maintain.vue'
    const swipeRef = ref()
    // 定义 props 接收父组件的 listData 和 isMore 属性
    const props = withDefaults(
        defineProps<{
            listData: Array<{ img: string;[key: string]: any }>;
            isMore?: boolean; // 可选属性 isMore
            isLeft?: boolean;
        }>(),
        {
            isMore: true, // 默认值设置为 true
            isLeft: true,
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
    const more = () => {
        emit('more-click'); // 向父组件发送事件和数据
    }
    /**
     * @description: 左右滚动游戏
     * @param {*} type
     * @return {*}
     */
    const handleOffset = (type: string): void => {
        if (type === 'left') {
            swipeRef.value?.prev()
        } else {
            swipeRef.value?.next()
        }
    }
</script>

<style lang="scss" scoped>

    .lobbyItem {
        .h {
            display: flex;
            justify-content: space-between;
            align-content: center;
            height: 44px;

            .t {}

            .d {
                display: flex;
                gap: 16px;

                &>div {
                    border-radius: 8px;
                    background: #FFF;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: none;

                    &.disabled {
                        cursor: not-allowed;
                        opacity: 0.5;
                    }
                }

                .more {
                    font-family: "Alibaba PuHuiTi 3.0";
                    font-size: 22px;
                    font-style: normal;
                    font-weight: 600;
                    padding: 0 16px;
                }

                .left {
                    width: 52px;
                    background-repeat: no-repeat;
                    background-image: url(./svg/a_l.svg);
                    background-size: contain;
                    background-position: center;
                }

                .right {
                    width: 52px;
                    background-repeat: no-repeat;
                    background-image: url(./svg/a_r.svg);
                    background-size: contain;
                    background-position: center;
                }
            }
        }

        .b {
            margin-top: 32px;
            display: flex;
            gap: 12px;
            overflow-x: auto;
			.b-item{
				width: 222px;
				height: 300px;
				position: relative;
				left: 1px;
				img {
					width: 222px;
					height: 300px;
				}
			}
        }
    }

</style>
