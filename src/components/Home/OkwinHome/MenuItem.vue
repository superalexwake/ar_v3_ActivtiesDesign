<script setup lang="ts">
import {ref} from "vue";
import NavTab from "@/components/FunTab/NavBar.vue";
import popular from '@public/home/okwinHome/popular.png';
import flash from '@public/home/okwinHome/flash.png';
import slot from '@public/home/okwinHome/slot.png';
import lottery from '@public/home/okwinHome/lottery.png';
import fish from '@public/home/okwinHome/fish.png';
import video from '@public/home/okwinHome/video.png';
import sport from '@public/home/okwinHome/sport.png';
import chess from '@public/home/okwinHome/chess.png';


const mentList = [
  {
    key: 'popular',
    type: 'hot',
    title: 'popular',
    icon: popular
  },
  {
    key: 'flash',
    type: 'code9308',
    title: 'flash',
    icon: flash
  },
  {
    key: 'slot',
    type: 'code9304',
    title: 'slot',
    icon: slot
  },
  {
    key: 'lottery',
    type: 'lottery',
    title: 'lottery',
    icon: lottery
  },
  {
    key: 'fish',
    type: 'code9303',
    title: 'fish',
    icon: fish
  },
  {
    key: 'video',
    type: 'code9306',
    title: 'video',
    icon: video
  },

  {
    key: 'sport',
    type: 'code9305',
    title: 'sport',
    icon: sport
  },
  {
    key: 'chess',
    type: 'code9307',
    title: 'chess',
    icon: chess
  },
]
const emit = defineEmits(['changeMenu'])
const isTop = ref(false)
const active = ref(0)

const props = defineProps({
  currentMenu: {
    type: String,
    default: 'popular'
  }
})

const handleChangeMenu = (item: any) => {
  if (props.currentMenu === item.key) return
  emit('changeMenu', {key: item.key, title: item.type})
  sessionStorage.setItem('currentKey', item.key)
	const contentHeight = document.getElementById('ok_game_main')?.offsetTop || 0
	const menu_listHeight = (document.querySelector('.menu_list') as HTMLElement)?.offsetHeight || 0
  // 添加一点动画效果
  if (isTop.value) {
    window.scrollTo({
      top: contentHeight- menu_listHeight,
      behavior: 'smooth'
    })
  }

}

const scrollChange = (val) => {
  const {scrollTop} = val
  if (scrollTop > 306) {
    isTop.value = true
  } else {
    isTop.value = false
  }
}

</script>

<template>
  <van-sticky :offset-top="0" @change="(val: boolean) => isTop = val" @scroll="scrollChange">    
    <div class="menu_list" :class="{topBg: isTop}">
      <NavTab :list="mentList" v-slot="{ item }" v-model:active="active"
      tabClassName="fff"
      >
        <div class="item" :class="{active_item: currentMenu === item.key}" @click="handleChangeMenu(item)">
          <img :src="item.icon" alt="" />
          <div class="title">{{ $t(item.type) }}</div>
        </div>
      </NavTab>
    </div>
  </van-sticky>
</template>

<style scoped lang="scss">
.menu_list {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: end;
  width: 100%;
  height: 178px;
  overflow-x: scroll;
  margin-bottom: 20px;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  ::v-deep(.fun-tabs) {
    background: none;
  }
  ::v-deep(.fun-tabs__tab-list) {
    align-items: end;

  }

  .item {
    position: relative;
	  margin-left: 16px;

    img {
      width: 110px;
      height: 140px;
    }

    .title {
      position: absolute;
      bottom: 16px;
      left: 0;
      text-align: center;
      width: 100%;
      font-size: 20px;
      color: #fff;
    }
  }


  .active_item {
    img {
      width: 140px;
      height: 178px;
    }
    .title {
      font-size: 26px;
      font-weight: 500;
    }
  }
}

.topBg {
  box-shadow: 0 12px 32px 0 rgba(0, 0, 0, 0.12);
  background-color: #f7f8ff;
}
</style>