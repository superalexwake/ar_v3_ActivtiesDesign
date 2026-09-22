import {
	Get5DRuleByTypeId,
	GetK3RuleByTypeId,
	GetRuleByTypeId,
	GetTRXRuleByTypeId,
	get5DtypeList,
	getK3TypeList,
	winGoGetTypeList,
	winTxrGetTRXtypeList
} from '@/api'
import {AwaitApiResult} from '@/utils'
import {defineStore} from 'pinia'
import {closeToast, showLoadingToast} from "vant";

const setTime = 5000
export const LorreryStore = defineStore({
	id: 'lorreryStore',
	state: () => ({
		wingo: [
			{
				typeID: 30,
				typeName: 'Win Go<br />30 second',
				tabName: 'WinGo 30 Second',
				intervalM: 0.5,
				scope: '1|10|100|1000',
				sort: 1,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100',
			},
			{
				typeID: 1,
				typeName: 'Win Go<br />1Min',
				tabName: 'WinGo 1Min',
				intervalM: 1,
				scope: '1|10|100|1000',
				sort: 4,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100', show: true,
			},
			{
				typeID: 2,
				typeName: 'Win Go<br />3Min',
				tabName: 'WinGo 3Min',
				intervalM: 3,
				scope: '1|10|100|1000',
				sort: 3,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100',
			},
			{
				typeID: 3,
				typeName: 'Win Go<br />5Min',
				tabName: 'WinGo 5Min',
				intervalM: 5,
				scope: '1|10|100|1000',
				sort: 2,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100',
			},
			{
				typeID: 4,
				typeName: 'Win Go<br />10Min',
				tabName: 'WinGo 10Min',
				intervalM: 10,
				scope: '1|10|100|1000',
				sort: 1,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100',
			},
		],
		fiveD: [
			{
				typeID: 5,
				typeName: '5D Lotre<br />1Min',
				tabName: '5D 1Min',
				intervalM: 1,
				scope: '1|10|100|1000',
				sort: 4,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100',
				show: true,
			},
			{
				typeID: 6,
				typeName: '5D Lotre<br />3Min',
				tabName: '5D 3Min',
				intervalM: 3,
				scope: '1|10|100|1000',
				sort: 3,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
			{
				typeID: 7,
				typeName: '5D Lotre<br />5Min',
				tabName: '5D 5Min',
				intervalM: 5,
				scope: '1|10|100|1000',
				sort: 2,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
			{
				typeID: 8,
				typeName: '5D Lotre<br />10Min',
				tabName: '5D 10Min',
				intervalM: 10,
				scope: '1|10|100|1000',
				sort: 1,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
		],
		k3: [
			{
				typeID: 9,
				typeName: 'K3 Lotre<br />1Min',
				tabName: 'K3 1Min',
				intervalM: 1,
				scope: '1|10|100|1000',
				sort: 4,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
			{
				typeID: 10,
				typeName: 'K3 Lotre<br />3Min',
				tabName: 'K3 3Min',
				intervalM: 3,
				scope: '1|10|100|1000',
				sort: 3,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
			{
				typeID: 11,
				typeName: 'K3 Lotre<br />5Min',
				tabName: 'K3 5Min',
				intervalM: 5,
				scope: '1|10|100|1000',
				sort: 2,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
			{
				typeID: 12,
				typeName: 'K3 Lotre<br />10Min',
				tabName: 'K3 10Min',
				intervalM: 10,
				scope: '1|10|100|1000',
				sort: 1,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			}],
		trx: [
			{
				typeID: 13,
				typeName: 'Trx Win Go<br />1Min',
				tabName: 'Trx 1Min',
				intervalM: 1,
				scope: '1|10|100|1000',
				sort: 4,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
			{
				typeID: 14,
				typeName: 'Trx Win Go<br />3Min',
				tabName: 'Trx 3Min',
				intervalM: 3,
				scope: '1|10|100|1000',
				sort: 3,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
			{
				typeID: 15,
				typeName: 'Trx Win Go<br />5Min',
				tabName: 'Trx 5Min',
				intervalM: 5,
				scope: '1|10|100|1000',
				sort: 2,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			},
			{
				typeID: 16,
				typeName: 'Trx Win Go<br />10Min',
				tabName: 'Trx 10Min',
				intervalM: 10,
				scope: '1|10|100|1000',
				sort: 1,
				gamePresentation: null,
				betMultiple: '1|5|10|20|50|100'
			}],
		winGoLock: false,
		TrxLock: false,
		k3Lock: false,
		fiveDLock: false,
		winType: (import.meta.env.VITE_WINGO && JSON.parse(import.meta.env.VITE_WINGO)) || [1, 2, 3, 4]
	}),
	getters: {
		getWingo: (state) => state.wingo,
		get5D: (state) => state.fiveD,
		getK3: (state) => state.k3,
		getTrx: (state) => state.trx,
	},
	actions: {
		async getWinGoData() {
			if (this.winGoLock) return
			showLoadingToast({
				overlay: true,
				type: 'loading',
			})
			const res = await AwaitApiResult(winGoGetTypeList())
			const nameMap = {
				1: 'Win Go<br />1Min',
				2: 'Win Go<br />3Min',
				3: 'Win Go<br />5Min',
				4: 'Win Go<br />10Min',
				30: 'Win Go<br />30s',
			}
			if (res && res.data) {
				this.wingo = res.data.map((item: any) => {
					item.typeName = nameMap[item.typeID]
					item.gamePresentation = null
					return item
				})
				this.winGoLock = true
			}
			closeToast();
		},
		async getTrxData() {
			if (this.TrxLock) return
			showLoadingToast({
				overlay: true,
				type: 'loading',
			})
			const res = await AwaitApiResult(winTxrGetTRXtypeList())
			const nameMap = {
				13: 'Trx Win Go<br />1Min',
				14: 'Trx Win Go<br />3Min',
				15: 'Trx Win Go<br />5Min',
				16: 'Trx Win Go<br />10Min',
			}
			if (res && res.data) {
				this.trx = res.data.map((item: any) => {
					item.typeName = nameMap[item.typeID]
					item.gamePresentation = null
					return item
				})
				this.TrxLock = true

			}
			closeToast();
		},
		async getK3Data() {
			if (this.k3Lock) return
			showLoadingToast({
				overlay: true,
				type: 'loading',
			})
			const res = await AwaitApiResult(getK3TypeList())
			const nameMap = {
				9: 'K3 Lotre <br />1Min',
				10: 'K3 Lotre<br />3Min',
				11: 'K3 Lotre<br />5Min',
				12: 'K3 Lotre<br />10Min',
			}
			if (res && res.data) {
				this.k3 = res.data.map((item: any) => {
					item.typeName = nameMap[item.typeID]
					item.gamePresentation = null
					return item
				})
				this.k3Lock = true
			}
			closeToast();
		},
		async get5DData() {
			if (this.fiveDLock) return
			showLoadingToast({
				overlay: true,
				type: 'loading',
			})
			const res = await AwaitApiResult(get5DtypeList())
			const nameMap = {
				5: '5D<br />1Min',
				6: '5D<br />3Min',
				7: '5D<br />5Min',
				8: '5D<br />10Min',
			}
			if (res && res.data) {
				this.fiveD = res.data.map((item: any) => {
					item.typeName = nameMap[item.typeID]
					item.gamePresentation = null
					return item
				})
				this.fiveDLock = true

			}
			closeToast();
		},
		async getWinGoRule(gameType: number) {
			let index = this['wingo'].findIndex(x => x.typeID === gameType)
			if (this['wingo'][index].gamePresentation) return
			const res = await AwaitApiResult(GetRuleByTypeId({typeId: gameType}))
			if (res && res.data) {
				this['wingo'][index].gamePresentation = res.data.gamePresentation
			}
		},
		async getTrxRule(gameType: number) {
			let index = this['trx'].findIndex(x => x.typeID === gameType)
			if (this['trx'][index].gamePresentation) return
			const res = await AwaitApiResult(GetTRXRuleByTypeId({typeId: gameType}))
			if (res && res.data) {
				this['trx'][index].gamePresentation = res.data.gamePresentation
			}
		},
		async getK3Rule(gameType: number) {
			let index = this['k3'].findIndex(x => x.typeID === gameType)
			if (this['k3'][index].gamePresentation) return
			const res = await AwaitApiResult(GetK3RuleByTypeId({typeId: gameType}))
			if (res && res.data) {
				this['k3'][index].gamePresentation = res.data.gamePresentation
			}
		},
		async get5DRule(gameType: number) {
			let index = this['fiveD'].findIndex(x => x.typeID === gameType)
			if (this['fiveD'][index].gamePresentation) return
			const res = await AwaitApiResult(Get5DRuleByTypeId({typeId: gameType}))
			if (res && res.data) {
				this['fiveD'][index].gamePresentation = res.data.gamePresentation
			}
		},
		setData(item: any, type: 'wingo' | 'k3' | 'fiveD' | 'trx') {
			let len = this[type].findIndex(x => x.typeID === item.typeID)
			this[type][len].scope = item.scope
			this[type][len].betMultiple = item.betMultiple
			if (item.gamePresentation) this[type][len].gamePresentation = item.gamePresentation;
		}
	}
})
