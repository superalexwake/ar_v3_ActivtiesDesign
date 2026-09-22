<template>
  <div class="infiniteScroll" ref="scrollRef">
    <slot name="content" :list="filterList"></slot>
    <slot name="loading">
      <div class="infiniteScroll__loading">
        <van-loading class="z-50" v-if="loading && !finished" />

        <slot name="empty" v-if="filterList.length === 0 && finished">
          <Empty />
        </slot>
        <div v-else-if="finished" ref="pullTextRef">
          {{ $t("noMoreThere") }}
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { AwaitApiResult } from "@/utils";
import { useElementBounding } from "@vueuse/core";
import { onBeforeUnmount, onMounted } from "vue";
import { ref, watch, nextTick, computed, unref } from "vue";
import Empty from "@/components/Empty/index.vue";
import usePullRefresh from "@/components/common/use/usePullRefresh";

/**
 * @description: 列表组件属性说明
 * @param {*} api api方法
 * @param {*} distance
 * @param {*} list 列表数组
 * @param {*} pageQuery 请求参数 内置pageNo、pageSize，如果传这些将覆盖
 * @param {*} totalCount 总数量
 * 废弃@param {*} isFirst 是否第一次请求  逻辑改为第一请求渲染之后启动监听bottom,不再需要此参数
 */
export type ListProps = {
  api: (parms: any) => Promise<any>;
  distance?: number;
  pageQuery?: any;
  list: Array<unknown>;
  isAutoLoad?: boolean;
  filterData?: Function;
};

const props = withDefaults(defineProps<ListProps>(), {
  pageQuery: {},
  isAutoLoad: true,
  distance: 100,
});
const filterList = computed(() => {
  let list = unref(props.list);
  if (props.filterData) return props.filterData(list) || [];
  return list || [];
});
const emit = defineEmits([
  "update:list",
  "update:pageQuery",
  "update:totalCount",
  "pageChange",
  "listChange",
]);
const { isAutoLoad } = props;

const finished = ref(false);
const pageInfo = ref<PageQuery>({
  pageNo: 1,
  pageSize: 10,
});
const loading = ref(false);

const getList = async (pageInfoNew?: {}) => {
  if (!pageInfo.value.pageNo || !pageInfo.value.pageSize) return;
  loading.value = true;
  let parms = {
    ...pageInfo.value,
    ...props.pageQuery,
    ...pageInfoNew,
  };
  const result = await AwaitApiResult(props.api(parms));
  if (result) {
    pageInfo.value.pageNo = result.data.pageNo;
    emit("pageChange", result.data);
    if (result.data.totalCount === 0 || result.data.totalPage === pageInfo.value.pageNo) {
      finished.value = true;
    }
    let list =
      pageInfo.value.pageNo === 1
        ? result.data.list
        : [...props.list.concat(result.data.list)];
    emit("update:list", list);
    emit("listChange", result);
    loading.value = false;
  } else {
    loading.value = false;
  }
};

const Lock = ref(false);
let unWatch: Function | null = null;
async function unWatchGetList() {
  if (unWatch) {
    unWatch();
    unWatch = null;
  }
  await getList();
  nextTick(() => {
    unWatch = watch(bottom, (val) => {
      const { innerHeight } = window;
      if (Lock.value) return;

      if (
        val <= innerHeight + props.distance &&
        val !== 0 &&
        pageInfo.value.pageNo >= 1 &&
        !loading.value &&
        !finished.value
      ) {
	    getList({ pageNo: pageInfo.value.pageNo + 1 });
        Lock.value = true;
        setTimeout(() => {
          Lock.value = false;
        }, 1000);
      }
    });
  });
}
onMounted(async () => {
  if (!isAutoLoad) return;
  await unWatchGetList();
});
onBeforeUnmount(async () => {
  // unWatchGetList()
});
/**
 * @description: 重置刷新列表
 * @return {*}
 */
const resetRefresh = () => {
  pageInfo.value = {
    pageNo: 1,
    pageSize: 10,
  };
  finished.value = false;
  emit("update:list", []);
  unWatchGetList();
};
const { elementRef: scrollRef } = usePullRefresh(resetRefresh);
const { bottom } = useElementBounding(scrollRef);
defineExpose({
  resetRefresh,
});
</script>

<style lang="scss" scoped>
.infiniteScroll {
  min-height: 200px;
  border-radius: 12px 12px 12px 12px;

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 88px;
    margin-top: auto;
    margin-bottom: 30px;
    color: var(--text_color_L1);
    font-size: 28px;
    text-align: center;

    .van-loading {
      text-align: center;
      z-index: 999;
    }
  }
}
</style>
