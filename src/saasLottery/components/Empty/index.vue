<template>
  <div class="empty__container">

	  <svg-icon name="empty" />
    <slot name="text">
      <p>{{ $t("noData") }}</p>
    </slot>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.empty__container {
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    width: 388px;
    height: 227px;
    margin-top: 30px;
    margin-bottom: 18.5px;
  }

  p {
    font-size: 26px;
    margin-top: 20px;
  }
}
</style>
