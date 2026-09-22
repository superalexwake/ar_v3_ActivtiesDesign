<template>
	<div class="explain">
		<div v-if="showType !== '5'" class="explain-label">
			<img src="@icon/promotion/shuoming.png" />
			<h1>{{ $t('rechargeInstruction') }}</h1>
		</div>
		<div v-if="showType === '1'" class="explain-content">
			<div>
				<span class="logo"></span><span class="text">{{ $t('explainDesc1') }}</span>
			</div>
			<div>
				<span class="logo"></span><span class="text">{{ $t('explainDesc2') }}</span>
			</div>
			<div>
				<span class="logo"></span><span class="text">{{ $t('explainDesc3') }}</span>
			</div>
		</div>
		<div v-else-if="showType === '2'" class="explain-content">
			<div>
				<span class="logo"></span>
				<span class="text">
					{{ $t('explainDesc4') }}
					<h6 class="red">1%</h6>
					{{ $t('explainDesc5') }}
				</span>
			</div>
			<div>
				<span class="logo"></span><span class="text">{{ $t('explainDesc6') }}</span>
			</div>
			<div>
				<span class="logo"></span><span class="text">{{ $t('explainDesc7') }}</span>
			</div>
		</div>
		<div v-else-if="showType === '5'" class="explain-content">
			<div>
				<span class="logo"></span>
				<span class="text">
					{{ $t('explainDesc8') }}
					<h6 class="lightRed">588</h6>
					{{ $t('explainDesc9') }}
				</span>
			</div>
			<div>
				<span class="logo"></span><span class="text">{{ $t('explainDesc10') }} 00：00-23:59</span>
			</div>
			<div>
				<span class="logo"></span><span class="text">{{ $t('explainDesc11') }}</span>
			</div>
			<div>
				<span class="logo"></span><span class="text">{{ $t('explainDesc12') }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const prop = withDefaults(
	defineProps<{
		showType: string //提示文本类型,默认第一种,规则1到5属于充值，5到10属于提现
	}>(),
	{
		showType: '1'
	}
)
</script>

<style lang="scss" scoped>
.explain {
	background: var(--darkBg,var(--bg_color_L2));
	box-shadow:var(--BoxShadowColor-9);
	border-radius: 20px;
	padding: 20px 25px 40px;
	margin: 30px 0;

	&-label {
		display: flex;
		align-items: center;
		margin-bottom: 15px;

		h1 {
			font-weight: 600;
			font-size: 30px;
			line-height: 36px;
			color: var(--text_color_L1);
		}

		img {
			width: 45px;
			margin-right: 5px;
		}
	}

	&-content {
		border: 1px solid var(--Dividing-line_color);
		border-radius: 20px;
		padding: 30px 30px;

		> div {
			display: flex;
			padding: 10px;
			line-height: 40px;
		}

		.logo {
			width: 9px;
			height: 9px;
			background: var(--colorText-26);
			border-radius: 2px;
			transform: rotate(45deg);
			margin-right: 30px;
			margin-top: 15px;
		}

		span {
			letter-spacing: 0.04em;
			text-align: left;
			color: var(--text_color_L2);
			font-weight: 400;
			font-size: 24px;
		}

		h6 {
			display: inline;

			&.red {
				color: var(--norm_red-color);
			}

			&.lightRed {
				color: var(--main-color);
			}
		}
	}
}
</style>
