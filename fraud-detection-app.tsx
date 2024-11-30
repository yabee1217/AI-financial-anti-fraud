import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Search, Plus, Send } from 'lucide-react';

const fraudKeywords = {
  investment: [
    "高回報", "保證獲利", "穩賺不賠", "投資機會", "股票內線", "快速致富",
    "保證年化報酬XX%", "無風險投資", "私募基金", "期貨交易", "虛擬貨幣投資",
    "短期暴利", "一夜致富", "7天翻倍", "黃金交易", "外匯投資", "碳權交易"
  ],
  onlineShopping: [
    "限時特價", "秒殺優惠", "錯誤標價", "假冒官網", "盜版商品",
    "只接受銀行轉帳", "僅限郵局匯款", "不接受貨到付款",
    "全新未拆封", "原廠平行輸入", "海外代購",
    "今日最後一天", "數量極少", "限時搶購"
  ],
  impersonation: [
    "冒充公務員", "假冒銀行", "緊急通知", "系統升級", "身分驗證",
    "稅務局人員", "社福機構", "健保署", "警察局", "檢察官",
    "帳戶異常", "個資外洩", "違法行為", "欠稅通知",
    "立即處理", "馬上登入", "盡快回覆"
  ],
  lottery: [
    "中大獎", "海外彩券", "中獎通知", "領獎手續費", "預先付款",
    "樂透頭獎", "刮刮樂", "發票對獎", "價值百萬", "億元大獎", 
    "豐厚獎金", "保密協議", "公證手續", "稅務處理"
  ],
  loan: [
    "無擔保貸款", "快速放款", "協商債務", "代辦貸款", "信用卡代償",
    "免信用查核", "無需財力證明", "信用不良可辦", "企業周轉", 
    "資金週轉", "緊急現金", "私人放款", "民間借貸", "小額借款"
  ]
};

const fraudCases = [
  {
    type: "investment",
    description: "宣稱高報酬率的投資計劃",
    link: "https://www.npa.gov.tw/ch/app/news/view?module=news&id=2834",
    keywords: ["高回報", "保證獲利"]
  },
  {
    type: "onlineShopping",
    description: "假冒知名購物網站騙取個資",
    link: "https://www.npa.gov.tw/ch/app/news/view?module=news&id=2831",
    keywords: ["限時特價", "假冒官網"]
  },
  {
    type: "impersonation",
    description: "假冒檢察官詐騙案件",
    link: "https://www.npa.gov.tw/ch/app/news/view?module=news&id=2828",
    keywords: ["冒充公務員", "緊急通知"]
  },
  {
    type: "lottery",
    description: "假中獎詐騙案件",
    link: "https://www.npa.gov.tw/ch/app/news/view?module=news&id=2825",
    keywords: ["中大獎", "領獎手續費"]
  },
  {
    type: "loan",
    description: "假冒銀行行員詐騙案件",
    link: "https://www.npa.gov.tw/ch/app/news/view?module=news&id=2822",
    keywords: ["無擔保貸款", "快速放款"]
  }
];

const FraudDetectionSystem = () => {
  const [activePage, setActivePage] = useState('home');
  const [userInput, setUserInput] = useState('');
  const [detectionResult, setDetectionResult] = useState(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [keywordCategory, setKeywordCategory] = useState('investment');
  const [feedback, setFeedback] = useState('');
  const [feedbackResult, setFeedbackResult] = useState('');

  const detectFraud = () => {
    const input = userInput.toLowerCase();
    let detectedKeywords = [];
    let detectedCategories = new Set();

    Object.entries(fraudKeywords).forEach(([category, keywords]) => {
      const detected = keywords.filter(keyword => 
        input.includes(keyword.toLowerCase())
      );
      if (detected.length > 0) {
        detectedKeywords = [...detectedKeywords, ...detected];
        detectedCategories.add(category);
      }
    });

    setDetectionResult({
      keywords: detectedKeywords,
      categories: Array.from(detectedCategories),
      cases: fraudCases.filter(c => 
        detectedCategories.has(c.type) || 
        c.keywords.some(k => detectedKeywords.includes(k))
      )
    });
  };

  const submitFeedback = () => {
    if (feedback.trim()) {
      setFeedbackResult('感謝您的反饋！我們會認真考慮您的意見。');
      setFeedback('');
    } else {
      setFeedbackResult('請輸入有效的反饋內容。');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-green-400 to-purple-500 p-4">
      <div className="max-w-4xl mx-auto bg-white/25 backdrop-blur-sm rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          金融反詐騙系統
        </h1>
        
        <nav className="mb-6">
          <ul className="flex justify-center space-x-6">
            {['首頁', '關鍵字管理', '意見反饋'].map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => setActivePage(['home', 'keywords', 'feedback'][index])}
                  className={`text-white hover:underline ${
                    activePage === ['home', 'keywords', 'feedback'][index]
                      ? 'font-bold'
                      : ''
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {activePage === 'home' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">詐騙檢測</h2>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              rows="4"
              placeholder="請輸入可疑訊息..."
            />
            <button
              onClick={detectFraud}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Search size={20} />
              檢測
            </button>

            {detectionResult && (
              <div className="mt-4">
                {detectionResult.keywords.length > 0 ? (
                  <>
                    <div className="flex items-start gap-2 p-4 bg-red-100 rounded-lg">
                      <AlertTriangle className="text-red-500 mt-1" />
                      <div>
                        <p className="text-red-700 font-bold">
                          警告：檢測到可疑關鍵詞
                        </p>
                        <p className="text-red-600">
                          {detectionResult.keywords.join('、')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <h3 className="font-semibold mb-2">相似案例：</h3>
                      <ul className="space-y-2">
                        {detectionResult.cases.map((case_, index) => (
                          <li key={index}>
                            <a
                              href={case_.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {case_.description}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-500" />
                    <p className="text-green-700">
                      未檢測到明顯的詐騙關鍵詞，但仍請保持警惕。
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activePage === 'keywords' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">關鍵字管理</h2>
            <div className="mb-6">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="w-full p-3 border rounded-lg mb-2"
                placeholder="輸入新關鍵字"
              />
              <select
                value={keywordCategory}
                onChange={(e) => setKeywordCategory(e.target.value)}
                className="w-full p-3 border rounded-lg mb-2"
              >
                <option value="investment">投資詐騙</option>
                <option value="onlineShopping">網路購物詐騙</option>
                <option value="impersonation">假冒身分詐騙</option>
                <option value="lottery">中獎詐騙</option>
                <option value="loan">貸款詐騙</option>
              </select>
              <button
                onClick={() => {
                  if (newKeyword.trim()) {
                    setNewKeyword('');
                    alert('新關鍵字已添加！');
                  }
                }}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={20} />
                新增關鍵字
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(fraudKeywords).map(([category, keywords]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    {({
                      investment: '投資詐騙',
                      onlineShopping: '網路購物詐騙',
                      impersonation: '假冒身分詐騙',
                      lottery: '中獎詐騙',
                      loan: '貸款詐騙'
                    })[category]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'feedback' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">意見反饋</h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              rows="4"
              placeholder="請提供您的反饋..."
            />
            <button
              onClick={submitFeedback}
              className="flex items-center justify-center gap-2 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Send size={20} />
              提交反饋
            </button>
            {feedbackResult && (
              <p className={`mt-4 ${feedbackResult.includes('感謝') ? 'text-green-600' : 'text-red-600'}`}>
                {feedbackResult}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudDetectionSystem;