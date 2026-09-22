declare const _default: import('vue').DefineComponent<
	{
		modelValue: {
			type: (StringConstructor | NumberConstructor)[]
			default: string
		}
		activeColor: {
			type: StringConstructor
			default: string
		}
	},
	void,
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
			modelValue: {
				type: (StringConstructor | NumberConstructor)[]
				default: string
			}
			activeColor: {
				type: StringConstructor
				default: string
			}
		}>
	> & {
		'onUpdate:modelValue'?: ((...args: any[]) => any) | undefined
		onChange?: ((...args: any[]) => any) | undefined
	},
	{
		modelValue: string | number
		activeColor: string
	}
>
export default _default
