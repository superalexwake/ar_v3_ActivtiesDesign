import {showSuccessToast} from "vant/lib/toast/function-call";

export const copy = (text: any):void=>{
    if (!text) return
    const input = document.createElement('input')
    input.setAttribute('readonly', 'readonly')
    input.setAttribute('value', text.toLocaleString())
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
    showSuccessToast(('copySuccess'))
};