<template>
    
    <div v-if="messageList" class="mList">
        <div v-for="(item,i) in messageList" :key="i" @click="messageS=i">
          <div class="title">
            {{ item.title }}
            <uIcon v-if="messageS == i" />
            <dIcon v-else />
          </div>
          <div v-if="messageS == i" class="body">{{ item.b }}</div>
        </div>
      </div>
</template>
<script setup lang="ts">
import uIcon from '../../svg/u.svg';
import dIcon from '../../svg/d.svg';
import { ref } from 'vue';
defineProps({
	messageList: {
		default: ():any => []
	},
})
const messageS = ref(-1);
</script>
<style lang="scss" scoped>
.mList {
    border-radius: 32px;
    background: #FFF;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 20px;
    .title {
      color: #323536;
      font-size: 28px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
      svg {
        width: 24px;
        height: 20px;
      }
    }
    .body {
      color: #929292;
      font-size: 24px;
      margin-top: 8px;
      
    }
  }
</style>