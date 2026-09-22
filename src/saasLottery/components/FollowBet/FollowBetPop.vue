<script setup lang="ts">
import {PropType, ref} from "vue";
import {Pagination as VanPagination, Icon as VanIcon} from 'vant';
defineProps({
  title:{
    type:String as PropType<string>
  },
  showPop:{
    type:Boolean as PropType<boolean>,
    default:false
  },
  /*是否显示分页*/
  isPagina:{
    type:Boolean as PropType<boolean>,
    default:false
  },
  /*是否显示*/
  isClose:{
    type:Boolean as PropType<boolean>,
    default:false
  },
  totalCount:{
    type:Number as PropType<number>,
    default:1,
    required:false
  },
  totalPage:{
    type:Number as PropType<number>,
    default:1,
    required:false
  },
  pageNo:{
    type:Number as PropType<number>,
    default:1,
    required:false
  }
})
const emit=defineEmits(['close','PaginatChange'])
const currentPage = ref(1);
</script>

<template>
  <van-popup
      :show="showPop"
      round
      :close-on-click-overlay="false"
	  :destroy-on-close="true"
      class="boxPop"
  >
    <div class="bet-rule">
      <div class="bet-rule-head">
        <div class="sound-dot"></div>
        <span>· {{ title }} ·</span>
        <div class="sound-dot"></div>
      </div>

      <div :class="['bet-rule-conent',!isPagina?'noPagtion':'']">
        <slot></slot>
      </div>
      <div class="bet-rule-foot" v-if="isPagina">
        <slot name="foot">
          <van-pagination
              force-ellipses
              v-model="currentPage"
              :items-per-page="10"
              :total-items="totalCount"
              :page-count="totalPage"
              @change="(res:any)=>{emit('PaginatChange',res)}"
          >
            <template #prev-text>
              <van-icon name="arrow-left" />
            </template>
            <template #next-text>
              <van-icon name="arrow" />
            </template>
            <template #page="{ text }">{{ text }}</template>
          </van-pagination>
        </slot>
      </div>

      <!-- 关闭按钮图标 -->
      <div class="closeIcon" @click="emit('close')" v-if="isClose">
        <img src="./assets/img/close.png" alt="">
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">

.bet{
  &-rule {
    //position: relative;
    width: 650px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;

    &-head {
      height: 88px;
      line-height: 88px;
      color: #fff;
      font-size: 32px;
      text-align: center;
      background: var(--main-color);
      background-size: contain;
	  border-radius:16px 16px 0 0;
      span{
        margin: 0 10px;
      }
    }
    &-dot{
      height: 6px;
      width: 6px;
      background: var(--bg_color_L2);
      border-radius: 50%;
    }

    &-conent {
      position: relative;
      //height: 882px;
      max-height: calc(80vh - 200px);
      overflow-y: auto;
      overflow-x: hidden;
      color:var(--text_color_L1);
      background: var(--bg_color_L2);
      padding: 20px 20px 0 20px;
      font-weight: 500;
      font-size: 28px;
      //line-height: 40px;
      //:deep(p) {
      //  line-height: 40px;
      //}
      &.noPagtion{
        border-radius: 0 0 16px 16px;
	  	padding: 20px;

      }
    }


    &-foot {
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--bg_color_L2);
      border-radius: 0 0 16px 16px;
      &-btn {
        width: 320px;
        background: #f3f4fa;
        border-radius: 40px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 28px;
        color: #323536;
        font-weight: 500;
      }
    }
    .closeIcon{
      margin: 32px auto;
      width:60px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
.boxPop{
  background: transparent;
	overflow: initial;
	:deep(.van-pagination__item){
		color: var(--main-color, #06B36A);
    background: transparent;
	}
  :deep(.van-pagination__item--active){
    background: var(--main-color, #06B36A);
    color: var(--text_color_L4, #FFF) !important;
  }
  :deep(.van-pagination__item--prev, .van-pagination__item--next){
    background: transparent;
  }
  :deep(.van-pagination__item--disabled, .van-pagination__item--disabled:active){
    background: transparent;
  }
}

</style>