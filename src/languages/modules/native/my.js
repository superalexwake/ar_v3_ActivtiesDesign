// var __defProp = Object.defineProperty
// var __getOwnPropDesc = Object.getOwnPropertyDescriptor
// var __getOwnPropNames = Object.getOwnPropertyNames
// var __hasOwnProp = Object.prototype.hasOwnProperty
// var __export = (target, all) => {
// 	for (var name in all) __defProp(target, name, { get: all[name], enumerable: true })
// }
// var __copyProps = (to, from, except, desc) => {
// 	if ((from && typeof from === 'object') || typeof from === 'function') {
// 		for (let key of __getOwnPropNames(from))
// 			if (!__hasOwnProp.call(to, key) && key !== except)
// 				__defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable })
// 	}
// 	return to
// }
// var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod)
// var stdin_exports = {}
// __export(stdin_exports, {
// 	default: () => stdin_default
// })
// // module.exports = __toCommonJS(stdin_exports)

var stdin_default = {
	name: 'Nama',
	tel: 'Telefon',
	save: 'Simpan',
	confirm: 'Sahkan',
	cancel: 'Batal',
	delete: 'Padam',
	loading: 'Memuatkan...',
	noCoupon: 'Tiada kupon',
	nameEmpty: 'Sila isikan nama',
	addContact: 'Tambah kenalan',
	telInvalid: 'Nombor telefon cacat',
	vanCalendar: {
		end: 'tamat',
		start: 'Mulakan',
		title: 'Kalendar',
		weekdays: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
		monthTitle: (year, month) => `${year}/${month}`,
		rangePrompt: (maxRange) => `Pilih tidak lebih daripada ${maxRange} hari`
	},
	vanCascader: {
		select: 'Pilih'
	},
	vanPagination: {
		prev: 'Sebelumnya',
		next: 'Seterusnya'
	},
	vanPullRefresh: {
		pulling: 'Tarik untuk menyegarkan...',
		loosing: 'Longgar untuk disegarkan...'
	},
	vanSubmitBar: {
		label: 'Jumlah:'
	},
	vanCoupon: {
		unlimited: 'Tidak terhad',
		discount: (discount) => `${discount}% diskaun`,
		condition: (condition) => `Sekurang-kurangnya ${condition}`
	},
	vanCouponCell: {
		title: 'kupon',
		count: (count) => `Anda mempunyai ${count} kupon`
	},
	vanCouponList: {
		exchange: 'Pertukaran',
		close: 'tutup',
		enable: 'Tersedia',
		disabled: 'Tidak ada',
		placeholder: 'Kod Kupon'
	},
	vanAddressEdit: {
		area: 'Kawasan',
		areaEmpty: 'Sila pilih kawasan penerimaan',
		addressEmpty: 'Alamat tidak boleh kosong',
		addressDetail: 'Alamat',
		defaultAddress: 'Tetapkan sebagai alamat lalai'
	},
	vanAddressList: {
		add: 'Tambah alamat baharu'
	}
}
export default stdin_default
