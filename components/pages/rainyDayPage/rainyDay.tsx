
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../BackButton';
import RainyWindowPage from './components/RainyWindowPage';

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* 뒤로가기 버튼 */}
      {/* 뒤로가기 버튼 */}
      <BackButton />
      <RainyWindowPage />
    </div>
  );
};

export default App;
