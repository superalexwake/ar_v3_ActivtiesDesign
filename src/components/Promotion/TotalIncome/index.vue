<template>
	<div class="container">
		<div class="container__header">
			<img src="@icon/promotion/wallet.png" alt="" />
			<span>{{ $t('totalCommision') }}</span>
		</div>
		<div class="container__body">
			<div class="top">888'888'888'88</div>
			<div class="bottom">
				<span>{{ $t('totalCommisionThisWeek') }}</span>
				<span></span>
				<span>888'888'888'88</span>
			</div>
		</div>
		<div class="container__footer">
			<div>
				<span>888'888'888'88</span>
				<span>{{ $t('totalCommisionDirect') }}</span>
			</div>
			<span></span>
			<div>
				<span>888'888'888'88</span>
				<span>{{ $t('totalCommisionTeam') }}</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	height: 340px;
	max-height: 340px;
	margin-top: 23px;
	padding: 28px;
	font-family: $font-family;
	border-radius: 20px;
	background: url('../../../assets/icons/images/promotion/totalIncomeBg.png') no-repeat top center / contain;
	background-color: var(--textW);
	box-shadow:var(--BoxShadowColor-9);

	&__header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
		font-size: 26px;

		img {
			width: 36px;
			height: 36px;
		}
	}

	&__body {
		display: flex;
		flex-direction: column;

		.top {
			color: var(--main-color);
			margin-bottom: 8px;
			font-size: 48px;
			font-weight: 700;
			line-height: 48px;
		}

		.bottom {
			display: flex;
			align-items: center;
			justify-content: space-evenly;
			width: 360px;
			height: 46px;
			line-height: 46px;
			border-radius: 9rem;
			background: var(--bgColor-6);

			span {
				&:nth-child(1) {
					font-size: 22px;
					color: var(--text_color_L2);
				}

				&:nth-child(2) {
					width: 0.5px;
					height: 20px;
					background: var(--bgcolor-42);
				}

				&:nth-child(3) {
					color: var(--text_color_L1);
					font-size: 24px;
				}
			}
		}
	}

	&__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 43px;
		font-family: 'Inter', sans-serif;

		& > div {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 12px;

			span {
				&:first-of-type {
					color: var(--text_color_L1);
					font-size: 30px;
					font-weight: 500;
				}

				&:last-of-type {
					color: var(--text_color_L2);
					font-size: 24px;
				}
			}
		}

		& > span {
			width: 0.5px;
			height: 75.5px;
			background: var(--gray-color-1);
		}
	}
}
</style>
