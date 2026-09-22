import { onUnmounted } from 'vue';

export function useAnimationFrameUtils() {
    const prefixes = 'webkit moz ms o'.split(' ');
    let lastTime = 0;

    let requestAnimationFrame: typeof window.requestAnimationFrame;
    let cancelAnimationFrame: typeof window.cancelAnimationFrame;

    if (typeof window === 'undefined') {
        requestAnimationFrame = () => undefined as any;
        cancelAnimationFrame = () => undefined as any;
    } else {
        requestAnimationFrame = window.requestAnimationFrame;
        cancelAnimationFrame = window.cancelAnimationFrame;

        for (let i = 0; i < prefixes.length; i++) {
            if (requestAnimationFrame !== undefined && cancelAnimationFrame !== undefined) break;
            const prefix = prefixes[i];
            requestAnimationFrame =
                requestAnimationFrame || (window as any)[prefix + 'RequestAnimationFrame'];
            cancelAnimationFrame =
                cancelAnimationFrame ||
                (window as any)[prefix + 'CancelAnimationFrame'] ||
                (window as any)[prefix + 'CancelRequestAnimationFrame'];
        }

        if (!requestAnimationFrame || !cancelAnimationFrame) {
            requestAnimationFrame = (callback) => {
                const currTime = new Date().getTime();
                const timeToCall = Math.max(0, 16 - (currTime - lastTime));
                const id = window.setTimeout(() => {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

            cancelAnimationFrame = (id) => {
                window.clearTimeout(id);
            };
        }
    }

    // Cleanup on component unmount
    onUnmounted(() => {
        cancelAnimationFrame(lastTime);
    });

    return {
        requestAnimationFrame,
        cancelAnimationFrame,
    };
}
