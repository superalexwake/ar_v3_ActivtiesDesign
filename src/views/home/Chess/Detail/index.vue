<template>
	<div class="header">
		<div class="l1">
			<div class="backSvg" @click="goBack"></div>
			<div class="header_title">{{ $t('ChessandCards') }}</div>
			<div class="searchIcon" @click="isSearch = true"></div>
		</div>
		<div v-if="isSearch" class="l2">
			<div class="inputDom">
				<input type="text" :v-model="searchData" placeholder="Search games……" />
			</div>
			<div class="close" @click="closeSearch">Close</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const isSearch = ref(false)
const searchData = ref('')
const goBack = () => {
	router.push({
		name: 'Chess'
	})
}
const closeSearch = ()=> {
    searchData.value = '';
    isSearch.value = false
}
</script>

<style lang="scss" scoped>
.header {
	padding: 10px 16px;
	background: #141b26;
	& > div {
		display: flex;
		align-items: center;
		.searchIcon {
			background-image: url('@/assets/icons/home/search.svg');
			background-repeat: no-repeat;
			background-position: center;
			width: 48px;
			height: 48px;
		}
		&.l2 {
			height: 92px;
			display: flex;
			.inputDom {
				height: 100%;
				background-color: rgba(76, 96, 127, 0.12);
				border-radius: 16px 0 0 16px;
				flex: 1;
				background-image: url('@/assets/icons/home/search.svg');
				background-repeat: no-repeat;
				background-position: 20px center;
				padding-left: 80px;
				display: flex;
				align-items: center;
				input {
					height: 40px;
					width: 100%;
					outline: 0;
					border: 0;
					font-size: 30px;
					background: transparent;
					padding: 0 24px;
                    color: #DBE3ED;
					border-left: 1px solid #48586d;
					&::placeholder {
						color: #48586d;
					}
				}
			}
			.close {
				flex: none;
				width: 120px;
				line-height: 92px;
				background-color: rgba(76, 96, 127, 0.12);
				height: 100%;
				color: #48586d;
				text-align: center;
				border-radius: 0 16px 16px 0;
				position: relative;
				&::before {
					content: '';
					position: absolute;
					width: 40px;
					height: 100%;
					top: 0;
					left: 0;
					background: linear-gradient(65deg, transparent 0 40%, #141b26 40% 60%, transparent 60% 100%),
						linear-gradient(-65deg, transparent 0 40%, #141b26 40% 60%, transparent 60% 100%);
					background-size: 32px 50%;
					background-repeat: no-repeat;
					background-position: 0 bottom, 0 top;
				}
			}
		}
	}
	.backSvg {
		background-image: url('@/assets/icons/home/backButton.svg');
		background-repeat: no-repeat;
		background-position: center;
		width: 84px;
		height: 52px;
	}

	&_title {
		padding: 10px;
		font-family: Inter;
		font-size: 36px;
		font-style: italic;
		font-weight: 700;
		letter-spacing: -0.36px;
		background: linear-gradient(180deg, #f5f6ff -2.72%, rgba(245, 246, 255, 0) 219.64%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		flex: 1;
	}
}
</style>
