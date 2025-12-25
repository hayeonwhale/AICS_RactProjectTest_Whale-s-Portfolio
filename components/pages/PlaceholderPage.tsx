import React from 'react';

interface PlaceholderPageProps {
  icon: string;
  text: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ icon, text }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-slate-500 text-center">
      <span className="text-6xl mb-4" role="img" aria-label="icon">{icon}</span>
      <p className="text-2xl font-medium">{text}</p>
    </div>
  );
};

export default PlaceholderPage;