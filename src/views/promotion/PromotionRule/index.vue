<template>
  <div class="promotion-page">
    <NavBar
      class="white"
      :title="$t('titleInvitationRule')"
      left-arrow
      @click-left="router.go(-1)"
    />
    <RuleContent />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import RuleContent from "@/components/Promotion/RuleContent/index.vue";
const { t: $t } = useI18n();
const router = useRouter();
</script>
