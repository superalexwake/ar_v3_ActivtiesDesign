/**
 * ===========================================
 * useEventbus.ts
 * 事件总线，用于跨组件通信
 * @description: 提供一个简单的事件总线机制，允许组件之间通过事件名称进行通信。
 * @version: 1.0.0
 * 
 * 使用方式：
 * 1. 导入 useEventbus 模块。
 * 2. 使用 eventbusGlobalListener 注册事件监听器。
 * 3. 使用 emitEvent 对象中的方法触发事件。
 * @example:
 * import { eventbusGlobalListener, emitEvent, eventType } from '@/hooks/useEventbus';
 * // 注册事件监听器
 * eventbusGlobalListener((event, ...args) => {
 *     if (event === eventType.update_firebase_token) {
 *         // 处理更新 firebase token 事件
 *     }
 * });
 * // 触发更新 firebase token 事件
 * emitEvent.update_firebase_token();
 * =========================================
 * 
 **/

import { useEventBus } from '@vueuse/core';
const eventBus = useEventBus<string>('broadcast');


export const eventbusGlobalListener = function (callback: (event: string, ...args: any[]) => void) {
    eventBus.on(callback)
}

// 定义全局eventbus的事件类型channels
export const eventType = {
    update_firebase_token: 'UPDATE_FIREBASETOKEN',// 更新 firebase token 事件
}

// 事件函数
export const emitEvent = {
    update_firebase_token: () => eventBus.emit(eventType.update_firebase_token),
}

export type EventType = keyof typeof eventType;
export type EventTypeFunc = keyof typeof emitEvent;
