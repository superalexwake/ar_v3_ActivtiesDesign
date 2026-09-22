var stdin_default = {
	name: 'Pangalan',
	tel: 'Telepono',
	save: 'I-save',
	confirm: 'Kumpirmahin',
	cancel: 'Kanselahin',
	delete: 'Burahin',
	loading: 'Naglo-load...',
	noCoupon: 'Walang mga kupon',
	nameEmpty: 'Mangyaring punan ang pangalan',
	addContact: 'Magdagdag ng contact',
	telInvalid: 'Maling porma ng numero ng telepono',
	vanCalendar: {
		end: 'Tapusin',
		start: 'Magsimula',
		title: 'Kalendaryo',
		weekdays: ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'],
		monthTitle: (year, month) => `${year}/${month}`,
		rangePrompt: (maxRange) => `Pumili ng hindi hihigit sa ${maxRange} araw`
	},
	vanCascader: {
		select: 'Pumili'
	},
	vanPagination: {
		prev: 'Nakaraang',
		next: 'Susunod'
	},
	vanPullRefresh: {
		pulling: 'Hilahin para i-refresh...',
		loosing: 'LMaluwag na i-refresh...'
	},
	vanSubmitBar: {
		label: 'Kabuuan:'
	},
	vanCoupon: {
		unlimited: 'Walang limitasyon',
		discount: (discount) => `${discount}% diskwento`,
		condition: (condition) => `Hindi bababa sa ${condition}`
	},
	vanCouponCell: {
		title: 'Kupon',
		count: (count) => `Mayroon kang ${count} kupon`
	},
	vanCouponList: {
		exchange: 'Palitan',
		close: 'Isara',
		enable: 'Available',
		disabled: 'Hindi magagamit',
		placeholder: 'Code ng kupon'
	},
	vanAddressEdit: {
		area: 'Lugar',
		areaEmpty: 'Mangyaring pumili ng lugar para sa pagtanggap',
		addressEmpty: 'Hindi maaaring walang laman ang address',
		addressDetail: 'Address',
		defaultAddress: 'Itakda bilang default na address'
	},
	vanAddressList: {
		add: 'Magdagdag ng bagong address'
	}
}
export default stdin_default
