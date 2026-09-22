<template>
    <div class="okwin2Home_sport">
        <div class="title">{{ $t('sport') }}</div>
        <div class="container">
           <div v-for="(item, i) in picList1" :key="i"   @click="onItemClick(item)">
			   <img  v-lazy="item.vendorImg" />
			   <Maintain :item="item"/>
		   </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import { computed } from 'vue'
import Maintain from '@/components/common/Maintain.vue'

const { homeState, onItemClick } = useHome()
const picList1 = computed(() => {
    return homeState.allGameList?.sport || []
})
</script>

<style scoped lang="scss">
.okwin2Home_sport {
    .title {
        color: var(--text_color_L1, #e3efff);
        font-family: Poppins;
        font-size: 28px;
        font-style: normal;
        font-weight: 600;
        height: 42px;
        display: flex;
        align-items: center;
        margin: 40px 0 20px 0;
        padding-inline-start: 52px;
        gap: 12px;
        background-image: url('./assets/icon_sport.svg');
        background-repeat: no-repeat;
        background-size: 40px;
    }
    .container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
		&>div{
			position: relative;
			width: calc((100% - 36px) / 3);
			border-radius: 20px;
			img {
				width:100%;
				border-radius: 20px;
			}
		}

    }
}
</style>