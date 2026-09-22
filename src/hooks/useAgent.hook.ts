import {computed, reactive, ref} from 'vue'
import { GetPartnerRewards, GetUrlAddress } from '@/api'
import { AwaitApiResult } from '@/utils'
import {useRouter} from "vue-router";

export function useAgent() {
	const router=useRouter()
	const store = reactive({
		config: {
			configAmount: 0,
			effectiveQuantity: 0,
			invitationCode: '',
			numberOfInvitations: 0,
			totalAmount: 0,
			days: 0,
			items: []
		},
	})
	const query = ref({
		pageNo: 1,
		pageSize: 10
	})
	const partnerList=ref([])
	const amount=computed(()=>store.config.configAmount)
	const totalAmount=computed(()=>store.config.totalAmount)
	const invitationLink=ref(''); 
	const invitationCode=computed(()=>store.config.invitationCode||'')
	const effectiveQuantity=computed(()=>store.config.effectiveQuantity)
	const numberOfInvitations=computed(()=>store.config.numberOfInvitations)
	const firstItem = computed(()=>{
		return store.config.items.filter((item:any)=>item.type === 1);
	})
	const secondItem = computed(()=>{
		return store.config.items.filter((item:any)=>item.type === 2);
	})
	const thirdItem = computed(()=>{
		return store.config.items.filter((item:any)=>item.type === 3);
	})
	const allItem = computed(()=>store.config.items)
	const days=computed(()=>store.config.days || '0')
	const getInfo = async () => {
		const data = await AwaitApiResult(GetPartnerRewards())
		if (data) {
			store.config = data.data
		}
	}
	const goInvitation=async ()=>{
      await router.push({
		  name:'TeamPartner-Invitation'
	  })
	}
	const  goBack=()=> {
		router.go(-1)
	}
	
	async function getUrl() {
		const res = await AwaitApiResult(GetUrlAddress())
		if (res) {
			if (res.data.url.startsWith('http')) {
				invitationLink.value = res.data.url
			} else {
				invitationLink.value =
					window.location.href.substring(0, window.location.href.lastIndexOf('/#/') + 2) +
					'/' +
					res.data.url.substring(res.data.url.lastIndexOf('re'), res.data.url.length)
			}
			return;
		} else {
			invitationLink.value = `${location.origin}/#/register?invitationCode=${store.config.invitationCode||''}`
		}
	}
	return {
		getInfo,
		goBack,
		goInvitation,
		getUrl,
		amount,
		invitationLink,
		totalAmount,
		invitationCode,
		effectiveQuantity,
		numberOfInvitations,
		query,
		partnerList,
		days,
		firstItem,
		secondItem,
		thirdItem,
		allItem
	}
}
