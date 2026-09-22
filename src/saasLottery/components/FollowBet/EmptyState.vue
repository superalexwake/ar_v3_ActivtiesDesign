<template>
  <div class="empty-state">
    <img src="./assets/img/empty-state.png" alt="Empty state" class="empty-image" />
    <p class="empty-text">{{$t('strategyTip')}}</p>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;

  .empty-image {
    width: 200px;
    height: 150px;
    margin-bottom: 20px;
  }

  .empty-text {
    font-size: 24px;
    color: #999;
    margin: 0;
  }
}
</style>