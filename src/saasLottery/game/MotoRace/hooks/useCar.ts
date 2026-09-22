import { computed, onUnmounted, reactive, ref, shallowRef, watch } from 'vue'
import {
	Application,
	Assets,
	BlurFilter,
	Container,
	ContainerChild,
	Graphics,
	Particle,
	ParticleContainer,
	Point,
	Sprite,
	Text,
	Texture,
	TextureSource,
	Ticker,
	TilingSprite,
} from 'pixi.js'
import { GifSprite } from 'pixi.js/gif'
import { useSound } from './useSound'
import type {TextOptions} from "pixi.js/lib/scene/text/AbstractText";
import {useI18n} from "vue-i18n";
import { getLocal } from '@/utils'

const DESIGN_WIDTH = 750 // 假设你的设计稿宽度为375

interface GameElements {
	bg: Container | null
	head: Container | null
	bottom: Container | null
}

interface SheetList {
	scSheet: any
	motoSheet: any
	carSheet: any
	numberSheet: any
	motoRSheet: any
	manSheet: any
}

export const useCar = (MotorcycleHook: any) => {
	// const MotorcycleHook = useMotorcycleContext();
	const { t } = useI18n()
	const gameContainer = ref<HTMLDivElement | null>(null)
	const pixApp = shallowRef<Application | null>(null)
	let gameElements: GameElements = {
		bg: null,
		head: null,
		bottom: null
	} // 存储基础背景精灵的引用
	const currentShowCar = ref(0)
	const rankSprites = ref<
		{
			key: string
			bg: Sprite
		}[]
	>([]) // 存储左侧排名背景精灵的引用
	const currentRankList = ref<number[]>([]) // 存储当前排序的车辆列表
	const sheetList = ref<SheetList>({
		scSheet: null,
		motoSheet: null,
		carSheet: null,
		numberSheet: null,
		motoRSheet: null,
		manSheet: null
	}) // 存储所有的sheet
	const bgContainer = shallowRef<Container<ContainerChild> | undefined>()
	const trackContainer = shallowRef<Container<ContainerChild> | undefined>()
	const trackSprite = shallowRef<Container | undefined>()
	const clientWidth = ref(0)
	const mainInfo = reactive({
		w: 0,
		h: 0,
		x: 0,
		y: 0
	})
	const lotteryInfo = reactive({
		rank: [],
		lastRank: [4, 2, 8],
		statistics: {}
	})
	const { countdown, historyIssues, currentResult, statistics, visibilityStatus, issue, getIssue } = MotorcycleHook
	const lastIssuesRank = computed(() => {
		if (!historyIssues.value.length) return []
		return historyIssues.value[0].premium.split(',')?.map((item: string) => parseInt(item))
	})
	const lastIssues = computed(() => {
		if (!historyIssues.value.length) return '***loading***Z'
		return historyIssues.value[0].issueNumber
	})
	const switchInterval = ref<NodeJS.Timeout | null>(null)
	const isShowProgress = ref<boolean>(false)

	watch(
		() => currentResult.value,
		async (val, old) => {
			if (val && val !== old) {
				console.log('currentResult:', val)
				lotteryInfo.rank = val.premium.split(',').map((item: string) => parseInt(item))
			}
		}
	)
	const { playEffectSound, sounds } = useSound()

	// 监听 countdown 变化执行游戏逻辑
	watch(
		() => countdown.value.seconds,
		async (val) => {
			if (val === 23) {
				changeTrackBg()
				playEffectSound('changeSound')
				sounds['bgSound'].seek(37)
			}
			if (val === 6) {
				setTimeout(() => {
					addPodiumBg()
					playEffectSound('winSound')
				}, 800)
			}
			if (val === 21) {
				trackAddCar()
			}

			if (val === 18 && lotteryInfo.rank.length) {
				playEffectSound('carSound')
			}
			if (val === 18 && !currentResult.value) {
				setTrackBg3()
			}
			if (val === 0) {
				clearStage()
				if (pixApp.value) pixApp.value.stage.removeChild(bgContainer.value!)
				isShowProgress.value = false
				setTimeout(async () => {
					currentRankList.value = generateRandomArray()
					await getIssue()
					await addBg()
					await addCar()
				}, 300)
			}
		}
	),
	{
		immediate: true,
		deep: true
	}

	// 使用共享Ticker实例以减少多个Ticker的开销
	const sharedTicker = Ticker.shared

	// 缓存常用纹理
	const textureCache = new Map<string, Texture>()

	// 对象池，用于重用精灵和容器
	const spritePool: Sprite[] = []

	// 获取精灵从对象池
	const getSprite = (texture?: Texture): Sprite => {
		if (spritePool.length > 0) {
			const sprite = spritePool.pop()!
			if (texture) sprite.texture = texture
			sprite.alpha = 1
			sprite.visible = true
			sprite.scale.set(1)
			sprite.rotation = 0
			return sprite
		}
		return texture ? new Sprite(texture) : new Sprite()
	}

	const containerInit = async () => {
		if (!gameContainer.value) return

		const gameCanvas = document.getElementById('game-container') as HTMLDivElement

		// 初始化应用
		pixApp.value = new Application()

		await pixApp.value.init({
			width: DESIGN_WIDTH,
			height: gameCanvas.clientHeight,
			backgroundColor: 'transparent',
			resolution: window.devicePixelRatio || 1.5, // 根据设备像素比设置分辨率
			autoDensity: true, // 调整canvas CSS样式以匹配分辨率
			antialias: true, // 使图像更加平滑
			// 启用WebGL2以获得更好的性能
			preference: 'webgpu'
		})
		clientWidth.value = gameCanvas.clientWidth
		currentRankList.value = generateRandomArray()
		lotteryInfo.lastRank = lastIssuesRank.value

		// 将 Pixi 的画布添加到 DOM 中
		gameContainer.value.appendChild(pixApp.value.canvas)

		if (countdown?.value?.seconds <= 22){
			isShowProgress.value = true
			lotteryInfo.lastRank = historyIssues.value[1].premium.split(',')?.map((item: string) => parseInt(item)) || []
		}

			// 预加载资源
		await addBg()
		// 等待背景加载完成
		sounds['bgSound'].play()

		sounds['bgSound'].seek(60 - countdown?.value?.seconds)
		if (countdown?.value?.seconds > 24) {
			addCar()
		} else if (countdown?.value?.seconds > 5 && countdown?.value?.seconds < 24) {
			setTrackBg3()
		}
	}

	// 优化后的资源加载方法
	const loadAssets = async (onProgress?: (percentage: number) => void) => {
		 Assets.reset() // 重置资源加载器
		try {
			// 基础资源定义
			const resources = [
				{ alias: 'bg', src: 'show_bg' },
				{ alias: 'head', src: 'header' },
				{ alias: 'bottom', src: 'bottom' },
				{ alias: 'car_bg', src: 'main_bg' },
				{ alias: 'big_l', src: 'big_l' },
				{ alias: 'small_l', src: 'small_l' },
				{ alias: 'rankList_bg', src: 'rank_bg' },
				{ alias: 'rb_1', src: 'rb_1' },
				{ alias: 'track_1', src: 'track_1' },
				{ alias: 'track_2', src: 'track_2' },
				// { alias: 'track_3', src: 'track_3' },
				{ alias: 'rank_bg', src: 'rank' },
				{ alias: 'active_rank', src: 'active_rank' },
				{ alias: 'podium_bg', src: 'podium_bg' },
				{ alias: 'podium', src: 'podium' },
				{ alias: 'no_1', src: 'no_1' },
				{ alias: 'no_2', src: 'no_2' },
				{ alias: 'no_3', src: 'no_3' },
				{ alias: 'wait_bg', src: 'wait_bg' },
				{ alias: 'flame', src: 'flame' },
				{ alias: 'flame2', src: 'flame2' },
				{ alias: 'flame_i', src: 'flame_i' },
				{ alias: 'track3_1', src: 'track3_1' },
				{ alias: 'track3_2', src: 'track3_2' },
				{ alias: 'track3_3', src: 'track3_3' },
				{ alias: 'light', src: new URL('../assets/images/light.gif', import.meta.url).href }
			]

			// 雪碧图定义
			const spriteSheets = [
				{ alias: 'sc', json: 'sc' },
				{ alias: 'moto', json: 'moto' },
				{ alias: 'car', json: 'car' },
				{ alias: 'number', json: 'number' },
				{ alias: 'man', json: 'man' },
				{ alias: 'motoR', json: 'motoR' }
			]

			// 计算资源总量
			const totalResources = resources.length + spriteSheets.length * 2 // 因为每个雪碧图包含纹理图和JSON文件两项
			let loadedCount = 0

			const updateProgress = () => {
				loadedCount++
				const progress = Math.round((loadedCount / totalResources) * 100)
				onProgress?.(progress)
			}

			// 加载基础资源
			await Promise.all(
				resources.map(async (resource) => {
					let src = resource.src
					if (!src.startsWith('http') && !src.includes('/images/')) {
						src = await loadImg(resource.src) // 你的资源路径处理函数
					}
					const texture = await Assets.load({ alias: resource.alias, src })
					textureCache.set(resource.alias, texture)
					updateProgress() // 每加载一个基础资源更新进度
				})
			)

			// 加载雪碧图资源 (纹理 + JSON)
			await Promise.all(
				spriteSheets.map(async (sheet) => {
					const texturePath = await loadImg(sheet.json) // 获取纹理路径
					const jsonPath = new URL(`../assets/json/${sheet.json}.json`, import.meta.url).href

					// 先加载纹理
					const texture = await Assets.load(texturePath)
					updateProgress() // 更新加载纹理进度

					// 再加载 JSON 并关联纹理
					Assets.add({
						alias: sheet.alias,
						src: jsonPath,
						data: { texture }
					})

					updateProgress() // 更新加载json进度
				})
			)

			// 存储雪碧图引用
			sheetList.value.scSheet = await Assets.load('sc')
			sheetList.value.motoSheet = await Assets.load('moto')
			sheetList.value.carSheet = await Assets.load('car')
			sheetList.value.numberSheet = await Assets.load('number')
			sheetList.value.motoRSheet = await Assets.load('motoR')
			sheetList.value.manSheet = await Assets.load('man')

			console.log('所有资源和雪碧图加载完成')
		} catch (error) {
			console.error('加载资源出错:', error)
		}
	}

	const addBg = async () => {
		if (!pixApp.value) return

		bgContainer.value = new Container()
		bgContainer.value.zIndex = 1
		let innerWidth = (document.getElementById('game-container') as HTMLDivElement).clientWidth
		bgContainer.value.scale.set(innerWidth / DESIGN_WIDTH)
		// console.log('innerWidth', innerWidth, getLocal())
		if (getLocal() === 'ar') {
			bgContainer.value.x = DESIGN_WIDTH - innerWidth
		}

		bgContainer.value.sortableChildren = true
		pixApp.value.stage.addChild(bgContainer.value)

		try {
			const bgTexture = new Sprite(await Assets.get('bg'))
			const headTexture = new Sprite(await Assets.get('head'))
			const bottomTexture = new Sprite(await Assets.get('bottom'))

			const headContainer = new Container()
			const bottomContainer = new Container()
			const mainContainer = new Container()
			const { width: screenWidth } = pixApp.value!.screen

			headContainer.x = bottomContainer.x = mainContainer.x = 0
			headContainer.y = 0
			mainContainer.y = 88
			bottomContainer.y = 410
			headContainer.sortableChildren = true
			mainContainer.sortableChildren = true
			bottomContainer.sortableChildren = true

			bgTexture.x = 0
			bgTexture.width = screenWidth
			bgTexture.height = 322

			headTexture.x = 0
			headTexture.width = screenWidth
			headTexture.height = 88

			bottomTexture.x = 0
			bottomTexture.width = screenWidth
			bottomTexture.height = 74

			// 设置精灵垂直位置
			headTexture.y = 0
			bgTexture.y = 0
			bottomTexture.y = 0

			headContainer.addChild(headTexture)
			mainContainer.addChild(bgTexture)
			bottomContainer.addChild(bottomTexture)
			gameElements.bg = mainContainer
			gameElements.head = headContainer
			gameElements.bottom = bottomContainer

			mainInfo.h = bgTexture.height
			mainInfo.w = bgTexture.width
			mainInfo.x = bgTexture.x
			mainInfo.y = headTexture.height

			let lastIs = lastIssues.value || '***loading***'
			if (isShowProgress.value) {
				lastIs = historyIssues.value[1].issueNumber
			}
			const issue2Text = new Text({
				text: lastIs || '***loading***',
				style: { fontFamily: 'Arial', fontSize: 24, fill: '#fff', fontWeight: '400' }
			})
			issue2Text.x = 26
			issue2Text.y = 436
			issue2Text.label = 'issue2Text'
			issue2Text.zIndex = 3

			const issue1Text = new Text({
				text: issue.value || '***loading***',
				style: { fontFamily: 'Arial', fontSize: 24, fill: '#fff', fontWeight: '400', lineHeight: 28 }
			})
			issue1Text.x = 26
			issue1Text.y = 30
			issue1Text.zIndex = 3
			issue1Text.label = 'issue1Text'

			headContainer.addChild(issue1Text)
			// Add resolution to improve text clarity
			// issueText.resolution = window.devicePixelRatio || 2;
			bgContainer.value?.addChild(issue2Text)

				// 将精灵添加到容器
				;[gameElements.bg, gameElements.head, gameElements.bottom].forEach((container) => {
					bgContainer.value?.addChild(container as Container)
				})

			bottomAddNo()
		} catch (e) {
			console.error('Error loading images:', e)
		}
	}
	// 添加底部排名数字
	const bottomAddNo = () => {
		if (!pixApp.value) return
		let w = 390
		const addNoContainer = new Container()
		addNoContainer.x = 288
		addNoContainer.y = 423

		addNoContainer.width = w
		addNoContainer.height = 48
		addNoContainer.zIndex = 3
		addNoContainer.label = 'addNoContainer'
		addNoContainer.sortableChildren = true
		bgContainer.value?.addChild(addNoContainer)

		setBottomNo()
	}

	const setBottomNo = () => {
		if (!pixApp.value) return
		const addNoContainer = bgContainer.value?.getChildByName('addNoContainer') as Container<ContainerChild>
		addNoContainer.removeChildren()
		let rank = lotteryInfo.lastRank
		// 预先获取纹理，避免重复查找
		const no1Texture = sheetList.value.numberSheet.textures[`t_${rank[0]}.png`]
		const no2Texture = sheetList.value.numberSheet.textures[`t_${rank[1]}.png`]
		const no3Texture = sheetList.value.numberSheet.textures[`t_${rank[2]}.png`]

		const no1 = getSprite(no1Texture)
		const no2 = getSprite(no2Texture)
		const no3 = getSprite(no3Texture)

		// 批量设置共同属性
		const noWidth = 48
		const noHeight = 48
			;[no1, no2, no3].forEach((sprite) => {
				sprite.width = noWidth
				sprite.height = noHeight
				sprite.y = 0
				sprite.zIndex = 3
			})

		const st1 = new Text({
			text: '1st',
			style: {
				fontFamily: 'Arial',
				fontSize: 32,
				fontWeight: '400',
				fill: '#F5ECC3'
			}
		})
		const st2 = new Text({
			text: '2nd',
			style: {
				fontFamily: 'Arial',
				fontSize: 32,
				fontWeight: '400',
				fill: '#B5CFDC'
			}
		})
		const st3 = new Text({
			text: '3rd',
			style: {
				fontFamily: 'Arial',
				fontSize: 32,
				fontWeight: '400',
				fill: '#DEAD93'
			}
		})

			// 批量设置共同属性
			;[st1, st2, st3].forEach((text) => {
				text.anchor.set(0.5)
				text.y = 24
				text.resolution = window.devicePixelRatio || 2 // 提高文本清晰度
			})

		st1.label = 'st1'
		st2.label = 'st2'
		st3.label = 'st3'

		st1.x = 24.5
		st2.x = 161
		st3.x = 298.5

		no1.x = st1.width + no1.width * 0.25
		no2.x = st2.x + st2.width / 2 + no1.width * 0.25
		no3.x = st3.x + st3.width / 2 + no1.width * 0.25
		no1.label = 'no1'
		no2.label = 'no2'
		no3.label = 'no3'

		// 批量添加到容器，减少多次调用
		addNoContainer.addChild(st1, st2, st3, no1, no2, no3)
	}

	// 添加左侧车辆排名
	const addCar = async () => {
		if (!bgContainer.value) return

		// 左侧车辆排名盒子
		const carRankContainer = new Container()
		carRankContainer.sortableChildren = true
		carRankContainer.x = 13
		carRankContainer.y = 97
		carRankContainer.zIndex = 9
		carRankContainer.label = 'carLeft'
		bgContainer.value?.addChild(carRankContainer)

		const updateSprites = async () => {
			carRankContainer.removeChildren()
			rankSprites.value = []
			// 截取currentRankList前五个元素，并删除原数组中的这五个元素
			const firstFive = currentRankList.value.splice(0, 5)
			let textures = firstFive.map((item) => {
				return {
					key: `n_${item}.png`,
					sprite: sheetList.value.carSheet.textures[`n_${item}.png`] as Texture
				}
			})
			for (const item of textures) {
				const index = textures.indexOf(item)
				const rankBg = new Sprite(await Assets.get('rank_bg'))
				rankBg.width = 78
				rankBg.height = 52
				const car = new Sprite(item.sprite)
				car.width = 60
				car.height = 42.5
				car.x = 5
				car.y = (mainInfo.h! / 5) * index + 4
				rankBg.x = 0
				rankBg.y = (mainInfo.h! / 5) * index
				rankBg.zIndex = 1
				car.zIndex = 2
				carRankContainer.addChild(car)
				carRankContainer.addChild(rankBg)
				rankSprites.value.push({ key: item.key, bg: rankBg }) // 存储rank背景精灵的引用
			}
		}

		updateSprites()
		const switchCar = setInterval(() => {
			if (countdown.value?.seconds > 23 && (countdown.value?.seconds === 45 || countdown.value?.seconds === 30)) {
				updateSprites()
			}

			if (countdown.value?.seconds <= 23) {
				clearInterval(switchCar)
				pixApp.value?.stage.removeChild(carRankContainer)
			}
		}, 1000)

		startSwitchingCars()
		// showCarInfo()
	}

	// 左侧切换当前车辆
	const startSwitchingCars = async () => {
		let currentIndex = 0

		// 预先获取激活状态纹理
		const activeRankTexture = await Assets.get('active_rank')
		const rankBgTexture = await Assets.get('rank_bg')

		// 重置所有背景为非激活状态
		const resetRanks = () => {
			for (const sprite of rankSprites.value) {
				sprite.bg.texture = rankBgTexture
			}
		}

		// 设置当前激活的背景
		const setActiveRank = async (index: number) => {
			resetRanks()
			currentShowCar.value = parseInt(rankSprites.value[index].key.split('_')[1].split('.')[0])
			rankSprites.value[index].bg.texture = activeRankTexture
		}

		// 立即执行第一次切换
		await setActiveRank(currentIndex)
		currentIndex = (currentIndex + 1) % 5

		// 之后每3秒切换一次
		switchInterval.value = setInterval(async () => {
			if (countdown?.value?.seconds <= 23) {
				clearInterval(switchInterval.value as NodeJS.Timeout)
				return
			}

			await setActiveRank(currentIndex)
			currentIndex = (currentIndex + 1) % 5
		}, 3000)
	}

	// 展示车辆移入移出
	const showCarInfo = async () => {
		if (!pixApp.value) return
		if (!bgContainer.value) return

		const carInfoContainer = new Container()
		carInfoContainer.sortableChildren = true
		carInfoContainer.x = 0
		carInfoContainer.y = mainInfo.y
		carInfoContainer.zIndex = 3
		carInfoContainer.label = 'carInfoContainer'

		// 首先将容器添加到舞台
		bgContainer.value.addChild(carInfoContainer)

		// 创建一个矩形遮罩
		let mask = new Graphics().rect(0, 0, pixApp.value.screen.width, mainInfo.h).fill(0x000000)

		// 应用遮罩 - 遮罩应该使用相对于被遮罩对象的坐标
		carInfoContainer.mask = mask
		// 将遮罩添加到舞台 - 必须有共同的父容器
		carInfoContainer.addChild(mask)

		// 调用车辆动画
		carDirection(carInfoContainer)

		// 在超时函数中确保正确移除遮罩
		setTimeout(() => {
			// 确保在销毁容器前清除遮罩引用
			if (carInfoContainer) {
				carInfoContainer.mask = null
				carInfoContainer.removeChildren()
				bgContainer.value?.removeChild(carInfoContainer)
			}
		}, 3000)
	}

	// 车辆移入移出
	const carDirection = async (container: Container<ContainerChild>) => {
		if (!pixApp.value) return
		// 背景
		const car_bg = await Assets.get('car_bg')
		const carBg = new Sprite(car_bg)
		carBg.anchor.set(0.5)
		carBg.x = mainInfo.w / 2
		carBg.y = mainInfo.h / 2
		carBg.width = mainInfo.w
		carBg.height = mainInfo.h
		carBg.zIndex = 3

		container.addChild(carBg)

		const carContainer = new Container()
		const car = new Sprite(sheetList.value.scSheet.textures[`s_c_${currentShowCar.value}.png`])
		car.width = 400
		car.height = 283
		let direction = currentShowCar.value % 2 === 0
		let cw = car.width / 2

		carContainer.width = car.width
		carContainer.height = car.height
		carContainer.x = direction ? mainInfo.w + cw : -cw // 根据方向设置初始位置
		carContainer.y = mainInfo.h / 2
		carContainer.sortableChildren = true
		carContainer.zIndex = 4
		// 设置 pivot 为中心点
		carContainer.pivot.set(0, 0)
		carContainer.scale.set(1)

		container.addChild(carContainer)


		car.anchor.set(0.5)
		car.x = 0 // 相对于carContainer的中心
		car.y = 0 // 相对于carContainer的中心
		car.zIndex = 4

		carContainer.addChild(car)
		const textureFlame = direction ? await Assets.get('flame2') : await Assets.get('flame')
		const falme = new Sprite(textureFlame)
		falme.anchor.set(0.5)
		falme.width = 200
		falme.height = 80
		falme.x = direction ? 230 : -230
		falme.y = -36
		falme.zIndex = 6
		carContainer.addChild(falme)

		const big_l = new Sprite(await Assets.get('big_l'))
		const small_l = new Sprite(await Assets.get('small_l'))
		big_l.width = mainInfo.w * 0.168
		big_l.height = mainInfo.w * 0.168
		small_l.width = mainInfo.w * 0.141
		small_l.height = mainInfo.w * 0.141
		big_l.anchor.set(0.5)
		small_l.anchor.set(0.5)
		if (direction) {
			big_l.zIndex = 5
			small_l.zIndex = 3
			big_l.x = car.width / 2 - big_l.width / 2
			big_l.y = car.height / 2 - big_l.height / 2
			small_l.x = -car.width / 2 + small_l.width / 2 - 5
			small_l.y = car.height / 2 - small_l.height / 2
		} else {
			big_l.zIndex = 5
			small_l.zIndex = 3

			big_l.x = -car.width / 2 + big_l.width / 2
			big_l.y = car.height / 2 - big_l.height / 2
			small_l.x = car.width / 2 - small_l.width / 2 + 5
			small_l.y = car.height / 2 - small_l.height / 2
		}
		carContainer.addChild(big_l)
		carContainer.addChild(small_l)
		tireTicker(big_l, small_l)

		const ticker = new Ticker()
		const duration = 1000 // 动画持续时间1.5秒
		const targetX = mainInfo.w / 2
		const startX = carContainer.x
		const deltaX = targetX - startX
		let elapsed = 0

		// 创建粒子容器
		const particleContainer = new ParticleContainer({
			dynamicProperties: {
				position: true,
				rotation: true,
				scale: true,
				alpha: true,
				uvs: true
			}
		});
		particleContainer.x = direction ? 135 : -135;
		particleContainer.y = -16;
		particleContainer.zIndex = 6;
		carContainer.addChild(particleContainer);


		// 获取火焰纹理
		const flameTexture = Assets.get('flame_i');
		if (!flameTexture) {
			console.error('error loading flame texture');
			return;
		}

		// 创建粒子数组用于跟踪
		const particles: Particle[] = [];

		// 创建初始粒子
		const createParticle = () => {
			const particle: any = new Particle(flameTexture)
			// 设置基础属性
			particle.anchorX = 0.5;
			particle.anchorY = 0.5;

			particle.scaleX = 0.2 + Math.random() * 0.3;
			particle.scaleY = particle.scaleX;
			particle.alpha = Math.random() * 0.5 + 0.5;  // 透明度变化
			particle.rotation = Math.random() * Math.PI * 2;
			// 基于方向的速度设置 - 关键改变
			if (direction) {
				// 向右上角喷射 (车朝右)
				const angle = Math.PI * 0.09 + (Math.random() * 0.1 - 0.05); // 右上方向 + 小范围随机变化
				const speed = 3 + Math.random() * 2;
				particle.vx = Math.cos(angle) * speed; // 主要是正X方向
				particle.vy = -Math.sin(angle) * speed; // 主要是负Y方向
			} else {
				// 向左上角喷射 (车朝左)
				const angle = Math.PI * 0.915 + (Math.random() * 0.1 - 0.05); // 左上方向 + 小范围随机变化
				const speed = 3 + Math.random() * 2;
				particle.vx = Math.cos(angle) * speed; // 主要是负X方向
				particle.vy = -Math.sin(angle) * speed; // 主要是负Y方向
			}
			particle.fade = Math.random() * 0.0015 + 0.008;
			// 设置初始位置（随机分布在车身周围）
			particle.x = direction ? 20 : -20;
			particle.y = Math.random() * 3 - 1.5;
			particles.push(particle);
			particleContainer.addParticle(particle);
		}

		function updateParticles() {
			for (let i = particles.length - 1; i >= 0; i--) {
				const p: any = particles[i];
				p.x += p.vx;
				p.y += p.vy;

				// 减小重力效应，保持直线轨迹
				p.vy -= 0.009; // 减小Y方向的加速度

				// 减小透明度
				p.alpha -= p.fade;
				p.scaleX *= 0.97;  // 让粒子缩小，形成拖尾渐细效果
				p.scaleY *= 0.98;  // 让粒子缩小，形成拖尾渐细效果
				p.rotation += 0.02;

				if (p.alpha <= 0 || p.scaleX < 0.05) {
					particleContainer.removeParticle(p);
					particles.splice(i, 1);
				}
			}
			// 每帧添加新粒子
			if (Math.random() < 0.85) createParticle();
		}
		// 车辆移动动画
		animate(() => {
			elapsed += ticker.deltaMS;
			const progress = Math.min(elapsed / duration, 1);
			carContainer.x = startX + progress * deltaX;
			updateParticles()
			particleContainer.update()

			if (progress === 1) {
				const shrinkDuration = 500;
				const initialScale = carContainer.scale.x;
				const targetScale = 0.9;
				let shrinkElapsed = 0;

				// 车辆到达中心位置后的缩放动画
				animate(() => {
					if (!pixApp.value) {
						ticker.stop()
						ticker.destroy()
						return
					}
					shrinkElapsed += ticker.deltaMS;
					const shrinkProgress = Math.min(shrinkElapsed / shrinkDuration, 1);
					const newScale = initialScale + (targetScale - initialScale) * shrinkProgress;
					carContainer.scale.set(newScale);
					updateParticles()
					particleContainer.update()
					// 继续更新粒子
					if (shrinkProgress === 1) {
						// 执行后续操作
						moveShowCar(container);
						rankInfo();
						return false;
					}
					return true;
				});
				return false;
			}
			return true;
		});
	}

	// 移动展示车辆的盒子
	const moveShowCar = (container: Container<ContainerChild>) => {
		const ticker = new Ticker() // 创建 ticker 动画更新器
		const duration = 300 // 动画持续时间（毫秒）
		const direction = currentShowCar.value % 2 === 0 // 偶数为左移，奇数为右移
		const targetX = direction ? -pixApp.value!.screen.width : pixApp.value!.screen.width // 目标位置
		const startX = 0 // 当前容器的起始位置
		const distance = targetX - startX // 总移动距离
		let elapsedTime = 0 // 已经过的时间

		// 逐帧更新动画
		animate(() => {
			if (!pixApp.value) {
				ticker.stop()
				return
			}
			// 增加 elapsedTime，计算当前比例
			elapsedTime += ticker.deltaMS
			const progress = Math.min(elapsedTime / duration, 1) // 确保 progress 不超过 1

			// 根据进度更新位置（使用线性插值公式）
			container.x = startX + distance * progress

			// 动画结束时停止 ticker
			if (progress >= 1) {
				return false; // 停止动画
			}
			return true; // 继续动画
		});
	}

	// 添加车辆信息100期记录
	const addCarInfo = () => {
		const motoSheet = sheetList.value.motoSheet
		const currentSprite = new Sprite(motoSheet.textures[`moto_${currentShowCar.value}.png`])
		currentSprite.width = mainInfo.w * 0.573
		currentSprite.height = mainInfo.h * 0.89
		currentSprite.x = mainInfo.w * 0.104
		currentSprite.y = mainInfo.h * 0.062
		currentSprite.zIndex = 2
		currentSprite.label = 'carInfo'
		gameElements.bg?.addChild(currentSprite)

		setTimeout(() => {
			if (gameElements.bg!.children.includes(currentSprite)) {
				gameElements.bg!.removeChild(currentSprite)
			}
		}, 3000)
	}

	// 车辆排名信息
	const rankInfo = async () => {
		const rankContainer = new Container()
		rankContainer.x = 486
		rankContainer.y = 24
		rankContainer.width = 240
		rankContainer.height = 277
		rankContainer.sortableChildren = true

		gameElements.bg!.addChild(rankContainer)

		// 使用缓存的纹理
		const rankBg = new Sprite(await Assets.get('rankList_bg'))
		rankBg.width = 240
		rankBg.height = 277
		rankBg.x = 0
		rankBg.y = -rankBg.height
		rankBg.zIndex = 1
		rankContainer.addChild(rankBg)

		const text = new Text({
			text: `NO.${currentShowCar.value}`,
			style: { fontFamily: 'Arial', fontSize: 28, fill: 'white', align: 'center' }
		})
		text.x = rankBg.width / 2 - text.width / 2
		text.y = 2
		text._zIndex = 2
		rankContainer.addChild(text)

		// 创建矩形遮罩
		const mask = new Graphics().rect(0, 0, rankBg.width, rankBg.height).fill(0xffffff)
		rankContainer.mask = mask
		rankContainer.addChild(mask)

		rankListTicker(rankBg, -rankBg.height, 300)
		car100Info(rankContainer)

		setTimeout(() => {
			if (gameElements.bg!.children.includes(rankContainer)) {
				gameElements.bg!.removeChild(rankContainer)
			}
		}, 3000)
	}

	// 右侧车辆排名信息
	const car100Info = async (container: Container<ContainerChild>) => {
		const containers: Container[] = []
		const bgHeight = mainInfo.h
		const itemHeight = 30
		const itemWidth = 197
		const startY = bgHeight * 0.33
		const itemSpacing = 14

		// 预先加载纹理，避免循环中重复加载
		const rb1Texture = await Assets.get('rb_1')

		// 批量创建容器和元素
		for (let index = 0; index < 3; index++) {
			const item = statistics.value[currentShowCar.value][index]
			const noCon = new Container()
			noCon._zIndex = 2
			noCon.width = itemWidth
			noCon.height = itemHeight
			noCon.x = -itemWidth
			noCon.y = startY + (itemHeight + itemSpacing) * index
			noCon.sortableChildren = true
			container.addChild(noCon)
			containers.push(noCon)

			const rb_1 = new Sprite(rb1Texture)
			rb_1.width = itemWidth
			rb_1.height = itemHeight
			rb_1.x = 0
			rb_1.y = 0
			noCon.addChild(rb_1)
			const ndText = ['st', 'nd', 'rd']
			const rankText = new Text({
				text: index + 1 + ndText[index],
				style: { fontFamily: 'Arial', fontSize: 24, fill: '#04060A' }
			})
			rankText.x = rb_1.x + 2
			rankText.y = rb_1.y
			rankText._zIndex = 3

			const rankText2 = new Text({
				text: item,
				style: { fontFamily: 'Arial', fontSize: 32, fill: '#FB5B5B', fontWeight: 'bold' }
			})
			rankText2._zIndex = 3
			rankText2.x = 62
			rankText2.y = 10
			rankText2.anchor.set(0.5)

			noCon.addChild(rankText)
			noCon.addChild(rankText2)
		}

		// 使用单个Ticker处理所有动画
		const ticker = new Ticker()
		let currentIndex = 0
		let startTime = performance.now()
		const duration = 300
		const targetX = 21

		try {
			ticker.add(() => {
				if (!pixApp.value) {
					ticker.stop()
					return
				}
				if (currentIndex < containers.length) {
					const noCon = containers[currentIndex]
					const elapsedTime = performance.now() - startTime

					if (elapsedTime < duration) {
						const progress = elapsedTime / duration
						noCon.x = -noCon.width + (targetX + noCon.width) * progress
					} else {
						noCon.x = targetX
						currentIndex++
						startTime = performance.now()
					}
				} else {
					ticker.stop()
				}
			})

			ticker.start()
		} catch (error) {
			console.log(error)
		}
	}

	const changeTrackBg = async () => {
		let carLeft = bgContainer.value?.getChildByLabel('carLeft') as Container
		if (carLeft) {
			bgContainer.value?.removeChild(carLeft)
		}
		let issue1Text = gameElements.head?.getChildByLabel('issue1Text') as Text
		if (issue1Text) {
			gameElements.head?.removeChild(issue1Text)
		}
		let carInfo = gameElements.bg?.getChildByLabel('carInfo') as Sprite
		if (carInfo) {
			gameElements.bg?.removeChild(carInfo)
		}
		let carInfoContainer = bgContainer.value?.getChildByLabel('carInfoContainer') as Container
		if (carInfoContainer) {
			carInfoContainer.removeChildren()
			bgContainer.value?.removeChild(carInfoContainer)
		}
		// 预先获取纹理
		const track1Texture = await Assets.get('track_1')

		const track1Bg = new Sprite(track1Texture)

		// 设置尺寸和位置
		track1Bg.width = 750
		track1Bg.height = 322
		track1Bg.x = 0
		track1Bg.y = 0
		track1Bg.zIndex = 3

		// 替换背景
		gameElements.bg?.removeChildren()
		gameElements.bg?.addChild(track1Bg)

		carNumberBg()

		// 并行执行后续操作
		await trackMove1()
	}

	const carNumberBg = ( rank?: any[]) => {
		// 使用对象池获取容器
		const carNumberContainer = new Container()
		carNumberContainer.x = 0
		carNumberContainer.y = 0
		carNumberContainer.width = mainInfo.w
		carNumberContainer.height = mainInfo.y
		carNumberContainer.zIndex = 2
		carNumberContainer.sortableChildren = true
		carNumberContainer.label = 'carNumberContainer'
		bgContainer.value?.addChild(carNumberContainer)

		// 创建1ST文本
		const st1 = new Text({
			text: '1st',
			style: { fontFamily: 'Arial', fontSize: 32, fill: '#fff', fontWeight: 'bold', lineHeight: 32 }
		})
		st1.x = 606
		st1.y = 28
		st1.zIndex = 3
		st1.resolution = window.devicePixelRatio || 2 // 提高文本清晰度
		carNumberContainer.addChild(st1)

		// 预先计算常用值以避免重复计算
		const numberWidth = 48
		const numberHeight = 48
		const marginLeft = 26
		const spacing = 10
		const yPosition = 20
		const numberSheet = sheetList.value.numberSheet.textures

		// 批量创建数字精灵
		if(rank) {
			rank.reverse()
			for (let i = 0; i < rank.length; i++) {
				const numberBg = new Sprite(numberSheet[`t_${rank[i]}.png`])
				numberBg.width = numberWidth
				numberBg.height = numberHeight
				numberBg.x = marginLeft + (i) * (numberWidth + spacing)
				numberBg.y = yPosition
				numberBg.zIndex = 3
				numberBg.label = 'number' + rank[i]
				carNumberContainer.addChild(numberBg)
			}
		} else {
			for (let i = 1; i <= 10; i++) {
				const numberBg = new Sprite(numberSheet[`t_${i}.png`])
				numberBg.width = numberWidth
				numberBg.height = numberHeight
				numberBg.x = marginLeft + (i - 1) * (numberWidth + spacing)
				numberBg.y = yPosition
				numberBg.zIndex = 3
				numberBg.label = 'number' + i
				carNumberContainer.addChild(numberBg)
			}
		}
		
	}

	// 赛道场景1
	const trackMove1 = async () => {
		// 使用对象池获取容器
		trackContainer.value = new Container()
		trackContainer.value.sortableChildren = true
		trackContainer.value.zIndex = 4
		trackContainer.value.x = -mainInfo.w
		trackContainer.value.y = mainInfo.y
		trackContainer.value.width = mainInfo!.w
		trackContainer.value.height = mainInfo!.h
		bgContainer.value?.addChild(trackContainer.value)

		// 预先获取纹理
		const [track2Texture, track3Texture1, track3Texture2, track3Texture3] = await Promise.all([Assets.get('track_2'),
		Assets.get('track3_1'),
		Assets.get('track3_2'),
		Assets.get('track3_3'),
		])

		// 创建赛道精灵
		const track2Bg = new Sprite(track2Texture as Texture<TextureSource<any>>)
		track2Bg.width = 3042
		track2Bg.height = 322
		track2Bg.x = 0
		track2Bg.y = 0
		track2Bg.zIndex = 4
		track2Bg.alpha = 1
		trackContainer.value.addChild(track2Bg)

		// const track3 = getSprite(track3Texture as Texture<TextureSource<any>>);

		// 创建容器存放赛道
		const t3 = new Container()
		const track3Sprite1 = new Sprite(track3Texture1 as Texture<TextureSource<any>>)
		const track3Sprite3 = new Sprite(track3Texture3 as Texture<TextureSource<any>>)
		track3Sprite1.width = 750
		track3Sprite3.width = 795
		track3Sprite1.height = track3Sprite3.height = 322
		track3Sprite1.x = 0
		track3Sprite3.x = 1606
		track3Sprite1.y = track3Sprite3.y = 0

		const track3Sprite2 = new TilingSprite(track3Texture2 as Texture<TextureSource<any>>)
		track3Sprite2.width = 856
		track3Sprite2.height = 322
		track3Sprite2.x = 750
		track3Sprite2.y = 0

		t3.addChild(track3Sprite1, track3Sprite2, track3Sprite3)
		// // 将整个赛道容器添加到游戏中
		trackSprite.value = t3

		trackContainer.value.addChild(trackSprite.value)

		// 创建遮罩
		let mask = new Graphics().rect(0, 0, mainInfo.w, track2Bg.height).fill(0xffffff)
		trackContainer.value.mask = mask
		trackContainer.value.addChild(mask)

		// 使用共享Ticker实例而不是创建新的
		const duration1 = 500 // trackContainer 动画持续时间 500ms
		const delay2 = 550 // track2Bg 动画延迟 400ms
		const duration2 = 1300 // track2Bg 动画持续时间 1500ms
		let elapsedTime = 0
		let startTime = performance.now()

		const animationTicker = (delta: Ticker) => {
			const currentTime = performance.now()
			elapsedTime = currentTime - startTime

			// 控制 trackContainer 的 x 动画
			if (elapsedTime <= duration1) {
				const progress1 = elapsedTime / duration1
				trackContainer.value!.x = -mainInfo.w * (1 - progress1)
			} else {
				trackContainer.value!.x = 0
			}

			// 控制 track2Bg 的 x 动画（在延迟后开始）
			if (elapsedTime > delay2) {
				const progress2 = Math.min((elapsedTime - delay2) / duration2, 1)
				track2Bg.x = (-track2Bg.width + mainInfo.w) * progress2
			}

			// 如果两阶段动画都完成，停止 Ticker
			if (elapsedTime >= delay2 + duration2) {
				sharedTicker.remove(animationTicker)
				track1ToTrack2(track2Bg, trackSprite.value as Container,
					trackContainer.value as Container<ContainerChild>)
			}
		}

		sharedTicker.add(animationTicker)

		// 使用setTimeout移除背景
		setTimeout(() => {
			gameElements.bg?.removeChildren()
		}, 1000)
	}

	const setTrackBg3 = () => {

		let issue1Text = gameElements.head?.getChildByLabel('issue1Text') as Text
		if (issue1Text) {
			gameElements.head?.removeChild(issue1Text)
		}

		const t3 = new Container()
		gameElements.bg?.addChild(t3)

		t3.sortableChildren = true
		// 获取原始纹理尺寸 - 应该是6000宽
		const wait_bgTexture = new Sprite(Assets.get('wait_bg'))
		wait_bgTexture.width = 750
		wait_bgTexture.height = 322
		wait_bgTexture.x = 0
		wait_bgTexture.y = 0
		wait_bgTexture.zIndex = 2
		t3.addChild(wait_bgTexture)

		const wait:TextOptions = {
			text: t("moto10"),
			style: { fontFamily: 'Arial', fontSize: 28, fill: '#FD565C' }
		}
		const waitText = new Text(wait)
		waitText.anchor.set(0.5)
		waitText.x = mainInfo.w / 2
		waitText.y = mainInfo.h / 2
		waitText.zIndex = 3
		t3.addChild(waitText)

		const headWait: TextOptions = {
			text: t("moto10"),
			style: { fontFamily: 'Arial', fontSize: 32, fill: '#FD565C' }
		};
		const headWaitText = new Text(headWait);
		headWaitText.anchor.set(0.5);
		headWaitText.x = mainInfo.w / 2;
		headWaitText.y = 44;
		headWaitText._zIndex = 2;
		headWaitText.label = 'wait';

		gameElements.head?.addChild(headWaitText)
	}

	// 切换到赛道场景2
	const track1ToTrack2 = async (track1: Sprite, track2: Container, trackContainer: Container<ContainerChild>) => {
		const duration = 800 // 动画持续时间
		let elapsedTime = 0

		// 使用共享Ticker而不是创建新的
		const animationTicker = () => {
			elapsedTime += sharedTicker.deltaMS / 800

			// 计算动画进度 (0-1范围)
			const progress = Math.min(elapsedTime / (duration / 800), 1)

			// 设置透明度
			track1.alpha = 1 - progress
			track2.alpha = progress

			// 动画结束逻辑
			if (progress >= 1) {
				sharedTicker.remove(animationTicker)
				trackContainer.removeChild(track1)
			}
		}

		sharedTicker.add(animationTicker)
	}

	// h红绿灯
	const setLight = () => {
		const light = new GifSprite(Assets.get('light'))
		light.alpha = 1
		light.width = mainInfo!.w * 0.1813
		light.height = mainInfo.h * 0.175
		light.anchor.set(0.5)
		light.x = mainInfo.w / 2
		light.y = mainInfo.y + mainInfo.h / 2
		light.zIndex = 5
		light.loop = false
		light.stop()
		bgContainer.value?.addChild(light)
		light.onComplete = () => {
			bgContainer.value?.removeChild(light)
		}
		// 创建透明度从1到0的动画，在300ms内完成
		const fadeOut = () => {
			let alphaValue = 1
			const fadeOutInterval = setInterval(() => {
				alphaValue -= 0.1
				light.alpha = alphaValue
				// 当透明度达到或低于0时
				if (alphaValue <= 0) {
					light.alpha = 0 // 确保最终值正好是0
					clearInterval(fadeOutInterval)
					// 停止GIF播放
					light.stop()
				}
			}, 30) // 每30毫秒更新一次，约300ms完成淡出
		}

		light.play()
		playEffectSound('lightSound')

		setTimeout(fadeOut, 2700)
	}

	// 赛道添加车辆和车辆运动动画
	const trackAddCar = () => {
		setLight()

		// 获取排名容器
		if (!bgContainer.value) return
		const carNumberContainer = bgContainer.value.getChildByName('carNumberContainer') as Container<ContainerChild>
		if (!carNumberContainer) return

		// 获取数字精灵 - 使用缓存减少DOM查询
		const numberSprites: { sprite: Sprite; x: number; label: string }[] = []
		for (let i = 1; i <= 10; i++) {
			const number = carNumberContainer.getChildByName('number' + i) as Sprite
			if (number) {
				numberSprites.push({
					sprite: number,
					label: number.label,
					x: number.x
				})
			}
		}

		// 车辆信息数组 - 添加更多运动属性以增强真实感
		const cars: {
			sprite: Sprite
			speed: number
			index: number
			isFinished: boolean
			speedFactor: number
			targetFinishTime: number
			carIndex: number
			lastPosition: number // 记录上一帧位置用于平滑
			speedVariation: number[] // 速度变化点
			variationMagnitude: number[] // 速度变化幅度
		}[] = []

		// 初始化所有车辆
		for (let i = 0; i < 10; i++) {
			// 使用对象池或缓存纹理以提升性能
			const carTexture = sheetList.value.carSheet.textures[`n_${i + 1}.png`]
			const car = new Sprite(carTexture)

			// 批量设置属性，减少布局重绘
			car.width = 50
			car.height = 35.4
			car.x = 42 + 5.2 * i // 起点位置
			car.visible = true // 确保车辆可见
			if (i === 0) {
				car.y = 34
			} else {
				car.y = cars[i - 1].sprite.y + 26 // 垂直排列
			}
			car.zIndex = 5 + i

			trackContainer.value?.addChild(car)

			// 为每辆车生成5-8个随机速度变化点
			const variationCount = 5 + Math.floor(Math.random() * 4)
			const speedVariation: number[] = []
			const variationMagnitude: number[] = []

			// 生成速度变化点和变化幅度
			for (let j = 0; j < variationCount; j++) {
				// 变化点分布在0.1-0.9之间，避免起点和终点附近
				speedVariation.push(0.03 + Math.random() * 0.8)
				// 变化幅度在-0.3到0.3之间
				variationMagnitude.push(Math.random() * 0.8 - 0.3)
			}

			// 按变化点位置排序，便于后续处理
			speedVariation.sort((a, b) => a - b)

			// 初始化车辆数据
			cars.push({
				sprite: car,
				speed: 0.18 + Math.random() * 0.1, // 基础速度
				index: i,
				isFinished: false,
				speedFactor: 1,
				targetFinishTime: 0,
				carIndex: i + 1,
				lastPosition: car.x, // 初始位置
				speedVariation,
				variationMagnitude
			})
		}

		// 更新排名数字位置
		let copyNumberSprites = [...numberSprites]
		const moveNumber = setInterval(() => {
			if(!pixApp.value) {
				clearInterval(moveNumber)
				return
			}
			// 检查是否所有车辆都已完成
			if (cars.findIndex((car) => !car.isFinished) === -1) {
				clearInterval(moveNumber)
			}

			// 按位置排序车辆a
			const sortedCars = [...cars].sort((a, b) => a.sprite.x - b.sprite.x)

			// 获取排序后的数字精灵
			let sortedNumbers: any[] = []
			sortedCars.forEach((car) => {
				const number = copyNumberSprites.find((item) => item.sprite.label === 'number' + car.carIndex)
				if (number) {
					sortedNumbers.push(number)
				}
			})

			// 执行数字交换动画
			swapNumbers(sortedNumbers)
		}, 400)

		// 数字交换动画
		const swapNumbers = (targetPositions: any[]) => {
			targetPositions.forEach((item, index) => {
				const startX = item.sprite.x
				const targetNumber = numberSprites.find((n) => n.sprite.label === item.sprite.label)
				const targetX = numberSprites[index].x
				const distance = targetX - startX

				// 如果位置相同，不需要动画
				if (Math.abs(distance) < 1) return

				// 动画参数
				const duration = 300
				let elapsedTime = 0
				const ticker = new Ticker()

				ticker.add(() => {
					if (!pixApp.value) {
						ticker.stop()
						ticker.destroy()
						return
					}
					elapsedTime += ticker.deltaMS
					const progress = Math.min(elapsedTime / duration, 1)

					// 更新位置
					targetNumber!.sprite.x = startX + progress * distance

					// 动画结束时清理
					if (progress >= 1) {
						ticker.stop()
						ticker.destroy()
					}

				})

				ticker.start()
			})
		}

		const setBottomNoTimer = setTimeout(() => {
			lotteryInfo.lastRank = lotteryInfo.rank.slice(0, 3)
			setBottomNo()
			clearTimeout(setBottomNoTimer)
		}, 15500)

		const setTrackRankTimer = setTimeout(() => {
			createParallelogram()
			clearTimeout(setTrackRankTimer)
		}, 14300)

		const runCar = setTimeout(() => {
			trackScroll()
			carMove(cars)
			clearTimeout(runCar)
		}, 3000)
	}

	const carMove = (cars: any[]) => {
		// 预先计算一次常用值w
		const bgWidth = 750
		const startTime = performance.now()
		const finishLineExtended = bgWidth - 126
		const trackStopTime = 10700
		const postTrackStopSpeedFactor = 1.4
		const carMoveTicker = new Ticker()

		const finishTimes: Record<number, number> = {}
		const carOrder = lotteryInfo.rank
		carOrder.forEach((carIndex, idx) => {
			if (idx === 0) {
				finishTimes[carIndex] = 11300 // 第一名10秒到达
			} else if (idx === 1) {
				finishTimes[carIndex] = 11800 // 第二名10.3秒到达
			} else if (idx === 2) {
				finishTimes[carIndex] = 12300 // 第三名10.8秒到达
			} else {
				// 从第四名开始,每名比前一名多0.2秒
				const prevTime = finishTimes[carOrder[idx - 1]]
				finishTimes[carIndex] = prevTime + 300
			}
		})

		for (let i = 0; i < cars.length; i++) {
			cars[i].targetFinishTime = finishTimes[cars[i].carIndex]
			// 初始化随机加速参数（保证均值为零）
			cars[i].variationAmp = 0.025 + Math.random() * 0.085 // 加减速幅度（0.01～0.05）
			cars[i].variationFreq = 0.8 + Math.random() * 0.8  // 频率（0.8～1.6）
			cars[i].variationPhase = Math.random() * Math.PI * 2 // 相位（0～2π）
		}

		const easeInOutQuad = (t: number): number => {
			return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
		}

		const predefinedRanking: number[] = lotteryInfo.rank

		const calculateSpeedFactor = (car: any, elapsedTime: number, isTrackStopped: boolean): number => {
			if (car.isFinished) return 0.5

			const expectedRank = predefinedRanking.indexOf(car.carIndex)
			let baseSpeedFactor = 1.0 - expectedRank * 0.01

			if (isTrackStopped) {
				const transitionTime = Math.min((elapsedTime - trackStopTime) / 1000, 1)
				return 1.0 + (postTrackStopSpeedFactor - 1.0) * easeInOutQuad(transitionTime)
			}

			// 仅在前13秒内应用随机加速逻辑 - 使用正弦波形式
			let variation = 0
			if (elapsedTime <= 10700) {
				// 计算随机变化效果（均值为零），使得车辆速度出现平滑的加速与减速
				variation = car.variationAmp * Math.sin((elapsedTime / 500) * car.variationFreq + car.variationPhase)
			}

			return Math.max(0.9, Math.min(1.2, baseSpeedFactor + variation))
		}

		const carUpdateCallback = () => {
			if (!pixApp.value) {
				carMoveTicker.stop()
				carMoveTicker.destroy()
				return
			}
			const currentTime = performance.now()
			const elapsedTime = currentTime - startTime
			const isTrackStopped = elapsedTime > trackStopTime

			cars.forEach((car) => {
				if (!car.isFinished) {
					const speedFactor = calculateSpeedFactor(car, elapsedTime, isTrackStopped)
					car.speedFactor = speedFactor

					const rawProgress = elapsedTime / car.targetFinishTime
					const adjustedProgress = rawProgress * speedFactor

					let targetPosition = adjustedProgress * finishLineExtended

					// 确保目标位置不小于当前位置，防止倒退
					targetPosition = Math.max(targetPosition, car.sprite.x)

					if (car.sprite.x >= finishLineExtended) {
						car.isFinished = true
						// car.finishSpeed = car.speedFactor * 1.2; // 降低额外加速幅度
					}

					const smoothFactor = isTrackStopped ? 0.06 : 0.05
					car.sprite.x += (targetPosition - car.sprite.x) * smoothFactor
				} else {
					// 到达终点后继续以稳定速度向前移动
					car.sprite.x += (850 - car.sprite.x) * 0.032
				}

				if (car.sprite.x > bgWidth + car.sprite.width && car.sprite.visible) {
					car.sprite.visible = false
				}
			})
			// 检查是否所有车辆都已完成
			const allFinished = cars.every((car) => car.isFinished && car.sprite.x > bgWidth + car.sprite.width)
			if (allFinished) {
				carMoveTicker.stop()
				carMoveTicker.destroy()
			}

		}

		carMoveTicker.add(carUpdateCallback)
		carMoveTicker.start()

		return {
			stop: () => {
				carMoveTicker.stop()
				carMoveTicker.destroy()
			}
		}
	}

	const createGradientParallelogram = (
		x: number,
		y: number,
		skewFactor: number,
		colors: number[] = [0xF5EEC6, 0xCD941F],
		alpha: number = 1
	): Container => {
		const w = 90;
		const h = 25.6;

		// 创建容器
		const parallelogramContainer = new Container();
		parallelogramContainer.x = x;
		parallelogramContainer.y = y;

		// 创建用于渐变的画布
		const canvas = document.createElement('canvas');
		canvas.width = w + Math.abs(skewFactor);
		canvas.height = h;
		const ctx = canvas.getContext('2d')!;

		// 清除画布
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// 创建线性渐变
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

		// 添加渐变色停止点
		const color1 = '#' + colors[0].toString(16).padStart(6, '0');
		const color2 = '#' + colors[1].toString(16).padStart(6, '0');
		gradient.addColorStop(0, color1);
		gradient.addColorStop(1, color2);

		// 设置填充样式
		ctx.fillStyle = gradient;

		// 绘制平行四边形路径
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(w, 0);
		ctx.lineTo(w + skewFactor, h);
		ctx.lineTo(skewFactor, h);
		ctx.closePath();

		// 填充路径
		ctx.fill();

		// 从画布创建纹理
		const texture = Texture.from(canvas);

		// 创建精灵并添加到容器
		const sprite = new Sprite(texture);
		sprite.alpha = alpha;
		parallelogramContainer.addChild(sprite);

		return parallelogramContainer;
	}

	// 增加平行四边形标识
	const createParallelogram = () => {
		if (!bgContainer.value) return;

		const rankList = lotteryInfo.rank.slice(0, 3);
		const fillColors = [
			[0xF5EEC6, 0xCD941F], // 金色
			[0xF4F6F7, 0x549DB7], // 银色
			[0xF9D8C6, 0xE16B41]  // 铜色
		];

		// 为前三名创建平行四边形标识
		rankList.forEach((carNumber, index) => {
			// 设置平行四边形参数
			const x = 490 + (carNumber - 1) * 6;
			const y = 55 + (carNumber - 1) * 26;
			const skewFactor = 6; // 倾斜因子

			// 创建渐变平行四边形
			const parallelogram = createGradientParallelogram(
				x, y, skewFactor,
				fillColors[index],
				0.9
			);
			parallelogram.zIndex = 9;
			trackContainer.value!.addChild(parallelogram);

			// 添加车号文本
			const carText = new Text({
				text: `${index + 1}`,
				style: {
					fontFamily: 'Arial',
					fontSize: 24,
					fill: 0xFFFFFF
				}
			});

			// 设置文本位置
			carText.anchor.set(0.5);
			carText.x = 24;
			carText.y = 13;
			// 旋转90度
			carText.rotation = Math.PI / 2;
			carText.zIndex = 10
			parallelogram.addChild(carText);
		});
	}

	// 赛道滚动逻辑 - 确保起始段完全滚出后再开始循环段滚动
	const trackScroll = async () => {
		if (!trackSprite.value) return;

		// 提取各部分赛道
		const leftSection = trackSprite.value.children[0] as Sprite;       // 起始段 (750px)
		const tilingTrack = trackSprite.value.children[1] as TilingSprite; // 循环段 (856px)
		const rightSection = trackSprite.value.children[2] as Sprite;      // 尾段 (795px)

		// 基本参数
		const startTime = performance.now();
		const totalDistance = 9000;               // 总赛道长度 (px)
		const trackDuration = 11000;              // 总滚动持续时间 (ms)
		const pixelsPerMs = totalDistance / trackDuration;  // 每毫秒移动像素 (≈0.677)

		const screenWidth = mainInfo.w;           // 屏幕宽度 (750px)
		const leftSectionWidth = leftSection.width;  // 起始段长度 (750px)
		const rightSectionWidth = rightSection.width; // 尾段长度 (795px)

		// 计算中段应该循环的总长度 - 关键修复点
		const middleSectionTotalLength = totalDistance - leftSectionWidth - rightSectionWidth;

		// 初始化平铺纹理位置
		tilingTrack.tilePosition.x = 0;

		// 平滑滚动所需的变量
		let lastTimestamp = startTime;
		let animationFrameId: number;

		// 动画函数
		const animate = (timestamp: number) => {
			if (!pixApp.value) {
				cancelAnimationFrame(animationFrameId);
				return;
			}
			const currentTime = timestamp;
			const elapsedTime = currentTime - startTime;
			lastTimestamp = currentTime;

			if (elapsedTime < trackDuration) {
				// 计算已滚动的总距离
				const totalMoveDistance = elapsedTime * pixelsPerMs;

				// 三阶段滚动逻辑
				if (totalMoveDistance < leftSectionWidth) {
					// 第一阶段：只移动整体容器，起始段滚动
					trackSprite.value!.x = -totalMoveDistance;

					// 重要：确保循环段的纹理保持初始位置
					tilingTrack.tilePosition.x = 0;
				} else if (totalMoveDistance < leftSectionWidth + middleSectionTotalLength) {
					// 第二阶段：起始段固定，循环段滚动
					// 起始段已完全移出视野，固定位置
					trackSprite.value!.x = -leftSectionWidth;

					// 计算从起始段完全移出后经过的距离
					const middleScrollDistance = totalMoveDistance - leftSectionWidth;

					// 更新循环段的纹理偏移 (这会产生无限循环的效果)
					tilingTrack.tilePosition.x = -(middleScrollDistance % tilingTrack.width);

				} else {
					// 第三阶段：尾段进入视野

					// 计算尾段应显示的位置
					const rightSectionOffset = totalMoveDistance - (leftSectionWidth + middleSectionTotalLength);

					// 确保循环段的纹理位置与尾段衔接
					// 这是关键：当中段到达尾段时，纹理偏移应该刚好为循环的整数倍
					const remainderOffset = middleSectionTotalLength % tilingTrack.width;

					tilingTrack.tilePosition.x = -(remainderOffset);

					// 设置整体容器位置，确保尾段平滑进入
					const rightSectionPosition = leftSectionWidth + tilingTrack.width - (screenWidth - rightSectionOffset);
					trackSprite.value!.x = -rightSectionPosition;
				}

				// 继续下一帧
				animationFrameId = requestAnimationFrame(animate);
			} else {
				// 动画完成，确保赛道到达最终位置
				const finalPosition = -(leftSectionWidth + tilingTrack.width - screenWidth + rightSectionWidth);
				trackSprite.value!.x = finalPosition;
				console.log('赛道滚动完成', performance.now() - startTime, 'ms');
			}
		};

		// 开始动画
		animationFrameId = requestAnimationFrame(animate);

		// 返回停止函数
		return {
			stop: () => {
				cancelAnimationFrame(animationFrameId);
				console.log('赛道滚动被手动停止');
			}
		};
	};

	// 添加领奖背景
	const addPodiumBg = async () => {
		if (isShowProgress.value) {
			lotteryInfo.lastRank = lotteryInfo.rank.slice(0, 3)
			setBottomNo()
			const issue2Text = bgContainer.value?.getChildByLabel('issue2Text') as Text
			if(issue2Text) {
				issue2Text.text = historyIssues.value[0].issueNumber
			}
		}
		if (!bgContainer.value) return
		// 创建领奖台背景
		let waitTip = gameElements.head?.getChildByName('wait')
		if (waitTip) {
			gameElements.head?.removeChild(waitTip)
		}
		let carNumberContainer = bgContainer.value.getChildByName('carNumberContainer') as Container<ContainerChild>
		if (!carNumberContainer) {
			carNumberBg(lotteryInfo.rank)
		}
		const podiumBg = new Sprite(Assets.get('podium_bg'))
		podiumBg.width = 750
		podiumBg.height = 322
		podiumBg.x = 0
		podiumBg.y = 88
		podiumBg.zIndex = 2

		// 清理旧元素并添加新元素
		bgContainer.value?.addChild(podiumBg)
		if (trackContainer.value) bgContainer.value?.removeChild(trackContainer.value)
		trackSprite.value = undefined

		// 创建领奖台容器
		const podiumContainer = new Container() // 使用对象池获取容器
		podiumContainer.x = 0
		podiumContainer.y = mainInfo.y
		podiumContainer.width = 750
		podiumContainer.height = 396
		podiumContainer.sortableChildren = true
		podiumContainer.zIndex = 3
		bgContainer.value?.addChild(podiumContainer)

		// 创建遮罩
		const mask = new Graphics().rect(0, 0, 750, 396).fill(0xffffff)
		podiumContainer.mask = mask
		podiumContainer.addChild(mask)

		const rank = lotteryInfo.rank
		// rank的第一位和第二位交换一下位置
		const newRank = [...rank]
		const temp = newRank[0]
		newRank[0] = newRank[1]
		newRank[1] = temp

		// 预先计算共用值以提高性能
		const bgWidth = 750
		const bgHeight = 322

		// 添加车辆模型
		for (let i = 0; i < newRank.length; i++) {
			const moto = new Sprite(sheetList.value.motoRSheet.textures[`motoR_${newRank[i]}.png`]) // 使用对象池

			// 根据位置设置不同大小
			if (i === 1) {
				moto.width = 210
				moto.height = 148
			} else {
				moto.width = 180
				moto.height = 127
			}

			moto.x = bgWidth + moto.width * (i + 1)
			moto.y = bgHeight - moto.height - 6
			moto.zIndex = 5
			podiumContainer.addChild(moto)
			motoRmove(moto, i)
		}

		await podiumMan(podiumContainer, rank)

		// 延迟添加123号码
		setTimeout(() => {
			add123No(podiumContainer)
		}, 1000)
	}
	// 添加领奖台人物和数字
	const add123No = (container: Container) => {
		// 预先获取纹理，避免重复加载
		const no1Texture = Assets.get('no_1')
		const no2Texture = Assets.get('no_2')
		const no3Texture = Assets.get('no_3')

		// 创建精灵并设置共同属性
		const no1 = new Sprite(no1Texture)
		const no2 = new Sprite(no2Texture)
		const no3 = new Sprite(no3Texture)

		// 设置z索引
		const zIndex = 6
		no1.zIndex = no2.zIndex = no3.zIndex = zIndex

		no1.width = 60.84
		no1.height = 44
		no2.width = no3.width = 56.65
		no2.height = no3.height = 36

		// 设置初始位置
		no1.y = no2.y = no3.y = -no1.height
		no1.x = 340 + no1.width / 2
		no2.x = 116 + no2.width / 2
		no3.x = 576.98 + no3.width / 2

		// 设置锚点和透明度
		no1.anchor.set(0.5)
		no2.anchor.set(0.5)
		no3.anchor.set(0.5)
		no1.alpha = no2.alpha = no3.alpha = 0.2

		// 添加到容器
		container.addChild(no1, no2, no3)

		// 按顺序排列
		const noArr = [no2, no1, no3]

		// 目标Y位置计算一次，避免重复计算
		const targetY = [160, 162, 160]

		// 为每个数字创建动画
		for (let i = 0; i < 3; i++) {
			animateNumber(noArr[i], i, targetY[i])
		}

		// 数字下落动画函数
		function animateNumber(no: Sprite, index: number, targetY: number) {
			const ticker = new Ticker()
			const duration = 300 // 动画持续时间
			let elapsed = 0

			// 设置初始状态
			no.alpha = 0
			const startY = -no.height
			no.y = startY

			ticker.add(() => {
				if (!pixApp.value) {
					ticker.stop()
					ticker.destroy()
					return
				}
				elapsed += ticker.deltaMS
				const progress = Math.min(elapsed / duration, 1)

				// 更新位置和透明度
				no.y = startY + (targetY - startY) * progress
				no.alpha = progress

				if (progress >= 1) {
					no.y = targetY
					no.alpha = 1
					ticker.stop()
					ticker.destroy()

					// 根据索引确定下一个动画
					if (index === 0) {
						moveToBottom(noArr[1], 1)
					} else if (index === 1) {
						moveToBottom(noArr[0], 2)
					} else {
						moveToBottom(noArr[2], 3)
					}
				}

			})

			ticker.start()
		}
	}

	const moveToBottom = (no: Sprite, i: number) => {
		const addNoContainer = bgContainer.value?.getChildByName('addNoContainer') as Container<ContainerChild>
		if (!addNoContainer) return

		const targetSprite = addNoContainer.getChildByName('st' + i) as Text
		if (!targetSprite) return

		// 获取目标的全局位置
		const targetGlobalPosition = addNoContainer.toGlobal(new Point(targetSprite.x, targetSprite.y))

		// 将全局位置转换为数字精灵父容器的局部坐标系
		const targetLocalPosition = no.parent.toLocal(targetGlobalPosition)

		const startX = no.x
		const startY = no.y
		const duration = 600
		let elapsed = 0

		const moveAnimation = () => {
			elapsed += 16 // 假设每帧约16ms
			const progress = Math.min(elapsed / duration, 1)

			// 使用二次缓动使动画更平滑
			const easedProgress = Math.pow(progress, 2)

			// 线性插值计算位置
			no.x = startX + (targetLocalPosition.x - startX) * easedProgress
			no.y = startY + (targetLocalPosition.y - startY) * easedProgress

			if (progress >= 1) {
				no.x = targetLocalPosition.x
				no.y = targetLocalPosition.y
				scaleTicker()
				return false // 停止动画
			}
			return true // 继续动画
		}

		// 延迟启动动画
		setTimeout(() => {
			animate(moveAnimation)
		}, 300 * (i - 1))

		// 缩小动画
		const scaleTicker = () => {
			const duration2 = 500
			let elapsed2 = 0
			no.scale.set(0.4)

			const scaleAnimation = () => {
				elapsed2 += 16 // 假设每帧约16ms
				const progress2 = Math.min(elapsed2 / duration2, 1)
				const easedProgress = 1 - Math.pow(1 - progress2, 3) // 三次缓出
				no.scale.set(0.4 * (1 - easedProgress))

				if (progress2 >= 1) {
					no.scale.set(0)
					no.alpha = 0
					if (no.parent) {
						// 检查 no.parent 是否存在
						no.parent.removeChild(no)
					}
					numLight(i)
					return false // 停止动画
				}
				return true // 继续动画
			}

			animate(scaleAnimation)
		}
	}
	// 数字光扫效果
	const numLight = (i: number) => {
		const addNoContainer = bgContainer.value?.getChildByName('addNoContainer') as Container<ContainerChild>
		if (!addNoContainer) return

		const light = addNoContainer.getChildByName('no' + i) as Sprite
		if (!light) return

		// 使用light的尺寸作为效果区域
		const width = light.width
		const height = light.height

		// 创建效果容器
		const effectContainer = new Container()
		effectContainer.x = light.x
		effectContainer.y = light.y
		effectContainer.zIndex = 4
		addNoContainer.addChild(effectContainer)

		// 创建渐变纹理并应用
		const gradientTexture = createGradientTexture(width, height)
		const lightEffect = new Graphics().rect(0, 0, width, height).fill({
			texture: gradientTexture,
			alpha: 0.7
		})

		// 设置混合模式
		lightEffect.blendMode = 'overlay'
		effectContainer.addChild(lightEffect)

		// 创建遮罩
		const mask = new Graphics().rect(0, 0, width, height).fill(0xffffff)
		effectContainer.addChild(mask)
		lightEffect.mask = mask

		// 动画参数
		const ticker = new Ticker()
		const duration = 1000
		let elapsed = 0
		const startX = -width
		const startY = -height
		const endX = width
		const endY = height

		lightEffect.x = startX
		lightEffect.y = startY

		ticker.add(() => {
			if (!pixApp.value) {
				ticker.stop()
				ticker.destroy()
				return
			}
			elapsed += ticker.deltaMS
			const progress = Math.min(elapsed / duration, 1)

			// 沿对角线移动光效
			lightEffect.x = startX + progress * (endX - startX)
			lightEffect.y = startY + progress * (endY - startY)

			// 控制透明度
			lightEffect.alpha = progress < 0.5 || progress > 0.7 ? 0.5 : 0.7

			if (progress >= 1) {
				ticker.stop()
				ticker.destroy()
				addNoContainer.removeChild(effectContainer)
			}

		})

		ticker.start()
	}

	// 创建渐变纹理
	function createGradientTexture(width: number, height: number) {
		const canvas = document.createElement('canvas')
		canvas.width = width
		canvas.height = height
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

		// 创建对角线渐变
		const gradient = ctx.createLinearGradient(0, 0, width, height)
		gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
		gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0)')
		gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)')
		gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0)')
		gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, width, height)

		return Texture.from(canvas)
	}

	// 显示彩带效果
	const showConfetti = (container: Container) => {
		const ticker = new Ticker()
		const confettiCount = 40
		let particlesList: Graphics[] = []
		const colors = [0xff4d4f, 0x36cfc9, 0x40a9ff, 0xfadb14, 0x73d13d]
		// const { width, height } = gameElements.bg!;
		const width = mainInfo.w
		const height = mainInfo.h

		// 批量创建彩带粒子
		for (let i = 0; i < confettiCount; i++) {
			const color = colors[Math.floor(Math.random() * colors.length)]
			const particle = new Graphics().rect(0, 0, Math.random() * 5 + 2, Math.random() * 6 + 5).fill(color)

			// 设置初始位置和参数
			particle.x = Math.random() * width
			particle.y = Math.random() * -height
			particle.rotation = Math.random() * Math.PI * 3
			particle.zIndex = 10

			container.addChild(particle)
			particlesList.push(particle)
		}

		container.sortableChildren = true

		ticker.add(() => {
			if (!pixApp.value) {
				ticker.stop()
				ticker.destroy()
				return
			}
			for (let i = 0; i < particlesList.length; i++) {
				const particle = particlesList[i]
				particle.y += Math.random() * 10 + 3
				particle.x += Math.sin(particle.y / 30) * (Math.random() * 6 - 3)
				particle.rotation += 0.2

				// 重置超出范围的彩带
				if (particle.y > height) {
					particle.y = Math.random() * -30
					particle.x = Math.random() * width
				}
			}

		})

		ticker.start()

		// 定时清理
		setTimeout(() => {
			if (!pixApp.value) {
				particlesList = [] // 清空数组
				return
			}
			ticker.stop()
			ticker.destroy()

			// 批量移除彩带
			for (let i = 0; i < particlesList.length; i++) {
				container.removeChild(particlesList[i])
			}
			particlesList.length = 0 // 清空数组
		}, 4000)
	}

	// 创建领奖台和人物
	const podiumMan = async (container: Container<ContainerChild>, rank: number[]) => {
		// 预先获取纹理
		const podiumTexture = await Assets.get('podium')
		const podium = new Sprite(podiumTexture)

		// 计算尺寸
		const bgWidth = mainInfo.w
		const bgHeight = mainInfo.h
		podium.width = 327
		podium.height = 174

		// 创建容器
		const podiumBox = new Container()
		podiumBox.x = bgWidth / 2
		podiumBox.y = bgHeight - bgHeight * 0.428 - podium.height / 2
		podiumBox.sortableChildren = true
		container.addChild(podiumBox)

		// 设置领奖台
		podium.x = 0
		podium.y = 0
		podium.anchor.set(0.5)
		podium.zIndex = 3
		podiumBox.addChild(podium)

		// 创建人物精灵
		const man1 = new Sprite(sheetList.value.manSheet.textures[`g_${rank[0]}.png`])
		const man2 = new Sprite(sheetList.value.manSheet.textures[`j_${rank[1]}.png`])
		const man3 = new Sprite(sheetList.value.manSheet.textures[`y_${rank[2]}.png`])

		// 设置锚点
		man1.anchor.set(0.5)

		// 设置尺寸
		man1.width = 74.14
		man2.width = 54.2
		man3.width = 47.66
		man1.height = 122.36
		man2.height = 108.68
		man3.height = 112.43

		// 设置z索引
		man1.zIndex = 5
		man2.zIndex = 6
		man3.zIndex = 7

		// 设置位置
		man1.x = man1.width / 6.5
		man1.y = -podium.height / 7
		man2.x = -man1.width + man2.width / 6.8
		man2.y = -podium.height / 3.2
		man3.x = man1.width / 6.5 + man3.width / 6.8
		man3.y = -podium.height / 3.8

		// 添加到容器
		podiumBox.addChild(man1, man2, man3)

		// 显示彩带效果
		showConfetti(container)
	}

	// 领奖车辆进入动画
	const motoRmove = (sprite: Sprite, index: number) => {
		const margL = [0.066, 0.36, 0.693]
		const ticker = new Ticker()
		let elapsedTime = 0
		const duration = 400 * (index + 1)
		const targetX = margL[index] * mainInfo.w
		const startX = sprite.x
		const distance = targetX - startX

		// 添加模糊效果
		const blurFilter = new BlurFilter()
		blurFilter.strength = 6
		sprite.filters = [blurFilter]

		ticker.add(() => {
			if (!pixApp.value) {
				ticker.stop()
				ticker.destroy()
				return
			}
			elapsedTime += ticker.deltaMS
			const progress = Math.min(elapsedTime / duration, 1)

			// 更新位置
			sprite.x = startX + progress * distance

			// 动态减少模糊强度
			blurFilter.strength = 6 * (1 - progress)

			if (progress >= 1) {
				// 移除模糊滤镜
				sprite.filters = []
				ticker.stop()
				ticker.destroy()
			}

		})

		ticker.start()
	}

	/**
	 * rankListTicker
	 * @param rankBg 要移动的精灵
	 * @param startY 起始 y 坐标（应为负值，表示在上方不可见区域）
	 * @param duration 动画持续时间（毫秒）
	 */
	const rankListTicker = (rankBg: Sprite, startY: number, duration: number) => {
		const ticker = new Ticker()
		let elapsedTime = 0
		// 目标位置 y 为 0，即进入容器可见区域
		const targetY = 0
		// 距离为从 startY 到 targetY 的差值
		const distance = targetY - startY

		ticker.add(() => {
			if (!pixApp.value) {
				ticker.stop()
				ticker.destroy()
				return
			}
			// 累加每一帧经过的时间（单位：毫秒）
			elapsedTime += ticker.deltaMS
			// 计算动画进度（0 ~ 1）
			const progress = Math.min(elapsedTime / duration, 1)
			// 更新精灵的 y 坐标：线性插值
			rankBg.y = startY + progress * distance

			// 当动画完成后，停止并销毁 ticker
			if (progress >= 1) {
				ticker.stop()
				ticker.destroy()
			}

		})

		ticker.start()
	}

	watch(
		() => currentShowCar.value,
		() => {
			showCarInfo()
			addCarInfo()
		}
	)

	// 实现轮胎旋转动画
	const tireTicker = (tireSprite1: Sprite, tireSprite2: Sprite) => {
		const tireDuration = 0.25 // 旋转一周的时间
		const tireTicker = new Ticker()
		tireTicker.add((delta) => {
			tireSprite1.rotation += tireDuration * Math.PI * 2
			tireSprite2.rotation += tireDuration * Math.PI * 2
		})
		tireTicker.start()
	}

	const loadImg = async (imgName: string) => {
		return new URL(`../assets/images/${imgName}.png`, import.meta.url).href
	}

	// 生成随机数组
	const generateRandomArray = (): number[] => {
		// 生成1-10的数组
		const numbers = Array.from({ length: 10 }, (_, i) => i + 1)

		// 打乱前10位
		const first10 = numbers.sort(() => Math.random() - 0.5)

		// 获取第10位数字
		const lastNumber = first10[9]

		// 生成后4位的候选数字（排除第10位数字）
		const remainingNumbers = numbers
			.filter((n) => n !== lastNumber)
			.sort(() => Math.random() - 0.5)
			.slice(0, 5)

		return [...first10, ...remainingNumbers]
	}

	const animate = (callback: () => boolean) => {
		let tickerCallback: () => void;
		if (visibilityStatus.value) {
			tickerCallback = () => {
				if (!pixApp.value) return
				if (callback()) {
					requestAnimationFrame(tickerCallback);
				}
			};
			requestAnimationFrame(tickerCallback);
		} else {
			const interval = setInterval(() => {
				if (!pixApp.value) return
				if (!callback()) {
					clearInterval(interval);
				}
			}, 16); // 大约每秒60帧
			return () => clearInterval(interval);
		}
		return () => {
			if (tickerCallback) {
				Ticker.shared.remove(tickerCallback);
			}
		};
	};

	// 清理所有容器和精灵但保留资源缓存
	const clearStage = () => {
		if (!pixApp.value) return

		// 递归清理容器中的所有子元素
		const clearContainer = (container: Container) => {
			if (!container) return

			for (let i = container.children.length - 1; i >= 0; i--) {
				const child = container.children[i]

				// 如果是容器，递归清理
				if (child instanceof Container) {
					clearContainer(child as Container)
				}

				// 移除所有事件监听器
				child.removeAllListeners()

				// 解除引用，但不销毁纹理
				if (child instanceof Sprite) {
					// 用空纹理替换精灵的纹理引用，但不销毁原纹理
					child.texture = Texture.EMPTY
				}

				// 从父容器中移除
				container.removeChild(child)
			}
		}

		// 清理主舞台
		clearContainer(pixApp.value.stage)

		// 重置游戏元素引用
		bgContainer.value = undefined
		gameElements.bg = null
		gameElements.head = null
		gameElements.bottom = null
		rankSprites.value = []

		// 记录清理完成
		console.log('场景已清理，但资源缓存已保留')
	}

	// 组件卸载时销毁 PixiJS 实例，释放资源
	onUnmounted(() => {
		if (pixApp.value) {
			pixApp.value.destroy(true, {
				children: true,
				texture: true
			})
		}
		pixApp.value = null
		if (switchInterval.value) clearInterval(switchInterval.value)
	})

	return {
		containerInit,
		gameContainer,
		loadAssets
	}
}
