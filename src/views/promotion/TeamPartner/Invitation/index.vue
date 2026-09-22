<script setup lang="ts">
import List from "@/components/common/List.vue";
import {GetPartnerRewardsDeatilList} from "@/api";
import {useAgent} from "@/hooks";
import {useI18n} from "vue-i18n";
import {currency} from '@/utils'
import { MyEmerdListData } from '../../../../types/api/interface/home';
const {query,partnerList,goBack}=useAgent();
const {t}=useI18n()
</script>

<template>
  <div class="invitation">
	  <NavBar
		  :title="$t('inviteRecord')"
		  left-arrow
		  @click-left="goBack"
	  />
	  <List
		  :distance="60"
		  :api="GetPartnerRewardsDeatilList"
		  v-model:list="partnerList"
		  v-model:page-query="query"
		  :isAutoLoad="true"
	  >
		  <template #content>
			  <ul>
				  <li v-for="item of partnerList" class="invitation-item">
					  <p><span class="name">{{item.nickName}}</span> <span class="uid">UID:{{item.userId}}</span></p>
					  <p><span>{{$t('registerTime')}}</span> <span>{{item.registerTime}}</span></p>
					  <p v-if="item.firstAmount > -1"><span>{{$t('deposit1a')}}</span> <span class="money">{{currency(item.firstAmount)}}</span></p>
					  <p v-if="item.secondAmount > -1"><span>{{$t('deposit2a')}}</span> <span class="money">{{currency(item.secondAmount)}}</span></p>
					  <p v-if="item.thirdAmount > -1"><span>{{$t('deposit3a')}}</span> <span class="money">{{currency(item.thirdAmount)}}</span></p>
					  <p v-if="item.status < 2"><span>{{$t('turnover')}}</span><span class="money turnover">{{currency(item.turnover)}}</span></p>
					  <p v-else><span>{{t('statusMay')}}</span> <span class="status" :class="{isRecharge:item.status==2}">{{item.status==3 ?t('rewardExpired'):t('bounsReceived')}}</span></p>
				  </li>
			  </ul>
		  </template>
	  </List>
  </div>
</template>

<style scoped lang="scss">
.invitation{
	padding:0 12px;
	ul{
		margin-block : 24px;
	}
 &-item{
	 height: fit-content;
	 padding: 30px 20px;
	 background:var(--bg_color_L2);
	 border-radius: 12px;
	 color: var(--text_color_L2);
	 font-size: 24px;
	 font-weight: 400;
	 margin-bottom: 15px;
	 &:last-child{
		 margin-bottom:0;
	 }
	 line-height: 28px;
	 p{
		 display: flex;
		 align-items: center;
		 justify-content: space-between;
		 margin-bottom: 34px;
		 &:last-child{
			 margin-bottom: 0;
		 }
	 }
	 .uid{
		 color: var(--text_color_L2);
		 font-size: 30px;
		 font-style: normal;
		 font-weight: 400;
		 line-height: 28px;
	 }
	 .money {
		color: var(--norm_red-color);
		font-size: 28px;
		font-weight: 500;
		&.turnover {
			color: var(--norm_secondary-color);
		}
	 }
	 .name{
		 color:var(--text_color_L1);

		 font-size: 30px;
		 font-style: normal;
		 font-weight: 400;
		 line-height: 28px;
	 }
	 .status{
		 color: var(--norm_red-color);
		 font-size: 28px;
		 font-style: normal;
		 font-weight: 400;
		 line-height: 32px;
		 &.isRecharge{
			 color: var(--norm_green-color);
		 }
	 }
 }
}
</style>