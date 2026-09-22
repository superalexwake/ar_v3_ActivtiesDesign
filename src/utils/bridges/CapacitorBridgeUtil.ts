// export const isAndroid = async (): Promise<boolean> => {
//     try {
//         const { Capacitor } = await import('@capacitor/core');
//         return Capacitor.getPlatform?.() === 'android';
//     } catch (e) {
//         return false;
//     }
// };

export const isIOS = async (): Promise<boolean> => {
    try {
        const { Capacitor } = await import('@capacitor/core');
        return Capacitor.getPlatform?.() === 'ios';
    } catch (e) {
        return false;
    }
};


export const isNativePlatform = async (): Promise<boolean> => {
    try {
        const { Capacitor } = await import('@capacitor/core');
        return Capacitor.isNativePlatform?.() || false;
    } catch (e) {
        return false;
    }
};

export const getCapacitor = async () => {
  try {
    const { Capacitor } = await import('@capacitor/core');
    return Capacitor;
  } catch (e) {
    console.error("Capacitor is not available in this environment.");
    return null;
  }
}