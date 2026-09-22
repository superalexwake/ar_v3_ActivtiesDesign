import {
    showToast,
    showLoadingToast,
    setToastDefaultOptions,
} from "vant";
setToastDefaultOptions({ duration: 3500 });
export  function useToast(){
    const text = showToast;
    const success = text;
    const error = text;
    const loading = showLoadingToast;
    return {
        text,
        success,
        error,
        loading,
    };
}