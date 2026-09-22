import {useRouter} from 'vue-router'
export function useRututnUrl(){
	const router=useRouter()
    const goMerchant = () =>{
		router.push({
			name:'Recharge'
		})
    }

    return{
        goMerchant
    }
}