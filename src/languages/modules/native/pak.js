const stdin_default = {
	name: 'پورا نام',
	tel: 'فون نمبر',
	save: 'محفوظ کریں',
	confirm: 'تصدیق کریں۔',
	cancel: 'منسوخ کریں۔',
	delete: 'حذف کریں۔',
	loading: '...لوڈ ہو رہا ہے',
	noCoupon: 'کوئی کوپن نہیں۔',
	nameEmpty: 'برائے مہربانی اپنا مکمل نام درج کریں',
	addContact: 'رابطے شامل کریں۔',
	telInvalid: 'فون نمبر کا فارمیٹ غلط ہے۔',
	vanCalendar: {
		end: 'ختم',
		start: 'شروع کریں',
		title: 'کیلنڈر',
		weekdays: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
		monthTitle: (year, month) => `${year}/${month}`,
		rangePrompt: (maxRange) => ` چند سے زیادہ کا انتخاب نہ کریں۔${maxRange}دن `
	},
	vanCascader: {
		select: 'منتخب کریں۔',
	},
	vanPagination: {
		prev: 'پچھلا',
		next: 'اگلا'
	},
	vanPullRefresh: {
		pulling: 'تازہ دم کرنے کے لیے کھینچیں۔',
		loosing: 'ریفریش کریں۔',
	},
	vanSubmitBar: {
		label: 'تمام',
	},
	vanCoupon: {
		unlimited: 'لا محدود',
		discount: (discount) => `${discount}رعایت %`,
		condition: (condition) => ` کم از کم${condition}`
	},
	vanCouponCell: {
		title: 'کوپن',
		count: (count) => ` کوپن ہے۔${count} آپ کے پاس `
	},
	vanCouponList: {
		exchange: 'چھڑانا',
		close: 'بند کریں',
		enable: 'دستیاب',
		disabled: 'دستیاب نہیں ہے',
		placeholder: 'کوپن کوڈ'
	},
	vanAddressEdit: {
		area: 'رقبہ',
		areaEmpty: 'براہ کرم ترسیل کا علاقہ منتخب کریں۔',
		addressEmpty: 'پتہ خالی نہیں ہو سکتا',
		addressDetail: 'پتہ',
		defaultAddress: 'ڈیفالٹ ایڈریس کے طور پر سیٹ کریں۔',
	},
	vanAddressList: {
		add: 'نیا پتہ شامل کریں۔',
	}
}
export default stdin_default
