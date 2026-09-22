const win = window
function windowInit() {
	let lastTime = 0
	const vendors = ['webkit', 'moz']
	for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = win[vendors[x] + 'RequestAnimationFrame']
		window.cancelAnimationFrame = win[vendors[x] + 'CancelAnimationFrame'] || win[vendors[x] + 'CancelRequestAnimationFrame']
	}
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function (callback) {
			const currTime = Date.now()
			const interval = currTime - lastTime
			const timeToCall = Math.max(0, 16.7 - interval)
			const id = window.setTimeout(function () {
				callback(interval)
			}, timeToCall)
			lastTime = currTime + timeToCall
			return id
		}
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id)
		}
	}
}

export { windowInit }
//# sourceMappingURL=requestAnimationFrame.js.map
