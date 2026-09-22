import { ref, onMounted, onUnmounted } from 'vue';

interface UseWebWorkerIntervalFnOptions {
    immediate?: boolean;
}

export function useWorkerIntervalFn(
    callback: () => void,
    interval: number,
    options: UseWebWorkerIntervalFnOptions = { immediate: false }
) {
    const isActive = ref(false); // 是否正在运行
    let worker: Worker | null = null;

    // 创建 Worker 代码
    const createWorker = () => {
        const workerCode = `
      let intervalId = null;
      self.onmessage = (e) => {
        const { command, interval } = e.data;

        switch (command) {
          case 'start':
            if (!intervalId) {
              intervalId = setInterval(() => postMessage('tick'), interval);
            }
            break;
          case 'pause':
            clearInterval(intervalId);
            intervalId = null;
            break;
        }
      };
    `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    };

    // 启动定时器
    const start = () => {
        if (!worker) return;
        isActive.value = true;
        worker.postMessage({ command: 'start', interval });
    };

    // 暂停定时器
    const pause = () => {
        if (!worker) return;
        isActive.value = false;
        worker.postMessage({ command: 'pause' });
    };

    // 恢复定时器
    const resume = () => {
        if (!isActive.value) start();
    };

    onMounted(() => {
        worker = createWorker();
        worker.onmessage = (e) => {
            if (e.data === 'tick') {
                callback();
            }
        };
        if (options.immediate) {
            start();
        }
    });

    onUnmounted(() => {
        pause();
        worker?.terminate();
        worker = null;
    });

    return { start, pause, resume, isActive };
}
