<template>
	<div class="verifyInput__container" v-show="showVerify">
		<div class="verifyInput__container-label" v-show="!(isShowVerifyT === false && typeP === 'updateEmail')">
			<svg-icon name="safeIcon" class="verifyInput__container-label__icon" />

			<span v-if="typeP === 'updateEmail' || typeP === 'lock'">{{ $t('sendVerifyCodeTo') }} {{ hideEmail(email) }}</span>
			<span v-else>{{ $t('verifyCode') }}</span>
		</div>
		<div class="verifyInput__container-input">
			<input
				type="text"
				v-model="verifyValue"
				:placeholder="$t('phEnterVerificationCode')"
				maxlength="6"
				@input="onInput"
			/>
			<button
				@click="handleVerify"
				:class="{
					inActive: userStore.countEmailDown > 0
				}"
			>
				<span v-if="userStore.countEmailDown === 0"> {{ $t('send') }} </span>
				<span v-else> {{ userStore.countEmailDown }}S </span>
			</button>
		</div>
		<div v-show="!isFirst" class="verifyInput__container-tip">
			<van-icon name="warning-o" />
			<span>{{ $t('codeUnreceived') }}?</span>
			<span @click="onservice()">{{ $t('contactServicer') }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { hideEmail } from '@/utils'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import i18n from '@/languages'
import { useServer } from '@/hooks/useServe.hook'

const { t } = useI18n()
const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })
const userStore = useUserStore()
const router = useRouter()
const prop = withDefaults(
	defineProps<{
		value?: string
		typeP?: string //判断是否从更换手机号页面进入
		isShowVerifyT?: boolean //判断从更换手机号页面进入的时候，要不要显示验证码上方的标题
		placeholder?: string
		sendFunc?: Function
		number?: string
		numberType?: string
		showVerify?: boolean //判断组件是否显示隐藏
		email?: string
		loginType?: string //登录方式进行处理
	}>(),
	{
		// placeholder: inject('phStr'),
		showVerify: true,
		placeholder: i18n.global.t('registerTip6'),
		email: ''
		//numberType: '66' //一般用不到，为了防止万一数据丢失
	}
)

const emit = defineEmits<{
	(e: 'update:value', val: string): void
}>()

const verifyValue = computed({
	get(): string {
		return prop.value || ''
	},
	set(val: string) {
		emit('update:value', val)
	}
})

const isFirst = ref(true)

async function handleVerify() {
	if (isFirst.value) isFirst.value = false
	if (userStore.countEmailDown > 0) return
	userStore.sendEmailCode()
	prop.sendFunc && prop.sendFunc()
}

const email = computed(() => {
	return localStorage.getItem('email') || prop.email
})
// 去掉邀请码的空格
const onInput = (payload: Event) => {
	const target = payload.target as HTMLInputElement
	// target.value = target.value.trim()
	target.value = target.value.replace(/\s+/g, '') //去掉所有空格
	target.value = target.value.replace(/[^\d]/g, '') //纯数字输入框
}

function onservice() {
	getSelfCustomerServiceLink()
}
</script>

<style lang="scss" scoped>
.verifyInput__container {
	margin-bottom: 60px;
	padding: 0 2px;

	&-label,
	&-input {
		display: flex;
		align-items: center;
	}

	&-label {
		margin-bottom: 24px;

		color: var(--text_color_L1);
		font-size: 30px;

		&__icon {
			width: 48px;
			height: 48px;
			margin-right: 12px;
			color: var(--main-color);
		}
	}

	&-input {
		position: relative;
		gap: 18px;
		border-radius: 20px;
		input {
			width: 99%;
			height: 88px;
			padding: 27px 26px;
			font-size: 28px;
			border: none;
			border-radius: 20px;
			background-color: var(--bg_color_L2);
			color: var(--text_color_L1);
			&::placeholder {
				color: var(--text_color_L3);
			}
		}

		button {
			position: absolute;
			right: 20px;
			width: 190px;
			height: 70px;
			color: var(--text_color_L4);
			font-size: 26px;

			border: none;
			border-radius: 144px;
			background: var(--main_gradient-color);
			&.inActive {
				text-shadow: none;
				background: var(--button_dis_color);
				color: var(--text_color_L3);
				pointer-events: none;
				cursor: not-allowed;
			}
		}
	}

	&-tip {
		display: flex;
		align-items: center;
		margin-top: 18px;
		color: var(--norm_red-color);

		i {
			font-size: 36px;
			margin-inline: 7px;
		}

		span {
			font-size: 24px;

			&:last-of-type {
				margin-left: 24px;
				color: var(--main-color);
			}
		}
	}
}
</style>
