const autoprefixer = require('autoprefixer')

module.exports = ({ file }) => {
	let remUnit = 32
	if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
		remUnit = 37.5
	} else {
		remUnit = 75
	}

	return {
		plugins: {
			autoprefixer: {
				overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
			},
			'postcss-pxtorem': {
				// 根节点的 fontSize 值
				rootValue: remUnit,
				propList: ['*'],
				selectorBlackList: [':root']
			}
		}
	}
}
