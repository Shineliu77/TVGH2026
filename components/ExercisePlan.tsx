
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, LayoutGrid, CheckCircle2, ChevronUp, ChevronDown, ListChecks, ClipboardList, Sparkles, Info, Dumbbell, Trash2, Filter } from 'lucide-react';

interface ExerciseDefinition {
  category: '上肢運動' | '呼吸運動' | '下肢運動';
  name: string;
  description: string;
  target: string;
}

interface ExerciseItem {
  name: string;
  reps: string;
  order: number;
}

interface ExercisePlanProps {
  onBack: () => void;
}

const EXERCISE_DATABASE: ExerciseDefinition[] = [
  // 上肢運動 (6)
  { category: '上肢運動', name: '肩關節屈曲運動', description: '坐姿下雙手上舉約170到180度，並保持身體挺直，視線直視前方。', target: '訓練肩部前側肌肉' },
  { category: '上肢運動', name: '肩關節外展運動', description: '坐姿下雙手自身側向外打開170到180度，掌心朝上，並保持身體挺直。', target: '訓練肩部外側肌群 (三角肌，棘上肌群)' },
  { category: '上肢運動', name: '肘關節屈曲運動', description: '保持手肘貼在身側，彎曲90度，做雙手向上彎曲約160度。', target: '訓練肱二頭肌' },
  { category: '上肢運動', name: '前臂旋前旋後', description: '保持雙手平舉向前伸直，做手掌正反面翻掌動作，約90度。', target: '訓練旋前肌、旋後肌' },
  { category: '上肢運動', name: '手肘伸直抓握', description: '保持雙手平舉90度向前伸直，做手指握拳及放開動作。', target: '訓練肱二頭肌、肱三頭肌' },
  { category: '上肢運動', name: '手部抓握', description: '保持手肘貼在身側，彎曲90度，做手指握拳及放開動作。', target: '訓練末端循環、屈指肌、伸指肌' },

  // 呼吸運動 (10)
  { category: '呼吸運動', name: '吐氣運動', description: '以鼻子平緩吸氣，肩膀放鬆胸腹部鼓起。吐氣時，嘴巴以吹氣方式緩緩將氣吹出。', target: '訓練平穩吸吐氣、均勻呼吸' },
  { category: '呼吸運動', name: '腹式深呼吸', description: '以鼻子平緩吸氣，肩膀放鬆胸腹部鼓起。吐氣時，嘴巴噘起以吹氣方式緩緩將氣吹出。', target: '訓練避免肺泡擴張不全、減緩呼吸次數、降低呼吸功' },
  { category: '呼吸運動', name: '圓唇吐氣', description: '吐氣時，將嘴巴噘起，以吹氣方式緩緩將氣吹出，約4-5秒。', target: '訓練減少二氧化碳滯留、避免氣道塌陷' },
  { category: '呼吸運動', name: '擴胸運動', description: '手肘於胸前彎曲90度，將手臂向身體兩側打開，同時深呼吸並做出挺胸動作。', target: '訓練闊背肌、後三角肌、三頭肌' },
  { category: '呼吸運動', name: '雙手後伸', description: '保持身體直立，手肘伸直下將雙手向後延伸，維持3秒鐘再緩緩放下。', target: '訓練後三角肌、三頭肌' },
  { category: '呼吸運動', name: '身體側彎', description: '一手插腰，另一手向對側延伸帶出身體向側邊彎曲約20到25度。', target: '訓練背肌、腹斜肌、肩部外側肌群' },
  { category: '呼吸運動', name: '身體前彎後仰', description: '雙手插腰，將身體緩緩向前彎曲約九十度，回到直立，再緩緩向後仰約25度。', target: '訓練背肌、腹肌肌群' },
  { category: '呼吸運動', name: '斜向舉手', description: '一手由對側膝蓋位置開始，向斜上方舉起並帶出身體旋轉動作，摸到對側膝蓋。', target: '訓練闊背肌、胸大肌' },
  { category: '呼吸運動', name: '胸廓深呼吸', description: '雙手交疊於頭後，吐氣時身體向前彎曲手肘收緊，吸氣時回到直立手肘打開。', target: '訓練橫膈肌、肋間肌、闊背肌' },
  { category: '呼吸運動', name: '挺胸夾背', description: '保持手肘貼在身側，雙手向側邊打開，同時做出挺胸及背部向中間夾起動作。', target: '訓練背肌、菱形肌' },

  // 下肢運動 (28)
  { category: '下肢運動', name: '腳踝幫浦運動', description: '仰躺，腳踝同時往上勾和往下踩各約40度。', target: '訓練末端循環、脛前肌、腓腸肌' },
  { category: '下肢運動', name: '腿伸直向上抬高運動', description: '仰躺下保持膝蓋伸直，將腳向上抬起至30到45度維持3秒再緩緩放下。', target: '訓練股四頭肌、髂腰肌' },
  { category: '下肢運動', name: '仰躺髖關節外展運動', description: '仰躺下保持膝蓋伸直，將腿向側邊打開至30到40度再慢慢移回中線。', target: '訓練髂脛束' },
  { category: '下肢運動', name: '膝關節最後伸直運動', description: '膝蓋下方放枕頭墊高使微彎15度，做膝蓋伸直動作，維持3秒鐘。', target: '訓練股四頭肌' },
  { category: '下肢運動', name: '翻身運動', description: '單腳彎曲踩床幫助翻身至側躺。', target: '訓練床上活動能力' },
  { category: '下肢運動', name: '仰躺屈膝抬臀運動', description: '仰躺下雙腳彎曲踩於床面，將臀部抬離床面約5到10公分。', target: '訓練背肌、臀伸直肌、膝伸直肌' },
  { category: '下肢運動', name: '膝蓋開合運動', description: '仰躺下雙腳彎曲踩於床面，將雙膝向左右打開約40到45度維持3秒。', target: '訓練髖外轉肌、髖內轉肌' },
  { category: '下肢運動', name: '坐立髖關節屈曲運動', description: '坐姿下將膝蓋向上抬起約離地面10公分(約30度)，維持3秒鐘。', target: '訓練髂腰肌' },
  { category: '下肢運動', name: '坐立膝關節伸直運動', description: '坐姿下保持身體挺直，將膝蓋向前伸直，維持3秒。', target: '訓練股四頭肌' },
  { category: '下肢運動', name: '坐到站', description: '坐於椅子前緣，將身體向前彎、重心向前移，再將身體站直。', target: '訓練轉位能力、動態平衡' },
  { category: '下肢運動', name: '站立髖關節外展運動', description: '手扶椅子下將腳向側邊打開至30到40度，維持3秒。', target: '訓練單腳站、髂脛束' },
  { category: '下肢運動', name: '站立髖關節伸直運動', description: '在膝蓋伸直下將腳向後側延伸約15度，維持3秒。', target: '訓練臀伸直肌' },
  { category: '下肢運動', name: '半蹲姿運動', description: '手扶椅子將雙膝緩緩彎曲蹲下約五到十公分，維持3秒再慢慢站起。', target: '訓練股四頭肌、臀伸直肌' },
  { category: '下肢運動', name: '踏步運動', description: '手扶椅子將膝蓋輪流抬起約60-80度，維持3秒。', target: '訓練髂腰肌、股四頭肌、背肌' },
  { category: '下肢運動', name: '雙腳墊腳尖運動', description: '手扶椅子將雙腳腳跟墊起後維持3秒。', target: '訓練腓腸肌、比目魚肌、背肌' },
  { category: '下肢運動', name: '單腳站', description: '手扶椅子將單腳腳抬高約九十度，維持3秒後，再緩緩放下。', target: '訓練單腳平衡、下肢伸直肌力' },
  { category: '下肢運動', name: '被動關節活動機器', description: '從0至70度開始增加，一天做二至四次。', target: '訓練增加膝蓋屈曲伸直' },
  { category: '下肢運動', name: '壓腿運動', description: '平躺下大腿出力將腿打直，讓膝後窩貼到床面。', target: '訓練訓練大腿股四頭肌' },
  { category: '下肢運動', name: '腳跟滑水', description: '腳跟慢慢向臀部方向移動，使膝蓋彎曲至90度，停留3秒。', target: '訓練大腿後側肌群' },
  { category: '下肢運動', name: '大腿側抬運動', description: '側躺下將上方的腿向天花板抬起約10公分，停留3秒。', target: '訓練大腿外展肌群、臀肌' },
  { category: '下肢運動', name: '坐姿膝蓋彎曲運動', description: '坐床緣用對側腳將訓練腳往床底回勾，停留3秒。', target: '訓練增加膝蓋屈曲' },
  { category: '下肢運動', name: '雙膝夾球運動', description: '坐在床緣，在膝蓋中間夾球狀物，維持3秒。', target: '訓練大腿內側肌群' },
  { category: '下肢運動', name: '夾屁股運動', description: '站姿或躺姿下，屁股朝內側上方夾緊，維持3秒。', target: '訓練臀肌' },
  { category: '下肢運動', name: '靠牆蹲坐', description: '背對牆面蹲下至膝蓋彎曲90度，維持3秒。', target: '訓練股四頭肌' },
  { category: '下肢運動', name: '趴姿膝關節彎曲運動', description: '採趴姿將訓練側膝蓋慢慢彎曲至最大角度，維持3秒。', target: '訓練腿後肌' },
  { category: '下肢運動', name: '直膝抬臀運動', description: '腳踝墊高約20公分，雙腳往下出力，把屁股抬離床面。', target: '訓練臀伸直肌' },
  { category: '下肢運動', name: '趴姿後踢腿', description: '趴姿下訓練腳往後踢高至與身體平行，維持3秒。', target: '訓練臀伸直肌' },
  { category: '下肢運動', name: '弓步深蹲', description: '跨一步往下蹲，前後大腿與小腿皆彎曲維持90度。', target: '訓練臀伸直肌，背肌' }
];

const ExercisePlan: React.FC<ExercisePlanProps> = ({ onBack }) => {
  const [selected, setSelected] = useState<ExerciseItem[]>([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [dailyTotalSets, setDailyTotalSets] = useState('3');
  const [activeCategory, setActiveCategory] = useState<'上肢運動' | '呼吸運動' | '下肢運動'>('上肢運動');

  useEffect(() => {
    // 優先讀取最終處方，若無則讀取推薦處方
    const savedFinal = localStorage.getItem('current_exercise_plan_detailed');
    const savedPlan = localStorage.getItem('current_exercise_plan');
    const savedAdvice = localStorage.getItem('fitness_ai_advice');
    
    if (savedAdvice) {
      const lines = savedAdvice.split('\n').filter(l => l.trim()).slice(0, 3);
      setAiAdvice(lines.join('\n'));
    }

    if (savedFinal) {
      setSelected(JSON.parse(savedFinal));
    } else if (savedPlan) {
      const planNames: string[] = JSON.parse(savedPlan);
      const formatted = planNames.map((name, index) => ({
        name,
        reps: '10回',
        order: index + 1
      }));
      setSelected(formatted);
    }
  }, []);

  const toggleExercise = (name: string) => {
    const exists = selected.find(i => i.name === name);
    if (exists) {
      const newList = selected.filter(i => i.name !== name)
        .sort((a, b) => a.order - b.order)
        .map((item, idx) => ({ ...item, order: idx + 1 }));
      setSelected(newList);
    } else {
      setSelected([...selected, { name, reps: '10回', order: selected.length + 1 }]);
    }
  };

  const updateReps = (name: string, reps: string) => {
    setSelected(selected.map(i => i.name === name ? { ...i, reps } : i));
  };

  const moveOrder = (name: string, direction: 'up' | 'down') => {
    const index = selected.findIndex(i => i.name === name);
    if (index === -1) return;
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === selected.length - 1)) return;
    
    const newList = [...selected];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[targetIdx]] = [newList[targetIdx], newList[index]];
    
    setSelected(newList.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const handleInitialSave = () => {
    if (selected.length === 0) {
      alert('請至少選擇一個運動項目。');
      return;
    }
    setIsReviewing(true);
  };

  const handleFinalConfirm = () => {
    localStorage.setItem('current_exercise_plan_detailed', JSON.stringify(selected));
    localStorage.setItem('daily_total_sets', dailyTotalSets);
    alert('運動處方已完成最終配置並存檔！');
    onBack();
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 animate-in fade-in duration-500 pb-20">
      <button onClick={onBack} className="flex items-center text-purple-600 font-bold mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft className="mr-2 w-5 h-5" /> 返回管理首頁
      </button>

      {!isReviewing ? (
        <div className="space-y-8">
          <div className="glass-card rounded-[3.5rem] overflow-hidden border-white shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-10 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Dumbbell className="w-40 h-40" /></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-black tracking-tight">運動處方整合管理</h2>
                <p className="opacity-80 text-sm mt-2 font-medium">在 44 項運動中選取並配置順序，已選項目會同步標號</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 flex flex-col items-center shadow-xl">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">處方清單</span>
                 <span className="text-4xl font-black">{selected.length}</span>
              </div>
            </div>

            <div className="p-10 space-y-10 bg-white/60">
              {/* 精簡 AI 建議 */}
              {aiAdvice && (
                <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-100 relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 right-0 p-3 opacity-10"><Sparkles className="w-12 h-12" /></div>
                  <h3 className="text-[10px] font-black text-purple-700 mb-2 flex items-center uppercase tracking-[0.2em]">
                    <Sparkles className="w-3.5 h-3.5 mr-2" /> AI 處方核心建議
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-bold italic whitespace-pre-line">
                    {aiAdvice}
                  </p>
                </div>
              )}

              {/* 分類標籤頁 */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl space-x-1">
                {(['上肢運動', '呼吸運動', '下肢運動'] as const).map(cat => {
                  const countInCat = selected.filter(s => EXERCISE_DATABASE.find(d => d.name === s.name)?.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-1 py-4 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${activeCategory === cat ? 'bg-white text-purple-600 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <span>{cat}</span>
                      {countInCat > 0 && <span className="bg-purple-600 text-white px-2 py-0.5 rounded-md text-[9px] shadow-sm">{countInCat}</span>}
                    </button>
                  );
                })}
              </div>

              {/* 整合運動清單 */}
              <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-4 scrollbar-hide border-t-2 border-slate-50 pt-8">
                {EXERCISE_DATABASE.filter(ex => ex.category === activeCategory).map((ex, idx) => {
                  const selItem = selected.find(i => i.name === ex.name);
                  return (
                    <div 
                      key={idx}
                      className={`p-1 transition-all rounded-[2.5rem] ${selItem ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-xl scale-[1.01]' : 'bg-transparent'}`}
                    >
                      <div 
                        className={`p-6 rounded-[2.3rem] border-2 transition-all flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-white ${selItem ? 'border-transparent' : 'border-slate-100 hover:border-purple-200 shadow-sm'}`}
                      >
                        <div 
                          onClick={() => !selItem && toggleExercise(ex.name)}
                          className="flex items-start md:items-center space-x-5 flex-1 overflow-hidden cursor-pointer"
                        >
                          <div 
                            onClick={(e) => { e.stopPropagation(); toggleExercise(ex.name); }}
                            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${selItem ? 'bg-purple-600 border-purple-600 text-white shadow-lg rotate-6' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-purple-300'}`}
                          >
                            {selItem ? <CheckCircle2 className="w-7 h-7" /> : <div className="w-3 h-3 bg-slate-200 rounded-full" />}
                          </div>
                          
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <span className={`text-xl font-black truncate ${selItem ? 'text-purple-700' : 'text-slate-700'}`}>{ex.name}</span>
                              {selItem && (
                                <div className="flex items-center space-x-2">
                                  <span className="bg-purple-600 text-white px-3 py-1 rounded-xl text-xs font-black shadow-lg shadow-purple-100 border border-purple-400">
                                    順序 #{selItem.order}
                                  </span>
                                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Selected</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium mb-2">{ex.description}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <Info className="w-3.5 h-3.5 text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{ex.target}</span>
                            </div>
                          </div>
                        </div>

                        {selItem ? (
                          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-[2rem] border border-slate-100 shadow-inner w-full xl:w-auto animate-in fade-in zoom-in duration-300">
                            <div className="flex flex-col min-w-[120px]">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-2">訓練回數</label>
                              <div className="relative">
                                <select 
                                  value={selItem.reps}
                                  onChange={(e) => updateReps(ex.name, e.target.value)}
                                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-slate-700 focus:border-purple-500 outline-none shadow-sm cursor-pointer appearance-none"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={`${n}回`}>{n} 回</option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <ChevronDown className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-2 text-center">順序</label>
                              <div className="flex bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveOrder(ex.name, 'up'); }} 
                                  className={`p-3 transition-colors ${selItem.order === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-purple-100 hover:text-purple-600'}`}
                                  disabled={selItem.order === 1}
                                >
                                  <ChevronUp className="w-5 h-5" />
                                </button>
                                <div className="w-[1px] bg-slate-100" />
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveOrder(ex.name, 'down'); }} 
                                  className={`p-3 transition-colors ${selItem.order === selected.length ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-purple-100 hover:text-purple-600'}`}
                                  disabled={selItem.order === selected.length}
                                >
                                  <ChevronDown className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleExercise(ex.name); }}
                              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                              title="取消選取"
                            >
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => toggleExercise(ex.name)}
                            className="w-full xl:w-auto px-8 py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl border-2 border-dashed border-slate-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all text-sm shadow-sm"
                          >
                            + 加入處方
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 已選處方快速導航/檢查區 */}
              {selected.length > 0 && (
                <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-100 shadow-inner mt-10">
                   <h3 className="font-black text-slate-800 mb-6 flex items-center text-lg uppercase tracking-tight">
                    <Filter className="w-5 h-5 mr-3 text-purple-500" /> 處方彙總
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.sort((a,b) => a.order - b.order).map(item => (
                      <div key={item.name} className="bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm flex items-center space-x-2">
                        <span className="text-[10px] font-black text-purple-600">#{item.order}</span>
                        <span className="text-xs font-bold text-slate-700">{item.name}</span>
                        <span className="text-[9px] font-black text-slate-300">({item.reps})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={handleInitialSave}
                className="w-full py-8 bg-purple-600 text-white rounded-[2.5rem] font-black shadow-2xl shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center text-2xl group active:scale-[0.98]"
              >
                <Save className="w-8 h-8 mr-4 group-hover:rotate-12 transition-transform" /> 完成配置・進入最終核對
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 復健師最終核對介面 (同上) */
        <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in duration-500 pb-20">
          <div className="glass-card rounded-[4rem] shadow-2xl border-white overflow-hidden">
            <div className="bg-emerald-600 p-16 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10"><ClipboardList className="w-40 h-40" /></div>
              <div className="w-28 h-28 bg-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 backdrop-blur-2xl border border-white/30 shadow-2xl">
                <ListChecks className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-5xl font-black mb-4 text-white">復健師最終審核</h2>
              <p className="opacity-80 text-lg font-medium">請確認執行順序並設定病患全天執行目標</p>
            </div>

            <div className="p-16 space-y-12 bg-white/60">
              <div className="space-y-6">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-8 block text-center">全天建議執行總量 (每日次數設定)</label>
                <div className="relative group max-w-sm mx-auto">
                  <select 
                    value={dailyTotalSets}
                    onChange={(e) => setDailyTotalSets(e.target.value)}
                    className="w-full bg-white border-4 border-slate-100 rounded-[3rem] px-12 py-10 text-6xl font-black text-emerald-600 focus:bg-white focus:border-emerald-500 outline-none transition-all shadow-2xl shadow-emerald-100 text-center appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none">
                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Sets per Day</span>
                    <span className="text-xl font-black text-slate-300">回 / 每天</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-[4rem] p-12 border-2 border-slate-100 shadow-inner">
                <h3 className="font-black text-slate-800 mb-10 flex items-center text-2xl uppercase tracking-tighter">
                  <ClipboardList className="w-9 h-9 mr-5 text-emerald-500" /> 處方動作與回數明細
                </h3>
                <div className="space-y-5 max-h-[500px] overflow-y-auto pr-8 scrollbar-hide">
                  {selected.map((item) => {
                    const dbItem = EXERCISE_DATABASE.find(ex => ex.name === item.name);
                    return (
                      <div key={item.name} className="flex items-center justify-between bg-white px-10 py-7 rounded-[2.5rem] shadow-xl border border-slate-50 group hover:border-emerald-300 transition-all">
                        <div className="flex items-center space-x-8">
                          <span className="text-base font-black text-emerald-600 bg-emerald-100/50 w-12 h-12 flex items-center justify-center rounded-2xl border border-emerald-200 shadow-sm">#{item.order.toString().padStart(2, '0')}</span>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-700 text-xl">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              {dbItem?.category} // {dbItem?.target}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Target Reps</span>
                            <span className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-base font-black shadow-xl shadow-emerald-200">{item.reps}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 pt-8">
                <button onClick={() => setIsReviewing(false)} className="flex-1 py-7 text-slate-400 font-black hover:bg-slate-50 rounded-[2.5rem] transition-all uppercase tracking-[0.3em] text-xs">返回修改處方</button>
                <button 
                  onClick={handleFinalConfirm}
                  className="flex-[3] py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center text-3xl group"
                >
                  <CheckCircle2 className="w-10 h-10 mr-5 group-hover:scale-110 transition-transform" /> 確認存檔發布
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePlan;
