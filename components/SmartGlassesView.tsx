
import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Loader2, Home, AlertCircle, MonitorPlay, History } from 'lucide-react';

interface SmartGlassesViewProps {
  onBack: () => void;
}

const SmartGlassesView: React.FC<SmartGlassesViewProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'monitor'>('preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const INITIAL_URL = "https://smartglasses2025-production.up.railway.app/";

  useEffect(() => {
    // 檢查是否有儲存的眼鏡數據
    const savedData = localStorage.getItem('smart_glasses_data');
    if (savedData) {
      setHasData(true);
    }
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = INITIAL_URL;
    }
  };

  const startMonitoring = () => {
    setViewMode('monitor');
    setLoading(true);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 relative">
      <header className="p-4 bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center justify-between z-30 shadow-lg">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="flex items-center text-white font-bold px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-all border border-indigo-400/30 shadow-lg shadow-indigo-600/20 rounded-xl"
            title="返回物理治療管理頁面"
          >
            <Home className="mr-2 w-5 h-5" /> 返回管理
          </button>
          <div className="ml-4 px-3 py-1 bg-white/5 rounded-lg border border-white/10 hidden sm:block">
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Secure Uplink: Smart Glasses</p>
          </div>
        </div>

        <h2 className="text-white font-bold text-lg absolute left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
          智能眼鏡監控中心
        </h2>

        <div className="flex items-center space-x-2">
          {viewMode === 'monitor' && (
            <button 
              onClick={handleRefresh} 
              className="p-2.5 text-white/60 hover:text-white bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              title="重新整理連線內容"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          {viewMode === 'monitor' && (
            <button 
              onClick={() => setViewMode('preview')} 
              className="p-2.5 text-white/60 hover:text-white bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              title="回預覽模式"
            >
              <History className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
      
      <div className="flex-1 relative bg-slate-950 overflow-hidden">
        {viewMode === 'preview' ? (
          /* 預覽與數據檢查模式 */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {!hasData ? (
              <div className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
                  <AlertCircle className="w-12 h-12 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">尚未有監控資料</h3>
                <p className="text-slate-400 mb-10 leading-relaxed">
                  系統目前尚未偵測到此病患的歷史監控數據。請物理治療師啟動實境監控連線以建立初次評估紀錄。
                </p>
                <button 
                  onClick={startMonitoring}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center group px-8"
                >
                  <MonitorPlay className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  整合性閱讀認知分群智慧系統
                </button>
              </div>
            ) : (
              <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in duration-500">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-left">
                  <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-6">Last Session Data</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-400">連線日期</span>
                      <span className="text-white font-mono">2025-05-20</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-400">運動執行率</span>
                      <span className="text-green-400 font-mono">92%</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-400">環境風險等級</span>
                      <span className="text-amber-400 font-mono">LOW</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">已有存檔紀錄</h3>
                  <p className="text-slate-400 mb-8">偵測到病患曾進行過智能眼鏡輔助評估。您可以查看歷史數據或重新啟動連線。</p>
                  <button 
                    onClick={startMonitoring}
                    className="py-5 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center px-8"
                  >
                    <MonitorPlay className="w-5 h-5 mr-3" /> 進入系統
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 實際監控模式 (Iframe) */
          <>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <Loader2 className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-white font-medium tracking-[0.2em] animate-pulse uppercase text-xs">Uplink Encryption Active...</p>
              </div>
            )}
            <iframe 
              ref={iframeRef}
              src={INITIAL_URL}
              className="w-full h-full border-none relative z-10"
              onLoad={() => setLoading(false)}
              title="Smart Glasses Remote System"
              allow="camera; microphone; display-capture"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SmartGlassesView;
