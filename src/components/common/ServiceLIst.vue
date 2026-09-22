<template>
    <div class="content">
        <div>
            <div
                class="content-item"
                v-for="(item, index) in list"
                :key="index"
                @click="
                    () => {
                        emits('onClick', item)
                    }
                "
            >
                <div class="content-item-title">
                    <img v-if="item.imageUrl" :src="item.imageUrl" alt="" />
                    <i v-else class="cstype-icon" :class="`cstype-${item.typeID}`" />
                    <span>{{ item.typeName || item.name }}</span>
                </div>
                <van-icon name="arrow" size="18px" color="#A8A8A8" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = withDefaults(
    defineProps<{
        list: any
    }>(),
    {
        list: {
            type: Array,
            default: () => []
        }
    }
)

const emits = defineEmits<{
    (e: 'onClick', item: any): void
}>()
</script>

<style lang="scss" scoped>
.content {
    padding: 26px 26px;
    position: relative;
    z-index: 99;
    width: 750px;
    height: 100%;
    background: var(--bg_color_L1);
    border-top-right-radius: 40px;
    border-top-left-radius: 40px;

    &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 698px;
        height: 110px;
        background: var(--bg_color_L2);
        border-radius: 10px;
        color: var(--text_color_L2);
        padding: 26px 26px;

        img {
            width: 80px;
            padding-right: 24px;
        }

        .cstype-icon {
            display: inline-block;
            width: 80px;
            height: 80px;
            padding-right: 24px;
            background: no-repeat center / contain;
            box-sizing: content-box;
        }
        @for $i from 1 through 7 {
            .cstype-#{$i} { background-image: url('@public/main/CStype#{$i}.png'); }
        }

        span {
            font-size: 28px;
            color: var(--text_color_L1);
        }

        &-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }
}
</style>
