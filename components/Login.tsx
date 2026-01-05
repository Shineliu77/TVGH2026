
import React, { useState } from 'react';
import { User } from '../types';
import { UserCircle, ShieldCheck, ArrowRight, Loader2, Mic, UserPlus, Brain, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  isLoading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [step, setStep] = useState<'id' | 'name'>('id');

  const checkPatientExists = (id: string): string | null => {
    const registryStr = localStorage.getItem('patient_registry');
    if (!registryStr) return null;
    const registry = JSON.parse(registryStr);
    return registry[id] || null;
  };

  const saveToRegistry = (id: string, name: string) => {
    const registryStr = localStorage.getItem('patient_registry') || '{}';
    const registry = JSON.parse(registryStr);
    registry[id] = name;
    localStorage.setItem('patient_registry', JSON.stringify(registry));
  };

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim()) return;
    const existingName = checkPatientExists(patientId);
    if (existingName) {
      onLogin({ id: patientId, name: existingName });
    } else {
      setStep('name');
    }
  };

  const handleFullSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId && patientName) {
      saveToRegistry(patientId, patientName);
      onLogin({ id: patientId, name: patientName });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md glass-card rounded-[3rem] overflow-hidden animate-in fade-in zoom-in duration-700 relative z-10 border-white">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain className="w-24 h-24" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 opacity-10">
            <Zap className="w-20 h-20" />
          </div>
          
          <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-3xl mb-6 backdrop-blur-xl border border-white/30 shadow-xl">
            {step === 'id' ? <ShieldCheck className="w-10 h-10 text-white" /> : <UserPlus className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">智動健康數位管家</h1>
          <p className="mt-2 text-white/70 text-sm font-medium">
            {step === 'id' ? '請輸入您的專屬 ID 進行連結' : '請填寫您的姓名以建立數位檔案'}
          </p>
        </div>

        <form onSubmit={step === 'id' ? handleIdSubmit : handleFullSubmit} className="p-10 space-y-8 bg-white/40">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">Patient Identity // 病患編號</label>
            <div className="relative group">
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Ex: P001"
                disabled={step === 'name'}
                className="w-full px-5 py-5 pl-14 rounded-2xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-blue-500 outline-none transition-all disabled:opacity-50 font-mono text-lg shadow-inner"
                required
              />
              <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              {step === 'id' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-50 text-slate-400 rounded-xl pointer-events-none">
                  <Mic className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {step === 'name' && (
            <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">Full Name // 真實姓名</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="請輸入姓名"
                className="w-full px-5 py-5 rounded-2xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold shadow-inner"
                autoFocus
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoading || !patientId || (step === 'name' && !patientName)}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-bold shadow-xl shadow-blue-200 flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="tracking-wide">{step === 'id' ? '下一步' : '啟動系統'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            {step === 'name' && (
              <button type="button" onClick={() => setStep('id')} className="w-full text-slate-400 font-bold hover:text-blue-600 text-xs uppercase tracking-widest transition-colors">
                Back to ID
              </button>
            )}
          </div>
        </form>

        <div className="p-8 bg-slate-50/50 border-t border-white text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Privacy & Data Security Guaranteed
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
