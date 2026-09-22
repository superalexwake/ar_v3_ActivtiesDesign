<template>
    <div class="MG">
        <NavBar left-arrow @click-left="() => router.back()" :title="$t('xosoTxt73')"></NavBar>
        <ArSelect @click-select="showPicker = true" :selectName="typeLable"></ArSelect>
        <ShowGame  v-model:pageQuery="pageQuery"></ShowGame>
        <van-popup v-model:show="showPicker" round position="bottom">
            <van-picker :columns-field-names="{ text: 'typeName', value: 'typeId' }" :columns="typeList"
                @cancel="showPicker = false" @confirm="onConfirm" />
        </van-popup>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref} from 'vue';
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ShowGame from '@/components/Home/AllLotteryGames/4D/showGame.vue'
import { use4D } from '@/hooks/use4D.hook'

const { getTypeList, typeList ,getMy4DHistory} = use4D()
getTypeList()

const { t } = useI18n()
const router = useRouter()
const showPicker = ref(false)
const typeLable = ref(t('all'))
const pageQuery = reactive<any>({
    type: 0,
    date: '',
    pageSize: 20,
    pageNo: 1
})

getMy4DHistory(pageQuery)
const onConfirm = async ({ selectedOptions }: any) => {
    showPicker.value = false
    pageQuery.type = selectedOptions[0].typeId
    pageQuery.pageNo = 1
    typeLable.value =selectedOptions[0].typeName
    getMy4DHistory(pageQuery)
}

</script>
<style lang="scss" scoped>
.MG {
    padding: 30px 20px;

    :deep(.ar-searchbar__selector) {
        width: 100%;
    }
}
</style>