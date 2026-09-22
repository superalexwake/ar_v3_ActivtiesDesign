<template>
	<div class="homeNav">
		<div class="title"><b />{{ $t('code9308Flash') }}</div>
		<div class="tip">{{ $t('flashText') }}</div>
        <div class="picContainer">
			<template v-if="!picList.length">
				<div class="b"></div>
				<div class="b"></div>
				<div class="b"></div>
				<div class="b"></div>
				<div class="b"></div>
			</template>
            <div class="picContainer-item" v-for="(game,i) in picList" :key="i" @click="onItemClick(game)">
				<img v-lazy="game.img" alt="" >
				<Maintain :item="game"/>
			</div>
			<div class="more" @click="gol2('flash')">
				<div class="more-l1">
					<svg-icon name="p3more" />
					{{ $t('more') }}
				</div>
				<div class="more-l2">{{ $t('code9308Flash') }}</div>
			</div>
        </div>
	</div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks';
import { computed } from 'vue';
const { homeState, onItemClick, gol2 } = useHome();
const picList = computed(()=>{
    return homeState.allGameList?.flash.slice(0,5) || [];
})
</script>
<style scoped lang="scss">
.title {
	height: 42px;
	display: flex;
	align-items: center;
	font-size: 30px;
	font-weight: 500;
	margin-bottom: 10px;
	b {
		display: block;
		height: 26px;
		width: 8px;
		border-radius: 4px;
		background-color: var(--main-color);
		margin-inline-end: 10px;
	}
}
.tip {
	font-size: 20px;
	color: var(--text_color_L2);
	margin-bottom: 24px;
}
.picContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
	&-item{
		position: relative;
		width: 220px;
		height: 300px;
		img{
			width: 100%;
			height: 100%;
		}
	}
    .b {
        width: 220px;
		height: 300px;
    }
}
</style>