<script setup lang="ts">
import {useRouter} from "vue-router";
import {GetThirdGameAwardRecordPageList} from '@/api'
import { currency, desensitizeString } from '@/utils'
import { useAssets } from '@/hooks/useAssets'
import List from '@/components/common/ListSimply.vue'
import {reactive, ref} from "vue";

const router = useRouter();
const { getAvatarUrl } = useAssets()
const AwardsRecordPageList = ref<any[]>([])
const pageQuery = reactive<any>({
  pageSize: 10,
  isAll: true
})

</script>

<template>
 <div class="jackpot-star">
   <NavBar :title="$t('winningstar')" left-arrow @click-left="router.go(-1)"/>
   <List
       :api="GetThirdGameAwardRecordPageList"
       v-model:list="AwardsRecordPageList"
       v-model:page-query="pageQuery"
   >
     <template #content>
       <div class="jackpot-star-list">
         <div class="star-item" v-for="(item, index) in AwardsRecordPageList" :key="index">
           <div class="starheader">
             <img v-lazy="getAvatarUrl(item.userPhoto)" :data-img="getAvatarUrl(1)" />
             <div class="nickname">{{ desensitizeString(item.userName) }}</div>
           </div>
           <div class="solidline"></div>
           <div class="starcontent">
             <div class="rowcontent">
               <div class="label">{{ $t('gamename') }}</div>
               <div class="name">{{ item.gameName }}</div>
             </div>
             <div class="rowcontent">
               <div class="label">{{ $t('Winningmultiple') }}</div>
               <div class="multiple">{{ item.multiple + 'X' }}</div>
             </div>
             <div class="rowcontent">
               <div class="label">{{ $t('winTips5') }}</div>
               <div class="money">{{ currency(item.bonusAmount) }}</div>
             </div>
             <div class="rowcontent">
               <div class="label">{{ $t('winningtime') }}</div>
               <div class="time">{{ item.createTime }}</div>
             </div>
           </div>
         </div>
       </div>
     </template>
   </List>

 </div>
</template>

<style scoped lang="scss">
.jackpot-star{
  // background-color: #F6F6F6;
  &-list{
    padding: 0 24px;
  }
  .star-item{
    border-radius: 20px;
    background: var(--darkBg,var(--bg_color_L2));
    padding: 30px 20px;
    margin-top: 24px;
    margin-bottom: 20px;
  }
  .starheader {
    display: flex;
    flex-direction: row;
    .nickname {
      font-size: 28px;
      color: var(--darkTextW,var(--text_color_L1));
      font-weight: bold;
      margin-bottom: 45px;
      margin-top: 25px;
      margin-left: 20px;
    }
    img {
      width: 73px;
      height: 73px;
      border-radius: 37px;
    }
  }
  .rowcontent{
    border-radius: 6px;
    background: var(--bg_color_L3);
    margin: 5px 0;
    display: flex;
    align-items: center;
    height: 50px;
    justify-content: space-between;
    padding: 10px 20px;
     div{
       flex: 1;
     }
    .label{
      color: var(--text_color_L2);
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
    }
    .time{
      color: var(--text_color_L2);
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
    }
    .multiple{
      color: var(--norm_secondary-color);
      font-size: 28px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
    .money{
      color: var(--norm_red-color);
      font-size: 28px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
    .name{
      color: var(--text_color_L1);
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
    }
  }

}
</style>