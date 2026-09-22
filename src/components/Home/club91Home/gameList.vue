<template>
    <div class="allGame">
        <div class="allGame-item" v-for="(i, k) in listData" :key="k" @click="onItemClick(i)">
			<img  v-lazy="i.img"  />
			<Maintain  :item="i"/>
		</div>
    </div>
</template>
<script setup lang="ts">
    import { computed, inject } from 'vue';
    // 使用 inject 接收父组件传递的实例
    const useHomeHook: any = inject('useHomeHook');
    const { homeState, onItemClick } = useHomeHook;

    // 定义 props 接收父组件的 activeType
    const props = defineProps<{
        activeType: string;
    }>();
    const listData = computed(() => {
        return homeState.allGameList[props.activeType.toLocaleLowerCase()] || [];
    })
</script>
<style lang="scss" scoped>
    .allGame {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
		.allGame-item{
			position: relative;
			width: 222px;
			height: 300px;
			img {
				width: 100%;
				height: 100%;
			}
		}

    }
</style>