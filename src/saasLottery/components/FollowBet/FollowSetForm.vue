<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  Icon as VanIcon,
  Switch as VanSwitch,
	showToast
} from 'vant';
import addIcon from './assets/img/add.svg'
import colockIcon from './assets/img/colock.svg'
import dollarIcon from './assets/img/dollar.svg'
import crileIcon from './assets/img/crile.svg'
import game1Icon from './assets/img/game1.svg'
import reduceIcon from './assets/img/reduce.svg'
import multipleIcon from './assets/img/multiple.svg'
import {useGlobalContext} from "@/saasLottery/hooks";
import {currency} from '@/utils'
import {defineExpose } from 'vue'
const {balance} = useGlobalContext()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props= defineProps({
	infoData: {
		type: Object,
		default: {}
	}
})

const emit = defineEmits(['update:visible', 'confirm', 'try']);
const formState = reactive<any>({
  betAmount: props.infoData.defineAmount,
  preIssueCount: 10,
  initMarginAmount:'',
  stopProfitAmount:'',
  stopLossAmount:'',
  isOpenDoubleBet: 0,
  doubleBetMultiple:1
});

const show=()=>{
	formState.betAmount=props.infoData.defineAmount
	formState.preIssueCount=10
	formState.initMarginAmount=''
	formState.stopProfitAmount=''
	formState.stopLossAmount=''
	formState.isOpenDoubleBet=0
	formState.doubleBetMultiple=1
}

defineExpose({show})

// 折叠收缩逻辑
const isExpet = ref(false);
const activeNames = ref<string[]>([]);
const collapse = ref<any>(null);
const toggleExpand= () => {
  isExpet.value = !isExpet.value;
  activeNames.value = isExpet.value ? ['1'] : [];
  collapse.value.toggleAll(isExpet.value);
};

const halfAmount = () => {
  const currentAmount = parseFloat(formState.betAmount);
  formState.betAmount = Math.floor(currentAmount / 2).toString();
};

const doubleAmount = () => {
  const currentAmount = parseFloat(formState.betAmount);
  formState.betAmount = Math.floor(currentAmount * 2).toString();
};


const submitType = ref('')
const formRef = ref<any>(null)
const handleSubmit=(type:any,event?: Event)=>{
	if (event) event.preventDefault();
	submitType.value = type
  formRef.value.validate().then(() => {
    onSubmit()
  }).catch((errors:any) => {
    // 验证失败
    console.log(errors)
  })
}


/*正式跟单*/
const onSubmit = () => {
  if (submitType.value === 'default'){
	  const defineValue:any = {...formState,orderType:0};
	  if(defineValue.isOpenDoubleBet!==1){
		  delete defineValue.doubleBetMultiple
	  }else {
		  if (!defineValue.doubleBetMultiple) defineValue.doubleBetMultiple=1;
	  }
	  emit('try', { ...defineValue });

  }else if (submitType.value === 'primary'){
	  const showData:any = { ...formState,orderType:1};
	  if(showData.betAmount>balance.value){
		  showToast(t('verify5'))
		  return;
	  }else if(showData.betAmount<props.infoData.minAmount){
		  showToast(t('verify6'))
		  return;
	  }else if(showData.isOpenDoubleBet!==1) {
		  delete showData.doubleBetMultiple
	  }
	  emit('confirm', { ...showData});
  }
}

/*处理验证判断*/
const formatter = (value:any) => {
	if (!value)return
	value=Number(value);
	if (value<1) return  formState.doubleBetMultiple=1;
	if (value>15) return formState.doubleBetMultiple=15;
	if(value % 1 !== 0) {
		return  formState.doubleBetMultiple = Math.floor(value * 10) / 10;
	}
}

</script>

<template>
  <div class="contentBox">
    <van-collapse v-model="activeNames" ref="collapse">
      <van-form @submit="onSubmit" ref="formRef">
        <div class="form-item">
          <div class="label-container">
            <crileIcon class="icon money-icon"></crileIcon>
            <span class="label">{{$t('betA')}}<span class="required">*</span></span>
          </div>

          <div class="input-group">
            <van-field
                :max="1000000"
                v-model="formState.betAmount"
                type="number"
                :placeholder="$t('hint1')"
                class="amount-input"
                :rules="[{ required: true, message: `${$t('verify1')}` },{ pattern: /^[0-9]*$/, message:`${$t('verify2')}`}]"
            />
            <div class="action-buttons">
              <van-button class="half-button" @click="halfAmount">1/2</van-button>
              <van-button class="double-button" @click="doubleAmount">2X</van-button>
            </div>
          </div>
        </div>

        <div class="form-item">
          <div class="label-container">
            <colockIcon class="icon clock-icon" />
            <span class="label">{{$t('betR')}}<span class="required">*</span></span>
          </div>

          <van-field
              v-model="formState.preIssueCount"
              type="number"
			  :max="1000"
			  :min="1"
              :placeholder="$t('hint2')"
              class="round-input"
              :rules="[
                  { required: true, message: `${$t('verify3')}` },
                  { pattern: /^(?:[1-9]|[1-9]\d{1,2}|1000)$/, message: `${$t('verify4')}` }]"
          />
        </div>
        <van-collapse-item name="1" :border="false" :is-link="false">
          <div class="form-item">
            <div class="label-container">
              <dollarIcon class="icon clock-icon" />
              <span class="label">{{$t('margin')}}</span>
            </div>
            <van-field
                v-model="formState.initMarginAmount"
                type="number"
                :placeholder="$t('hint3')"
                class="round-input"
            />
          </div>
          <div class="form-item">
            <div class="label-container">
              <addIcon class="icon clock-icon" />
              <span class="label">{{$t('tpa')}}</span>
            </div>
            <van-field
                v-model="formState.stopProfitAmount"
                type="number"
                :placeholder="$t('hint4')"
                class="round-input"
            />
          </div>
          <div class="form-item">
            <div class="label-container">
              <reduceIcon class="icon clock-icon" />
              <span class="label">{{$t('sla')}}</span>
            </div>
            <van-field
                v-model="formState.stopLossAmount"
                type="number"
                :placeholder="$t('hint5')"
                class="round-input"
            />
          </div>
			<div class="form-item" v-if="formState.isOpenDoubleBet===1">
				<div class="label-container">
				  <multipleIcon class="icon clock-icon" />
				  <span class="label">{{$t('mating')}}</span>
				</div>
				<van-field
					:min="1"
					:max="15"
					v-model="formState.doubleBetMultiple"
					type="number"
					:placeholder="$t('hint9')"
					class="round-input"
					@input="(e:any)=>formatter(e.target.value)"
				/>
			  </div>
        </van-collapse-item>

		  <div class="expand-more" @click="toggleExpand">
			  {{!isExpet?$t('emore'):$t('pickUp')}}
			  <van-icon :name="!isExpet?'arrow-down':'arrow-up'" />
		  </div>

        <div class="strategy-parameters">
          <h2>{{$t('betSp')}}</h2>
          <div class="parameter-list">
            <div class="parameter-item">
              <span class="parameter-label">{{$t('bron')}}</span>
              <span class="parameter-value">{{ formState.preIssueCount }}</span>
            </div>
            <div class="parameter-item">
              <span class="parameter-label">{{$t('waaw')}}</span>
              <span class="parameter-value win-value">{{ currency(formState.betAmount) }}</span>
            </div>
            <div class="parameter-item">
              <span class="parameter-label">{{$t('waal')}}</span>
              <span class="parameter-value win2">
				  {{currency(formState.betAmount)}}<i v-if="formState.isOpenDoubleBet===1&&formState.doubleBetMultiple">×{{ formState.doubleBetMultiple }}<sup v-if="formState.doubleBetMultiple">n</sup></i>
              </span>
            </div>
            <div class="parameter-item" v-if="infoData?.isSupportDoubleBet===1">
              <span class="parameter-label">{{$t('wtem')}}</span>
              <van-switch
                  active-color="var(--main-color)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="formState.isOpenDoubleBet"
                  size="24"
              />
            </div>
          </div>
        </div>

        <div class="action-area">
          <div
              class="try-button"
              @click.prevent="handleSubmit('default')"
          >
              <game1Icon class="game1" />
              <span>{{$t('tryIt')}}</span>
          </div>

          <van-button
              type="primary"
              native-type="submit"
              class="confirm-button"
              @click.prevent="handleSubmit('primary')"
          >
            {{$t('confirm')}}
          </van-button>
        </div>
      </van-form>
    </van-collapse>
  </div>
</template>

<style scoped lang="scss">
.contentBox {
  padding-bottom:20px;

  .form-item {
    margin-bottom: 32px;
    .label-container {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .icon {
        //font-size: 28px;
        margin-right: 8px;
        width:40px;
        height:40px;
        &.money-icon {
          color: #00b36a;
        }

        &.clock-icon {
          color: #00b36a;
        }
      }

      .label {
        font-size: 28px;
        color: var(--text_color_L2, #768096);

        .required {
          color:var(--norm_red-color, #FB5B5B);
        }
      }
    }

    .input-group {
      display: flex;
      align-items: center;
      gap: 10px;

      .amount-input {
        flex: 1;

        //:deep(.van-field__control) {
        //  font-size: 18px;
        //}
      }

      .action-buttons {
        display: flex;
        gap: 10px;

        .half-button, .double-button {
          height: 80px;
          width:120px;
          font-size:32px;
          background: var(--main_gradient-color);
          color: var(--text_color_L4);
          border: none;
          border-radius: 12px;
        }
      }
    }
    //.round-input {
    //  :deep(.van-field__control) {
    //    font-size: 18px;
    //  }
    //}
  }

  .expand-more {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text_color_L2, #768096);
    font-size: 24px;
    margin:0 0 24px 0;
    cursor: pointer;
    .van-icon {
      margin-left: 5px;
    }
  }

  .strategy-parameters {
    margin-top: 20px;

    h2 {
      font-size: 28px;
      font-weight: 400;
      color: var(--text_color_L1, #1E2637);
      margin-bottom:10px;
    }

    .parameter-list {
      background-color: var(--bg_color_L3);
      border-radius: 12px;
      padding: 16px;

      .parameter-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        &:last-child {
          border-bottom: none;
        }

        .parameter-label {
          color: var(--text_color_L1, #1E2637);
          font-size: 24px;
        }

        .parameter-value {
          color: var(--text_color_L1, #1E2637);
          font-weight: 500;
          font-size: 28px;

          &.win-value {
            color: var(--norm_secondary-color, #F5A036);
          }
			&.win2{
				color: var(--norm_secondary-color, #F5A036);
				sup {
					font-size: 22px;
					font-weight: 500;
					position: relative;
					top: -0.7em;
				}
			}
        }
      }
    }
  }

  .action-area {
    display: flex;
    gap: 16px;
    margin-top: 30px;

    .try-button {
      flex: 1;
      height: 80px;
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--main-color);
      color: var(--main-color);
      border-radius: 16px;
      gap: 8px;
      .game1 {
        margin-right: 5px;
        width: 40px;
        height: 40px;
        //font-size: 20px;
      }
    }

    .confirm-button {
      flex: 2;
      height: 80px;
      font-size: 28px;
      background: var(--main_gradient-color, linear-gradient(90deg, #49C755 15.38%, #0F9957 98.73%));
      border: none;
      border-radius: 16px;
    }
  }

	:deep(.van-field__control) {
		height:80px;
		width:100%;
		background: var(--bg_color_L3, #F6F6F6);
		border-radius: 12px;
		border: 2px solid var(--Dividing-line_color, #E1E1E1);
		padding: 0 12px;
		color: var(--text_color_L1, #1E2637);
		font-size: 28px;
		font-style: normal;
		font-weight: 500;
	}

	:deep(.van-field__control::placeholder) {
		font-size: 28px; /* 设置字体大小 */
		color: var(--text_color_L3, #B6BCC8);
	}

	:deep(.van-field__error-message){
		text-align: left;
		color: #FD565C;
	}
	:deep(.van-button:before){
		background-color: #FFF;
	}
	:deep(.van-switch--checked) {
		background-color: #00b36a;
	}
	:deep(.van-cell) {
		padding: 0;
	}
	:deep(.van-collapse-item__title){
		display: none;
	}
	:deep(.van-collapse-item__content){
		padding: 0;
	}
	:deep(.van-cell:after){
		border: none;
	}
}


</style>