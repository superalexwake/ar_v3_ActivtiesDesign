import {computed, reactive} from "vue";
const store=reactive({
    list:[
        {
            name:'English',
            code:'en',
            icon:'https://dapp.pmhash.com/_nuxt/img/en.fa78245.png'
        },
        {
            name:"中文",
            code:'zh',
            icon:'https://dapp.pmhash.com/_nuxt/img/zh-CN.0cb069f.png'
        }
    ],
    currentIndex:0,
    dialog:false
});
export function useLanguage(){
    const langs=computed(()=>store.list);
    const current=computed(()=>store.list[store.currentIndex])
    const onDialog=()=>{
        store.dialog=true
    }
    const onChange=(index:number)=>{
        store.currentIndex=index;
        store.dialog=false;
    }
    return {
        store,
        langs,
        current,
        onDialog,
        onChange,
    }
}