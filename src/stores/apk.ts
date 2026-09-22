// apkType: 'native', // apk类型 native:原生,embed:套壳
import { createGlobalState, useStorage } from '@vueuse/core'


export enum ApkType {
    QuickApk = 'quick_apk',
    FullApk = 'full_apk',
}

export const useApkState = createGlobalState(() => {
	const apk = useStorage<string>('apk-value-storage', '')
	return {
		apk,// full-apk | quick-apk
		setApk: (value: string) => {
			apk.value = value
		},
		getApk: () => apk.value,
		isFullApk: () => {
			return !!apk.value && apk.value === ApkType.FullApk
		}
	}
})
