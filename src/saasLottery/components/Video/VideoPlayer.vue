<script setup lang="ts">
import {onMounted, ref} from "vue";
import { createLivePlayer, register,isFLVSupported,live } from '@byteplus/veplayer';
import '@byteplus/veplayer/style';
import { flv, hls, rtm } from '@byteplus/veplayer-plugin';
import {getWingoLiveUrl} from '@/saasLottery/api';
register([rtm, flv, hls]);
let player:any=null;
async function createLive(urls:any) {
	if(isFLVSupported()){
		await createPlayer(urls.flv);
		return;
	}

	createPlayer(urls.rtm).then(function() {
		player.on(live.Events.ERROR, function(error){
			createPlayer(urls.hls)
		})
	})
}
async function createPlayer(url:any) {
	destroy();
	return createLivePlayer({
		url: url,
		lang: 'en',
		id: 'video',
		rtm: {
			enableFallback: false
		},
		controls:{
			play: true,
		}
	}).then(function(veplayer) {
		player = veplayer;
	})
}
function destroy() {
	if(player){
		player.destroy();
		player = null;
	}
}
const getPlayer = async () => {
	try {
		const {result,data}=await getWingoLiveUrl({
			isOriginalStream:false,
			transcodingStreamSuffix:'_hd',
			scheme:2
		});
		if (result){
			const video={
				rtm: data.replace('.flv','.sdp'),
				flv: data,
				hls: data.replace('.flv','.m3u8')
			};
			await createLive(video);
		}
	}catch (e) {

	}
}
onMounted(async ()=>{
  await getPlayer()
})
</script>

<template>
  <div class="video-container">
	  <div id="video">

	  </div>
  </div>
</template>

<style scoped lang="scss">
.video-container{
	height: 564px;
	width: 100%;
	.xgplayer{
		background: transparent;

	}
	:deep(.veplayer-unmute){
		display: none;
	}
	:deep(.xgplayer-play){
		display: none;
	}
	:deep(.xgplayer-loading){
		display: none;
	}
}
</style>