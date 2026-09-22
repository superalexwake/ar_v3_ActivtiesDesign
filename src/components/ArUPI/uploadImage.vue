<template>
	<div class="updaloadImage">
		<div class="img">
			<div class="title mb12 x-row x-row-between x-row-middle">
				<h1><span style="color: #ee4d4d">*</span>{{ $t('sellTip13', [fileListImg.length]) }}</h1>
				<div class="right" @click="() => (showVsImg = true)">{{ $t('vsImg') }}</div>
			</div>
			<van-uploader
				:disabled="disabled"
				:after-read="afterRead"
				v-model="fileListImg"
				:max-count="3"
				:max-size="5000 * 1024"
				@oversize="() => showToast($t('sellTip14'))"
				accept="image/*"
				:readonly="readonly"
				:name="1"
			>
				<div class="uploadImg x-row x-column x-row-middle-center">
					<van-image width="25" height="25" fit="cover" :src="updateImgIcon" />
					{{ $t('uploadImage') }}
				</div>
			</van-uploader>
			<div class="tip-p mt5 pb10">
				<van-icon name="warning" color="#F63E3E" class="img" />
				{{ $t('sellTip15') }}
			</div>
		</div>
		<div class="img video">
			<div class="title mb12 x-row x-row-between x-row-middle">
				<h1>
					{{ $t('sellTip16', [fileListVideo.length]) }}
				</h1>
				<div class="right" @click="() => (showVsVideo = true)">{{ $t('vsVideo') }}</div>
			</div>
			{{ VideoName }}
			<van-uploader
				:disabled="disabled"
				:after-read="afterRead"
				v-model="fileListVideo"
				:max-count="1"
				:max-size="50000 * 1024"
				@oversize="() => showToast($t('sellTip17'))"
				accept="video/*"
				:readonly="readonly"
				:name="2"
				:preview-image="false"
			>
				<div class="uploadImg x-row x-column x-row-middle-center">
					<van-image width="25" height="25" fit="contain" :src="videoIcon" />
					{{ $t('UploadVideo') }}
				</div>
			</van-uploader>
			<div class="videoBox" v-if="uploadV || fileListVideo.length > 0">
				<div class="del" @click="clearVideo"><van-icon class="icon" name="cross" /></div>
				<video class="v" controls :src="fileListVideo[0].url ? fileListVideo[0].url : page?.baseUrl + VideoName"></video>
			</div>
		</div>
		<VsImgVideo v-model:show="showVsImg" v-if="showVsImg">
			<img :src="getVsImgVideo[0]" />
		</VsImgVideo>
		<VsImgVideo v-model:show="showVsVideo" v-if="showVsVideo">
			<video controls>
				<source :src="getVsImgVideo[1]" type="video/ogg" />
				<source :src="getVsImgVideo[1]" type="video/mp4" />
				<source :src="getVsImgVideo[1]" type="video/webm" />
			</video>
		</VsImgVideo>
	</div>
</template>
<script lang="ts" setup>
import { getFileType, getFileNameUUID } from '@/utils'
import vsImg from '@public/arupi/vsImg.jpg'
import updateImgIcon from '@public/arupi/updateImg.png'
import videoIcon from '@public/arupi/video1.png'
import { showToast, showLoadingToast, showFailToast } from 'vant'
import { useVModels } from '@vueuse/core'
import { PutImage, upLoaderImg } from '@/api/arupi/uploader'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import VsImgVideo from './vsImgVideo.vue'
import { useRututnUrl, useStorage } from '@/hooks'
const { goMerchant } = useRututnUrl()
import { reactive } from 'vue'
import { SettingStore } from '@/stores'
const props = withDefaults(
	defineProps<{
		fileListImg: any
		fileListVideo: any
		readonly?: boolean
		disabled: boolean
	}>(),
	{
		readonly: false,
		disabled: false
	}
)
const emit = defineEmits(['update:fileListImg', 'update:fileListVideo'])
const uploadV = ref(false)
const VideoName = ref('')
const { localStore } = useStorage()
const { fileListImg, fileListVideo } = useVModels(props, emit)
const { t } = useI18n()
const setting = SettingStore()
const page = reactive({
	baseUrl: '',
	signedUrl: ''
})

const clearVideo = () => {
	uploadV.value = false
	page.baseUrl = ''
	fileListVideo.value = []
	VideoName.value = ''
}

const showVsImg = ref(false)
const showVsVideo = ref(false)
const afterRead = async (file: any, detail: any) => {
	const loading = showLoadingToast({
		message: t('upLoaderL'),
		forbidClick: true,
		duration: 0,
		overlay: true
	})
	const name = getFileNameUUID() + '.' + getFileType(file.file.type)
	try {
		const token = localStore.get('ar_p_t') || ''
		const res = await PutImage({ token, objectName: name, contentType: file.file.type })
		if (res.code === '1') {
			page.baseUrl = res.data.baseUrl
			page.signedUrl = res.data.signedUrl
			const resg = await upLoaderImg(file, res.data.signedUrl)
			if (resg) {
				file.file.objectName = name
				file.file.objectSuffix = getFileType(file.file.type)
				// if(detail?.name === 1){
				//     fileListImg.value.push(`${name},${file.file.type},${file.file.objectSuffix}`)
				// }else{
				//     fileListVideo.value.push(`${name},${file.file.type},${file.file.objectSuffix}`);
				//     uploadV.value = true;
				// }
				if (detail?.name === 2) {
					VideoName.value = name
					uploadV.value = true
				}
			} else {
				showFailToast(res.msg)
				setTimeout(() => {
					goMerchant()
				}, 1500)
			}
		}
	} catch (error) {
	} finally {
		loading.close()
	}
}

const getVsImgVideo = computed(() => {
	return [vsImg, `${setting.getOSSUrl}/vsvideo/vsVideo.mp4`]
})
</script>
<style lang="scss" scoped>
.videoBox {
	position: relative;
	:deep(.van-uploader__preview-image) {
		width: 200px;
		height: 200px;
	}
	.del {
		position: absolute;
		height: 40px;
		line-height: 40px;
		text-align: center;
		width: 40px;
		background: var(--main-color);
		border-radius: 0 0 0 40px;
		right: 0;
		top: 0;
		z-index: 10;
		.icon {
			color: #fff;
		}
	}
}
.updaloadImage {
	> .img {
		margin-top: 40px;

		.title {
			.right {
				color: #f5ba00;
			}
		}

		h1 {
			color: var(--text_color_L2);
			letter-spacing: -0.64px;
			font-size: 28px;
			font-weight: 600;
		}

		.uploadImg {
			// @include box;
			// @include fcCC;
			margin-top: 0;
			color: var(--text_color_L2);
			width: 200px;
			height: 200px;
			border-radius: 16px;
			border: 2px solid var(--bg_color_L3);
			background: var(--bg_color_L3);
			font-size: 24px;
		}
	}
	.tip-p {
		font-size: 28px;
		letter-spacing: -0.64px;
		color: #ee4d4d;
	}
	.video {
		:deep(.van-uploader__preview) {
			margin: 0;
		}
		:deep(.van-uploader__file) {
			width: 100%;
			height: 428px;
		}
		:deep(.van-uploader) {
			width: 100%;
			height: 100%;

			.van-uploader__wrapper,
			.van-uploader__preview,
			.van-uploader__preview-cover,
			.van-uploader__input-wrapper {
				width: 100%;
			}
		}

		.uploadImg {
			width: 200px;
			height: 200px;
		}

		.v {
			width: 100%;
			max-height: 428px;
			object-fit: cover;
			display: block;
		}
	}
}
</style>
