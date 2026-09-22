<script setup lang="ts">
import { getInvitedWheelRules } from "@/api";
import { AwaitApiResult } from "@/utils";
import { ref, watch} from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['update:visible'])
const isOpen = ref(false)
const richText = ref('')

const getRule = async () => {
  try {
    const res = await AwaitApiResult(getInvitedWheelRules())
    if (res.code === 0) {
      richText.value = res.data
    } else {
      richText.value = ''
    }
  } catch (error) {
    console.error('Error fetching rules:', error)
    richText.value = ''
  }
}

watch(
  () => props.visible,
  (newVal) => {
    isOpen.value = newVal
    if (newVal && !richText.value) {
      getRule()
    }
  },
  { immediate: true }
)

// onMounted(() => {
//   if (props.visible && !richText.value) {
//     getRule()
//   }
// })
</script>

<template>
  <div>
    <van-dialog v-model:show="isOpen" class="turntable_dialog" :confirm-button-text="$t('ok')"  @confirm="emit('update:visible', false)">
      <div class="header">{{ $t('rule') }}</div>
      <div class="content turntable_rule_custom">
        <div class="duan" v-html="richText">
        </div>
      </div>
  </van-dialog>
  </div>
</template>

<style scoped lang="scss">
/**首页公告弹窗样式 */
:deep() .van-dialog {
	width: 622px;
	height: 930px;
	border-radius: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;

	&__content {
		position: relative;
		width: 100%;

	}

	&__footer {
		z-index: 100;
		position: fixed;
		bottom: 30px;
		display: flex;
		flex-grow: 1;
		gap: 20px;
		width: 90%;
	}

	.van-button__text {
		color: #fff;
		width: 80%;
		height: 70px;
		text-align: center;
		line-height: 70px;
		background: var(--main_gradient-color);
		border-radius: 80px;
		z-index: 100;
		font-weight: 700;
		font-size: 32px;
		font-family: 'Inter';
		font-style: normal;
		letter-spacing: 5px;
	}
}


.header {
  width: 100%;
  height: 88px;
  line-height: 88px;
  color: #ffffff;
  font-weight: 700;
  font-size: 36px;
  text-align: center;
  background: var(--main_gradient-color);
}
.content {
  height: 700px;
  padding: 30px 20px;
  overflow-y: auto;
  :deep(.duan p) {
    font-size: 28px !important;
  }
}
</style>