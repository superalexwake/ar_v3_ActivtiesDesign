let rootConfig = {} as any
const changeLange = (t: any) => {
	rootConfig = {
		// 0=支付中  1=确认中  2=支付超时  3=申诉中  4=已完成  5=充值失败  6=已取消   7=确认到账超时
		RechargeState: [
			{
				key: t('all'),
				value: -1
			},
			{
				key: t('titleToBePaid'),
				value: 0
			},
			{
				key: t('completed'),
				value: 1
			},
			{
				key: t('rechargeState4'),
				value: 2
			}
		],
		RechargeC2CState: [
			{
				key: t('payments'),
				value: 0
			},
			{
				key: t('c2cState1'),
				value: 1
			},
			{
				key: t('c2cState3'),
				value: 3
			},
			{
				key: t('timeOut'),
				value: 7
			},
			{
				key: t('c2cState4'),
				value: 4
			},
			{
				key: t('rechargeState4'),
				value: 5
			},
			{
				key: t('cancelled'),
				value: 6
			}
		],

		//提现状态，不准确，等待后端提供准确数据
		//状态 0待审核,申请中 1通过 2未通过,已拒绝 3第三方审核结果
		//<!--0待审核 1已完成 2未通过 3出款中 -->
		WithdrawState: [
			{
				key: t('withdrawStatem1'),
				value: -1
			},
			{
				key: t('withdrawState0'),
				value: 0
			},
			{
				key: t('rechargeState2'),
				value: 1
			},
			{
				key: t('withdrawState2'),
				value: 2
			},
			{
				key: t('withdrawing'),
				value: 3
			}
		],
		C2cState: [
			{
				key: t('withdrawStatem1'),
				value: -1
			},
			{
				key: t('c2cState0'),
				value: 0
			},
			{
				key: t('c2cState1'),
				value: 1
			},
			{
				key: t('c2cState2'),
				value: 2
			},
			{
				key: t('c2cState3'),
				value: 3
			},
			{
				key: t('c2cState4'),
				value: 4
			},
			{
				key: t('c2cTip9'),
				value: 5
			},
			{
				key: t('c2cState6'),
				value: 6
			},
			{
				key: t('c2cState7'),
				value: 7
			},
			{
				key: t('c2cState8'),
				value: 8
			},
			{
				key: t('c2cState9'),
				value: 9
			}
		],
		levelTypes: [
			{
				key: t('all'),
				value: -1
			},
			{
				key: t('downlevel', [1]),
				value: 1
			},
			{
				key: t('downlevel', [2]),
				value: 2
			},
			{
				key: t('downlevel', [3]),
				value: 3
			},
			{
				key: t('downlevel', [4]),
				value: 4
			},
			{
				key: t('downlevel', [5]),
				value: 5
			},
			{
				key: t('downlevel', [6]),
				value: 6
			}
		],
		bettingResult: [
			{
				key: t('bettingResultState1'),
				value: 2
			},
			{
				key: t('bettingResultState2'),
				value: 1
			},
			{
				key: t('bettingResultState3'),
				value: 0
			}
		],
		bettingOrderStatus: [
			{
				key: t('unsettled'),
				value: 0
			},
			{
				key: t('settled'),
				value: 1
			},
			{
				key: t('invalidbet'),
				value: 2
			}
		],
		//提现记录详情页的状态对应的提示文本
		//状态 0待审核,申请中 1通过 2未通过,已拒绝 3第三方审核结果
		WStateCorrelationT: [
			{
				value: 0,
				key: t('stateTips1')
			},
			{
				value: 1,
				key: t('stateTips2')
			},
			{
				value: 2,
				key: t('stateTips3')
			},
			{
				value: 3,
				key: t('stateTips4')
			}
		],
		//充值记录详情页的状态对应的提示文本,没有0是因为0是待支付状态，待支付状态不进入充值记录详情页
		RStateCorrelationT: [
			{
				key: t('RStateTips1'),
				value: 1
			},
			{
				key: t('RStateTips2'),
				value: 2
			}
		],
		gameSelectType: [
			{
				key: '0',
				value: '0'
			},
			{
				key: '1',
				value: '1'
			},
			{
				key: '2',
				value: '2'
			},
			{
				key: '3',
				value: '3'
			},
			{
				key: '4',
				value: '4'
			},
			{
				key: '5',
				value: '5'
			},
			{
				key: '6',
				value: '6'
			},
			{
				key: '7',
				value: '7'
			},
			{
				key: '8',
				value: '8'
			},
			{
				key: '9',
				value: '9'
			},
			{
				key: '10',
				value: '10'
			},
			{
				key: '11',
				value: '11'
			},
			{
				key: '12',
				value: '12'
			},
			{
				key: '13',
				value: '13'
			},
			{
				key: '14',
				value: '14'
			},
			{
				key: '15',
				value: '15'
			},
			{
				key: '16',
				value: '16'
			},
			{
				key: '17',
				value: '17'
			},
			{
				key: '18',
				value: '18'
			},
			{
				key: t('numbersUnmatch'),
				value: 'ABC'
			},
			{
				key: t('numbersMatch'),
				value: 'AAA'
			},
			{
				key: '22',
				value: '22'
			},
			{
				key: '33',
				value: '33'
			},
			{
				key: '44',
				value: '44'
			},
			{
				key: '55',
				value: '55'
			},
			{
				key: '66',
				value: '66'
			},
			{
				key: '111',
				value: '111'
			},
			{
				key: '222',
				value: '222'
			},
			{
				key: '333',
				value: '333'
			},
			{
				key: '444',
				value: '444'
			},
			{
				key: '555',
				value: '555'
			},
			{
				key: '666',
				value: '666'
			},
			{
				key: t('small'),
				value: 'L'
			},
			{
				key: t('big'),
				value: 'H'
			},
			{
				key: t('odd'),
				value: 'O'
			},
			{
				key: t('k3Even'),
				value: 'E'
			},
			{
				key: t('GTBig'),
				value: 'big'
			},
			{
				key: t('GTSmall'),
				value: 'small'
			},
			{
				key: t('GTRed'),
				value: 'red'
			},
			{
				key: t('GTGreen'),
				value: 'green'
			},
			{
				key: t('GTPurple'),
				value: 'violet'
			},
			{
				key: 'O',
				value: t('GTOdd')
			},
			{
				key: 'E',
				value: t('GTEven')
			},
			{
				key: 'L',
				value: t('GTSmall')
			},
			{
				key: 'H',
				value: t('GTBig')
			}
		],
		gameAllName: [
			{
				key: t('sabaSport'),
				value: 14
			},
			{
				key: t('cmdSport'),
				value: 8
			},
			{
				key: t('agSport'),
				value: 13
			},
			{
				key: t('imSport'),
				value: 15
			},
			{
				key: t('arSport'),
				value: 50
			},
			{
				key: t('dgLive'),
				value: 7
			},
			{
				key: t('agLive'),
				value: 10
			},
			{
				key: t('evoLive'),
				value: 16
			},
			{
				key: t('chess365'),
				value: 19
			},
			{
				key: t('chessv8'),
				value: 21
			},
			{
				key: t('sexyLive'),
				value: 27
			},
			{
				key: t('wmLive'),
				value: 26
			},
			{
				key: t('wicketsSport'),
				value: 25
			},
			{
				key: t('wicketsSport'),
				value: 25
			},
			{
				key: 'WM' + t('code9306'),
				value: 26
			},
			{
				key: 'SEXY' + t('code9306'),
				value: 27
			},
			{
				key: 'BG' + t('code9304'),
				value: 28
			},
			{
				key: 'BetSoft' + t('code9304'),
				value: 29
			},
			{
				key: 'YGG' + t('code9304'),
				value: 30
			},
			{
				key: 'JOKER' + t('code9304'),
				value: 31
			},
			{
				key: 'PlayNgo' + t('code9304'),
				value: 32
			},
			{
				key: 'Hacksaw' + t('code9304'),
				value: 33
			},
			{
				key: 'HackMD' + t('code9304'),
				value: 34
			},
			{
				key: 'Marbles' + t('code9304'),
				value: 35
			},
			{
				key: 'Spribe2' + t('code9304'),
				value: 36
			},
			{
				key: 'MG' + t('code9303'),
				value: 37
			},
			{
				key: 'MG' + t('code9306'),
				value: 38
			}
		],
		//语言
		languageCodes: [
			{
				value: 'en',
				key: 0
			},
			{
				value: 'id',
				key: 1
			},
			{
				value: 'vi',
				key: 2
			},
			{
				value: 'bra',
				key: 3
			},
			{
				value: 'tha',
				key: 4
			},
			{
				value: 'th',
				key: 4
			},
			{
				value: 'zh',
				key: 5
			},
			{
				value: 'zh-CN',
				key: 5
			},
			{
				value: 'tw',
				key: 6
			},
			{
				value: 'md',
				key: 7
			},
			{
				value: 'bd',
				key: 8
			},
			{
				value: 'hd',
				key: 9
			},
			{
				value: 'my',
				key: 10
			},
			{
				value: 'pk',
				key: 11
			},
			{
				value: 'ar',
				key: 12
			},
			{
				value: 'ta',
				key: 13
			},
			{
				value: 'te',
				key: 14
			}
		],
		// 邀请禁启用方式  0:禁用  1:启用  产品和测试确认
		StatusType: [
			{
				key: t('enableStatus'),
				value: 1
			},
			{
				key: t('disabledStatus'),
				value: 0
			}
		],
		// 区域方式
		RegionType: [
			{
				key: t('north'),
				value: '北部'
			},
			{
				key: t('central'),
				value: '中央'
			},
			{
				key: t('south'),
				value: '南部'
			}
		],
		// 洗码
		gameTabList: [
			{
				name: t('all'),
				img: 'all',
				codeType: -1
			},
			{
				name: t('lottery'),
				img: 'lottery',
				codeType: 3
			},
			{
				name: t('live'),
				img: 'video',
				codeType: 1
			},
			// {
			// 	name: t('fishing'),
			// 	img: 'fish',
			// },
			// {
			// 	name: t('sport'),
			// 	img: 'sport',
			// 	codeType: 2
			// },
			{
				name: t('chess'),
				img: 'chess',
				codeType: 4
			},
			// {
			// 	name: t('miniGame'),
			// 	img: 'flash',
			// },
			{
				name: t('electric'),
				img: 'slot',
				codeType: 0
			}
		],
		//vip记录类型
		VipType: [
			{
				key: t('receiveSuccess'),
				value: 1
			},
			{
				key: t('receiveSuccess'),
				value: 2
			},
			{
				key: t('vipcondition'),
				value: 3
			},
			{
				key: t('vipcondition'),
				value: 4
			},
			{
				key: t('vipTip8'),
				value: 5
			},
			{
				key: t('vipTip9'),
				value: 6
			},
			{
				key: t('vipTip16'),
				value: 7
			},
			{
				key: t('vipTip16'),
				value: 8
			}
		]
	}
}
export { rootConfig, changeLange }
