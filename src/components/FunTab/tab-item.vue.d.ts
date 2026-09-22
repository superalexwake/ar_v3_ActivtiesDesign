declare const _default: import('vue').DefineComponent<
	{
		title: StringConstructor
		name: (StringConstructor | NumberConstructor)[]
		badge: (StringConstructor | NumberConstructor)[]
	},
	{
		el: import('vue').Ref<any>
		style: import('vue').ComputedRef<
			| {
					color: string | undefined
			  }
			| {
					color?: undefined
			  }
		>
		handleClick: () => void
	},
	unknown,
	{},
	{},
	import('vue').ComponentOptionsMixin,
	import('vue').ComponentOptionsMixin,
	Record<string, any>,
	string,
	import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
	Readonly<
		import('vue').ExtractPropTypes<{
			title: StringConstructor
			name: (StringConstructor | NumberConstructor)[]
			badge: (StringConstructor | NumberConstructor)[]
		}>
	>,
	{}
>
export default _default
