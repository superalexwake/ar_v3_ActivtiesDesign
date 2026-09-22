var stdin_default = {
	name: 'အမည်',
	tel: 'ဖုန်း',
	save: 'သိမ်း',
	confirm: 'အတည်ပြု',
	cancel: 'ပယ်',
	delete: 'ဖျက်',
	loading: 'ဖွင့်နေသည်...',
	noCoupon: 'ကူပွန်မပါ',
	nameEmpty: 'နာမည် ဖြည့်ပါ',
	addContact: 'အဆက်အသွယ်ထည့်ပါ',
	telInvalid: 'ပုံစံမမှန်သော ဖုန်းနံပါတ်',
	vanCalendar: {
		end: 'အဆုံး',
		start: 'စတင်ပါ။',
		title: 'ပြက္ခဒိန်',
		weekdays: ['တနင်္ဂနွေ', 'တနင်္လာနေ့', 'အင်္ဂါ', 'ဗုဒ္ဓဟူးနေ့', 'ကြာသပတေးနေ့', 'သောကြာ', 'စနေနေ့'],
		monthTitle: (year, month) => `${year}/${month}`,
		rangePrompt: (maxRange) => `${maxRange} ရက်ထက် ပိုမရွေးချယ်ပါ။`
	},
	vanCascader: {
		select: 'ရွေးပါ။'
	},
	vanPagination: {
		prev: 'အရင်',
		next: 'နောက်တစ်ခု'
	},
	vanPullRefresh: {
		pulling: 'ပြန်လည်ဆန်းသစ်ရန် ဆွဲပါ...',
		loosing: 'ပြန်လည်ဆန်းသစ်ဖို့ လွတ်လွတ်လပ်လပ်...'
	},
	vanSubmitBar: {
		label: 'စုစုပေါင်း-'
	},
	vanCoupon: {
		unlimited: 'အကန့်အသတ်',
		discount: (discount) => `${discount}% လျှော့စျေး`,
		condition: (condition) => `အနည်းဆုံး ${condition}`
	},
	vanCouponCell: {
		title: 'ကူပွန်',
		count: (count) => `သင့်တွင် ကူပွန် ${count} ခုရှိသည်။`
	},
	vanCouponList: {
		exchange: 'ချိန်းတယ်။',
		close: 'ပိတ်လိုက်',
		enable: 'ရရှိနိုင်ပါသည်။',
		disabled: 'မရနိုင်ပါ။',
		placeholder: 'ကူပွန်ကုဒ်'
	},
	vanAddressEdit: {
		area: 'ဧရိယာ',
		areaEmpty: 'လက်ခံဧရိယာကို ရွေးပါ။',
		addressEmpty: 'လိပ်စာ အလွတ်မရနိုင်ပါ။',
		addressDetail: 'လိပ်စာ',
		defaultAddress: 'မူရင်းလိပ်စာအဖြစ် သတ်မှတ်ပါ။'
	},
	vanAddressList: {
		add: 'လိပ်စာအသစ်ထည့်ပါ။'
	}
}
export default stdin_default
