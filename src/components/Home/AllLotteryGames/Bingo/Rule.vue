<script setup></script>
<template>
	<div class="container">
		<div class="first-paragraph">
			<p class="first-statement">
				{{$t('binguoRuleText1')}}
			</p>
		</div>
		<!-- ------------------------- First paragraph ends here--------------------------- -->
		<div class="paragraph-two">
			<p class="paragraph-two-statement">
				{{$t('binguoRuleText2')}}
			</p>
		</div>
		<!-- ------------------------- Paragraph two ends here--------------------------- -->

		<div class="paragraph-three">
			<p class="paragraph-three-statement">{{ $t('binguoRuleText3') }}</p>
		</div>
		<!-- ------------------------- Paragraph three ends here--------------------------- -->

		<div class="svg-container">
			<div class="first-vector">
				<svg xmlns="http://www.w3.org/2000/svg" width="132" height="14" viewBox="0 0 132 14" fill="none">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M0 6.99997C-2.41411e-08 6.72383 0.223857 6.49997 0.499999 6.49997L119.5 6.49996C119.776 6.49996 120 6.72382 120 6.99996C120 7.27611 119.776 7.49996 119.5 7.49996L0.5 7.49997C0.223858 7.49997 2.41411e-08 7.27612 0 6.99997Z"
						fill="url(#paint0_linear_22_2052)"
					/>
					<path
						d="M119.515 8.41418C118.734 7.63313 118.734 6.3668 119.515 5.58575L123.757 1.34311C124.538 0.562062 125.805 0.562062 126.586 1.34311L130.828 5.58575C131.609 6.3668 131.609 7.63313 130.828 8.41418L126.586 12.6568C125.805 13.4379 124.538 13.4379 123.757 12.6568L119.515 8.41418Z"
						fill="url(#paint1_linear_22_2052)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_22_2052"
							x1="126"
							y1="7.00003"
							x2="-4.8188e-08"
							y2="7.00003"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#5DBA47" />
							<stop offset="1" stop-color="#5DBA47" stop-opacity="0" />
						</linearGradient>
						<linearGradient
							id="paint1_linear_22_2052"
							x1="126"
							y1="7.00003"
							x2="-4.8188e-08"
							y2="7.00003"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#5DBA47" />
							<stop offset="1" stop-color="#5DBA47" stop-opacity="0" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div class="vector-heading">{{ $t('gamePlay') }}</div>

			<!-- ------------------------- vector heading ends here--------------------------- -->

			<div class="vector-two">
				<svg xmlns="http://www.w3.org/2000/svg" width="132" height="14" viewBox="0 0 132 14" fill="none">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M132 6.99997C132 6.72383 131.776 6.49997 131.5 6.49997L12.5 6.49996C12.2239 6.49996 12 6.72382 12 6.99996C12 7.27611 12.2239 7.49996 12.5 7.49996L131.5 7.49997C131.776 7.49997 132 7.27612 132 6.99997Z"
						fill="url(#paint0_linear_22_2053)"
					/>
					<path
						d="M12.4853 8.41418C13.2664 7.63313 13.2664 6.3668 12.4853 5.58575L8.24268 1.34311C7.46163 0.562062 6.1953 0.562062 5.41425 1.34311L1.17162 5.58575C0.390564 6.3668 0.390564 7.63313 1.17162 8.41418L5.41425 12.6568C6.1953 13.4379 7.46163 13.4379 8.24268 12.6568L12.4853 8.41418Z"
						fill="url(#paint1_linear_22_2053)"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_22_2053"
							x1="6.00001"
							y1="7.00003"
							x2="132"
							y2="7.00003"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#5DBA47" />
							<stop offset="1" stop-color="#5DBA47" stop-opacity="0" />
						</linearGradient>
						<linearGradient
							id="paint1_linear_22_2053"
							x1="6.00001"
							y1="7.00003"
							x2="132"
							y2="7.00003"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#5DBA47" />
							<stop offset="1" stop-color="#5DBA47" stop-opacity="0" />
						</linearGradient>
					</defs>
				</svg>
			</div>
		</div>

		<!-- ------------------------- vector two ends here--------------------------- -->

		<!-- ///////////////////////////////////////////////////// First container div starts from here   ///////////////////////////////////////////////////////////////////// -->

		<div class="details-container-one">
			<div class="details-container-items">{{$t('xosoTxt60')}}</div>
			<!-- ------------------------- svg right ends here--------------------------- -->

			<!-- ------------------------- details container heading ends here--------------------------- -->

			<div class="first-heading">{{$t('binguoRuleText4')}} <span class="fontBold">{{$t('binguoRuleText5')}}</span>{{$t('binguoRuleText6')}}</div>

			<!-- ------------------------- first-heading ends here--------------------------- -->

			<div class="paragraph-inside-container">
				<div class="paragraph-title"><span>{{$t('binguoRuleText7')}}:</span>{{$t('binguoRuleText8')}}</div>
			</div>
			<div class="paragraph-inside-container">
				<div class="paragraph-title"><span>{{ $t('binguoRuleText9') }}:</span>{{$t('binguoRuleText10')}}</div>
			</div>
			<div class="paragraph-inside-container">
				<div class="paragraph-title"><span>{{ $t('binguoRuleText17') }}:</span>{{$t('binguoRuleText18')}}</div>
			</div>
			<div class="paragraph-inside-container">
				<div class="paragraph-title"><span>{{$t('binguoRuleText11')}},</span>{{$t('binguoRuleText12')}}</div>
			</div>
		</div>
		<!-- First container ends here  -->

		<!-- ///////////////////////////////////////////////////// 2nd container div starts from here   ///////////////////////////////////////////////////////////////////// -->

		<div class="details-container-one">
			<div class="details-container-items">{{$t('same')}}</div>
			<!-- ------------------------- svg right ends here--------------------------- -->

			<!-- ------------------------- details container heading ends here--------------------------- -->

			<div class="first-heading">{{ $t('binguoRuleText4') }} <span class="fontBold">1,2,3,4,5,6</span></div>

			<!-- ------------------------- first-heading ends here--------------------------- -->

			<div class="paragraph-inside-container">
				<div class="paragraph-title">{{$t('binguoRuleText13')}}</div>
			</div>
		</div>

		<!-- ///////////////////////////////////////////////////// 3rd container div starts from here   ///////////////////////////////////////////////////////////////////// -->

		<div class="details-container-one">
			<div class="details-container-items">{{ $t('sameNum') }}</div>
			<!-- ------------------------- svg right ends here--------------------------- -->

			<!-- ------------------------- details container heading ends here--------------------------- -->

			<div class="first-heading">{{$t('binguoRuleText4')}}<span class="fontBold">11,22...66</span></div>

			<!-- ------------------------- first-heading ends here--------------------------- -->

			<div class="paragraph-inside-container">
				<div class="paragraph-title">{{$t('binguoRuleText14')}}</div>
			</div>
		</div>

		<!-- ///////////////////////////////////////////////////// 4th container div starts from here   ///////////////////////////////////////////////////////////////////// -->

		<div class="details-container-one">
			<div class="details-container-items">{{ $t('numbersMatch') }}</div>
			<!-- ------------------------- svg right ends here--------------------------- -->

			<!-- ------------------------- details container heading ends here--------------------------- -->

			<div class="first-heading">{{$t('binguoRuleText4')}}<span class="fontBold">111,222...666,***</span></div>

			<!-- ------------------------- first-heading ends here--------------------------- -->

			<div class="paragraph-inside-container">
				<div class="paragraph-title">{{$t('binguoRuleText15')}}</div>
			</div>
			<div class="paragraph-inside-container">
				<div class="paragraph-title">{{$t('binguoRuleText16')}}</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@mixin statement-one-design {
	color: #fff;
	font-size: 20px;
	font-style: normal;
	font-weight: 400;
	letter-spacing: 0.24px;
	padding-top: 30px;
	line-height: 30px;
	text-align: justify;
}

@mixin statement-two-design {
	color: #fff;
	font-size: 24px;
	font-style: normal;
	font-weight: 400;
}

@mixin bold-heading {
	font-weight: 700;
}
.container {
	background-color: var(--LotteryBingoBg);
	border-radius: 15px;
	padding-bottom: 24px;
	.first-paragraph {
		width: auto;
		height: auto;
		.first-statement {
			@include statement-one-design;
		}
	}
	// First paragraph ends here
	.paragraph-two {
		width: auto;
		height: auto;
		.paragraph-two-statement {
			@include statement-one-design;
			letter-spacing: 0.6px;
		}
	}

	//   paragraph two finish here
	.paragraph-three {
		height: 60px;
		.paragraph-three-statement {
			@include statement-one-design;
			line-height: 24px;
			letter-spacing: 0px;
		}
	}
	//   paragraph three finish here
	.svg-container {
		width: 100%;
		display: flex;
		margin-top: 50px;
		justify-content: center;
		svg {
			width: 120px;
		}
		.first-vector {
			height: 12.485px;
			flex-shrink: 0;
		}
		.vector-heading {
			color: var(--colorText-25);
			font-size: 28px;
			font-style: normal;
			font-weight: 700;
			line-height: 28px; /* 100% */
			text-align: center;
			margin: 0 20px;
		}

		.vector-two {
			width: 131.414px;
			height: 12.485px;
			flex-shrink: 0;
		}
	}

	// vectors finished here
	.details-container-one {
		width: 100%;
		color: #fff;;
		border-right: 2px solid var(--borderColor-11);
		border-bottom: 2px solid var(--borderColor-11);
		border-left: 2px solid var(--borderColor-11);
		margin-top: 60px;
		border-radius: 15px 15px 0px 0px;
		background-color: var(--borderColor-11);
		padding-bottom: 30px;
		.details-container-items {
			width: 100%;
			height: 40px;
			background: url('@/assets/icons/home/AllLotteryGames/binguo/rule_bg.png') no-repeat center center;
			background-size: 100% 40px;
			text-align: center;
			color: var(--LotteryBingoTextColor);
			font-size: 24px;
			font-style: normal;
			font-weight: 700;
			line-height: 40px; /* 150% */
		}

		// container-heading-finished here
		.first-heading {
			color: #fff; 
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 24px; /* 100% */
			margin-left: 14px;
			margin-top: 20px;
		}
		.fontBold {
			font-weight: 700;
		}
		.paragraph-inside-container {
			margin-top: 20px;
			width: 100%;
			display: flex;
			padding: 0 16px;
			font-size: 24px;
			font-weight: 400;

			.paragraph-title {
				color: #fff; 
				line-height: 30px; /* 100% */
				margin-left: 10px;
				position: relative;
				padding-left: 10px;
				span {
					font-weight: 700;
				}
			}
			.paragraph-title::after {
				content: '';
				position: absolute;
				top: 0;
				left: -10px;
				display: inline-block;
				width: 10px;
				height: 10px;
				transform: rotate(45deg);
				flex-shrink: 0;
				border-radius: 2px;
				background-color: var(--LotteryBingoBg-3);
				margin-top: 8px;
				html:lang(ar) &{
					right: -10px;
					left: unset;
				}
			}

			.paragraph-body {
				width: 68%;
				display: flex;
				color: #fff; 
				font-family: Inter;
				font-size: 100%;
				font-style: normal;
				font-weight: 400;
				line-height: 24px;
				flex-shrink: 0;
				height: auto;
				text-align: justify;
			}

			// .dot-rotate {
			// 	width: 10px;
			// 	height: 10px;
			// 	transform: rotate(45deg);
			// 	flex-shrink: 0;
			// 	border-radius: 2px;
			// 	background-color: var(--LotteryBingoBg-3);
			// 	margin-top: 8px;
			// 	margin-left: 30px;
			// }
		}
	}
}
</style>
