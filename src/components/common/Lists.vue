<template>
  <div class="infiniteScroll" ref="scrollRef">
    <slot name="content" :list="list"></slot>
    <slot name="loading">
      <div class="infiniteScroll__loading">
        <van-loading class="z-50" v-if="loading && !finished" />
        <Empty v-if="list.length === 0 && !isFirst" class="mgt40" />
        <div v-else-if="finished">{{ $t("noMoreThere") }}</div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from "@vueuse/core";
import { onMounted } from "vue";
import { ref, watch } from "vue";
import Empty from "@/components/Empty/index.vue";

/**
 * @description: 列表组件属性说明
 * @param {*} api api方法
 * @param {*} distance
 * @param {*} list 列表数组
 * @param {*} pageQuery 请求参数 不需要传pageNo、pageSize，传其他信息
 * @param {*} totalCount 总数量
 * @param {*} isFirst 是否第一次请求
 * @param {*} isLoad 决定是否触发 触底加载事件
 */
export type ListProps = {
  api: (parms: any) => Promise<any>;
  distance: number;
  pageQuery: any;
  list: Array<unknown>;
  isFirst: boolean;
  isAutoLoad?: boolean;
  isLoad?: boolean;
};

type ListData<T> = {
  data: {
    code: number;
    msg: string;
    msgCode: number;
    data: {
      list: T;
      totalCount: number;
      pageNo: number;
      totalPage: number;
    };
  };
};

const props = withDefaults(defineProps<ListProps>(), {
  isAutoLoad: true,
});

const scrollRef = ref<HTMLElement>((null as unknown) as HTMLElement);
const { bottom } = useElementBounding(scrollRef);
const emit = defineEmits([
  "update:list",
  "update:isFirst",
  "update:pageQuery",
  "update:totalCount",
  "pageChange",
]);
const { isAutoLoad } = props;
onMounted(() => {
  if (isAutoLoad) {
    console.log(1);
    getList();
  }
});

const finished = ref(false);
const pageInfo = ref<PageQuery>({
  pageNo: 1,
  pageSize: 10,
});
const loading = ref(false);

const getList = async () => {
  try {
    loading.value = true;
    let parms = {
      ...props.pageQuery,
      ...pageInfo.value,
    };
    const result: ListData<any> = await props.api(parms);
    if (result) {
      const { list, totalCount, totalPage } = result.data.data;
      // console.log(result.data.data)
      emit("pageChange", list);
      if (totalCount === 0 || totalPage === pageInfo.value.pageNo) {
        finished.value = true;
      }
      if (props.pageQuery.pageSize > totalCount) {
        finished.value = false;
      }
      emit(
        "update:list",
        pageInfo.value.pageNo === 1 ? list : [...props.list.concat(list)]
      );
    }
  } catch (err: any) {
    throw err;
  } finally {
    loading.value = false;
  }
  if (props.isFirst) {
    emit("update:isFirst", false);
  }
};

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
  getList();
};

defineExpose({
  resetRefresh,
});

const Lock = ref(false);
watch(bottom, (val) => {
  const { innerHeight } = window;
  if (Lock.value) return;
  if ((!props.isFirst && !props.isAutoLoad) || !props.isLoad) return;
  if (
    val <= innerHeight + props.distance &&
    pageInfo.value.pageNo >= 1 &&
    !loading.value &&
    !finished.value
  ) {
    pageInfo.value.pageNo = pageInfo.value.pageNo + 1;
    getList();
    console.log(12);
    Lock.value = true;
    setTimeout(() => {
      Lock.value = false;
    }, 1000);
  }
});
</script>

<style lang="scss" scoped>
.infiniteScroll {
  &__loading {
    width: 100%;
    min-height: 55px;
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
