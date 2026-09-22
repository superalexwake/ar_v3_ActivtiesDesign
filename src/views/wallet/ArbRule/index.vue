<template>
    <div class="RechargeArUpi__container">
        <NavBar :title="$t('arWallet')"  :placeholder="false" left-arrow @click-left="onClick"> </NavBar>
        <iframe class="iframe" sandbox="allow-same-origin allow-popups allow-scripts allow-top-navigation" frameborder="0" marginwidth="0"
            marginheight="0" vspace="0" hspace="0" allowtransparency="true" :allowfullscreen="true" ref="iframe"
            :src="submitUrl"></iframe>
    </div>
</template>

<script setup lang="ts">
import { useRoute,useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const submitUrl = computed(() => {
	const returnUrl = encodeURIComponent('https://' + window.location.host + '/#/' + 'main');
	const language = localStorage.getItem('language');
    return route.query.url+`?type=1&lang=${language}&returnUrl=${returnUrl}`
})


function onClick() {
    router.go(-1)
}
</script>

<style lang="scss" scoped>
.RechargeArUpi__container {
    position: relative;
    width: 100%;
    font-family: 'Inter', sans-serif;
    overflow: hidden;

    .iframe {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100vh;
        background: #eee;
    }
}
</style>
<style lang="scss">
.arupiNav{
    position: absolute;
    top: 0;
}
</style>
