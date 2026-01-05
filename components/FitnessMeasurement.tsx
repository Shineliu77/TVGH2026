
import React, { useState } from 'react';
import { ArrowLeft, Mic, Trophy, AlertCircle, Info, Activity, User, Ruler, Zap, ClipboardCheck, Table, Loader2, Sparkles } from 'lucide-react';
import { FitnessData, AppView } from '../types';
import { generateHealthAdvice } from '../services/geminiService';

interface FitnessMeasurementProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

// 與 ExercisePlan 資料庫完全一致的 44 項運動名稱
const ALL_44_EXERCISES = [
  // 上肢 (6)
  '肩關節屈曲運動', '肩關節外展運動', '肘關節屈曲運動', '前臂旋前旋後', '手肘伸直抓握', '手部抓握',
  // 呼吸 (10)
  '吐氣運動', '腹式深呼吸', '圓唇吐氣', '擴胸運動', '雙手後伸', '身體側彎', '身體前彎後仰', '斜向舉手', '胸廓深呼吸', '挺胸夾背',
  // 下肢 (28)
  '腳踝幫浦運動', '腿伸直向上抬高運動', '仰躺髖關節外展運動', '膝關節最後伸直運動', '翻身運動', '仰躺屈膝抬臀運動', '膝蓋開合運動', '坐立髖關節屈曲運動', '坐立膝關節伸直運動', '坐到站', '站立髖關節外展運動', '站立髖關節伸直運動', '半蹲姿運動', '踏步運動', '雙腳墊腳尖運動', '單腳站', '被動關節活動機器', '壓腿運動', '腳跟滑水', '大腿側抬運動', '坐姿膝蓋彎曲運動', '雙膝夾球運動', '夾屁股運動', '靠牆蹲坐', '趴姿膝關節彎曲運動', '直膝抬臀運動', '趴姿後踢腿', '弓步深蹲'
];

const FitnessMeasurement: React.FC<FitnessMeasurementProps> = ({ onBack, onNavigate }) => {
  const [data, setData] = useState<FitnessData>({
    age: 0, gender: '', waist: 0, hip: 0, arm: 0, calf: 0,
    sitStandTime: 0, gripStrength: 0, walkSpeed: 0, sppbScore: 0, totalActivity: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');

  const calculateGrade = () => {
    const isGripLow = data.gender === 'M' ? data.gripStrength < 28 : data.gripStrength < 18;
    const isSitStandSlow = data.sitStandTime > 12;
    const isSppbLow = data.sppbScore < 8;

    if (isGripLow && isSitStandSlow && isSppbLow) {
      return { 
        grade: 'A級', 
        desc: '全面弱化', 
        coreMissing: '全身性肌肉、功能與平衡皆不足。',
        color: 'text-red-600', 
        bg: 'bg-red-50' 
      };
    }
    if (isGripLow && !isSitStandSlow && !isSppbLow) {
      return { 
        grade: 'B級', 
        desc: '上肢弱，下肢佳', 
        coreMissing: '上肢與握力為主要弱點。',
        color: 'text-orange-600', 
        bg: 'bg-orange-50' 
      };
    }
    if (!isGripLow && isSitStandSlow && !isSppbLow) {
      return { 
        grade: 'C級', 
        desc: '下肢弱，上肢佳', 
        coreMissing: '下肢功能性肌力與爆發力不足。',
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50' 
      };
    }
    if (!isGripLow && !isSitStandSlow && isSppbLow) {
      return { 
        grade: 'D級', 
        desc: '力量足，平衡差', 
        coreMissing: '平衡與動態穩定性為主要問題。',
        color: 'text-blue-600', 
        bg: 'bg-blue-50' 
      };
    }
    return { 
      grade: '優良', 
      desc: '體能狀況良好', 
      coreMissing: '各項功能均在標準範圍內。',
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    };
  };

  const result = calculateGrade();

  const handleGenerateReport = async () => {
    setShowResult(true);
    setIsGeneratingAdvice(true);
    try {
      const prompt = `病患資料：年齡${data.age}歲，性別${data.gender === 'M' ? '男' : '女'}。體適能數據：五次坐站${data.sitStandTime}秒，握力${data.gripStrength}kg，SPPB分數${data.sppbScore}。分級結果：${result.grade} (${result.desc})。核心功能缺失：${result.coreMissing}。請針對此分級，給予物理治療師專業的運動處方建議與適合病患的居家運動。建議請簡短。`;
      const advice = await generateHealthAdvice(prompt);
      setAiAdvice(advice || '無法產生建議，請手動評估。');
    } catch (e) {
      setAiAdvice('AI 建議產生失敗，請檢查網路連線。');
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  const handleSaveAndConfirm = () => {
    localStorage.setItem('fitness_measurement_data', JSON.stringify(data));
    localStorage.setItem('fitness_ai_advice', aiAdvice);
    
    // 根據分級自動勾選運動 (模擬 AI 推薦)
    let recommendedNames: string[] = [];
    if (result.grade === 'A級') {
        recommendedNames = ['吐氣運動', '腹式深呼吸', '斜向舉手', '膝蓋開合運動', '大腿前側拉伸', '貓牛式伸展']; 
        // 修正為資料庫中有的名稱
        recommendedNames = ['吐氣運動', '腹式深呼吸', '斜向舉手', '膝蓋開合運動', '腳踝幫浦運動', '翻身運動'];
    } else if (result.grade === 'B級') {
        recommendedNames = ['肩關節屈曲運動', '肘關節屈曲運動', '手肘伸直抓握', '手部抓握', '手腕屈曲伸展'];
        recommendedNames = ['肩關節屈曲運動', '肘關節屈曲運動', '手肘伸直抓握', '手部抓握', '前臂旋前旋後'];
    } else if (result.grade === 'C級') {
        recommendedNames = ['斜向舉手', '坐到站', '直膝抬臀運動', '靠牆蹲坐', '登階運動', '深蹲基礎訓練'];
        recommendedNames = ['斜向舉手', '坐到站', '直膝抬臀運動', '靠牆蹲坐', '半蹲姿運動', '踏步運動'];
    } else if (result.grade === 'D級') {
        recommendedNames = ['單腳站立平衡', '踏步運動', '超人式核心訓練', '交叉踏步訓練', '側向走步運動'];
        recommendedNames = ['單腳站', '踏步運動', '直膝抬臀運動', '仰躺屈膝抬臀運動', '膝蓋開合運動'];
    } else {
        recommendedNames = ['半蹲姿運動', '踏步運動', '弓步深蹲'];
    }

    localStorage.setItem('current_exercise_plan', JSON.stringify(recommendedNames));
    alert(`資料已存檔！根據分級 ${result.grade}，系統已自動為病患配置推薦運動。`);
    onNavigate(AppView.EXERCISE_PLAN);
  };

  const InputField = ({ label, icon: Icon, value, onChange, type = "number", suffix = "", options = [] }: any) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center">
        {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 opacity-60" />}
        {label}
      </label>
      <div className="relative group">
        {type === 'select' ? (
          <select 
            className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none text-slate-700 font-bold"
            value={value}
            onChange={e => onChange(e.target.value)}
          >
            <option value="">請選擇</option>
            {options.map((opt: any) => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
          </select>
        ) : (
          <input 
            type={type}
            value={value === 0 ? "" : value}
            placeholder={`輸入${label}`}
            className="w-full px-4 py-4 pr-14 rounded-2xl border-2 border-slate-100 bg-white focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700 font-bold placeholder:font-normal placeholder:opacity-30"
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
          />
        )}
        {suffix && <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase pointer-events-none">{suffix}</span>}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 pointer-events-none">
          <Mic className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ title, icon: Icon }: any) => (
    <div className="flex items-center space-x-3 mb-6 pt-2 first:pt-0 border-b border-slate-50 pb-4">
      <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <button onClick={onBack} className="flex items-center text-blue-600 font-bold mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft className="mr-2 w-5 h-5" /> 返回管理首頁
      </button>
      
      <div className="glass-card rounded-[3rem] overflow-hidden border-white">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 text-white">體適能評估測量</h2>
            <p className="opacity-80 text-sm font-medium">數位化精準評估・ABCD 功能分級系統</p>
          </div>
          <ClipboardCheck className="w-20 h-20 absolute -right-4 -bottom-4 opacity-10 text-white" />
        </div>

        <div className="p-10 space-y-12 bg-white/60">
          <section>
            <SectionHeader title="基本資料" icon={User} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="病患年齡" value={data.age} onChange={(val:any) => setData({...data, age: val})} suffix="Years" />
              <InputField label="性別" type="select" options={[{v:'M', l:'男性'}, {v:'F', l:'女性'}]} value={data.gender} onChange={(val:any) => setData({...data, gender: val})} />
            </div>
          </section>

          <section>
            <SectionHeader title="身體測量 (公分)" icon={Ruler} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <InputField label="腰圍" value={data.waist} onChange={(val:any) => setData({...data, waist: val})} suffix="cm" />
              <InputField label="臀圍" value={data.hip} onChange={(val:any) => setData({...data, hip: val})} suffix="cm" />
              <InputField label="手臂圍" value={data.arm} onChange={(val:any) => setData({...data, arm: val})} suffix="cm" />
              <InputField label="小腿圍" value={data.calf} onChange={(val:any) => setData({...data, calf: val})} suffix="cm" />
            </div>
          </section>

          <section>
            <SectionHeader title="功能測量" icon={Zap} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="五次坐站時間" value={data.sitStandTime} onChange={(val:any) => setData({...data, sitStandTime: val})} suffix="Seconds" />
              <InputField label="握力測量" value={data.gripStrength} onChange={(val:any) => setData({...data, gripStrength: val})} suffix="kg" />
              <InputField label="行走速度" value={data.walkSpeed} onChange={(val:any) => setData({...data, walkSpeed: val})} suffix="m/s" />
              <InputField label="SPPB 總分" value={data.sppbScore} onChange={(val:any) => setData({...data, sppbScore: val})} suffix="Score" />
            </div>
          </section>

          <section>
            <SectionHeader title="日常活動量" icon={Activity} />
            <InputField label="本週總活動量 (估算)" value={data.totalActivity} onChange={(val:any) => setData({...data, totalActivity: val})} suffix="MET-min" />
          </section>

          <button 
            onClick={handleGenerateReport}
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-bold shadow-xl shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-[0.98] text-xl"
          >
            產生評估報告
          </button>
        </div>
      </div>

      {showResult && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-100/60 backdrop-blur-xl overflow-y-auto">
          <div className="glass-card rounded-[3rem] p-10 w-full max-w-3xl shadow-2xl border-white animate-in zoom-in duration-300 my-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center p-5 bg-blue-50 rounded-3xl border border-blue-100 shadow-inner">
                <Trophy className="w-12 h-12 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">體適能分級報告</h3>
                <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-widest">Diagnostic Report v5.0</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] text-left border border-slate-200 overflow-hidden">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center px-2"><Info className="w-4 h-4 mr-2" /> 體適能分級標準對照表</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-[11px] border-collapse bg-white">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600">
                                <th className="p-3 border border-slate-200 text-left">分級</th>
                                <th className="p-3 border border-slate-200 text-left">判斷標準</th>
                                <th className="p-3 border border-slate-200 text-left">分型描述</th>
                                <th className="p-3 border border-slate-200 text-left">核心缺失</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-3 border border-slate-100 font-bold text-red-600 bg-red-50/30">A級</td>
                                <td className="p-3 border border-slate-100 text-slate-600">握力低、起站&gt;12s、SPPB&lt;8</td>
                                <td className="p-3 border border-slate-100 font-medium text-slate-700">全面弱化</td>
                                <td className="p-3 border border-slate-100 text-slate-500">全身肌力、平衡皆不足</td>
                            </tr>
                            <tr>
                                <td className="p-3 border border-slate-100 font-bold text-orange-600 bg-orange-50/30">B級</td>
                                <td className="p-3 border border-slate-100 text-slate-600">握力低、起站&lt;12s、SPPB&gt;8</td>
                                <td className="p-3 border border-slate-100 font-medium text-slate-700">上肢弱下肢佳</td>
                                <td className="p-3 border border-slate-100 text-slate-500">上肢握力為主要弱點</td>
                            </tr>
                            <tr>
                                <td className="p-3 border border-slate-100 font-bold text-yellow-600 bg-yellow-50/30">C級</td>
                                <td className="p-3 border border-slate-100 text-slate-600">握力佳、起站&gt;12s、SPPB&gt;8</td>
                                <td className="p-3 border border-slate-100 font-medium text-slate-700">下肢弱上肢佳</td>
                                <td className="p-3 border border-slate-100 text-slate-500">下肢肌力爆發力不足</td>
                            </tr>
                            <tr>
                                <td className="p-3 border border-slate-100 font-bold text-blue-600 bg-blue-50/30">D級</td>
                                <td className="p-3 border border-slate-100 text-slate-600">握力高、起站&lt;12s、SPPB&lt;8</td>
                                <td className="p-3 border border-slate-100 font-medium text-slate-700">力量足平衡差</td>
                                <td className="p-3 border border-slate-100 text-slate-500">平衡穩定性為主要問題</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-left">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                  <Table className="w-4 h-4 mr-2 text-blue-500" /> 量測摘要
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500">性別</span> <span className="font-bold">{data.gender === 'M' ? '男' : '女'}</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500">五次坐站</span> <span className="font-bold">{data.sitStandTime}s</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500">握力</span> <span className="font-bold">{data.gripStrength}kg</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500">SPPB</span> <span className="font-bold">{data.sppbScore}分</span></div>
                </div>
              </div>
              
              <div className={`p-8 rounded-[2.5rem] ${result.bg} border-2 border-white shadow-xl`}>
                <div className={`text-6xl font-black mb-2 ${result.color} tracking-tighter`}>{result.grade}</div>
                <div className={`text-xl font-bold ${result.color} mb-1`}>{result.desc}</div>
                <div className="text-xs opacity-70 font-medium">{result.coreMissing}</div>
              </div>

              <div className="bg-white/50 p-6 rounded-[2rem] text-left border border-slate-100 shadow-inner">
                <p className="text-sm font-bold text-slate-700 mb-3 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-blue-500" /> AI 教練建議：</p>
                {isGeneratingAdvice ? (
                  <div className="flex items-center space-x-2 text-slate-400 py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">正在產生建議...</span>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 leading-relaxed max-h-40 overflow-y-auto pr-2 italic">
                    {aiAdvice}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-4 mt-10">
              <button onClick={() => setShowResult(false)} className="flex-1 py-5 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all uppercase text-xs">修正</button>
              <button onClick={handleSaveAndConfirm} disabled={isGeneratingAdvice} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all uppercase text-xs disabled:opacity-50">確認存檔並發布處方</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessMeasurement;
