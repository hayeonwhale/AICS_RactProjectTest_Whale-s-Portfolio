
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RainyWindowPage from './components/RainyWindowPage';

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* 뒤로가기 버튼 */}
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-10 left-10 z-[60] w-14 h-14 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        aria-label="Back to home"
      >
        <svg 
          className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <RainyWindowPage />
    </div>
  );
};

export default App;
