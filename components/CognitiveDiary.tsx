
import React, { useState } from 'react';
import { ArrowLeft, Book, Save, CheckCircle2 } from 'lucide-react';

const QUESTIONS = [
  { id: 'reading', label: '1. 平均每天閱讀的時間', icon: '📚' },
  { id: 'writing', label: '2. 平均每天書寫的時間', icon: '✍️' },
  { id: 'static', label: '3. 平均每天進行靜態活動的時間', icon: '🧘' },
  { id: 'dynamic', label: '4. 平均每天進行動態活動的時間', icon: '🏃' },
  { id: 'video', label: '5. 平均每天觀看影片的時間', icon: '📺' },
  { id: 'multimedia', label: '6. 平均每天使用多媒體的時間', icon: '💻' }
];

const OPTIONS = ['半小時以下', '半小時到一小時', '一小時到兩小時', '兩小時以上'];

interface CognitiveDiaryProps {
  onBack: () => void;
}

const CognitiveDiary: React.FC<CognitiveDiaryProps> = ({ onBack }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (Object.keys(answers).length < 6) {
      alert('請完成所有問題再儲存喔！');
      return;
    }
    setSaved(true);
    setTimeout(() => onBack(), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <button onClick={onBack} className="flex items-center text-indigo-600 font-bold mb-8"><ArrowLeft className="mr-2 w-5 h-5" /> 返回主選單</button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">📖 認知日記</h2>
            <p className="opacity-80">紀錄今日的大腦活躍狀態</p>
          </div>
          <Book className="w-10 h-10 opacity-30" />
        </div>

        <div className="p-8 space-y-10">
          {saved ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">今日紀錄完成！</h3>
              <p className="text-slate-500 mt-2">太棒了，持續紀錄有助於觀察健康變化。</p>
            </div>
          ) : (
            <>
              {QUESTIONS.map(q => (
                <div key={q.id} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">{q.icon} {q.label}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setAnswers({...answers, [q.id]: opt})}
                        className={`text-left px-5 py-3 rounded-2xl border-2 transition-all ${answers[q.id] === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200"
              >
                儲存認知日記
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CognitiveDiary;
