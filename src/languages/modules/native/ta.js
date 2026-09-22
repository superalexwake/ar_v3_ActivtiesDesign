var stdin_default = {
	name: 'பெயர்',
	tel: 'தொலைபேச',
	save: 'சேமிக்கவும்',
	confirm: 'உறுதி',
	cancel: 'ரத்து செய்',
	delete: 'நீக்கவும்',
	loading: 'ஏற்றுகிறது...',
	noCoupon: 'கூப்பன்கள் இல்லை',
	nameEmpty: 'தயவுசெய்து பெயரை உள்ளிடவும்',
	addContact: 'தொடர்பைச் சேர்க்கவும்',
	telInvalid: 'குறைபாடுள்ள தொலைபேசி எண்',
	vanCalendar: {
		end: 'முடிக்கவும்',
		start: 'தொடங்க',
		title: 'காலண்டர்',
		weekdays: ['ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஞாயிறு'],
		monthTitle: (year, month) => `${year}/${month}`,
		rangePrompt: (maxRange) => `நாட்களுக்கு மேல் தேர்வு ${maxRange} செய்யவும்`
	},
	vanCascader: {
		select: 'தேர்ந்தெடு'
	},
	vanPagination: {
		prev: 'முன்பு',
		next: 'அடுத்தது'
	},
	vanPullRefresh: {
		pulling: 'புதுப்பிக்க இழுக்கவும்...',
		loosing: 'புதுப்பிக்க தளர்வானது...'
	},
	vanSubmitBar: {
		label: 'தொகை:'
	},
	vanCoupon: {
		unlimited: 'வரம்பற்ற',
		discount: (discount) => `${discount}% தள்ளுபடி`,
		condition: (condition) => `குறைந்தபட்சம் ${condition}`
	},
	vanCouponCell: {
		title: 'கூப்பன்கள்',
		count: (count) => `உங்களிடம் கூப்பன் ${count} உள்ளது`
	},
	vanCouponList: {
		exchange: 'பரிமாற்றம்',
		close: 'நெருக்கமான',
		enable: 'கிடைக்கும்',
		disabled: 'எதுவும் இல்லை',
		placeholder: 'கூப்பன் குறியீடு'
	},
	vanAddressEdit: {
		area: 'பகுதி',
		areaEmpty: 'வரவேற்புப் பகுதியைத் தேர்ந்தெடுக்கவும்',
		addressEmpty: 'முகவரி காலியாக இருக்கக்கூடாது',
		addressDetail: 'முகவரி',
		defaultAddress: 'இயல்புநிலை முகவரியாக அமைக்கவும்'
	},
	vanAddressList: {
		add: 'புதிய முகவரியைச் சேர்க்கவும்'
	}
}
export default stdin_default