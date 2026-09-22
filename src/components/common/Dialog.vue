<template>
  <div class="dialog" :class="{ active: show, inactive: !show }">
    <div class="dialog__container" role="dialog" tabindex="0">
      <div class="dialog__container-img" v-if="isShowHeader">
        <slot name="header">
          <img v-lazy="getWalletIcon(imgUrl)" :class="{succed : imgUrl == 'succeed'}" alt="" />
        </slot>
      </div>

      <div class="dialog__container-title">
        <slot name="title">
          <h1>{{ title }}</h1>
        </slot>
      </div>

      <div class="dialog__container-content">
        <slot name="content"></slot>
      </div>

      <div class="dialog__container-footer" v-if="showFooter">
        <slot name="footer">
			<button
				@click="
			  () => {
				emits('confirm');
			  }
			"
			>
				{{ confirmText || $t("confirm") }}
			</button>
          <button
            v-if="showCancelBtn"
            @click="
              () => {
                emits('update:show', false);
              }
            "
          >
            {{ cancelText || $t("cancel") }}
          </button>


        </slot>
      </div>
      <img
        class="close_img"
        v-if="showCloseIcon"
        src="@public/common/close.png"
        @click="closeOnClickOutSide"
      />
    </div>
    <div class="dialog__outside" @click="closeOnClickOutSide"></div>
  </div>
</template>

<script setup lang="ts">
import { getWalletIcon } from "@/utils/assetIcons";
import { watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  confirmText: {
    type: String,
    default: "",
  },
  showCancelBtn: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: "",
  },
  clickOutSide: {
    type: Boolean,
    default: false,
  },
  isShowHeader: {
    type: Boolean,
    default: true,
  },
  imgUrl: {
    type: String,
    default: "tip",
  },
  showCloseIcon: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
});

watch(
  () => props.show,
  (val) => {
    if (val) window.addEventListener("touchmove", preventScroll, { passive: false });
    else window.removeEventListener("touchmove", preventScroll);
  }
);

const emits = defineEmits<{
  (e: "update:show", val: boolean): void;
  (e: "confirm"): void;
}>();

function closeOnClickOutSide(e: Event) {
  if (props.clickOutSide) {
    emits("update:show", false);
  }
}

const preventScroll = (e: Event) => {
  // if (props.show) e.preventDefault()
};
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bgcolor-32);
  transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
  z-index: 2004;

  &.active {
    opacity: 1;
    visibility: visible;

    .dialog__container {
      transform: scale(1);
      opacity: 1;
    }
  }

  &.inactive {
    opacity: 0;
    visibility: hidden;

    .dialog__container {
      transform: scale(0.3);
      opacity: 0;
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 600px;
    min-height: 400px;
    border-radius: 20px;
    background: var(--bgDark-4, var(--bg_color_L2));
    transition: opacity 0.3s, transform 0.3s ease-in-out;
    z-index: 2003;

    padding: 20px 20px;
    border-radius: 20px;
    .close_img {
      position: absolute;
      bottom: -80px;
      width: 60px;
      height: 60px;
    }

    &-img {
      svg,
      :deep(img) {
		  width: 168px;
		  height: 168px;
        object-fit: contain;
		  &.succed{
			  width: 280px;
			  height: 162px;
			  position: relative;
			  margin-top: -56px;
		  }
      }
    }

    &-title {
      margin-top: 26px;
      font-size: 36px;
      font-weight: bold;
      color: var(--text_color_L1);
    }

    &-content {
      margin-top: 22px;
      color: var(--text_color_L2);
      font-size: 24px;
      font-weight: 400;
    }

    &-footer {
      display: initial;
      width: 100%;
      margin-top: 60px;
      padding: 0 20px;

      button {
        width: 100%;
        height: 80px;
        color: var(--main-color);
        font-size: 32px;
        text-align: center;
        border-radius: 9rem;
        border: 1px solid var(--main-color);
        background: transparent;

        &:first-of-type {
			margin-bottom: 20px;
          color: var(--text_color_L4);
          background: var(--main_gradient-color);
        }
      }
    }
  }

  &__outside {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: default;
    background: rgba(0,0,0,.6);
    z-index: 2002;
  }
}
.close_img {
  width: 60px;
  height: 60px;
  position: absolute;
  bottom: -80px;
  left: 50%;
  margin-left: -30px;
}
</style>
