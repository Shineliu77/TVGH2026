import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Brain, Activity, CheckCircle2, Trophy, Play, 
  BookOpen, ChevronRight, Save, ClipboardList, Calendar as CalendarIcon, 
  BarChart3, Info, TrendingUp, Clock, Zap, ChevronLeft, CalendarDays, PieChart, PlusCircle, Edit3, RotateCcw
} from 'lucide-react';

const EXERCISE_DATABASE = [
  { category: '上肢運動', name: '肩關節屈曲運動', description: '坐姿下雙手上舉約170到180度，並保持身體挺直。', target: '訓練肩部前側肌肉' },
  { category: '上肢運動', name: '肩關節外展運動', description: '坐姿下雙手自身側向外打開170到180度，掌心朝上。', target: '訓練肩部外側肌群' },
  { category: '上肢運動', name: '肘關節屈曲運動', description: '保持手肘貼在身側，彎曲90度，做雙手向上彎曲。', target: '訓練肱二頭肌' },
  { category: '上肢運動', name: '前臂旋前旋後', description: '保持雙手平舉向前伸直，做手掌正反面翻掌動作。', target: '訓練旋前肌、旋後肌' },
  { category: '上肢運動', name: '手肘伸直抓握', description: '保持雙手平舉90度向前伸直，做手指握拳及放開。', target: '訓練肱肌群' },
  { category: '上肢運動', name: '手部抓握', description: '保持手肘貼在身側，彎曲90度，做手指握拳及放開。', target: '訓練末端循環' },
  { category: '呼吸運動', name: '吐氣運動', description: '鼻子吸氣，肩膀放鬆。吐氣時，嘴巴以吹氣方式緩緩將氣吹出。', target: '訓練平穩呼吸' },
  { category: '呼吸運動', name: '腹式深呼吸', description: '吸氣時胸腹部鼓起，吐氣時嘴巴噘起緩緩吹氣。', target: '訓練肺部擴張' },
  { category: '呼吸運動', name: '圓唇吐氣', description: '將嘴巴噘起，以吹氣方式緩緩將氣吹出，約4-5秒。', target: '減少二氧化碳滯留' },
  { category: '呼吸運動', name: '擴胸運動', description: '手肘彎曲，將手臂向兩側打開，同時深呼吸挺胸。', target: '訓練闊背肌' },
  { category: '下肢運動', name: '腳踝幫浦運動', description: '仰躺，腳踝同時往上勾和往下踩。', target: '訓練末端循環' },
  { category: '下肢運動', name: '腿伸直向上抬高運動', description: '仰躺膝蓋伸直，將腳向上抬起至30到45度維持3秒。', target: '訓練股四頭肌' },
  { category: '下肢運動', name: '坐到站', description: '坐於椅子前緣，將重心向前移，再將身體站直。', target: '訓練轉位能力' },
  { category: '下肢運動', name: '踏步運動', description: '手扶椅子將膝蓋輪流抬起約60-80度。', target: '訓練核心與下肢' },
  { category: '下肢運動', name: '單腳站', description: '手扶椅子將單腳腳抬高約九十度，維持3秒。', target: '訓練平衡' }
];

const COGNITIVE_QUESTIONS = [
  { id: 'reading', label: '1. 平均每天閱讀的時間', icon: '📚' },
  { id: 'writing', label: '2. 平均每天書寫的時間', icon: '✍️' },
  { id: 'static', label: '3. 平均每天進行靜態活動的時間', icon: '🧘' },
  { id: 'dynamic', label: '4. 平均每天進行動態活動的時間', icon: '🏃' },
  { id: 'video', label: '5. 平均每天觀看影片的時間', icon: '📺' },
  { id: 'multimedia', label: '6. 平均每天使用多媒體的時間', icon: '💻' }
];

const EXERCISE_SURVEY_QUESTIONS = [
  { id: 'done', label: '1. 今日是否有完成所有運動？', options: ['是，全部完成', '部分完成', '今日未運動'] },
  { id: 'time', label: '2. 今日運動時間', options: ['未運動', '15分鐘以下', '15-30分鐘', '30-60分鐘', '60分鐘以上'] },
  { id: 'strength', label: '3. 運動強度感受', options: ['輕度（微喘）', '中度（明顯喘但可交談）', '高度（很喘難以交談）'] },
  { id: 'feeling', label: '4. 運動後身體感受', options: ['感覺很好、精神充沛', '稍微疲累但舒適', '非常疲累', '身體不適或疼痛'] }
];

const OPTIONS = ['半小時以下', '半小時到一小時', '一小時到兩小時', '兩小時以上'];
const COG_LEVEL_MAP: Record<string, number> = { '半小時以下': 1, '半小時到一小時': 2, '一小時到兩小時': 3, '兩小時以上': 4 };

const CHART_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface CombinedDiaryProps {
  onBack: () => void;
}

const CombinedDiary: React.FC<CombinedDiaryProps> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<'mission' | 'form' | 'calendar' | 'charts' | 'detail'>('mission');
  const [cogAnswers, setCogAnswers] = useState<Record<string, string>>({});
  const [exAnswers, setExAnswers] = useState<Record<string, string>>({});
  const [exercisePlanDetailed, setExercisePlanDetailed] = useState<any[]>([]);
  const [dailyTotalSets, setDailyTotalSets] = useState('3');
  const [diaryHistory, setDiaryHistory] = useState<Record<string, any>>({});
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<any>(null);
  
  const todayStr = useMemo(() => new Date().toLocaleDateString('en-CA'), []);
  const [targetDateStr, setTargetDateStr] = useState<string>(todayStr);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const isTargetDateSaved = !!diaryHistory[targetDateStr];

  useEffect(() => {
    const savedFinal = localStorage.getItem('current_exercise_plan_detailed');
    const savedSets = localStorage.getItem('daily_total_sets');
    
    if (savedFinal) setExercisePlanDetailed(JSON.parse(savedFinal));
    if (savedSets) setDailyTotalSets(savedSets);

    refreshHistory();
  }, []);

  const refreshHistory = () => {
    const history: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('diary_')) {
        const dateStr = key.replace('diary_', '');
        try {
          history[dateStr] = JSON.parse(localStorage.getItem(key)!);
        } catch (e) {}
      }
    }
    setDiaryHistory(history);
  };

  const handleSaveAll = () => {
    if (Object.keys(cogAnswers).length < 6 || Object.keys(exAnswers).length < 4) {
      alert('請完成所有問卷內容再儲存喔！');
      return;
    }

    const diaryEntry = {
      cognitive: cogAnswers,
      exercise: exAnswers,
      date: new Date().toISOString()
    };
    localStorage.setItem(`diary_${targetDateStr}`, JSON.stringify(diaryEntry));
    refreshHistory();
    
    // 保存後保持在 mission view 會因為 isTargetDateSaved 變為 true 而顯示 Trophy 畫面
    setViewMode('mission');
  };

  const handleDayClick = (dateStr: string) => {
    setTargetDateStr(dateStr); // 先切換目標日期
    const entry = diaryHistory[dateStr];
    if (entry) {
      setSelectedHistoryEntry({ ...entry, dateStr });
      setViewMode('detail');
    } else {
      // 點擊空白日期：先進入該日期的「任務清單（Mission）」要求先做運動
      setViewMode('mission');
    }
  };

  const handleEditRecord = () => {
    if (!selectedHistoryEntry) return;
    setTargetDateStr(selectedHistoryEntry.dateStr);
    setCogAnswers(selectedHistoryEntry.cognitive || {});
    setExAnswers(selectedHistoryEntry.exercise || {});
    setViewMode('form');
  };

  const DonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    if (total === 0) return <div className="text-[10px] text-slate-300 italic py-4 text-center">尚無數據</div>;

    let accumulatedPercentage = 0;
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-6">
          <svg viewBox="0 0 32 32" className="w-20 h-20 transform -rotate-90">
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -accumulatedPercentage;
              accumulatedPercentage += percentage;
              return (
                <circle
                  key={idx}
                  r="16"
                  cx="16"
                  cy="16"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  pathLength="100"
                />
              );
            })}
            <circle r="8" cx="16" cy="16" fill="white" />
          </svg>
          <div className="flex-1 space-y-1.5 overflow-hidden">
            {data.filter(d => d.value > 0).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[9px]">
                <div className="flex items-center min-w-0">
                  <div className="w-2 h-2 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-500 truncate">{item.label}</span>
                </div>
                <span className="font-bold text-slate-700 ml-2">{Math.round((item.value / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ProgressCharts = () => {
    const [range, setRange] = useState<'week' | 'month' | 'year'>('week');

    const chartData = useMemo(() => {
      if (range === 'year') {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 12 }, (_, i) => {
          const monthStr = (i + 1).toString().padStart(2, '0');
          const monthKey = `${currentYear}-${monthStr}`;
          const monthEntries = Object.keys(diaryHistory).filter(k => k.startsWith(monthKey));
          let avgCog = 0;
          let doneRate = 0;
          if (monthEntries.length > 0) {
            avgCog = monthEntries.reduce((acc: number, k) => {
              const cogData = (diaryHistory[k].cognitive as Record<string, string>) || {};
              const cogSum = Object.values(cogData).reduce((a: number, v: string) => a + (COG_LEVEL_MAP[v] || 0), 0);
              return acc + (cogSum / 6);
            }, 0) / monthEntries.length;
            doneRate = (monthEntries.filter(k => diaryHistory[k].exercise?.done === '是，全部完成').length / monthEntries.length) * 100;
          }
          return { label: `${i + 1}月`, cogHeight: (avgCog / 4) * 100, exHeight: doneRate };
        });
      } else {
        const count = range === 'week' ? 7 : 30;
        return Array.from({ length: count }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (count - 1 - i));
          const dateStr = d.toLocaleDateString('en-CA');
          const record = diaryHistory[dateStr];
          let avgCog = 0;
          if (record && record.cognitive) {
             avgCog = Object.values(record.cognitive as Record<string, string>).reduce((acc: number, val: string) => acc + (COG_LEVEL_MAP[val] || 0), 0) / 6;
          }
          const done = record?.exercise?.done === '是，全部完成';
          const part = record?.exercise?.done === '部分完成';
          return {
            label: d.getDate().toString(),
            cogHeight: (avgCog / 4) * 100,
            exHeight: done ? 100 : (part ? 50 : 0)
          };
        });
      }
    }, [range, diaryHistory]);

    const statsData = useMemo(() => {
      const dayLimit = range === 'week' ? 7 : (range === 'month' ? 30 : 365);
      const relevantDates = Object.keys(diaryHistory).filter(date => {
        const d = new Date(date);
        const diff = (Date.now() - d.getTime()) / (1000 * 3600 * 24);
        return diff <= dayLimit;
      });

      const getDistribution = (type: 'cognitive' | 'exercise', qId: string, options: string[]) => {
        const counts: Record<string, number> = {};
        options.forEach(opt => counts[opt] = 0);
        relevantDates.forEach(date => {
          const val = diaryHistory[date][type]?.[qId];
          if (val && counts[val] !== undefined) counts[val]++;
        });
        return options.map((opt, i) => ({ label: opt, value: counts[opt], color: CHART_COLORS[i % CHART_COLORS.length] }));
      };

      return {
        cognitive: COGNITIVE_QUESTIONS.map(q => ({ ...q, dist: getDistribution('cognitive', q.id, OPTIONS) })),
        exercise: EXERCISE_SURVEY_QUESTIONS.map(q => ({ ...q, dist: getDistribution('exercise', q.id, q.options) }))
      };
    }, [range, diaryHistory]);

    return (
      <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/50 p-6 rounded-[2rem] border border-white gap-4">
          <h3 className="text-2xl font-black text-slate-800 flex items-center">
            <TrendingUp className="w-7 h-7 mr-3 text-purple-500" /> 趨勢分析
          </h3>
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-100">
            {(['week', 'month', 'year'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${range === r ? 'bg-white text-purple-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {r === 'week' ? '週' : (r === 'month' ? '月' : '年')}
              </button>
            ))}
          </div>
          <button onClick={() => setViewMode('mission')} className="text-slate-400 font-bold hover:text-slate-600 px-6 py-2 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95">返回</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[3rem] border-white shadow-2xl">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-cyan-500" /> 腦力活動趨勢
            </h4>
            <div className="flex items-end justify-between h-48 px-2 space-x-1">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full">
                  <div className="w-full bg-slate-100/50 rounded-full h-full relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000" style={{ height: `${data.cogHeight}%` }}></div>
                  </div>
                  <span className="text-[8px] font-black text-slate-300 mt-2">{data.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border-white shadow-2xl">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-emerald-500" /> 運動達成率趨勢
            </h4>
            <div className="flex items-end justify-between h-48 px-2 space-x-1">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full">
                  <div className="w-full bg-slate-100/50 rounded-full h-full relative overflow-hidden">
                    <div className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ${data.exHeight >= 80 ? 'bg-emerald-500' : (data.exHeight > 0 ? 'bg-amber-400' : 'bg-transparent')}`} style={{ height: `${data.exHeight}%` }}></div>
                  </div>
                  <span className="text-[8px] font-black text-slate-300 mt-2">{data.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center space-x-3 px-2">
            <PieChart className="w-6 h-6 text-indigo-500" />
            <h4 className="text-xl font-black text-slate-800">各項指標分佈統計</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {statsData.cognitive.map(q => (
               <div key={q.id} className="glass-card p-6 rounded-[2rem] border-white shadow-lg bg-white/80">
                 <h5 className="text-[10px] font-black text-slate-500 mb-4 truncate uppercase tracking-widest">{q.label}</h5>
                 <DonutChart data={q.dist} />
               </div>
             ))}
             {statsData.exercise.map(q => (
               <div key={q.id} className="glass-card p-6 rounded-[2rem] border-emerald-50 shadow-lg bg-emerald-50/20">
                 <h5 className="text-[10px] font-black text-emerald-700/60 mb-4 truncate uppercase tracking-widest">{q.label}</h5>
                 <DonutChart data={q.dist} />
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  };

  const DetailView = () => {
    if (!selectedHistoryEntry) return null;
    return (
      <div className="space-y-10 animate-in zoom-in duration-500 pb-10">
        <div className="flex justify-between items-center bg-white/50 p-6 rounded-[2rem] border border-white">
          <h3 className="text-2xl font-black text-slate-800 flex items-center">
            <CalendarDays className="w-7 h-7 mr-3 text-emerald-500" /> {selectedHistoryEntry.dateStr} 歷史紀錄
          </h3>
          <div className="flex space-x-3">
            <button onClick={handleEditRecord} className="flex items-center space-x-2 bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all">
              <Edit3 className="w-4 h-4" /> <span>重新填寫</span>
            </button>
            <button onClick={() => setViewMode('calendar')} className="text-slate-400 font-bold hover:text-slate-600 px-6 py-2 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95">返回日曆</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[3rem] border-white shadow-xl">
            <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center"><Brain className="w-5 h-5 mr-3 text-cyan-500" /> 認知活動回顧</h4>
            <div className="space-y-4">
              {COGNITIVE_QUESTIONS.map(q => (
                <div key={q.id} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-600">{q.label.split('.')[1]}</span>
                  <span className="text-sm font-black text-cyan-600 bg-white px-3 py-1 rounded-lg shadow-sm">{selectedHistoryEntry.cognitive?.[q.id] || '無數據'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border-white shadow-xl">
            <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center"><Activity className="w-5 h-5 mr-3 text-emerald-500" /> 運動表現回顧</h4>
            <div className="space-y-4">
              {EXERCISE_SURVEY_QUESTIONS.map(q => (
                <div key={q.id} className="flex flex-col space-y-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{q.label}</span>
                  <span className="text-sm font-black text-emerald-600">{selectedHistoryEntry.exercise?.[q.id] || '無數據'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DiaryCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex justify-between items-center bg-white/50 p-6 rounded-[2rem] border border-white">
          <div className="flex items-center space-x-4">
            <button onClick={prevMonth} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
            <h3 className="text-2xl font-black text-slate-800 flex items-center">
              <CalendarIcon className="w-7 h-7 mr-3 text-blue-500" /> {year}年 {month + 1}月
            </h3>
            <button onClick={nextMonth} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
          </div>
          <button onClick={() => { setTargetDateStr(todayStr); setViewMode('mission'); }} className="text-slate-400 font-bold hover:text-slate-600 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-95">關閉</button>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="text-center text-xs font-black text-slate-400 py-2 uppercase tracking-widest">{d}</div>
          ))}
          {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map(d => {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const hasRecord = !!diaryHistory[dateStr];
            const isToday = dateStr === todayStr;
            const isCurrentTarget = dateStr === targetDateStr;
            return (
              <button 
                key={d} 
                onClick={() => handleDayClick(dateStr)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all group relative overflow-hidden
                  ${hasRecord ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95' : 'bg-white border-slate-50 text-slate-300 cursor-pointer hover:border-blue-200'}
                  ${isToday ? 'border-blue-300' : ''}
                  ${isCurrentTarget && !hasRecord ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              >
                <span className={`text-sm font-black ${isToday ? 'underline decoration-2' : ''}`}>{d}</span>
                {hasRecord ? (
                  <CheckCircle2 className="w-3 h-3 mt-1 opacity-70" />
                ) : (
                  <PlusCircle className="w-3 h-3 mt-1 opacity-20 group-hover:opacity-100 text-blue-500" />
                )}
              </button>
            );
          })}
        </div>
        <div className="p-4 bg-blue-50/50 rounded-2xl text-[10px] text-blue-600 font-bold text-center">
          💡 點擊日期可「查看紀錄」或「進入補填模式」。藍框標示為今日。
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center text-cyan-600 font-bold hover:-translate-x-1 transition-transform">
          <ArrowLeft className="mr-2 w-5 h-5" /> 返回主選單
        </button>
        <div className="flex space-x-3">
          <button onClick={() => setViewMode('calendar')} className={`p-3 rounded-2xl shadow-sm border transition-all flex items-center space-x-2 active:scale-95 ${viewMode === 'calendar' ? 'bg-blue-500 text-white border-blue-400' : 'bg-white text-blue-500 border-blue-50 hover:shadow-md'}`}>
            <CalendarIcon className="w-5 h-5" />
            <span className="text-xs font-black">紀錄日曆</span>
          </button>
          <button onClick={() => setViewMode('charts')} className={`p-3 rounded-2xl shadow-sm border transition-all flex items-center space-x-2 active:scale-95 ${viewMode === 'charts' ? 'bg-purple-500 text-white border-purple-400' : 'bg-white text-purple-500 border-purple-50 hover:shadow-md'}`}>
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-black">數據分析</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[3.5rem] overflow-hidden border-white shadow-2xl">
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 p-12 text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl font-black tracking-tighter">認知腦 X 運動腦</h2>
            <p className="opacity-80 text-lg mt-3 font-medium">整合腦力紀錄與物理治療追蹤系統</p>
          </div>
          <div className="flex -space-x-12 opacity-10 absolute -right-4">
            <Brain className="w-48 h-48" />
            <Activity className="w-56 h-56" />
          </div>
        </div>

        {isTargetDateSaved && viewMode === 'mission' ? (
          <div className="p-20 text-center animate-in zoom-in duration-700">
            <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-100 border-4 border-white rotate-3">
              <Trophy className="w-16 h-16" />
            </div>
            <h3 className="text-4xl font-black text-slate-800 mb-4">
              {targetDateStr === todayStr ? '今日紀錄已完成！' : `${targetDateStr} 紀錄已完成！`}
            </h3>
            <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
              您的紀錄已經成功存檔。良好的健康習慣是長壽的基石，期待您明天的表現！
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
               <button onClick={() => setViewMode('charts')} className="px-8 py-4 bg-purple-50 text-purple-600 rounded-2xl font-bold flex items-center hover:bg-purple-100 transition-all active:scale-95">
                 <TrendingUp className="w-5 h-5 mr-2" /> 查看趨勢
               </button>
               <button onClick={() => setViewMode('calendar')} className="px-8 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold flex items-center hover:bg-blue-100 transition-all active:scale-95">
                 <CalendarIcon className="w-5 h-5 mr-2" /> 切換其他日期
               </button>
               <button onClick={onBack} className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all active:scale-95">回到主選單</button>
            </div>
          </div>
        ) : (
          <div className="p-10 bg-white/40 min-h-[500px]">
            {viewMode === 'mission' && (
              <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                {targetDateStr !== todayStr && (
                   <div className="bg-amber-100 p-4 rounded-2xl flex items-center text-amber-700 font-bold shadow-inner">
                     <CalendarIcon className="w-5 h-5 mr-3" />
                     正在補填：{targetDateStr} 的運動任務與日記
                   </div>
                )}

                {exercisePlanDetailed.length > 0 ? (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                      <div className="space-y-2">
                        <span className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">Daily Mission // 今日任務</span>
                        <h3 className="text-4xl font-black text-slate-800">目標：全天 <span className="text-emerald-600 underline underline-offset-8">{dailyTotalSets}</span> 回</h3>
                      </div>
                      <div className="bg-slate-800 text-white p-6 rounded-3xl flex items-center space-x-4 shadow-xl border-4 border-white">
                        <Zap className="w-8 h-8 text-yellow-400 fill-current" />
                        <div>
                          <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Exercise Tasks</p>
                          <p className="text-2xl font-black">{exercisePlanDetailed.length} 項動作</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {exercisePlanDetailed.sort((a,b) => a.order - b.order).map((item, i) => {
                        const dbInfo = EXERCISE_DATABASE.find(ex => ex.name === item.name);
                        return (
                          <div key={i} className="flex flex-col lg:flex-row items-stretch bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all overflow-hidden group">
                            <div className="bg-slate-50 lg:w-20 flex items-center justify-center py-6 lg:py-0 border-b lg:border-b-0 lg:border-r border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <span className="text-3xl font-black">{i + 1}</span>
                            </div>
                            <div className="p-8 flex-1 space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <h4 className="text-2xl font-black text-slate-800">{item.name}</h4>
                                <span className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-2xl text-base font-black border border-emerald-100 flex items-center"><Clock className="w-4 h-4 mr-2" />{item.reps}</span>
                              </div>
                              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-start space-x-3">
                                <Info className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                                <p className="text-sm text-slate-600 font-bold leading-relaxed">{dbInfo?.description || '請依復健師指示動作。'}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col items-center pt-8">
                       <button onClick={() => { setCogAnswers({}); setExAnswers({}); setViewMode('form'); }} className="w-full max-w-xl py-8 bg-emerald-600 text-white rounded-[2.5rem] font-black shadow-2xl shadow-emerald-200 flex items-center justify-center text-3xl group transition-all hover:bg-emerald-700 active:scale-95 border-b-8 border-emerald-800">
                        <Play className="w-10 h-10 mr-4 fill-current group-hover:scale-110 transition-transform" /> 開始執行並填寫
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center">
                    <div className="p-8 bg-white rounded-[2.5rem] shadow-xl mb-8">
                       <ClipboardList className="w-20 h-20 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-black text-2xl mb-4 italic">尚未配置詳細運動處方內容</p>
                    <button onClick={() => { setCogAnswers({}); setExAnswers({}); setViewMode('form'); }} className="mt-10 px-10 py-5 bg-cyan-600 text-white rounded-3xl font-black shadow-xl hover:bg-cyan-700 transition-all active:scale-95">僅填寫認知日記</button>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'form' && (
              <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
                <div className="bg-blue-600 p-6 rounded-[2rem] text-white flex justify-between items-center shadow-lg border-b-4 border-blue-800">
                   <div className="flex items-center space-x-4">
                     <CalendarIcon className="w-6 h-6" />
                     <h3 className="font-black text-xl">
                       {targetDateStr === todayStr ? '填寫今日紀錄' : `補填日期：${targetDateStr}`}
                     </h3>
                   </div>
                   <button onClick={() => setViewMode('mission')} className="bg-white/20 hover:bg-white/40 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2">
                     <RotateCcw className="w-4 h-4" /> <span>返回任務清單</span>
                   </button>
                </div>

                <section className="space-y-12">
                  <div className="flex items-center space-x-5 border-b-4 border-cyan-100 pb-6">
                    <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center shadow-lg"><Brain className="w-8 h-8" /></div>
                    <h3 className="text-2xl font-black text-slate-800">🧠 認知活動紀錄</h3>
                  </div>
                  <div className="space-y-12 px-2">
                    {COGNITIVE_QUESTIONS.map(q => (
                      <div key={q.id} className="space-y-4">
                        <h4 className="text-lg font-black text-slate-700 flex items-center"><span className="mr-3 text-2xl">{q.icon}</span> {q.label}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {OPTIONS.map(opt => (
                            <button key={opt} onClick={() => setCogAnswers({...cogAnswers, [q.id]: opt})} className={`text-center px-4 py-4 rounded-2xl border-2 transition-all font-black text-xs active:scale-95 ${cogAnswers[q.id] === opt ? 'border-cyan-500 bg-cyan-600 text-white shadow-xl scale-105' : 'border-slate-100 bg-white hover:border-cyan-200 text-slate-500'}`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="h-px bg-slate-100 w-full"></div>

                <section className="space-y-12">
                  <div className="flex items-center space-x-5 border-b-4 border-emerald-100 pb-6">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"><Activity className="w-8 h-8" /></div>
                    <h3 className="text-2xl font-black text-slate-800">🏃 運動體感回饋</h3>
                  </div>
                  <div className="space-y-12 px-2">
                    {EXERCISE_SURVEY_QUESTIONS.map(q => (
                      <div key={q.id} className="space-y-5">
                        <h4 className="text-lg font-black text-slate-700">{q.label}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {q.options.map(opt => (
                            <button key={opt} onClick={() => setExAnswers({...exAnswers, [q.id]: opt})} className={`text-left px-8 py-5 rounded-[1.8rem] border-2 transition-all font-black text-sm active:scale-95 ${exAnswers[q.id] === opt ? 'border-emerald-500 bg-emerald-600 text-white shadow-xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-emerald-200 text-slate-500'}`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-10 flex flex-col items-center">
                  <button onClick={handleSaveAll} className="w-full max-w-2xl py-8 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl flex items-center justify-center group hover:scale-[1.02] transition-all active:scale-95 border-b-8 border-emerald-800"><Save className="w-8 h-8 mr-4" /> 儲存紀錄</button>
                </div>
              </div>
            )}

            {viewMode === 'calendar' && <DiaryCalendar />}
            {viewMode === 'charts' && <ProgressCharts />}
            {viewMode === 'detail' && <DetailView />}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedDiary;