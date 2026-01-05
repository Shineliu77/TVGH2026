
import React, { useState } from 'react';
import { User, AppView } from '../types';
import { 
  Sparkles, LogOut, ChevronRight, 
  Settings, ClipboardCheck, Dumbbell, 
  Brain, Zap, ShieldCheck, MonitorDot, LayoutDashboard, UserCircle2, Activity
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: AppView) => void;
  isProfessionalMode: boolean;
  setIsProfessionalMode: (val: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigate, isProfessionalMode, setIsProfessionalMode }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleAuth = () => {
    if (password === '000') {
      setIsProfessionalMode(true);
      setShowAuth(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* 頂部導覽列 */}
      <header className="flex justify-between items-center mb-12 glass-card p-6 rounded-[2.5rem]">
        <div className="flex items-center space-x-5">
          <div className={`w-16 h-16 bg-gradient-to-br ${isProfessionalMode ? 'from-amber-400 to-orange-600' : 'from-cyan-400 to-blue-600'} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200 transition-all`}>
            {isProfessionalMode ? <ShieldCheck className="w-8 h-8" /> : user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-slate-800">
                {isProfessionalMode ? '物理治療師 / 運動處方管理' : `您好，${user.name}`}
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-tighter ${isProfessionalMode ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                {isProfessionalMode ? 'Specialist Mode' : 'Verified Member'}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-mono tracking-wider mt-0.5">
              {isProfessionalMode ? 'CLINICAL INTERFACE ACTIVE' : `PATIENT CONNECTED // ID: ${user.id}`}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => isProfessionalMode ? setIsProfessionalMode(false) : setShowAuth(true)}
            className={`p-3.5 rounded-2xl transition-all border flex items-center space-x-2 ${isProfessionalMode ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-200' : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-400 hover:text-blue-500'}`}
          >
            {isProfessionalMode ? (
              <>
                <UserCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold">返回病患模式</span>
              </>
            ) : (
              <Settings className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onLogout}
            className="p-3.5 bg-slate-50 border border-slate-200 hover:bg-red-50 hover:border-red-200 rounded-2xl transition-all text-slate-400 hover:text-red-500"
            title="登出系統"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 核心內容區 */}
      {!isProfessionalMode ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10">
            <div onClick={() => onNavigate(AppView.COMBINED_DIARY)} className="glass-card group p-10 rounded-[3rem] hover:scale-[1.01] transition-all cursor-pointer border-t-8 border-t-cyan-400 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Brain className="w-48 h-48" />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="flex items-center space-x-8">
                  <div className="flex -space-x-4">
                    <div className="w-20 h-20 bg-cyan-100 text-cyan-600 rounded-3xl flex items-center justify-center shadow-lg border-4 border-white">
                      <Brain className="w-10 h-10" />
                    </div>
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg border-4 border-white">
                      <Activity className="w-10 h-10" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 mb-2">認知腦 X 運動腦</h3>
                    <p className="text-slate-500 text-lg max-w-lg">合併紀錄每日腦力活動與體能追蹤，全方位守護您的健康平衡。</p>
                  </div>
                </div>
                <div className="bg-cyan-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-cyan-200 group-hover:bg-cyan-700 transition-all flex items-center">
                  立即填寫紀錄 <ChevronRight className="w-6 h-6 ml-2" />
                </div>
              </div>
            </div>
          </div>

          <div onClick={() => onNavigate(AppView.AI_CHAT)} className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl shadow-blue-200 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div className="relative z-10 p-10 text-white flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/30">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">AI 健康大腦助教</h3>
                  <p className="text-white/80 text-sm max-w-sm">專業 AI 模組隨時為您解答運動與認知健康問題。</p>
                </div>
              </div>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-xl">立即諮詢</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center space-x-3 px-2 mb-8">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-600 uppercase tracking-widest text-sm">Diagnostic Center // 診斷與處方</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div onClick={() => onNavigate(AppView.SMART_GLASSES)} className="glass-card group p-8 rounded-[2rem] hover:scale-[1.05] transition-all cursor-pointer border-t-4 border-t-cyan-500">
              <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <MonitorDot className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">智能眼鏡監控</h3>
              <p className="text-slate-500 text-sm mb-6">遠端實境視角連線，即時觀察病患動態與居家環境。</p>
              <div className="text-cyan-600 font-bold text-xs uppercase tracking-widest">UPLINK SESSION <ChevronRight className="inline w-4 h-4 ml-1" /></div>
            </div>

            <div onClick={() => onNavigate(AppView.MEASUREMENT)} className="glass-card group p-8 rounded-[2rem] hover:scale-[1.05] transition-all cursor-pointer border-t-4 border-t-blue-500">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">體適能評估</h3>
              <p className="text-slate-500 text-sm mb-6">ABCD 分級管理系統，精準掌握病患核心功能缺失。</p>
              <div className="text-blue-600 font-bold text-xs uppercase tracking-widest">啟動評估終端 <ChevronRight className="inline w-4 h-4 ml-1" /></div>
            </div>

            <div onClick={() => onNavigate(AppView.EXERCISE_PLAN)} className="glass-card group p-8 rounded-[2rem] hover:scale-[1.05] transition-all cursor-pointer border-t-4 border-t-purple-500">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Dumbbell className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">運動處方設計</h3>
              <p className="text-slate-500 text-sm mb-6">客製化訓練清單，針對不同分級提供專屬運動建議。</p>
              <div className="text-purple-600 font-bold text-xs uppercase tracking-widest">配置訓練計畫 <ChevronRight className="inline w-4 h-4 ml-1" /></div>
            </div>
          </div>
        </div>
      )}

      {/* 授權視窗 */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-100/60 backdrop-blur-md">
          <div className="glass-card rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl border-white">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">治療師/運動處方設計</h3>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full bg-white border border-slate-200 px-4 py-5 rounded-2xl mb-6 text-center text-3xl tracking-[0.4em] text-blue-600 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-mono"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs text-center mb-6 font-bold animate-bounce">授權密碼錯誤</p>}
            <div className="flex space-x-3">
              <button onClick={() => setShowAuth(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl">Cancel</button>
              <button onClick={handleAuth} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">Verify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
