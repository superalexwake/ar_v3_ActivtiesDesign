/**
 * 银行列表配置
 * Bank List Configuration
 */
interface BankInfo {
  name: string;
  code: string;
}

interface BankMap {
  [key: string]: BankInfo;
}

const banks: BankMap = {
  // 主要商业银行 - Major Commercial Banks
  "UTIB": { "name": "Axis Bank", "code": "Axis Bank" },
  "HDFC": { "name": "HDFC Bank", "code": "HDFC Bank" },
  "ICIC": { "name": "ICICI Bank", "code": "ICICI Bank" },
  "KKBK": { "name": "Kotak Mahindra Bank", "code": "Kotak Mahindra Bank" },
  "YESB": { "name": "Yes Bank", "code": "Yes Bank" },
  "INDB": { "name": "Indusind Bank", "code": "Indusind Bank" },
  "SCBL": { "name": "Standard Chartered Bank", "code": "Standard Chartered Bank" },
  "CITI": { "name": "Citibank India", "code": "Citibank India" },
  "HSBC": { "name": "HSBC Bank", "code": "HSBC Bank" },
  "DBSS": { "name": "DBS Bank", "code": "DBS Bank" },

  // 国有银行 - Public Sector Banks
  "SBIN": { "name": "BHADRADRI BANK", "code": "BHADRADRI BANK" },
  "CNRB": { "name": "Canara Bank", "code": "Canara Bank" },
  "PUNB": { "name": "Bihar Gramin Bank", "code": "Bihar Gramin Bank" },
  "BKID": { "name": "Bank of India", "code": "Bank of India" },
  "UBIN": { "name": "Union Bank of India", "code": "Union Bank of India" },
  "BARB": { "name": "BARODA U.P BANK", "code": "BARODA U.P BANK" },
  "MAHB": { "name": "Bank of maharashtra", "code": "Bank of maharashtra" },
  "UCBA": { "name": "Uco Bank", "code": "Uco Bank" },
  "IOBA": { "name": "Indian Overseas Bank", "code": "Indian Overseas Bank" },
  "CORP": { "name": "Corporation Bank", "code": "Corporation Bank" },
  "ALLA": { "name": "Allahabad bank", "code": "Allahabad Bank" },
  "PSIB": { "name": "Punjab Sind Bank", "code": "Punjab Sind Bank" },
  "ORBC": { "name": "ORIENTAL BANK OF COMMERCE", "code": "ORIENTAL BANK OF COMMERCE" },

  // 地区银行 - Regional Banks
  "IDIB": { "name": "Indian Bank", "code": "Indian Bank" },
  "IBKL": { "name": "IDBI Bank", "code": "IDBI Bank" },
  "KARB": { "name": "Karnataka Bank", "code": "Karnataka Bank" },
  "SYNB": { "name": "Syndicate Bank", "code": "Syndicate Bank" },
  "ANDB": { "name": "Andhra Bank", "code": "Andhra Bank" },
  "JAKA": { "name": "Jammu Kashmir Bank", "code": "Jammu Kashmir Bank" },
  "SIBL": { "name": "South Indian Bank", "code": "South Indian Bank" },
  "KVBL": { "name": "Karur Vysya Bank", "code": "Karur Vysya Bank" },
  "TMBL": { "name": "Tamilnad Mercantile Bank", "code": "Tamilnad Mercantile Bank" },
  "CIUB": { "name": "City Union Bank", "code": "City Union Bank" },
  "LAVB": { "name": "Lakshmi Vilas Bank", "code": "Lakshmi Vilas Bank" },
  "DLXB": { "name": "Dhanalakshmi bank", "code": "Dhanalakshmi bank" },
  "RATN": { "name": "THE RATNAKAR BANK LTD", "code": "THE RATNAKAR BANK LTD" },
  "NTBL": { "name": "nainital bank", "code": "nainital bank" },
  "CSBK": { "name": "CATHOLIC SYRIAN BANK LTD", "code": "CATHOLIC SYRIAN BANK LTD" },
  "DCBL": { "name": "DCB Bank", "code": "DCB Bank" },
  "VIJB": { "name": "Vijaya Bank", "code": "Vijaya Bank" },
  "SBHY": { "name": "State Bank of Hyderabad", "code": "State Bank of Hyderabad" },
  "SBTR": { "name": "STATE BANK OF TRAVANCORE", "code": "STATE BANK OF TRAVANCORE" },
  "STBP": { "name": "State bank of patiala", "code": "State bank of patiala" },
  "SBMY": { "name": "State Bank of Mysore", "code": "State Bank of Mysore" },
  "SBBJ": { "name": "State Bank of Bikaner And Jaipur", "code": "State Bank of Bikaner And Jaipur" },
  "STCB": { "name": "State Bank Of Mauritius Ltd", "code": "State Bank Of Mauritius Ltd" },
  "KAJB": { "name": "Kallappanna Awade Janata Bank", "code": "Kallappanna Awade Janata Bank" },

  // 小额金融银行 - Small Finance Banks
  "IDFB": { "name": "IDFC FIRST BANK LTD", "code": "IDFC FIRST BANK LTD" },
  "BDBL": { "name": "Bandhan Bank", "code": "Bandhan Bank" },
  "ESFB": { "name": "Equitas Small Finance Bank", "code": "Equitas Small Finance Bank" },
  "AUBL": { "name": "AU Small Finance Bank", "code": "AU Small Finance Bank" },
  "UJSB": { "name": "Ujjivan Small Finance Bank", "code": "Ujjivan Small Finance Bank" },
  "CLBL": { "name": "capital small finance bank", "code": "capital small finance bank" },
  "ESMF": { "name": "ESAF Small Finance Bank", "code": "ESAF Small Finance Bank" },
  "NESF": { "name": "North East small financial bank", "code": "North East small financial bank" },
  "FINC": { "name": "Fincare small finance bank", "code": "Fincare small finance bank" },
  "JSFB": { "name": "Jana small finance bank", "code": "Jana small finance bank" },
  "SURY": { "name": "SURYODAY SMALL FINANCE BANK LIMITED", "code": "SURYODAY SMALL FINANCE BANK LIMITED" },
  "UTKS": { "name": "Utkarsh Small Finance Bank", "code": "Utkarsh Small Finance Bank" },
  "SHBK": { "name": "SHIVALIK SMALL FIHANCE BANK", "code": "SHIVALIK SMALL FIHANCE BANK" },

  // 支付银行 - Payment Banks
  "PYTM": { "name": "PYTM PAYMENTS BANK", "code": "PYTM PAYMENTS BANK" },
  "AIRP": { "name": "AIRTEL PAYMENTS BANK", "code": "AIRTEL PAYMENTS BANK" },
  "FINO": { "name": "Fino Payments Bank", "code": "Fino Payments Bank" },
  "NSPB": { "name": "NSDL Payments Bank", "code": "NSDL Payments Bank" },
  "JIOP": { "name": "jio payments bank", "code": "jio payments bank" },

  // 农村银行 - Rural Banks
  "CBIN": { "name": "Chaitanya Godavari Grameena Bank", "code": "Chaitanya Godavari Grameena Bank" },
  "MRBK": { "name": "Mizoram Rural Bank", "code": "Mizoram Rural Bank" },
  "KLGB": { "name": "Kerala Gramin Bank", "code": "Kerala Gramin Bank" },
  "HGBK": { "name": "Sarva Haryana Gramin Bank", "code": "Sarva Haryana Gramin Bank" },
  "SRCB": { "name": "Saurashtra Gramin Bank", "code": "Saurashtra Gramin Bank" },
  "APGB": { "name": "andhra pragathi grameena bank", "code": "andhra pragathi grameena bank" },
  "RMGB": { "name": "rajasthan marudhara gramin bank", "code": "rajasthan marudhara gramin bank" },
  "PKGB": { "name": "PRAGATHI KRISHNA GRAMIN BANK", "code": "PRAGATHI KRISHNA GRAMIN BANK" },
  "TSAB": { "name": "Telangana grameena bank", "code": "Telangana grameena bank" },
  "APGV": { "name": "Andhra Pradesh Grameena Vikas Bank", "code": "Andhra Pradesh Grameena Vikas Bank" },
  "KVGB": { "name": "Karnataka Vikas Grameena Bank", "code": "Karnataka Vikas Grameena Bank" },
  "MBGX": { "name": "Madhya Bihar Gramin Bank", "code": "Madhya Bihar Gramin Bank" },
  "MAHG": { "name": "MAHARASHTRA GRAMIN BANK", "code": "MAHARASHTRA GRAMIN BANK" },
  "TRGB": { "name": "Tripura Gramin Bank", "code": "Tripura Gramin Bank" },
  "ARYB": { "name": "GRAMIN BANK OF ARYAVART", "code": "GRAMIN BANK OF ARYAVART" },
  "UTBI": { "name": "UTKAL GRAMYA BANK", "code": "UTKAL GRAMYA BANK" },
  "BKDG": { "name": "BARODA GUJARAT GRAMIN BANK", "code": "BARODA GUJARAT GRAMIN BANK" },
  "BKDN": { "name": "Dena Gujarat Gramin Bank", "code": "Dena Gujarat Gramin Bank" },
  "TNGX": { "name": "Tamil nadu grama bank", "code": "Tamil nadu grama bank" },

  // 合作银行 - Cooperative Banks
  "VARA": { "name": "The Varachha Co-operative Bank Ltd.,Surat", "code": "The Varachha Co-operative Bank Ltd.,Surat" },
  "BACB": { "name": "Bassein catholic cooperative Bank", "code": "Bassein catholic co-operative Bank" },
  "ADCB": { "name": "The Ahmedabad district co-op Bank ltd", "code": "The Ahmedabad district co-op Bank ltd" },
  "ABHY": { "name": "ABHYUDAYA CO-OP. BANK LTD.", "code": "ABHYUDAYA CO-OP. BANK LTD." },
  "AMCB": { "name": "The Ahmedabad merchantile co-op bank Ltd", "code": "The Ahmedabad merchantile co-op bank Ltd" },
  "HPSC": { "name": "HIMACHAL PARDESH STATE COOPERATIVE BANK", "code": "HIMACHAL PARDESH STATE COOPERATIVE BANK" },
  "MSCB": { "name": "Maharashtra state cooperative bank", "code": "Maharashtra state cooperative bank" },
  "KSCB": { "name": "Krishna District Co-Operative Central Bank Ltd.", "code": "Krishna District Co-Operative Central Bank Ltd." },
  "RNSB": { "name": "RAJKOT NAGARIK SAHAKARI", "code": "RAJKOT NAGARIK SAHAKARI" },
  "COSB": { "name": "Cosmos Co-operative Bank Ltd", "code": "Cosmos Co-operative Bank Ltd" },
  "SUCB": { "name": "Suco Bank", "code": "Suco Bank" },
  "APBL": { "name": "Apna Sahakari Bank", "code": "Apna Sahakari Bank" },
  "SVCB": { "name": "SVC BANK", "code": "SVC BANK" },
  "BCBM": { "name": "Bharat cooperative bank", "code": "Bharat cooperative bank" },
  "SDCB": { "name": "The Surat District Co-Op. Bank Ltd.", "code": "The Surat District Co-Op. Bank Ltd." },
  "KCCB": { "name": "The Karnal Central Co-op. Bank Ltd", "code": "The Karnal Central Co-op. Bank Ltd" },
  "PMCB": { "name": "Prime co-operative Bank", "code": "Prime co-operative Bank" },
  "ZSBL": { "name": "Zila sahkari bank", "code": "Zila sahkari bank" },
  "NICB": { "name": "New India Co-Operative Bank", "code": "New India Co-Operative Bank" },
  "NKGS": { "name": "NKGSB Co-operative Bank Ltd.", "code": "NKGSB Co-operative Bank Ltd." },
  "JSBP": { "name": "janata sahakari bank ltd", "code": "janata sahakari bank ltd" },
  "RJSB": { "name": "Rajgurunagar Sahakari Bank", "code": "Rajgurunagar Sahakari Bank" },
  "GSMN": { "name": "GS Mahanagar Co-Op Bank Ltd", "code": "GS Mahanagar Co-Op Bank Ltd" },
  "MCAB": { "name": "The Meghalaya Co-operative Apex Bank", "code": "The Meghalaya Co-operative Apex Bank" },
  "GSCB": { "name": "The Gujarat State Co-operative Bank Limited", "code": "The Gujarat State Co-operative Bank Limited" },
  "VASV": { "name": "vasai vikas sahakari", "code": "vasai vikas sahakari" },
  "VCOB": { "name": "VISHAPATNAM co-operative bank", "code": "VISHAPATNAM co-operative bank" },
  "SMCB": { "name": "Samarth Sahakari Bank Ltd", "code": "Samarth Sahakari Bank Ltd" },
  "GAYX": { "name": "GAYATRI BANK", "code": "GAYATRI BANK" },
  "JDCX": { "name": "Jind central Co-OP Bank", "code": "Jind central Co-OP Bank" },
  "KDCB": { "name": "KDCC BANK", "code": "KDCC BANK" },
  "HCBL": { "name": "The Hasti Coop Bank", "code": "The Hasti Coop Bank" },
  "KJSB": { "name": "The Kalyan Janata Sahakari Bank Ltd", "code": "The Kalyan Janata Sahakari Bank Ltd" },
  "DNSB": { "name": "Dombivli Nagari Sahakari Bank Ltd.", "code": "Dombivli Nagari Sahakari Bank Ltd." },
  "JMCB": { "name": "Jalna Merchants Co-operative Bank", "code": "Jalna Merchants Co-operative Bank" },
  "NSBM": { "name": "NAGAR SAHKARI BANK LTD. MAHARAJGANJ", "code": "NAGAR SAHKARI BANK LTD. MAHARAJGANJ" },
  "HARY": { "name": "HARYANA BANK", "code": "HARYANA BANK" },
  "JSBL": { "name": "JILA SAHAKARI BANK", "code": "JILA SAHAKARI BANK" },
  "BDCB": { "name": "BANASKANTHA DISTRICT CENTRAL CO-OP. BANK LTD", "code": "BANASKANTHA DISTRICT CENTRAL CO-OP. BANK LTD" },
  "RCCB": { "name": "The Rohtak Central Co-op. Bank Ltd", "code": "The Rohtak Central Co-op. Bank Ltd" },
  "ACBL": { "name": "ASSOCIATE CO-OP. BANK LTD", "code": "ASSOCIATE CO-OP. BANK LTD" },
  "GBCB": { "name": "The Greater Bombay Co-operative Bank Limited", "code": "The Greater Bombay Co-operative Bank Limited" },
  "BBCB": { "name": "Balasore Bhadrak Central co-operative bank", "code": "Balasore Bhadrak Central co-operative bank" },
  "YNCB": { "name": "Yamuna Nagar Central Co-op. Bank Lt", "code": "Yamuna Nagar Central Co-op. Bank Lt" },
  "CCBL": { "name": "Citizen credit co permeative bank ltd", "code": "Citizen credit co permeative bank ltd" },
  "UPCB": { "name": "Uttar Pradesh Co Operative Bank Ltd", "code": "Uttar Pradesh Co Operative Bank Ltd" },
  "JSKM": { "name": "jila sahakari kendriya bank maryadit", "code": "jila sahakari kendriya bank maryadit" },

  // 其他银行 - Other Banks
  "FDRL": { "name": "Jupiter federal", "code": "Jupiter federal" },
  "TJSB": { "name": "TJSB Bank", "code": "TJSB Bank" },
  "GPPX": { "name": "Gp parsik bank", "code": "Gp parsik bank" },
  "IPOS": { "name": "Post Office Savings Bank", "code": "Post Office Savings Bank" },

  // 数字货币 - Digital Currency
  "USDT": { "name": "USDT", "code": "USDT" }
};

export default banks;

/**
 * 工具函数 - Utility Functions
 */

// 根据ISFC码获取银行信息 - Get bank information based on IFSC code
export function getBankInfoByIFSC(ifsc: string): BankInfo | null {
  const bankCode = ifsc.substring(0, 4).toUpperCase();
  return banks[bankCode] || null;
}