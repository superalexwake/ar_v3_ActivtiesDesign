import { PropType, Ref } from 'vue'
declare const _default: import('vue').DefineComponent<
	{
		readonly modelValue: {
			readonly type: PropType<string | number>
			readonly default: ''
		}
		readonly lineWidth: {
			readonly type: PropType<string | number>
			readonly default: 30
		}
		readonly lineHeight: {
			readonly type: NumberConstructor
			readonly default: 3
		}
		readonly activeColor: {
			readonly type: StringConstructor
			readonly default: '#1677ff'
		}
		readonly additionalX: {
			readonly type: NumberConstructor
			readonly default: 50
		}
		readonly reBoundExponent: {
			readonly type: NumberConstructor
			readonly default: 10
			readonly validator: (v: number) => boolean
		}
		readonly inertialDuration: {
			readonly type: NumberConstructor
			readonly default: 1000
			readonly validator: (v: number) => boolean
		}
		readonly reBoundingDuration: {
			readonly type: NumberConstructor
			readonly default: 360
		}
	},
	{
		viewAreaRef: Ref<HTMLElement>
		listRef: Ref<HTMLElement>
		activeValue: Ref<string | number>
		lineOffset: Ref<number>
		activeLineWidth: Ref<number>
		viewAreaWidth: Ref<number>
		offsetX: Ref<number>
		speed: Ref<number>
		touching: Ref<boolean>
		reBounding: Ref<boolean>
		translateX: Ref<number>
		startX: Ref<number>
		lastX: Ref<number>
		currentX: Ref<number>
		startMoveTime: Ref<number>
		endMoveTime: Ref<number>
		frameTime: Ref<number>
		frameStartTime: Ref<number>
		frameEndTime: Ref<number>
		inertiaFrame: Ref<number>
		zeroSpeed: Ref<number>
		acceleration: Ref<number>
		listStyle: import('vue').ComputedRef<{
			transitionTimingFunction: string
			transitionDuration: string
			transform: string
		}>
		activeBarStyle: import('vue').ComputedRef<{
			transition: string
			width: string
			height: string
			transform: string
			backgroundColor: string
		}>
		isMoveLeft: import('vue').ComputedRef<boolean>
	},
	unknown,
	{},
	{},
	import('vue').ComponentOptionsMixin,
	import('vue').ComponentOptionsMixin,
	('update:modelValue' | 'change')[],
	'update:modelValue' | 'change',
	import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
	Readonly<
		import('vue').ExtractPropTypes<{
			readonly modelValue: {
				readonly type: PropType<string | number>
				readonly default: ''
			}
			readonly lineWidth: {
				readonly type: PropType<string | number>
				readonly default: 30
			}
			readonly lineHeight: {
				readonly type: NumberConstructor
				readonly default: 3
			}
			readonly activeColor: {
				readonly type: StringConstructor
				readonly default: '#1677ff'
			}
			readonly additionalX: {
				readonly type: NumberConstructor
				readonly default: 50
			}
			readonly reBoundExponent: {
				readonly type: NumberConstructor
				readonly default: 10
				readonly validator: (v: number) => boolean
			}
			readonly inertialDuration: {
				readonly type: NumberConstructor
				readonly default: 1000
				readonly validator: (v: number) => boolean
			}
			readonly reBoundingDuration: {
				readonly type: NumberConstructor
				readonly default: 360
			}
		}>
	> & {
		'onUpdate:modelValue'?: ((...args: any[]) => any) | undefined
		onChange?: ((...args: any[]) => any) | undefined
	},
	{
		modelValue: string | number
		activeColor: string
		lineWidth: string | number
		lineHeight: number
		additionalX: number
		reBoundExponent: number
		inertialDuration: number
		reBoundingDuration: number
	}
>
export default _default
