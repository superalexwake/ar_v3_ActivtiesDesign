<template>
    <div class="progress" :class="[`state_${state}`,{isAppealCompleted:isAppealCompleted}]" v-if="getList.length > 0">
        <template v-for="(item, index) in getList">
            <div class="item">
                <span :class="`icon${getIsActive(index) ? item.icon + '_a' : item.icon}`"></span>
                <h6>{{ item.title }}</h6>
            </div>
            <div v-if="index < getList.length-1" class="line"></div>
        </template>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = withDefaults(
    defineProps<{
        state: number,
        isAppealCompleted?:boolean //是否申诉完成
    }>(),
    {}
)

const list = [{
    title: t('c2cState11'),
    icon: '1',
},
{
    title: t('c2cState13'),
    icon: '2',
},
{
    title: t('c2cTip30'),
    icon: '3',
},
{
    title: t('c2cState4'),
    icon: '4',
}]
const list3 = [{
    title: t('c2cTip32'),
    icon: '1',
},
{
    title: t('c2cTip33'),
    icon: '2',
},
{
    title: t('c2cState4'),
    icon: '3',
}]
const list5 = [{
    title: t('c2cTip32'),
    icon: '1',
},
{
    title: t('c2cTip33'),
    icon: '2',
},
{
    title: t('c2cTip9'),
    icon: '4',
}]
const getList = computed(() => {
    if ([1, 9, 11, 13].includes(props.state)) return list
    if ([3].includes(props.state)) return list3
    if ([5].includes(props.state)) return list5
    if (props.state == 4){
        if(!props.isAppealCompleted) return list // 正常流程完成
        else return list3 //申述流程完成
    }
    return []
})
function getIsActive(index: number) {
    let list: any = []
    switch (props.state) {
        case 1:
        case 9:
            list = [true, true, true, false]
            break;
        case 4:
            list = [true, true, true, true]
            break;
        case 11:
            list = [true, false, false, false]
            break;
        case 13:
            list = [true, true, false, false]
            break;
        case 3:
            list = [true, true, false]
            break;
        case 5:
            list = [true, true, true]
            break;
    }
    return list[index]
}
</script>
<style lang="scss" scoped>
$iconPath: '@/assets/icons/wallet/withdraw/c2c/progress';
.progress {
    margin-top: 60px;
    display: flex;
    justify-content: space-between;

    >div {
        flex: 1;
    }

    .line {
        background: var(--text_color_L2);
        height: 1px;
        margin-top: 20px;
    }

    .item {
        display: flex;
        flex-direction: column;
        align-items: center;

        >span {
            width: 48px;
            height: 48px;
            background-size: 48px 48px;
            background-repeat: no-repeat;
            background-position: center;
        }

        >h6 {
            margin-top: 10px;
            color: var(--text_color_L1);
            text-align: center;
        }
    }

    $list: 1 2 3 4;

    @each $i in $list {
        .icon#{$i} {
            background-image: url('#{$iconPath}/other/#{$i}.png');

            &+h6 {
                color: var(--text_color_L2);
            }
        }

        .icon#{$i}_a {
            background-image: url('#{$iconPath}/other/#{$i}_a.png');
        }
    }

}

.progress.state_11 {
    .line {
        background: var(--bg_color_L2);
    }

    $list: 1 2 3 4;
    @each $i in $list {

        .icon#{$i} {
            background-image: url('#{$iconPath}/11/#{$i}.png');

            &+h6 {
                color: #fff;
            }
        }
    }
}

.progress.state_3,
.progress.state_4.isAppealCompleted,
.progress.state_5 {
    $list: 1 2 3 4;

    @each $i in $list {

        .icon#{$i} {
            background-image: url('#{$iconPath}/3/#{$i}.png');
        }
        .icon#{$i}_a {
            background-image: url('#{$iconPath}/3/#{$i}_a.png');
        }
    }
}
</style>