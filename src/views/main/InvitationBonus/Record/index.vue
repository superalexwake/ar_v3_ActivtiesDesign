<template>
	<NavBar :title="$t('inviteRecord')" left-arrow @click-left="router.go(-1)" />
    <div class="container">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('noMoreThere')"
          @load="onLoad"
        >
          <div v-for="item in list" class="item">
            <div class="head"><span class="name">{{ item.userName }}</span> <span class="uid">UID:{{ item.userID }}</span></div>
            <div class="line">{{ $t('registerTime') }}<span class="time">{{ item.createTime }}</span></div>
            <div class="line">{{ $t('rechageAmount') }}<span class="amount">{{ currency(item.rechargeAmount_All) }}</span></div>
          </div>
        </van-list>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { currency, AwaitApiResult } from '@/utils'
import { GetCurrentActivityLevel1People } from '@/api'

const loading = ref(false)
const finished = ref(false)
const router = useRouter()
const pageNo = ref(1)
const list = ref([])

const onLoad = async() =>{
    const res = await AwaitApiResult(GetCurrentActivityLevel1People({pageSize: 20, pageNo: pageNo.value}))
    if(res.code === 0) {
        list.value.push(...res.data.data)
        if(res.data.totalPage <= pageNo.value) {
            finished.value = true
        }
        pageNo.value++

    } else {
        finished.value = true
    }
    loading.value = false
    
}
</script>
<style lang="scss" scoped>
.container {
    padding: 24px;
    .item {
        padding: 30px 20px;
        background-color: var(--bg_color_L2);
        border-radius: 20px;
        &>div {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .head {
            margin-bottom: 34px;
        }
        .name {
            font-size: 30px;
            color: var(--text_color_L1);
        }
        .uid {
            font-size: 30px;
            color: var(--text_color_L2);
           
        }
        .line {
            color: var(--text_color_L2);
            font-size: 24px;
            span {
                color: var(--text_color_L3);
            }
            .amount {
                color: var(--norm_secondary-color);
               
            }
            & + .line {
                margin-top: 22px;
                font-size: 28px;
                
            }
        }
        & + .item {
            margin-top: 20px;
        }
    }
}
</style>