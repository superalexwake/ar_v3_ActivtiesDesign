import { ref } from "vue";

export const amountList = [1,10,100,1000]
export const bettingList = ref<{ num: number | string; odds: string; chack: boolean }[]>([
	{
		num: 3,
		odds: "207.36X",
		chack: false
	},
	{
		num: 4,
		odds: '69.12X',
		chack: false
	},
	{
		num: 5,
		odds: '34.56X',
		chack: false
	},
	{
		num: 6,
		odds: '20.74X',
		chack: false
	},
	{
		num: 7,
		odds: '13.83X',
		chack: false
	},
	{
		num: 8,
		odds: '9.88X',
		chack: false
	},
	{
		num: 9,
		odds: '8.3X',
		chack: false
	},
	{
		num: 10,
		odds: '7.68X',
		chack: false
	},
	{
		num: 11,
		odds: '7.68X',
		chack: false
	},
	{
		num: 12,
		odds: '8.3X',
		chack: false
	},
	{
		num: 13,
		odds: '9.88X',
		chack: false
	},
	{
		num: 14,
		odds: '13.83X',
		chack: false
	},
	{
		num: 15,
		odds: '20.74X',
		chack: false
	},
	{
		num: 16,
		odds: '34.56X',
		chack: false
	},
	{
		num: 17,
		odds: '69.12X',
		chack: false
	},
	{
		num: 18,
		odds: '207.36X',
		chack: false
	},
	{
		num: 'Small', //H
		odds: '1.92X',
		chack: false
	},
	{
		num: 'Big', //L
		odds: '1.92X',
		chack: false
	},
	{
		num: 'Odd', //O
		odds: '1.92X',
		chack: false
	},
	{
		num: 'Even', //E
		odds: '1.92X',
		chack: false
	}
])

export const myRecordResponse = {
    "data": {
        "list": [
            {
                "issueNumber": "20240904091089",
                "amount": 5.00,
                "gameType": "3",
                "betCount": 1,
                "realAmount": 4.90,
                "selectType": "E",
                "profitAmount": null,
                "premium": null,
                "orderNumber": "K32024090418081364400065a",
                "fee": 0.10,
                "addTime": "2024-09-04 18:08:13",
                "state": 2
            },
            {
                "issueNumber": "20240904091089",
                "amount": 5.00,
                "gameType": "2",
                "betCount": 1,
                "realAmount": 4.90,
                "selectType": "H",
                "profitAmount": null,
                "premium": null,
                "orderNumber": "K32024090418081004700064a",
                "fee": 0.10,
                "addTime": "2024-09-04 18:08:10",
                "state": 2
            },
            {
                "issueNumber": "20240904091089",
                "amount": 5.00,
                "gameType": "3",
                "betCount": 1,
                "realAmount": 4.90,
                "selectType": "O",
                "profitAmount": null,
                "premium": null,
                "orderNumber": "K32024090418080807400063a",
                "fee": 0.10,
                "addTime": "2024-09-04 18:08:08",
                "state": 2
            },
            {
                "issueNumber": "20240904091088",
                "amount": 5.00,
                "gameType": "2",
                "betCount": 1,
                "realAmount": 4.90,
                "selectType": "L",
                "profitAmount": 4.90,
                "premium": "166",
                "orderNumber": "K32024090418075176900061a",
                "fee": 0.10,
                "addTime": "2024-09-04 18:07:51",
                "state": 0
            },
            {
                "issueNumber": "20240904091087",
                "amount": 180.00,
                "gameType": "4,9,10",
                "betCount": 1,
                "realAmount": 176.40,
                "selectType": ".1.,.2.,.3.,.4.,.5.,.6.,|1|,|2|,|3|,|4|,|5|,|6|,|ABC|",
                "profitAmount": 270.92,
                "premium": "341",
                "orderNumber": "K32024090418065184300060a",
                "fee": 3.60,
                "addTime": "2024-09-04 18:06:51",
                "state": 1
            },
            {
                "issueNumber": "20240904091087",
                "amount": 35.00,
                "gameType": "7,8",
                "betCount": 1,
                "realAmount": 34.30,
                "selectType": "|111|,|222|,|333|,|444|,|555|,|666|,|AAA|",
                "profitAmount": 34.30,
                "premium": "341",
                "orderNumber": "K32024090418064058800059a",
                "fee": 0.70,
                "addTime": "2024-09-04 18:06:40",
                "state": 0
            },
            {
                "issueNumber": "20240904091087",
                "amount": 75.00,
                "gameType": "5,6",
                "betCount": 1,
                "realAmount": 73.50,
                "selectType": ":11:,:22:,:33:,:4:,:5:,:6:,|11|,|22|,|33|,|44|,|55|,|66|",
                "profitAmount": 73.50,
                "premium": "341",
                "orderNumber": "K32024090418063344900058a",
                "fee": 1.50,
                "addTime": "2024-09-04 18:06:33",
                "state": 0
            },
            {
                "issueNumber": "20240904091087",
                "amount": 10.00,
                "gameType": "2,3",
                "betCount": 1,
                "realAmount": 9.80,
                "selectType": "L,O",
                "profitAmount": 9.41,
                "premium": "341",
                "orderNumber": "K32024090418061905500057a",
                "fee": 0.20,
                "addTime": "2024-09-04 18:06:19",
                "state": 1
            },
            {
                "issueNumber": "20240904091087",
                "amount": 90.00,
                "gameType": "1,2,3",
                "betCount": 1,
                "realAmount": 88.20,
                "selectType": "10,11,12,13,14,15,16,17,18,3,4,5,6,7,8,9,H,E",
                "profitAmount": 57.82,
                "premium": "341",
                "orderNumber": "K32024090418061500200056a",
                "fee": 1.80,
                "addTime": "2024-09-04 18:06:15",
                "state": 1
            },
            {
                "issueNumber": "20240904090996",
                "amount": 15.00,
                "gameType": "4,9,10",
                "betCount": 1,
                "realAmount": 14.70,
                "selectType": ".2.,.6.,|1|,|3|,|5|,|ABC|",
                "profitAmount": 14.70,
                "premium": "144",
                "orderNumber": "K32024090416352535600042a",
                "fee": 0.30,
                "addTime": "2024-09-04 16:35:25",
                "state": 0
            },
            {
                "issueNumber": "20240904090996",
                "amount": 15.00,
                "gameType": "7,8",
                "betCount": 1,
                "realAmount": 14.70,
                "selectType": "|222|,|666|,|AAA|",
                "profitAmount": 14.70,
                "premium": "144",
                "orderNumber": "K32024090416351771800041a",
                "fee": 0.30,
                "addTime": "2024-09-04 16:35:17",
                "state": 0
            },
            {
                "issueNumber": "20240904090996",
                "amount": 10.00,
                "gameType": "5,6",
                "betCount": 1,
                "realAmount": 9.80,
                "selectType": ":44:,:6:,|33|",
                "profitAmount": 9.80,
                "premium": "144",
                "orderNumber": "K32024090416351150500040a",
                "fee": 0.20,
                "addTime": "2024-09-04 16:35:11",
                "state": 0
            },
            {
                "issueNumber": "20240904090996",
                "amount": 20.00,
                "gameType": "1",
                "betCount": 1,
                "realAmount": 19.60,
                "selectType": "14,17,3,9",
                "profitAmount": 40.67,
                "premium": "144",
                "orderNumber": "K32024090416350596500039a",
                "fee": 0.40,
                "addTime": "2024-09-04 16:35:05",
                "state": 1
            },
            {
                "issueNumber": "20240903090912",
                "amount": 5.00,
                "gameType": "1",
                "betCount": 1,
                "realAmount": 4.90,
                "selectType": "5",
                "profitAmount": 4.90,
                "premium": "611",
                "orderNumber": "K32024090315112221100094a",
                "fee": 0.10,
                "addTime": "2024-09-03 15:11:22",
                "state": 0
            },
            {
                "issueNumber": "20240829090675",
                "amount": 60000.00,
                "gameType": "6",
                "betCount": 100,
                "realAmount": 58800.00,
                "selectType": "|11|,|22|,|33|,|44|,|55|,|66|",
                "profitAmount": 58800.00,
                "premium": "134",
                "orderNumber": "K32024082911142029600078a",
                "fee": 1200.00,
                "addTime": "2024-08-29 11:14:20",
                "state": 0
            },
            {
                "issueNumber": "20240817090555",
                "amount": 100000.00,
                "gameType": "2",
                "betCount": 100,
                "realAmount": 98000.00,
                "selectType": "L",
                "profitAmount": 98000.00,
                "premium": "654",
                "orderNumber": "K32024081709142909500033a",
                "fee": 2000.00,
                "addTime": "2024-08-17 09:14:29",
                "state": 0
            },
            {
                "issueNumber": "20240817090555",
                "amount": 100000.00,
                "gameType": "2",
                "betCount": 100,
                "realAmount": 98000.00,
                "selectType": "H",
                "profitAmount": 188160.00,
                "premium": "654",
                "orderNumber": "K32024081709142178400032a",
                "fee": 2000.00,
                "addTime": "2024-08-17 09:14:21",
                "state": 1
            }
        ],
        "pageNo": 1,
        "totalPage": 1,
        "totalCount": 17
    },
    "code": 0,
    "msg": "Succeed",
    "msgCode": 0,
    "serviceNowTime": "2024-09-04 18:08:28"
}

export const trendResponse = {
    "data": {
        "list": [
            {
                "issueNumber": "20240904091093",
                "gameType": 0,
                "sumCount": 10,
                "premium": "541"
            },
            {
                "issueNumber": "20240904091092",
                "gameType": 0,
                "sumCount": 13,
                "premium": "265"
            },
            {
                "issueNumber": "20240904091091",
                "gameType": 2,
                "sumCount": 11,
                "premium": "155"
            },
            {
                "issueNumber": "20240904091090",
                "gameType": 1,
                "sumCount": 9,
                "premium": "423"
            },
            {
                "issueNumber": "20240904091089",
                "gameType": 0,
                "sumCount": 7,
                "premium": "421"
            },
            {
                "issueNumber": "20240904091088",
                "gameType": 2,
                "sumCount": 13,
                "premium": "166"
            },
            {
                "issueNumber": "20240904091087",
                "gameType": 0,
                "sumCount": 8,
                "premium": "341"
            },
            {
                "issueNumber": "20240904091086",
                "gameType": 2,
                "sumCount": 5,
                "premium": "212"
            },
            {
                "issueNumber": "20240904091085",
                "gameType": 0,
                "sumCount": 10,
                "premium": "613"
            },
            {
                "issueNumber": "20240904091084",
                "gameType": 2,
                "sumCount": 10,
                "premium": "622"
            }
        ],
        "pageNo": 1,
        "totalPage": 3710,
        "totalCount": 37093
    },
    "code": 0,
    "msg": "Succeed",
    "msgCode": 0,
    "serviceNowTime": "2024-09-04 18:13:19"
}

export const recordResponse = {
    "data": {
        "list": [
            {
                "issueNumber": "20240905090597",
                "gameType": 1,
                "sumCount": 6,
                "premium": "312"
            },
            {
                "issueNumber": "20240905090596",
                "gameType": 0,
                "sumCount": 11,
                "premium": "452"
            },
            {
                "issueNumber": "20240905090595",
                "gameType": 1,
                "sumCount": 6,
                "premium": "213"
            },
            {
                "issueNumber": "20240905090594",
                "gameType": 0,
                "sumCount": 11,
                "premium": "542"
            },
            {
                "issueNumber": "20240905090593",
                "gameType": 0,
                "sumCount": 13,
                "premium": "652"
            },
            {
                "issueNumber": "20240905090592",
                "gameType": 2,
                "sumCount": 12,
                "premium": "525"
            },
            {
                "issueNumber": "20240905090591",
                "gameType": 1,
                "sumCount": 12,
                "premium": "345"
            },
            {
                "issueNumber": "20240905090590",
                "gameType": 0,
                "sumCount": 9,
                "premium": "153"
            },
            {
                "issueNumber": "20240905090589",
                "gameType": 2,
                "sumCount": 5,
                "premium": "122"
            },
            {
                "issueNumber": "20240905090588",
                "gameType": 3,
                "sumCount": 15,
                "premium": "555"
            }
        ],
        "pageNo": 1,
        "totalPage": 3804,
        "totalCount": 38037
    },
    "code": 0,
    "msg": "Succeed",
    "msgCode": 0,
    "serviceNowTime": "2024-09-05 09:57:23"
}

export const ruleData = {
        "typeID": 9,
        gamePresentation: "<p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Fast3openwith3numbersineachperiodastheopeningnumber<font face=\"宋体\">，</font><font face=\"Calibri\">Theopeningnumbersare111to666Naturalnumber</font><font face=\"宋体\">，</font><font face=\"Calibri\">Nozerosinthearray</font><font face=\"宋体\">，</font><font face=\"Calibri\">Andtheopeningnumbersareinnoparticularorder</font><font face=\"宋体\">，</font><font face=\"Calibri\">Quick3istoguessallorpartofthe3winningnumbers.</font></span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">SumValue</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Placeabetonthesumofthreenumbers</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose3samenumberall</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Forallthesamethreenumbers<font face=\"宋体\">（</font><font face=\"Calibri\">111</font><font face=\"宋体\">、</font><font face=\"Calibri\">222</font><font face=\"宋体\">、</font><font face=\"Calibri\">…</font><font face=\"宋体\">、</font><font face=\"Calibri\">666</font><font face=\"宋体\">）</font><font face=\"Calibri\">Makeanall-inclusivebet</font></span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose3samenumbersingle</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Fromallthesamethreenumbers<font face=\"宋体\">（</font><font face=\"Calibri\">111</font><font face=\"宋体\">、</font><font face=\"Calibri\">…</font><font face=\"宋体\">、</font><font face=\"Calibri\">666</font><font face=\"宋体\">）</font><font face=\"Calibri\">Chooseagroupofnumbersinanyofthemtoplacebets</font></span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose2SameMultiple</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Placeabetontwodesignatedsamenumbersandanarbitrarynumberamongthethreenumbers</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose2SameSingle</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Placeabetontwodesignatedsamenumbersandadesignateddifferentnumberamongthethreenumbers</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">3numbersdifferent</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Placeabetonthreedifferentnumbers</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">2numbersdifferent</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Placeabetontwodesignateddifferentnumbersandanarbitrarynumberamongthethreenumbers</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose3Consecutivenumberall</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Forallthreeconsecutivenumbers<font face=\"宋体\">（</font><font face=\"Calibri\">123</font><font face=\"宋体\">、</font><font face=\"Calibri\">234</font><font face=\"宋体\">、</font><font face=\"Calibri\">345</font><font face=\"宋体\">、</font><font face=\"Calibri\">456</font><font face=\"宋体\">）</font><font face=\"Calibri\">Placeabet</font></span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Descriptionofwinningandodds:</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">SumValue</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Abetwiththesameopeningnumberandvalueisthewinning</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose3samenumberall</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Iftheopeningnumbersareanythreeofthesamenumber,itisthewinning</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose3samenumbersingle</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Abetthatisexactlythesameastheopeningnumberisthewinning</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose2SameMultiple</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Thesamenumberasthetwosamenumbersintheopeningnumber(exceptforthethreesamenumbers)isthewinning</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose2SameSingle</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Abetthatisexactlythesameastheopeningnumberisthewinning</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">3numbersdifferent</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Abetthatisexactlythesameastheopeningnumberisthewinning</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">2numbersdifferent</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Thesameasthetwoarbitrarynumbersintheopeningnumberisthewinning</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Choose3Consecutivenumberall</span><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \"><o:p></o:p></span></p><p class=\"p0\" style=\"margin-bottom:0pt; margin-top:0pt; \"><span style=\"mso-spacerun:'yes'; font-size:10.5000pt; font-family:'Calibri'; \">Iftheopeningnumbersareanythreeconsecutivenumbers,itisthewinning</span></p>"
}