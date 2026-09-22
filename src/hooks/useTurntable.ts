import { computed, reactive, ref, shallowRef } from "vue";
import { Application, Assets, Container, ContainerChild, Sprite, Text, Texture } from "pixi.js";
import {
    FirstInvitedWheelData,
    getUserInvitedWheelWithdrawList,
    GetPageListInvitedWheelWithdrawRecordRsp,
    getInvitedWheelInfo,
    spinInvitedWheel,
    UserInvitedWheelInfoRsp
} from "@/api";
import { GifSprite } from "pixi.js/gif";
import MoneyJson from '@/views/turntable/assets/json/money.json?url';
import { AwaitApiResult } from "@/utils";
import { GlobalStore, SettingStore } from "@/stores";
import { requireLoginAction } from "@/hooks/useLoginIntercept";
import { useActive } from "@/components/common/use";

type UseTurntableState = {
    turntableInfo: UserInvitedWheelInfoRsp | undefined
}

const turntableState = reactive<UseTurntableState>({
    turntableInfo: undefined,
})
const textureCacheTurntable = new Map<string, Texture>() // 缓存常用纹理
const bgContainer = shallowRef<Container<ContainerChild> | undefined>()
const turntableApps = shallowRef<Application | null>(null);
const isEveryDayGift = ref(false) // 是否每日礼包
const countDownTimer = ref<NodeJS.Timeout | null>(null)
const countDownTime = ref('00:00:00')
const loading = ref(true) // 加载状态
const amountNoDialog = ref(false)


export const useTurntables = () => {
    const turntableCanvas = ref<HTMLDivElement | null>(null)
    const moneyIndexList = [0, 1, 4, 3, 2, 7, 6, 5] // 中奖金额顺序
    const moneySheet = ref<any>(null) // 精灵图
    // 新增转盘精灵引用
    const turntableBg = shallowRef<Container<ContainerChild> | null>(null);
    const firstReward = ref<number | undefined>(undefined)
    const firstInvitedWheelDatas = ref<FirstInvitedWheelData[]>([]) // 中奖数据
    const isOpenAward = ref(false) // 是否开奖
    const pageInfo = ref({
        page: 1,
        pageSize: 10,
        total: 0
    })
    const historyList = ref<GetPageListInvitedWheelWithdrawRecordRsp[]>([])
    const settingS = SettingStore() as any
    const { refreshRedDot } = useActive()
    const dollarSign = computed(() => settingS.getDollarSign)
    const isWin = ref(false) // 是否中奖
    const withdrawDialog = ref(false)
    const animateRef = ref<any>(null)
    const startRef = ref<any>()
    const cashOutDialog = ref(false)
    const ruleDialog = ref(false)
    const isAnimate = ref(false) // 是否正在转动
    const hasWithdrawMethodDialog = ref(false) // 没有提现方式弹窗
    
    // 添加动画ID管理
    const animationIds = ref<Set<number>>(new Set())

    const getTurntableInfo = async () => {
        const res = await AwaitApiResult(getInvitedWheelInfo({ ignoreAuthRedirect: !GlobalStore().token }))
        if (!res?.data) {
            turntableState.turntableInfo = undefined
            isEveryDayGift.value = false
            countDownTime.value = '00:00:00'
            if (loading.value) loading.value = false
            return
        }
        const { data, serviceNowTime } = res
        turntableState.turntableInfo = data
        isEveryDayGift.value = !!data.isFirstInvitedWheel
        const { noWinningRandomAmount } = data
        if (noWinningRandomAmount?.length && turntableState?.turntableInfo?.diskDisplayAmount) {
            let sort = turntableState.turntableInfo.diskDisplayAmount.sort((a, b) => b - a)
            
            let no1 = noWinningRandomAmount[0] >= 10000 ? (noWinningRandomAmount[0] / 1000) + 'K' : noWinningRandomAmount[0]
            let no2 = noWinningRandomAmount[1] >= 10000 ? (noWinningRandomAmount[1] / 1000) + 'K' : noWinningRandomAmount[1]
            // @ts-ignore
            sort.push(no1 + '-' + no2)
            turntableState.turntableInfo.diskDisplayAmount = sort
        }
        if (loading.value) loading.value = false
        if (data.expiredTime) startCountDown(serviceNowTime)
    }

    const withdrawNeedAmount = computed(() => turntableState.turntableInfo?.invitedWheelTotalPrizeAmount || 0)
    const userInvitedWheelAmount = computed(() => turntableState.turntableInfo?.userInvitedWheelAmount || 0)
    const recordList = computed(() => turntableState.turntableInfo?.lastWheelRecordList || [])
    const needAmount = computed(() => (withdrawNeedAmount.value - userInvitedWheelAmount.value) || 0)

    const awardIndex = computed(() => {
        if (!isWin.value) { // 如果没有找到，证明是中将范围金额
            return 5 // 默认转盘停在第六个位置
        }
        let index = turntableState.turntableInfo?.diskDisplayAmount?.findIndex((item) => item === firstReward.value)
        if (index !== -1) {
            return moneyIndexList.findIndex((item) => item === index) // 转盘停在第几个位置
        } else {
            return 5 // 默认转盘停在第六个位置
        }
    })

    const initTurntableCanvas = async () => {
        if (!turntableCanvas.value) return
        const canvas = document.getElementById('turntable_canvas');
        if (canvas) {
            turntableApps.value = new Application()
            await turntableApps.value.init({
                width: canvas.clientWidth,
                height: canvas.clientHeight,
                backgroundAlpha: 0, // 设置背景颜色为透明
                resolution: window.devicePixelRatio || 1.5, // 根据设备像素比设置分辨率
                autoDensity: true, // 调整canvas CSS样式以匹配分辨率
                antialias: true, // 使图像更加平滑
                preference: 'webgpu'
            });

            turntableCanvas.value.appendChild(turntableApps.value.canvas);

            setBg()
        } else {
            console.error('Canvas element not found');
        }
    }

    const loadImg = async (imgName: string) => {
        return new URL(`../views/turntable/assets/img/${imgName}.png`, import.meta.url).href
    }

    const loadAssets = async () => {
        Assets.reset() // 重置资源加载器

        try {
            const resources = [
                { alias: 'bg', src: 'turntable' },
                { alias: 'startBtn', src: 'start_btn' },
                { alias: 'select', src: 'select' },
                { alias: 'gold', src: 'gold' },
                { alias: 'money2', src: 'money2' },
                { alias: 'start', src: new URL('../views/turntable/assets/img/start.gif', import.meta.url).href },
                { alias: 'animate', src: new URL('../views/turntable/assets/img/animate.gif', import.meta.url).href }
            ]
    
            // 每次都重新加载资源，不使用缓存检查
            await Promise.all(resources.map(async (res) => {
                let src: string
                if (res.alias !== 'animate' && res.alias !== 'start') {
                    src = await loadImg(res.src)
                } else {
                    src = res.src
                }
                console.log(`Loading ${res.alias} from: ${src}`)
                
                // 如果资源已存在，先移除
                if (Assets.cache.has(res.alias)) {
                    Assets.cache.remove(res.alias)
                }
                
                // 重新加载资源
                const texture = await Assets.load({ alias: res.alias, src })
                console.log(`Loaded ${res.alias} successfully`)
            }))
    
            // 处理金币精灵图
            if (Assets.cache.has('money')) {
                Assets.cache.remove('money')
            }
            
            const texturePath = await loadImg('money')
            const texture = await Assets.load(texturePath)
            Assets.add({
                alias: 'money',
                src: MoneyJson,
                data: { texture }
            })
            
            moneySheet.value = await Assets.load('money')
            console.log('All assets loaded successfully')
    
        } catch (e) {
            console.error('Error loading assets:', e);
            throw e;
        }
    }

    const setBg = async () => {
        if (!turntableApps.value) return
        bgContainer.value = new Container()
        bgContainer.value.sortableChildren = true
        bgContainer.value.zIndex = 1
        const canvas = document.getElementsByClassName('turntable_all')[0] as HTMLDivElement;
        turntableApps.value.stage.scale.set(canvas?.clientWidth / 750)
        turntableApps.value.stage.addChild(bgContainer.value)

        turntableBg.value = new Container();
        turntableBg.value.sortableChildren = true
        // 设置转盘容器的位置为画布中心
        turntableBg.value.x = 330;
        turntableBg.value.y = 570;
        turntableBg.value.zIndex = 0
        const bgTexture = new Sprite(await Assets.get('bg'));

        bgTexture.anchor.set(0.5);
        bgTexture.width = 660;
        bgTexture.height = 660;

        turntableBg.value.addChild(bgTexture);

        const selectTexture = new Sprite(await Assets.get('select'));
        selectTexture.width = 278
        selectTexture.height = 340
        selectTexture.x = 330 - 139;
        selectTexture.y = 240;
        selectTexture.zIndex = 2

        bgContainer.value.addChild(turntableBg.value, selectTexture);

        await startBtn()
        await setMoney()
        goldAnimate()
        startAnimate()
    }

    const restBgcontainer = async () => {
        await getTurntableInfo()

        let oldAwardText = bgContainer.value?.getChildByName('awardText')
        if (oldAwardText) {
            bgContainer.value?.removeChild(oldAwardText)
        }
        // 重置按钮文本
        inputText()
    }

    const setMoney = async () => {
        if (!turntableBg.value || !moneySheet.value) return;

        const radius = 174; // 图片距离转盘中心的半径
        const sectorAngle = 360 / 8; // 每个扇面的角度
        const initialAngleOffset = -90; // 初始角度偏移量（-90 度）

        for (let i = 0; i < 8; i++) {
            // 创建精灵图
            const moneySprite = new Sprite(moneySheet.value.textures[`money${moneyIndexList[i] + 1}.png`]);
            moneySprite.anchor.set(0.5); // 设置锚点为中心
            moneySprite.width = 74; // 设置图片宽度
            moneySprite.height = 74; // 设置图片高度

            // 计算图片的角度和位置
            const angle = ((sectorAngle * i) + initialAngleOffset) * (Math.PI / 180); // 转换为弧度
            moneySprite.x = radius * Math.cos(angle); // 根据角度计算 x 坐标
            moneySprite.y = radius * Math.sin(angle); // 根据角度计算 y 坐标

            // 设置图片的旋转角度，使其与扇面一致
            moneySprite.rotation = angle + Math.PI / 2;

            // 添加图片到转盘容器
            turntableBg.value.addChild(moneySprite);
        }

        let arr = turntableState.turntableInfo?.diskDisplayAmount?.map((item: any) => {
            if (item >= 10000) {
                item = (item / 1000) + 'K'
            }
            return item
        })

        // 添加转盘每格金额
        for (let i = 0; i < 8; i++) {
            if (!turntableState.turntableInfo?.diskDisplayAmount?.length) return
            // @ts-ignore
            const moneyText = new Text({
                text: dollarSign.value + (arr ? arr[moneyIndexList[i]] || '0' : '0'),
                style: {
                    fontSize: 30,
                    fill: '#F15542',
                    align: 'center',
                    fontWeight: 600
                }
            })
            moneyText.anchor.set(0.5); // 设置锚点为中心
            const angle = ((sectorAngle * i) + initialAngleOffset) * (Math.PI / 180); // 转换为弧度
            const radius = 230; // 图片距离转盘中心的半径
            moneyText.x = radius * Math.cos(angle); // 根据角度计算 x 坐标
            moneyText.y = radius * Math.sin(angle); // 根据角度计算 y 坐标
            // 设置文字的旋转角度，使其与中心点平行
            moneyText.rotation = angle + Math.PI / 2;
            turntableBg.value.addChild(moneyText);
        }
    };

    const startBtn = async () => {
        const btnTexture = new Sprite(await Assets.get('startBtn'));
        btnTexture.width = 211
        btnTexture.height = 211;
        btnTexture.x = 330;
        btnTexture.y = 576;
        btnTexture.zIndex = 3
        btnTexture.anchor.set(0.5);
        bgContainer.value?.addChild(btnTexture);
        // 创建按钮文本
        inputText()
        // 添加点击事件监听器
        btnTexture.interactive = true; // 使按钮可交互
        btnTexture.on('pointerdown', handleClickTurntable);
    }

    /*
    * @description: 点击转盘按钮
    * */
    const handleClickTurntable = async () => {
        if (isAnimate.value) return
        if (!(await requireLoginAction())) return

        if (!turntableState.turntableInfo?.userInvitedWheelCount) {
            amountNoDialog.value = true
            return
        }
        if (needAmount.value === 0) {
            withdrawDialog.value = true
            return
        }
        isAnimate.value = true
        await getTurntableReward()

        console.log('Start button clicked!');
        // 随机选择一个目标扇面（0-7）
        const targetIndex = Math.floor(Math.random() * 8);
        await transformTurntable(awardIndex.value || targetIndex);

        const awardText = createAwardText()
        const [btnText, btnText2] = createBtnText()
        bgContainer.value?.removeChild(btnText, btnText2);
        bgContainer.value?.addChild(awardText);
        await setDoneAnimation()
        console.log(`转盘停止在扇面 ${awardIndex.value}`);
    }

    const createBtnText = () => {
        let oldBtnText = bgContainer.value?.getChildByLabel('centerBtn')
        let oldBtnText2 = bgContainer.value?.getChildByLabel('centerBtn2')
        if (oldBtnText && oldBtnText2) {
            bgContainer.value?.removeChild(oldBtnText, oldBtnText2)
        }
        // @ts-ignore
        const btnText = new Text({
            text: 'X' + (turntableState.turntableInfo?.userInvitedWheelCount || 0),
            style: {
                fontSize: 60,
                fill: '#F15542',
                align: 'center',
                fontWeight: 700
            }
        })
        // @ts-ignore
        const btnText2 = new Text({
            text: 'FREE SPIN',
            style: {
                fontSize: 16,
                fill: '#F15542',
                align: 'center',
                fontWeight: 700
            }
        })
        btnText.anchor.set(0.5); // 设置锚点为中心
        btnText.x = 330;
        btnText.y = 576 - 20;
        btnText.zIndex = 4
        btnText2.anchor.set(0.5); // 设置锚点为中心
        btnText2.x = 330;
        btnText2.y = 576 + 26;
        btnText2.zIndex = 4
        btnText.label = 'centerBtn'
        btnText2.label = 'centerBtn2'

        return [btnText, btnText2]
    }

    const createAwardText = () => {
        // @ts-ignore
        const awardText = new Text({
            text: dollarSign.value + (firstReward.value || 0),
            style: {
                fontSize: 32,
                fill: '#F15542',
                align: 'center',
                fontWeight: 700
            }
        })
        awardText.anchor.set(0.5);
        awardText.x = 330;
        awardText.y = 576;
        awardText.zIndex = 4;
        awardText.label = 'awardText'
        return awardText
    }

    const inputText = () => {
        const [btnText, btnText2] = createBtnText()
        bgContainer.value?.addChild(btnText, btnText2);
    }

    const setDoneAnimation = async () => {
        const goldContainer = new Container({
            width: 414,
            height: 414,
            x: 330,
            y: 576,
            zIndex: 5,
            sortableChildren: true
        });
    
        const goldTexture = new Sprite(await Assets.get('gold'));
        goldTexture.width = 414
        goldTexture.height = 414;
        goldTexture.anchor.set(0.5);
    
        const goldText = new Text({
            text: dollarSign.value + (firstReward.value || 0),
            style: {
                fontSize: 34,
                fill: '#F15542',
                align: 'center',
                fontWeight: 700
            }
        })
        goldText.anchor.set(0.5);
        goldText.x = 5;
        goldText.y = 5;
        goldText.zIndex = 6
        goldContainer.scale.set(0);
        goldContainer.addChild(goldText, goldTexture);
        bgContainer.value?.addChild(goldContainer);
    
        // 缩放动画,持续0.6s
        const duration = 0.6;
        const startTime = Date.now();
        let scaleAnimationId: number;
        
        const animate = () => {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTime) / 1000;
    
            if (elapsedTime >= duration) {
                goldContainer.scale.set(1);
                animateRef.value?.play()
                
                // 开始淡化动画
                startFadeAnimation();
                
                setTimeout(() => {
                    startRef.value?.play()
                }, 500)
                
                setTimeout(() => {
                    restBgcontainer()
                    isAnimate.value = false
                }, 1200)
                return;
            }
    
            const scale = elapsedTime / duration;
            goldContainer.scale.set(scale);
    
            // 保存动画ID
            scaleAnimationId = requestAnimationFrame(animate);
            animationIds.value.add(scaleAnimationId);
        };
    
        // 分离淡化动画
        const startFadeAnimation = () => {
            const fadeDuration = 1;
            const fadeStartTime = Date.now();
            let fadeAnimationId: number;
            
            const fadeAnimate = () => {
                const currentTime = Date.now();
                const elapsedTime = (currentTime - fadeStartTime) / 1000;
    
                if (elapsedTime >= fadeDuration) {
                    goldContainer.alpha = 0;
                    bgContainer.value?.removeChild(goldContainer);
                    // 清除这个动画ID
                    if (fadeAnimationId) {
                        animationIds.value.delete(fadeAnimationId);
                    }
                    return;
                }
    
                goldContainer.alpha = 1 - (elapsedTime / fadeDuration);
    
                // 保存动画ID
                fadeAnimationId = requestAnimationFrame(fadeAnimate);
                animationIds.value.add(fadeAnimationId);
            };
            
            fadeAnimate();
        };
    
        animate();
    }

    const goldAnimate = () => {
        const animate = new GifSprite(Assets.get('animate'))
        animate.width = 274
        animate.height = 643
        animate.x = 330 - 137;
        animate.y = 40;
        animate.zIndex = 7
        animate.loop = false
        animate.stop()
        animateRef.value = animate
        bgContainer.value?.addChild(animate)
    }

    const startAnimate = () => {
        const start = new GifSprite(Assets.get('start'))
        start.width = 600
        start.height = 140
        start.y = 10
        start.x = 30
        start.zIndex = 7
        start.loop = false
        start.stop()
        startRef.value = start
        bgContainer.value?.addChild(start)
    }

    const transformTurntable = (targetIndex: number): Promise<void> => {
        return new Promise((resolve) => {
            if (!turntableBg.value) return resolve();

            const safeTargetIndex = Math.abs(targetIndex % 8);
            const sectorAngle = 360 / 8;
            const initialAngleOffset = 0;

            const targetAngle = 360 - (safeTargetIndex * sectorAngle + initialAngleOffset);
            const extraRotations = 5 * 360;
            const currentRotation = turntableBg.value.rotation || 0;
            const currentAngle = (currentRotation * 180) / Math.PI;
            const totalRotation = extraRotations + targetAngle - currentAngle;

            const startTime = Date.now();
            const duration = 2000;
            const fastPhaseDuration = 1500;

            const animate = () => {
                const currentTime = Date.now();
                const elapsedTime = currentTime - startTime;

                if (elapsedTime >= duration) {
                    if (turntableBg.value) {
                        turntableBg.value.rotation = (targetAngle * Math.PI) / 180;
                        const finalAngle = (turntableBg.value.rotation * 180) / Math.PI;
                        console.log(`转盘最终停留的角度: ${finalAngle.toFixed(2)}°`);
                    }
                    resolve();
                    return;
                }

                let progress;
                if (elapsedTime < fastPhaseDuration) {
                    progress = (elapsedTime / fastPhaseDuration) * 0.85;
                } else {
                    const slowPhaseElapsed = elapsedTime - fastPhaseDuration;
                    const slowPhaseProgress = slowPhaseElapsed / (duration - fastPhaseDuration);
                    progress = 0.85 + (1 - Math.pow(1 - slowPhaseProgress, 2)) * 0.15;
                }

                const currentRotation = progress * totalRotation;
                if (turntableBg.value) {
                    turntableBg.value.rotation = (currentRotation * Math.PI) / 180;
                }

                // 保存动画ID
                const id = requestAnimationFrame(animate);
                animationIds.value.add(id);
            };

            animate();
        });
    };

    const getTurntableReward = async () => {
        const { data, code } = await AwaitApiResult(spinInvitedWheel())
        if (code === 0) {
            if (data.isFirstInvitedWheel) {
                isOpenAward.value = true
                firstInvitedWheelDatas.value = data.firstInvitedWheelDatas || []
            } else {
                firstInvitedWheelDatas.value = []
                isWin.value = !!data.isWin
            }
            firstReward.value = data.prizeAmount
            refreshRedDot()
        }
    }

    const getPageListHistory = async (page?: number) => {
        let params = {
            pageNo: page || pageInfo.value.page,
            pageSize: pageInfo.value.pageSize
        }
        const { data, code } = await AwaitApiResult(getUserInvitedWheelWithdrawList(params))
        if (code === 0) {
            historyList.value = data.list || []
            pageInfo.value.page = data.pageNo as number
            pageInfo.value.total = data.totalCount as number
        }
    }

    const startCountDown = (serviceNowTime: any) => {
        // 清除之前的计时器（如果存在）
        if (countDownTimer.value) {
            clearInterval(countDownTimer.value);
        }

        // 计算服务器时间和本地时间的差值
        const serverTime = new Date(serviceNowTime).getTime();
        const localTime = Date.now();
        const timeDifference = serverTime - localTime;

        // 设置新的计时器
        countDownTimer.value = setInterval(() => {
            const expiredTime = new Date(turntableState.turntableInfo?.expiredTime as any).getTime() || 0;

            // 使用本地时间 + 时间差来模拟服务器时间
            const now = Date.now() + timeDifference;
            const timeDiff = expiredTime - now;

            if (timeDiff <= 0) {
                countDownTime.value = '00:00:00';
                if (countDownTimer.value) {
                    clearInterval(countDownTimer.value);
                    countDownTimer.value = null;
                }
                if (!turntableState.turntableInfo?.isFirstInvitedWheel) {
                    getTurntableInfo();
                }
            } else {
                // 计算剩余总秒数
                const totalSeconds = Math.floor(timeDiff / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                countDownTime.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000);
    };

    // 在组件卸载时清除定时器
    const clearCountDown = () => {
        if (countDownTimer.value) {
            clearInterval(countDownTimer.value);
            countDownTimer.value = null;
        }
    };

    // 正确的清除所有requestAnimationFrame动画方法
    const clearAllAnimations = () => {
        // 清除所有保存的动画ID
        animationIds.value.forEach(id => {
            cancelAnimationFrame(id);
        });
        animationIds.value.clear();
    };

    const removeAllAnimate = () => {
        // 清除所有动画帧
        clearAllAnimations();

        // 清除GIF动画
        if (animateRef.value) {
            animateRef.value.destroy();
            animateRef.value = null;
        }
        if (startRef.value) {
            startRef.value.destroy();
            startRef.value = null;
        }
        turntableApps.value?.canvas.remove();
        turntableApps.value?.destroy(true, { children: true });
    }

    return {
        turntableCanvas,
        turntableApps,
        initTurntableCanvas,
        loadAssets,
        transformTurntable,
        getTurntableInfo,
        turntableState,
        getTurntableReward,
        firstReward,
        firstInvitedWheelDatas,
        isOpenAward,
        isEveryDayGift,
        recordList,
        getPageListHistory,
        historyList,
        pageInfo,
        countDownTime,
        textureCacheTurntable,
        withdrawDialog,
        withdrawNeedAmount,
        userInvitedWheelAmount,
        dollarSign,
        needAmount,
        cashOutDialog,
        ruleDialog,
        restBgcontainer,
        hasWithdrawMethodDialog,
        loading,
        clearCountDown,
        removeAllAnimate,
        clearAllAnimations,
        amountNoDialog
    }
}
