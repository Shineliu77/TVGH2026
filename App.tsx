
import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FitnessMeasurement from './components/FitnessMeasurement';
import ExercisePlan from './components/ExercisePlan';
import CombinedDiary from './components/CombinedDiary';
import AIConsultant from './components/AIConsultant';
import SmartGlassesView from './components/SmartGlassesView';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProfessionalMode, setIsProfessionalMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('health_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView(AppView.DASHBOARD);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setLoading(true);
    setTimeout(() => {
      setUser(userData);
      localStorage.setItem('health_user', JSON.stringify(userData));
      setView(AppView.DASHBOARD);
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfessionalMode(false);
    localStorage.removeItem('health_user');
    setView(AppView.LOGIN);
  };

  return (
    <div className="min-h-screen w-full relative bg-transparent">
      <main className="w-full min-h-screen relative z-10">
        {view === AppView.LOGIN && <Login onLogin={handleLogin} isLoading={loading} />}
        
        {user && view === AppView.DASHBOARD && (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            onNavigate={setView} 
            isProfessionalMode={isProfessionalMode}
            setIsProfessionalMode={setIsProfessionalMode}
          />
        )}

        {user && view === AppView.MEASUREMENT && (
          <FitnessMeasurement 
            onBack={() => setView(AppView.DASHBOARD)} 
            onNavigate={setView}
          />
        )}

        {user && view === AppView.EXERCISE_PLAN && (
          <ExercisePlan onBack={() => setView(AppView.DASHBOARD)} />
        )}

        {user && view === AppView.COMBINED_DIARY && (
          <CombinedDiary onBack={() => setView(AppView.DASHBOARD)} />
        )}

        {user && view === AppView.AI_CHAT && (
          <AIConsultant onBack={() => setView(AppView.DASHBOARD)} />
        )}

        {user && view === AppView.SMART_GLASSES && (
          <SmartGlassesView onBack={() => setView(AppView.DASHBOARD)} />
        )}
      </main>
    </div>
  );
};

export default App;
