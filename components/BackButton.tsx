import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="fixed bottom-10 left-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-2xl z-[9999] text-slate-600 hover:text-black hover:scale-110 transition-all duration-300 cursor-pointer group"
            aria-label="Back to home"
        >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="group-hover:-translate-x-1 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
    );
};

export default BackButton;
