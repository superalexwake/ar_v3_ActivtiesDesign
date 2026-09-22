<template>
	<div class="fish_game">
		<NavBar
			:title="$t('fishing')"
			backgroundColor="linear-gradient(90deg, #CF0305 0%, #F23F3A 100%)"
			:placeholder="false"
			left-arrow
			@click-left="onClick"
		>
		</NavBar>
		<div class="fish_list">
			<div v-for="item in gameList" :key="item.vendorId" @click="onItemClick(item)">
				<img class="gameImg" v-lazy="item.img"  />
				<Maintain :item="item"/>
			</div>

		</div>
	</div>
</template>
<script lang="ts" setup>
import { getGameUrl, getThirdGameList } from '@/api'
import router from '@/router'
import type { Fish } from '@/types/api'
import {AwaitApiResult, encodeToBase64, getUserAgent, isOpenInternalUrl, isPC, openInternalUrl, partyUrl} from '@/utils'
import { showDialog } from 'vant'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import {isHybridApp, openBrowser} from "@/utils/jsBridge";

const gameList = reactive<Fish[]>([])
const { t } = useI18n()

const onClick = () => {
	router.back()
}

const getFishList = async () => {
	const res = await AwaitApiResult(getThirdGameList({ type: 11 }))
	if (res) {
		gameList.push(...res.data.gameLists)
	}
}

const onItemClick = (item: any) => {
	showDialog({
		title: t('tips'),
		message: t('tipsPlayGame'),
		cancelButtonText: t('cancel'),
		showCancelButton: true
	}).then(async () => {
		let query = {
			gameCode: item.gameCode || item.gameID,
			vendorCode: item.hasOwnProperty('vendorCode')&&item.vendorCode?item.vendorCode:Number(item.vendorId) || Number(item.slotsTypeID)
		}
		if (item.hasOwnProperty('vendorCode')){
			query.deviceType=getUserAgent(false)
		}else {
			query.phonetype= getUserAgent()
		}
		const res = await AwaitApiResult(
			getGameUrl({
				...query,
			})
		)
		if (res) {
			if(isOpenInternalUrl()) {
      		  	openInternalUrl({
					...(res?.data||{}),
					title: item.slotsName || item.gameNameEn || ''
      		  })
      		} else if (isHybridApp()) {
				openBrowser('game', {
					...(res?.data||{}),
					gameName: item.slotsName || item.gameNameEn || ''
				})
			}else{
				if (isPC||['Wickets9','CMD','IM','SaBa','ARLottery'].includes(query.vendorCode)){
					return partyUrl(res?.data, 1)
				}
				return router.push({
					name:'game',
					query:{
						url:encodeToBase64(res?.data?.url),
						vendorCode:query.vendorCode,
					}
				})
			}

		}
	})
}

getFishList()
</script>
<style lang="scss" scoped>
.fish_game {
	padding: 24px;
	.fish_list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 24px;
		margin-bottom: 62px;
		&>div {
			position: relative;
			width: 216px;
			height: auto;
		}
		.gameImg {
			width: 216px;
			//height: 216px;
		}
	}
}
</style>
