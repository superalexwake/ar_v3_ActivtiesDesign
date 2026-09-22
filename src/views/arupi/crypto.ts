import AES from 'crypto-js/aes';
import Enc from 'crypto-js/enc-utf8';
import Mode from 'crypto-js/mode-ecb'
import Pad from 'crypto-js/pad-pkcs7'
export function aesDecryptECB(contentBase64:string, strKey:string='c4d9e1b54a0c4d3681b98d3f54c0a8e7') {
	try {
		const key = Enc.parse(strKey);
		const decrypted = AES.decrypt(contentBase64, key, {
			mode: Mode,
			padding: Pad
		});
		const content=  decrypted.toString(Enc);
		if (content) return JSON.parse(content)
	} catch (e) {
		return null;
	}
}