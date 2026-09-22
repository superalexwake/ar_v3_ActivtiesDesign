<template>
    <div class="rule ruleHead">
        <svg-icon name="ruleHead"/>
        <div class="head">{{ name }}</div>
        <div v-for="(item, index) in tiplist" :key="index">
			<div v-if="render==='text'">{{ item }}</div>
			<div v-else v-html="item"></div>
		</div>
		<slot/>
    </div>
</template>

<script setup lang="ts">

defineProps({
	tiplist: {
		type: Array,
		default: []
	},
	render:{
		type: String,
		default: 'text'
	},
	name: {
		type: String,
		default: []
	}
})
</script>

<style lang="scss" scoped>
.rule {
    width: calc(100% - 48px);
    border: 4px solid var(--bgDark-2,var(--borderColor-5));
    border-top: none;
    margin: auto;
    padding: 0 24px 24px;
    background-color: var(--darkBg,var(--bg_color_L2));
    border-radius: 20px;
	position: relative;
    .head {
        width: 100%;
        position: relative;
        height: 60px;
        line-height: 60px;
        color: #fff;
        font-family: Inter;
        font-size: 32px;
        font-style: normal;
        font-weight: 700;
        text-align: center;
        margin-bottom: 12px;
        z-index: 2;
        html:lang(ar) &{
            right: -28px;
            left: auto;
        }
    }
    &> div:not(.head) {
        color: var(--text_color_L2);
        font-size: 26px;
        line-height: 34px;
        margin-bottom: 30px;
        padding-left: 26px;
        position: relative;
        &::before {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            top: 10px;
            height: 12px;
            width: 12px;
            flex: none;
            border-radius: 2px;
            transform: rotate(45deg);
            background: var(--main-color);
            html:lang(ar) &{
                left: auto;
                right: 0;
            }
        }
    }
}
</style>
