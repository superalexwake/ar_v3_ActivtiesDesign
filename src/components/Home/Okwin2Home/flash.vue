<template>
    <div class="okwin2Home_flash">
        <div class="title">{{ $t('code9308') }}</div>
        <div class="container">
            <div class="container-item" v-for="(item, i) in picList1" :key="i" @click="onItemClick(item)">
				<img  v-lazy="item.img"  />
				<Maintain :item="item"/>
			</div>
            <div class="all" @click="gol2('flash')">{{ $t('all') }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import { computed } from 'vue'
import Maintain from '@/components/common/Maintain.vue'

const { homeState, onItemClick, gol2 } = useHome()
const picList1 = computed(() => {
    return homeState.allGameList?.flash || []
})
</script>

<style scoped lang="scss">
.okwin2Home_flash {
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
        background-image: url('./assets/icon_mini.svg');
        background-repeat: no-repeat;
        background-size: 40px;
    }
    .container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
		.container-item{
			position: relative;
			width: calc((100% - 36px) / 3);
			border-radius: 20px;
			img {
				width: 100%;
				border-radius: 20px;
			}
		}

        .all {
            width: 100%;
            height: 78px;
            font-size: 28px;
            font-style: normal;
            font-weight: 600;
            border-radius: 40px;
            border: 1.5px solid #d0ffef;
            color: var(--text_color_L4);
            background: var(--main_gradient-color);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
        }
    }
}
</style>