<template>
  <div class="feedback-container">
    <NavBar :title="$t('feedback')" left-arrow @click-left="router.go(-1)" />
    <div class="feedback-container-content">
      <div class="feedback-container-content-text">
        <div class="feedback-container-content-text-wrapper">
          <textarea
            v-model="pageQuery.content"
            name="feedback"
            id=""
            cols="30"
            rows="10"
            :placeholder="placeholderText"
          ></textarea>
        </div>
      </div>
      <div class="feedback-container-content-describe">
        <h5>{{ $t("tipAcessableFeedback") }}</h5>
        <h5>{{ $t("tipWinMysteryRewards") }}</h5>
        <div>
          <img src="@icon/main/feedbackImg.png" alt="" />
        </div>
      </div>
    </div>
    <div class="feedback-container-footer">
      <button @click="onFeedBack">{{ $t("submit") }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { AwaitApiResult } from "@/utils";
import { useRouter } from "vue-router";
import { SubmitSuggest } from "@/api";
import type { ReqSubmitSuggest } from "@/types/api";
import { showFailToast, showSuccessToast } from "vant";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const router = useRouter();
const placeholderText = t("feedbackPhTXT");
const pageQuery = reactive<ReqSubmitSuggest>({
  content: "",
});

//提交意见反馈
async function onFeedBack() {
  if (!pageQuery.content) {
    showFailToast({
      message: t("feedbackMsg"),
      wordBreak: "break-word",
    });
    return;
  }
  const res = await AwaitApiResult(SubmitSuggest(pageQuery));
  if (res) {
    showSuccessToast(t("submitSuccess"));
    router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
.feedback-container {
  margin-top: 24px;
  &-content {
    padding: 0 24px;

    &-text {
      height: 685px;
      background: var(--bg_color_L2);

      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px;

      &-wrapper {
        width: 100%;
        height: 400px;
      }

      span {
        font-size: 24px;
        color: var(--main-color);
      }

      textarea {
        border: none;
        font-size: 24px;
        width: 100%;
        height: 100%;
        background: transparent;
        color:var(--text_color_L1) ;
        &::placeholder{
          color:var(--text_color_L3) ;
        }
      }
    }

    &-uploadImg {
      img {
        width: 140px;
      }
    }

    &-describe {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 73px 0 84px;

      h5 {
        font-size: 28px;
        color: var(--darkTextW, var(--text_color_L1));
        margin-bottom: 15px;
      }

      img {
        width: 440px;
        margin-top: 37px;
      }
    }
  }

  &-footer {
    display: flex;
    justify-content: center;
    bottom: 80px;
    width: 100%;
    padding-bottom: 50px;

    button {
      width: 674px;
      height: 80px;
      font-size: 30px;
      background: var(--main_gradient-color);
      border-radius: 80px;
      color: var(--text_color_L4);
      border: none;
    }
  }
}
</style>
