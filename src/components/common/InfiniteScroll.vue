<template>
  <div class="infiniteScroll" ref="scrollRef">
    <slot name="content"></slot>
    <slot name="loading">
      <div class="infiniteScroll__loading">
        <van-loading class="z-50" v-if="loading && !finished" />
        <div v-else-if="finished" ref="pullTextRef">
          {{ $t("noMoreThere") }}
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from "@vueuse/core";
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    distance: number;
    loading: boolean;
    finished: boolean;
    page: number;
    onArrivedBottom: () => void;
  }>(),
  {}
);
const Lock = ref(false);
const scrollRef = ref<HTMLElement>((null as unknown) as HTMLElement);
const { bottom } = useElementBounding(scrollRef);
watch(bottom, (val) => {
  const { innerHeight } = window;
  if (Lock.value) return;
  if (
    val <= innerHeight + props.distance &&
    props.page >= 1 &&
    !props.loading &&
    !props.finished
  ) {
    props.onArrivedBottom();
    Lock.value = true;
    setTimeout(() => {
      Lock.value = false;
    }, 500);
  }
});

// const state = ref({
// 	pulling: false,
// 	startY: 0,
// 	distance: 0,
// 	threshold: 0
// })

// const reset = () => {
// 	state.value.pulling = false
// 	state.value.distance = 0
// }

// const checkPullUp = () => {
// 	const { threshold, distance } = state.value
// 	if (distance >= threshold && !state.value.pulling) {
// 		state.value.pulling = true
// 		props.onArrivedBottom()
// 	}
// }

// const ease = (distance: number) => {
// 	const pullDistance = 50
// 	distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4
// 	console.log(bottom.value)

// 	return Math.round(distance - 37.5)
// }

// const pullTextRef = ref<HTMLElement>()
// const { direction } = useSwipe(pullTextRef, {
// 	passive: false,
// 	onSwipeStart: (e) => {
// 		if (state.value.pulling) return
// 		state.value.startY = e.touches[0].clientY
// 	},
// 	onSwipe: (e) => {
// 		if (state.value.pulling || direction.value !== 'UP') return

// 		const { clientY } = e.touches[0]
// 		const distance = clientY - state.value.startY

// 		if (distance < 0) {
// 			state.value.distance = distance
// 			if (scrollRef.value) {
// 				scrollRef.value.style.transition = `transform 0ms ease-in-out`
// 				scrollRef.value.style.transform = `translate3d(0, ${ease(distance)}px, 0)`
// 			}
// 		} else {
// 			state.value.distance = 0
// 		}
// 	},
// 	onSwipeEnd: () => {
// 		if (state.value.pulling) return
// 		state.value.threshold = 50
// 		checkPullUp()
// 		reset()
// 		if (scrollRef.value) {
// 			scrollRef.value.style.transition = `transform 500ms ease-in-out`
// 			scrollRef.value.style.transform = `translate3d(0, 0, 0)`
// 		}
// 	}
// })
</script>

<style lang="scss" scoped>
.infiniteScroll {
  &__loading {
    width: 100%;
    min-height: 55px;
    margin-top: auto;
    margin-bottom: 30px;
    font-size: 28px;
    text-align: center;
    color: var(--text_color_L1);
     .van-loading {
      text-align: center;
      z-index: 999;
    }
  }
}
</style>
