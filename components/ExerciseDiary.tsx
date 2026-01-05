
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Activity, CheckCircle2, Trophy, Play } from 'lucide-react';

const QUESTIONS = [
  { id: 'done', label: '1. 今日是否有完成所有運動？', options: ['是，全部完成', '部分完成', '今日未運動'] },
  { id: 'time', label: '2. 今日運動時間', options: ['未運動', '15分鐘以下', '15-30分鐘', '30-60分鐘', '60分鐘以上'] },
  { id: 'strength', label: '3. 運動強度感受', options: ['輕度（微喘）', '中度（明顯喘但可交談）', '高度（很喘難以交談）'] },
  { id: 'feeling', label: '4. 運動後身體感受', options: ['感覺很好、精神充沛', '稍微疲累但舒適', '非常疲累', '身體不適或疼痛'] }
];

interface ExerciseDiaryProps {
  onBack: () => void;
}

const ExerciseDiary: React.FC<ExerciseDiaryProps> = ({ onBack }) => {
  const [plan, setPlan] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('current_exercise_plan');
    if (savedPlan) setPlan(JSON.parse(savedPlan));
  }, []);

  const handleSave = () => {
    if (Object.keys(answers).length < 4) {
      alert('請完成問卷再存儲喔！');
      return;
    }
    setSaved(true);
    setTimeout(() => onBack(), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <button onClick={onBack} className="flex items-center text-emerald-600 font-bold mb-8"><ArrowLeft className="mr-2 w-5 h-5" /> 返回主選單</button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">🏃 運動日記</h2>
            <p className="opacity-80">執行計畫並紀錄身體回饋</p>
          </div>
          <Activity className="w-10 h-10 opacity-30" />
        </div>

        <div className="p-8 space-y-8">
          {saved ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">運動紀錄已提交！</h3>
              <p className="text-slate-500 mt-2">您的努力正一步步改善您的健康。</p>
            </div>
          ) : !started ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-900 mb-4">📋 今日運動清單</h3>
                {plan.length > 0 ? (
                  <ul className="space-y-2">
                    {plan.map((ex, i) => (
                      <li key={i} className="flex items-center text-emerald-700 bg-white p-3 rounded-xl border border-emerald-100">
                        <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs mr-3">{i+1}</div>
                        {ex}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-emerald-600 opacity-60 italic text-center">尚未設定運動計畫，請聯繫物理治療師。</p>
                )}
              </div>
              <button 
                onClick={() => setStarted(true)}
                disabled={plan.length === 0}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center text-xl disabled:opacity-50"
              >
                <Play className="w-6 h-6 mr-3 fill-current" /> 開始運動
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm font-bold border border-yellow-200 text-center">
                運動辛苦了！請根據剛才的感受填寫問卷：
              </div>
              {QUESTIONS.map(q => (
                <div key={q.id} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">{q.label}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setAnswers({...answers, [q.id]: opt})}
                        className={`text-left px-5 py-4 rounded-2xl border-2 transition-all ${answers[q.id] === opt ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200"
              >
                儲存運動日記
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDiary;
