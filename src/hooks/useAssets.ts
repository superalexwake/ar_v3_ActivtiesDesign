// Generic default avatar (home/avatar.png) — used as v-lazy / || fallback
import defaultAvatar from '@public/home/avatar.png'
// Alt placeholders used in :data-img on GameList / LuckyWinners / etc.
import defaultImgAvatar from '@public/images/avatar.png'
import defaultImgAvatar1 from '@public/images/avatar1.png'

// User avatars (main/Avatar/1.png ~ 20.png)
import avatar1 from '@public/main/Avatar/1.png'
import avatar2 from '@public/main/Avatar/2.png'
import avatar3 from '@public/main/Avatar/3.png'
import avatar4 from '@public/main/Avatar/4.png'
import avatar5 from '@public/main/Avatar/5.png'
import avatar6 from '@public/main/Avatar/6.png'
import avatar7 from '@public/main/Avatar/7.png'
import avatar8 from '@public/main/Avatar/8.png'
import avatar9 from '@public/main/Avatar/9.png'
import avatar10 from '@public/main/Avatar/10.png'
import avatar11 from '@public/main/Avatar/11.png'
import avatar12 from '@public/main/Avatar/12.png'
import avatar13 from '@public/main/Avatar/13.png'
import avatar14 from '@public/main/Avatar/14.png'
import avatar15 from '@public/main/Avatar/15.png'
import avatar16 from '@public/main/Avatar/16.png'
import avatar17 from '@public/main/Avatar/17.png'
import avatar18 from '@public/main/Avatar/18.png'
import avatar19 from '@public/main/Avatar/19.png'
import avatar20 from '@public/main/Avatar/20.png'

// Okwin rank crowns (home/okwinHome/crown1.png ~ crown3.png)
import okwinCrown1 from '@public/home/okwinHome/crown1.png'
import okwinCrown2 from '@public/home/okwinHome/crown2.png'
import okwinCrown3 from '@public/home/okwinHome/crown3.png'

// Language flags (languages/*.png)
import langAr from '@public/languages/ar.png'
import langBd from '@public/languages/bd.png'
import langBra from '@public/languages/bra.png'
import langEn from '@public/languages/en.png'
import langHd from '@public/languages/hd.png'
import langId from '@public/languages/id.png'
import langJapan from '@public/languages/japan.png'
import langKorea from '@public/languages/korea.png'
import langMd from '@public/languages/md.png'
import langMy from '@public/languages/my.png'
import langPh from '@public/languages/ph.png'
import langPk from '@public/languages/pk.png'
import langRus from '@public/languages/rus.png'
import langTh from '@public/languages/th.png'
import langVi from '@public/languages/vi.png'
import langZh from '@public/languages/zh.png'

// VIP swiper logo (vip/swiper/logo/1.png ~ 10.png)
import vipLogo1 from '@public/vip/swiper/logo/1.png'
import vipLogo2 from '@public/vip/swiper/logo/2.png'
import vipLogo3 from '@public/vip/swiper/logo/3.png'
import vipLogo4 from '@public/vip/swiper/logo/4.png'
import vipLogo5 from '@public/vip/swiper/logo/5.png'
import vipLogo6 from '@public/vip/swiper/logo/6.png'
import vipLogo7 from '@public/vip/swiper/logo/7.png'
import vipLogo8 from '@public/vip/swiper/logo/8.png'
import vipLogo9 from '@public/vip/swiper/logo/9.png'
import vipLogo10 from '@public/vip/swiper/logo/10.png'

// VIP swiper crown (vip/swiper/crown/1.png, 2.png)
import vipCrown1 from '@public/vip/swiper/crown/1.png'
import vipCrown2 from '@public/vip/swiper/crown/2.png'

// KYC bank icons (arupi/kycbank/{bank}/1.png)
import kycAirtel from '@public/arupi/kycbank/airtel/1.png'
import kycBhimAxisPay from '@public/arupi/kycbank/bhimAxisPay/1.png'
import kycFreeCharge from '@public/arupi/kycbank/freeCharge/1.png'
import kycFreo from '@public/arupi/kycbank/freo/1.png'
import kycMobikwik from '@public/arupi/kycbank/mobikwik/1.png'
import kycPaytm from '@public/arupi/kycbank/paytm/1.png'
import kycPhonepe from '@public/arupi/kycbank/phonepe/1.png'
import kycSlice from '@public/arupi/kycbank/slice/1.png'
import kycSupermoney from '@public/arupi/kycbank/supermoney/1.png'
import moneyView from '@public/arupi/kycbank/moneyView/1.png'
import twid from '@public/arupi/kycbank/twid/1.png'
import navi from '@public/arupi/kycbank/navi/1.png'

const avatarMap: Record<string | number, string> = {
	1: avatar1, 2: avatar2, 3: avatar3, 4: avatar4, 5: avatar5,
	6: avatar6, 7: avatar7, 8: avatar8, 9: avatar9, 10: avatar10,
	11: avatar11, 12: avatar12, 13: avatar13, 14: avatar14, 15: avatar15,
	16: avatar16, 17: avatar17, 18: avatar18, 19: avatar19, 20: avatar20,
}

const okwinCrownMap: Record<number, string> = {
	1: okwinCrown1, 2: okwinCrown2, 3: okwinCrown3,
}

const langMap: Record<string, string> = {
	ar: langAr, bd: langBd, bra: langBra, en: langEn, hd: langHd,
	id: langId, japan: langJapan, korea: langKorea, md: langMd,
	my: langMy, ph: langPh, pk: langPk, rus: langRus, th: langTh,
	vi: langVi, zh: langZh,
}

const vipLogoMap: Record<number, string> = {
	1: vipLogo1, 2: vipLogo2, 3: vipLogo3, 4: vipLogo4, 5: vipLogo5,
	6: vipLogo6, 7: vipLogo7, 8: vipLogo8, 9: vipLogo9, 10: vipLogo10,
}

const vipCrownMap: Record<number, string> = {
	1: vipCrown1, 2: vipCrown2,
}

const kycBankMap: Record<string, string> = {
	airtel: kycAirtel,
	bhimAxisPay: kycBhimAxisPay,
	freeCharge: kycFreeCharge,
	freo: kycFreo,
	mobikwik: kycMobikwik,
	paytm: kycPaytm,
	phonepe: kycPhonepe,
	slice: kycSlice,
	supermoney: kycSupermoney,
	moneyView: moneyView,
	twid: twid,
	navi: navi
}

export const useAssets = () => {
	// main/Avatar/{photo}.png; return '' when missing so callers can chain with ||
	const getAvatarUrl = (photo?: string | number): string => {
		if (photo == null) return ''
		return avatarMap[photo as any] ?? ''
	}

	// home/okwinHome/crown{rank}.png (rank 1-3)
	const getOkwinCrownUrl = (rank: number): string => okwinCrownMap[rank] ?? ''

	// languages/{locale}.png; ta/te fall back to hd (preserve legacy util behavior)
	const getLangFlag = (locale: string): string => {
		const key = locale === 'ta' || locale === 'te' ? 'hd' : locale
		return langMap[key] ?? ''
	}

	// vip/swiper/logo/{id}.png (id 1-10)
	const getVipLogo = (id: number): string => vipLogoMap[id] ?? ''

	// vip/swiper/crown/{1|2}.png — id==1 uses crown/1, others use crown/2
	const getVipCrown = (id: number): string => vipCrownMap[id !== 1 ? 2 : 1] ?? ''

	// arupi/kycbank/{bankCode}/1.png
	const getKycBankIcon = (bankCode: string): string => kycBankMap[bankCode] ?? ''

	return {
		defaultAvatar,
		defaultImgAvatar,
		defaultImgAvatar1,
		getAvatarUrl,
		getOkwinCrownUrl,
		getLangFlag,
		getVipLogo,
		getVipCrown,
		getKycBankIcon,
	}
}
