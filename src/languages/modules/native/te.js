var stdin_default = {
	name: 'పేరు',
	tel: 'ఫోన్',
	save: 'ఫోన్ కాల్',
	confirm: 'నిర్ధారించండి',
	cancel: 'రద్దు చేయండి',
	delete: 'తొలగించండి',
	loading: 'లోడింగ్...',
	noCoupon: 'కూపన్లు లేవు',
	nameEmpty: 'దయచేసి పేరు నమోదు చేయండి',
	addContact: 'కాంటాక్ట్ జోడించండి',
	telInvalid: 'చెల్లని ఫోన్ నంబర్',
	vanCalendar: {
		end: 'ముగించు',
		start: 'ప్రారంభించు',
		title: 'క్యాలెండర్',
		weekdays: ['ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఆదివారం'],
		monthTitle: (year, month) => `${year}/${month}`,
		rangePrompt: (maxRange) => `గరిష్టంగా ${maxRange} రోజులు మాత్రమే ఎంచుకోండి`
	},
	vanCascader: {
		select: 'ఎంచుకోండి'
	},
	vanPagination: {
		prev: 'మునుపటి',
		next: 'తరువాత'
	},
	vanPullRefresh: {
		pulling: 'రిఫ్రెష్ చేయడానికి లాగండి...',
		loosing: 'రిఫ్రెష్ చేయడానికి వదలండి...'
	},
	vanSubmitBar: {
		label: 'మొత్తం:'
	},
	vanCoupon: {
		unlimited: 'అమితమైన',
		discount: (discount) => `${discount}% డిస్కౌంట్`,
		condition: (condition) => `కనీసం ${condition} కావాలి`
	},
	vanCouponCell: {
		title: 'కూపన్లు',
		count: (count) => `మీ వద్ద ${count} కూపన్‌లు ఉన్నాయి`
	},
	vanCouponList: {
		exchange: 'మార్చుకోవడం',
		close: 'దగ్గరగా',
		enable: 'లభ్యం',
		disabled: 'ఏదీ లేదు',
		placeholder: 'కూపన్ కోడ్'
	},
	vanAddressEdit: {
		area: 'ప్రాంతం',
		areaEmpty: 'దయచేసి స్వాగత ప్రాంతాన్ని ఎంచుకోండి',
		addressEmpty: 'చిరునామా ఖాళీగా ఉండకూడదు',
		addressDetail: 'చిరునామా వివరాలు',
		defaultAddress: 'డిఫాల్ట్ చిరునామాగా సెట్ చేయండి'
	},
	vanAddressList: {
		add: 'కొత్త చిరునామా జోడించండి'
	}
}
export default stdin_default
