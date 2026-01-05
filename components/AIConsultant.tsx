
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, User, Bot, Loader2, Mic, MicOff } from 'lucide-react';
import { Message } from '../types';
import { chatWithAI } from '../services/geminiService';

interface AIConsultantProps {
  onBack: () => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: '您好！我是您的健康助教。今天有什麼我可以幫您的嗎？不論是健康建議還是心情分享，我都隨時在線喔！', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const responseText = await chatWithAI(input, history);
      
      const aiMessage: Message = {
        role: 'model',
        text: responseText || '抱歉，我現在無法回答這個問題。',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'model',
        text: '噢，我的連線似乎出了一點問題，請稍後再試。',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    // In a real app, this would trigger the Live API or Web Speech API
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput('我最近感覺體力不太好，有什麼建議嗎？');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto md:p-6">
      <header className="p-4 md:px-0 flex items-center justify-between border-b border-slate-100 md:border-none">
        <button onClick={onBack} className="p-2 bg-white text-indigo-600 rounded-xl shadow-sm hover:shadow-md transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 bg-white px-6 py-2 rounded-2xl shadow-sm">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full absolute -right-0.5 -bottom-0.5 border-2 border-white"></div>
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Bot className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">AI 健康助教</h2>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">在線諮詢中</p>
          </div>
        </div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:px-0 space-y-6 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-slate-200 ml-2' : 'bg-indigo-100 mr-2'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 opacity-50 text-right ${msg.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 bg-white rounded-2xl border border-slate-100 rounded-bl-none shadow-sm flex space-x-1">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 md:px-0">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 flex items-center space-x-2">
          <button 
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
          >
            {isRecording ? <MicOff className="w-6 h-6 animate-pulse" /> : <Mic className="w-6 h-6" />}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isRecording ? "正在傾聽..." : "請輸入您的問題..."}
            className="flex-1 px-2 py-3 bg-transparent border-none outline-none resize-none h-12 text-slate-700 placeholder-slate-400 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-4 px-4 uppercase tracking-tighter">
          AI 助教的建議僅供參考，如有不適請務必尋求醫療專業人員協助。
        </p>
      </div>
    </div>
  );
};

export default AIConsultant;
