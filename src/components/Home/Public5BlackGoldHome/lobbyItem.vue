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

        <Swipe class="my-swipe" ref="swipeRef" :autoplay="3000" :lazy-render="false"
            :show-indicators="false">
			<SwipeItem v-for="(group, x) in picList2" :key="x">
				<div class="g">
					<div v-for="(row, rowIndex) in group" :key="rowIndex" class="row">
						<div v-for="(game, i) in row" :key="i"  @click="handleClick(game)">
							<img  v-lazy="game.img || game.vendorImg" />
							<Maintain :item="game"/>
						</div>
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

    // const picList = computed(() => {
    //     return splitIntoGroups(props.listData || [], 3)
    // })

	const picList2 = computed(() => {
		const groups = splitIntoGroups(props.listData || [], 6); // 每组6个
		return groups.map(group => splitIntoGroups(group, 3)); // 每组再分成两排，每排3个
	});

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
                    //background: #FFF;
					//background: var(--bg_color_L3, #382E35);
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
                    padding: 0 16px;
					background: var(--bg_color_L3, #382E35);
					border-radius: 8px;
					color: var(--main-color, #FED358);
                }

                .left {
                    width: 44px;
                    background-repeat: no-repeat;
                    background-image: url(./svg/a_l.svg);
                    background-size: contain;
                    background-position: center;
                }

                .right {
                    width: 44px;
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

            &>img {
                width: 222px;
                height: 300px;
                position: relative;
                left: 1px;
            }
        }

		.g{
			margin-top: 32px;
			display: flex;
			flex-direction: column;
			gap: 12px;

			.row {
				display: flex;
				gap: 12px;
				&>div{
					width: 222px;
					height: 300px;
					position: relative;
					 img {
						width: 222px;
						height: 300px;
					}
				}


			}
		}
    }

</style>
