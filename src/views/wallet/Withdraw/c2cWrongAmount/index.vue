<template>
    <div class="wrongA">
        <div class="head">
            <NavBar title="" left-arrow @click-left="() => router.back()" backgroundColor="transparent" />
            <h1>{{ $t('c2cState14') }}</h1>
            <div>{{ $t('c2cTip35') }}</div>
            <div>{{ $t('c2cTip36') }}</div>
        </div>
        <div class="content">
            <div class="amount">
                <h1>{{ $t('c2cTip37') }}</h1>
                <p>{{ $t('c2cTip38') }}</p>
                <div class="input">
                    <div class="place-div">
                        {{ dollarSign }}
                    </div>
                    <van-field v-model.number="params.realAmount" center type="digit" :placeholder="$t('enterAmount')"
                        class="inp" />
                </div>
            </div>
            <div class="img">
                <h1>
                    {{ $t('c2cTip39') }} ({{ fileListImg.length }}/3)
                </h1>
                <van-uploader v-model="fileListImg" multiple :max-count="3" :max-size="5000 * 1024"
                    @oversize="() => showToast($t('C2Cuploadtip2'))" accept="image/*" :after-read="uploadFile"
                    :before-delete="deleteFile">
                    <div class="uploadImg">
                        {{ $t('c2cTip40') }}
                    </div>
                </van-uploader>
                <div class="tip">
                    <van-icon name="warning-o" size="18" />{{ $t('c2cTip41') }}
                </div>
            </div>
            <div class="img video">
                <h1>
                    {{ $t('c2cTip42') }} ({{ fileListVideo.length }}/1)
                </h1>
                <van-uploader v-if="!loading" v-model="fileListVideo" :max-count="1" :max-size="50000 * 1024"
                    @oversize="() => showToast($t('c2cTip51'))" accept="video/*" :after-read="uploadFileVideo">
                    <div class="uploadImg">
                        {{ $t('c2cTip43') }}
                    </div>
                    <template #preview-cover="{ file }">
                        <video class="v" controls v-if="videoUrl">
                            <source :src="videoUrl" type="video/ogg" />
                            <source :src="videoUrl" type="video/mp4" />
                            <source :src="videoUrl" type="video/webm" />
                        </video>
                    </template>
                </van-uploader>
                <div class="videoBox loading" v-if="loading">{{ $t('c2cTip44') }}</div>
            </div>
            <div class="cmdBth" :class="{ active: isActiveC }" @click="onSubmit">{{ $t('c2cState14') }}</div>
        </div>

    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SettingStore } from '@/stores'
import { computed, ref } from 'vue';
import { showToast } from 'vant'
import { AwaitApiResult, AwaitWrap, fixMsg } from '@/utils'
import { UploadImages, UploadVideos } from '@/api'
import { C2CWithdrawOrderAmountError } from '@/api/modules/wallet'
import { showFailToast } from 'vant'

const router = useRouter()
const { t } = useI18n()
const dollarSign = computed(() => SettingStore().getDollarSign)
const fileListImg = ref([])
const fileListVideo = ref([])
const imgUrlList: any = ref([])
const videoUrl = ref()
const videoUrl1 = ref()
const loading = ref(false)
const params = ref({
    orderNo: router.currentRoute.value.query?.orderNo,
    realAmount: 0,
    ossUrls: [{}]
})
const isActiveC = computed(() => {
    if (params.value.orderNo?.toString().trim().length == 0) return false
    if (Number(params.value.realAmount <= 0)) return false
    if (imgUrlList.value.length == 0) return false
    if (loading.value) return false
    return true
})

const uploadFile = async (file: any) => {
    console.log('file', file)
    const formData = new FormData()
    if (file?.length > 0) {
        file.forEach((item: any) => {
            formData.append('files', item.file)
        })
    } else {
        formData.append('files', file.file)
    }
    const result = await AwaitApiResult(UploadImages(formData))
    result.data.forEach((item: any) => {
        imgUrlList.value.push(item.src)
    })
    console.log(11, imgUrlList.value, result.data)
}
const deleteFile = (url, index) => {
    imgUrlList.value.filter((item, indexs) => {
        if (index.index == indexs) {
            imgUrlList.value.splice(indexs, 1)
        }
    })
    console.log(11, imgUrlList.value)
    return true
}

const uploadFileVideo = async (file: any) => {
    loading.value = true
    const formData = new FormData()
    formData.append('files', file.file)
    const result = await AwaitApiResult(UploadVideos(formData))
    if (result) {
        videoUrl.value = result.data[0].ossHttp + '/' + result.data[0].src
        videoUrl1.value = result.data[0].src
    } else {
    }
    loading.value = false

}
async function onSubmit() {
    if (!isActiveC.value) return
    if (loading.value) {
        return showFailToast({
            message: t('c2cTip45'),
            wordBreak: 'break-word'
        })
    }
    params.value.ossUrls.length = 0
    imgUrlList.value.forEach((item: any) => {
        params.value.ossUrls.push({
            fileType: 1,
            fileUrl: item
        })
    })
    if (videoUrl1.value) {
        params.value.ossUrls.push({
            fileType: 2,
            fileUrl: videoUrl1.value
        })
    }
    console.log(22, params.value)
    const [err, res] = await AwaitWrap(C2CWithdrawOrderAmountError(params.value))
    console.log(err, res)
    if (res.code == 0) {
        toBack(t('submitSuccess'))
    } else if (res.msgCode == '281' && res.code == 1) {
        toBack(res.msg)
    } else {
        fixMsg(res)
    }
}

function toBack(val: string) {
    showFailToast({
        message: val,
        wordBreak: 'break-word'
    })
    setTimeout(() => {
        router.replace({ name: 'Withdraw-C2cDetail', query: { order: params.value.orderNo } })
    }, 2000)
}
</script>
<style lang="scss" scoped>
.wrongA {
    font-weight: 400;

    .head {
        color: var(--textW);
        padding: 0 20px;
        background-repeat: no-repeat;
        background-size: 160px, 100%;
        background-repeat: no-repeat;
        background-position: right 20px top 110px, center;
        background-image: url('@/assets/icons/wallet/withdraw/c2c/wrong_1.png'), var(--main-color);
        padding-bottom: 40px;

        h1 {
            font-size: 36px;
            font-weight: 700;
            margin: 20px 0;
        }

        div {
            font-size: 26px;
            margin-bottom: 10px;
        }
    }

    .content {
        padding: 20px;

        .amount {
            background: var(--bg_color_L2);
            padding: 30px 20px;
            border-radius: 10px;
            box-shadow:var(--BoxShadowColor-9);

            h1 {
                font-size: 30px;
            }

            p {
                font-size: 22px;
                color: var(--text_color_L2);
            }

            .input {
                margin-top: 20px;
                justify-content: space-between;
                background: var(--walletBgColor-1);
                border-radius: 20px;
                height: 88px;
                padding: 20px;
                display: flex;
                align-items: center;

                .place-div {
                    position: absolute;
                    height: 88px;
                    width: 60px;

                    color: var(--main-color);
                    font-weight: 900;
                    font-size: 42px;
                    line-height: 88px;
                    html:lang(ar) &{
                        right: 15px;
                    }
                    &::after {
                        position: absolute;
                        content: '';
                        height: 40px;
                        display: inline-block;
                        margin: 0 10px 2px;
                        vertical-align: middle;
                        border-right: 2px solid var(--darkLight2,var(--gray-color-1));
                        top: 26px;
                        right: -30px;
                        html:lang(ar) &{
                            left: -30px;
                            right: auto;
                        }
                    }
                }

                .inp {
                    width: 70%;
                    background: none;
                    border: none;
                    margin-left: 100px;
                    padding-left: 20px;

                    :deep(.van-field__control) {
                        color: var(--main-color);
                        letter-spacing: 0.04em;
                        font-weight: 700;
                        font-size: 42px;
                    }

                    :deep(.van-field__control::placeholder) {
                        color: var(--gray-color-1);
                        font-size: 28px;
                        font-weight: 400;
                    }
                }
            }
        }

        .img {
            margin-top: 30px;

            h1 {
                display: flex;
                font-size: 32px;
                color: var(--text_color_L1);
                margin-bottom: 10px;

                &::before {
                    content: '';
                    width: 48px;
                    height: 48px;
                    background: url('@/assets/icons/wallet/withdraw/c2c/uploadImg1.png') no-repeat center;
                    background-size: cover;
                    margin-right: 10px;
                }
            }

            .uploadImg {
                color: var(--text_color_L2);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: var(--bg_color_L2);
                box-shadow:var(--BoxShadowColor-9);
                width: 200px;
                height: 200px;
                border-radius: 10px;
                gap: 10px;

                &::before {
                    content: '';
                    width: 50px;
                    height: 50px;
                    background: url('@/assets/icons/wallet/withdraw/c2c/uploadImg1.png') no-repeat center;
                    background-size: cover;
                }
            }

            .tip {
                margin-top: 20px;
                color: var(--main-color);
                letter-spacing: 0.88px;
                display: flex;
                align-items: center;
                gap: 5px;
            }

        }

        .video {
            height: 427px;

            h1 {
                &::before {
                    background: url('@/assets/icons/wallet/withdraw/c2c/uploadVideo.png') no-repeat center;
                    background-size: cover;
                }
            }

            :deep(.van-uploader) {
                width: 100%;
                height: 100%;

                .van-uploader__wrapper,
                .van-uploader__preview,
                .van-uploader__preview-cover,
                .van-uploader__input-wrapper {
                    width: 100%;
                    height: 100%;
                }
            }

            .uploadImg {
                height: 100%;
                width: 100%;

                &::before {
                    background: url('@/assets/icons/wallet/withdraw/c2c/uploadVideo1.png') no-repeat center;
                    background-size: cover;
                }
            }

            .v {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .videoBox {
                width: 100%;
                height: 100%;
            }

            .loading {
                width: 100%;
                height: 427px;
                z-index: 1;
                background: rgba(0, 0, 0, 0.5);
                color: var(--textW);;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .cmdBth {
            min-height: 70px;
            border-radius: 40px;
            color: var(--textW);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            font-weight: 700;
            margin-top: 100px;
            background: var(--main_gradient-color);

            &.active {
                background:  var(--main_gradient-color2);
            }
        }

    }




}

:deep(.van-uploader__preview-delete) {
    z-index: 2;
}</style>