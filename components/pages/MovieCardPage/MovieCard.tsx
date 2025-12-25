import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- 일러스트레이션 (변경 없음) ---
const ZoneOfInterestIllustration: React.FC = () => {
  return (
    <svg viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-[#2e3033]">
      <defs>
        <linearGradient id="skyGradient" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#2e3033" />
          <stop offset="70%" stopColor="#3c3c44" />
          <stop offset="90%" stopColor="#694f42" />
          <stop offset="100%" stopColor="#c58c63" />
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComposite in="SourceGraphic" operator="in" />
          <feBlend in="SourceGraphic" in2="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      <rect width="400" height="350" fill="url(#skyGradient)" />
      <rect width="400" height="350" fill="black" opacity="0.07" style={{ filter: "url(#grain)" }} />
      <path d="M 150 200 L 150 180 L 160 180 L 160 170 L 170 170 L 170 180 L 250 180 L 250 170 L 260 170 L 260 180 L 270 180 L 270 200 Z" fill="#222" />
      <rect x="180" y="150" width="10" height="30" fill="#1a1a1a" />
      <rect x="230" y="150" width="10" height="30" fill="#1a1a1a" />
      <path d="M 182 150 Q 185 140 188 150 T 182 150" fill="#e57e5b" />
      <path d="M 232 150 Q 235 142 238 150 T 232 150" fill="#f09061" />
      <path d="M 185 150 C 180 130, 160 120, 150 90 C 140 60, 160 40, 180 30 C 200 20, 220 50, 200 80 C 180 110, 190 130, 185 150 Z" fill="#4a4a4a" opacity="0.7" />
      <path d="M 235 150 C 240 135, 255 125, 265 100 C 275 75, 260 50, 240 40 C 220 30, 200 60, 220 90 C 240 120, 230 140, 235 150 Z" fill="#404040" opacity="0.6" />
      <path d="M 50 150 C 55 130, 65 120, 70 90 C 75 60, 65 50, 50 60 C 35 70, 40 100, 45 120 C 50 140, 50 150, 50 150 Z" fill="#d8d8d8" opacity="0.4" />
      <rect x="0" y="200" width="400" height="50" fill="#c0c0c0" />
      <path d="M 0 200 L 400 200" stroke="#a0a0a0" strokeWidth="1" />
      <line x1="100" y1="200" x2="100" y2="250" stroke="#a0a0a0" strokeWidth="2" />
      <line x1="150" y1="200" x2="150" y2="250" stroke="#a0a0a0" strokeWidth="2" />
      <line x1="200" y1="200" x2="200" y2="250" stroke="#a0a0a0" strokeWidth="2" />
      <line x1="250" y1="200" x2="250" y2="250" stroke="#a0a0a0" strokeWidth="2" />
      <line x1="300" y1="200" x2="300" y2="250" stroke="#a0a0a0" strokeWidth="2" />
      <line x1="0" y1="195" x2="400" y2="195" stroke="#777" strokeWidth="0.5" />
      <line x1="0" y1="192" x2="400" y2="192" stroke="#777" strokeWidth="0.5" />
      <path d="M 0 250 C 50 220, 150 220, 200 250 Z" fill="#7a8972" />
      <path d="M 200 250 C 250 220, 350 220, 400 250 Z" fill="#6f7c69" />
      <rect x="0" y="250" width="400" height="100" fill="#9db193" />
      <rect x="0" y="250" width="400" height="100" fill="black" opacity="0.09" style={{ filter: "url(#grain)" }} />
      <rect x="170" y="260" width="80" height="40" fill="#8b9ea7" rx="2" />
      <rect x="165" y="257" width="90" height="46" fill="#c0c5c9" rx="3" stroke="#b0b5b9" strokeWidth="1" />
      <rect x="170" y="260" width="80" height="40" fill="#6a828e" opacity="0.8" rx="2" />
      <rect x="205" y="262" width="5" height="15" fill="#4a4238" />
      <circle cx="100" cy="290" r="15" fill="#c7c7c7" />
      <circle cx="115" cy="300" r="10" fill="#d1d1d1" />
      <circle cx="130" cy="285" r="12" fill="#bcbcbc" />
      <circle cx="90" cy="305" r="8" fill="#d8d8d8" />
      <rect x="-10" y="150" width="60" height="150" fill="#d1ccc2" />
      <path d="M -10 150 L 50 150 L 20 120 Z" fill="#b96a4a" />
      <rect x="350" y="170" width="60" height="150" fill="#d1ccc2" />
      <rect x="70" y="220" width="5" height="40" fill="#6b4f3a" />
      <circle cx="72.5" cy="210" r="20" fill="#4d614b" />
      <rect x="290" y="225" width="5" height="40" fill="#6b4f3a" />
      <circle cx="292.5" cy="215" r="20" fill="#4d614b" />
      <g transform="translate(155, 265)">
          <ellipse cx="0" cy="53" rx="20" ry="5" fill="#000" opacity="0.2" />
          <path d="M -8 0 L 8 0 L 10 35 L -10 35 Z" fill="#f0ede5" />
          <path d="M -10 35 L 10 35 L 12 60 L -12 60 Z" fill="#2a2a2a" />
          <path d="M -6 0 L -4 0 L -6 35 L -8 35 Z" fill="#2a2a2a" />
          <path d="M 6 0 L 4 0 L 6 35 L 8 35 Z" fill="#2a2a2a" />
          <circle cx="0" cy="-5" r="7" fill="#e0c9b6" />
          <path d="M -6 -10 Q 0 -15 6 -10 L 0 -5 Z" fill="#4a3b2a" />
          <path d="M -15 5 L -12 2 L -5 15 L -8 18 Z" fill="#c58c63" />
          <circle cx="-16" cy="4" r="3" fill="#f09061" />
      </g>
      <g transform="translate(110, 300)">
        <ellipse cx="12" cy="13" rx="15" ry="3" fill="#000" opacity="0.15" />
        <path d="M 0 0 Q 15 -5 25 5 L 20 10 Q 10 15 0 5 Z" fill="#252525" />
        <path d="M 5 8 L 3 12 M 8 9 L 6 13 M 18 9 L 16 13 M 21 8 L 19 12" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// --- 메인 페이지 컴포넌트 ---
const MovieCard: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        // 👇 [핵심] div로 변경, flex 제거, pt-40로 넉넉한 여백
        <div className="bg-[#e8e6d9] min-h-screen w-full pt-40 pb-20 px-4 relative">
            
            {/* 👇 [핵심] z-[9999] 추가로 모든 레이어 뚫고 나오게 설정 */}
            <button 
                onClick={() => navigate('/')}
                className="fixed bottom-10 left-10 w-14 h-14 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-2xl z-[9999] text-slate-600 hover:text-black hover:scale-110 transition-all cursor-pointer"
                aria-label="Back to home"
            >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            {/* 카드 본문: mx-auto로 수평 중앙 정렬 유지 */}
            <div className="mx-auto max-w-sm w-full bg-[#f4f3ed] rounded-xl shadow-2xl shadow-stone-400/30 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 ease-in-out">
                <div className="w-full h-auto">
                    <ZoneOfInterestIllustration />
                </div>
                <div className="p-6 text-center text-[#5c5b57]">
                    <h1 className="text-4xl font-semibold tracking-wider text-[#4a4a4a]">
                        THE ZONE OF INTEREST
                    </h1>
                    <h2 className="font-kor text-xl mt-2 mb-4 text-[#6b6a66]">
                        존 오브 인터레스트
                    </h2>

                    <div className="w-1/4 h-px bg-stone-300 mx-auto my-5"></div>

                    <p className="font-kor text-lg italic my-4 text-[#63615b]">
                        "행복의 벽 너머, 들려오는 비명"
                    </p>
                    
                    <div className="w-1/4 h-px bg-stone-300 mx-auto my-5"></div>

                    <p className="font-kor text-xs my-4 text-[#63615b] text-left leading-relaxed px-2 break-keep">
                        아우슈비츠 강제 수용소 담장 밖, 꽃으로 만발한 정원이 있는 그림 같은 집에는 수용소 소장 루돌프 회스와 그의 아내 헤트비히, 그리고 다섯 아이들이 살고 있다. 그들은 평범하고 행복한 일상을 꿈꾸지만, 담장 너머에서 들려오는 비명과 총성, 그리고 연기는 그들의 낙원을 미묘하게 뒤흔든다.
                    </p>

                    <div className="w-1/4 h-px bg-stone-300 mx-auto my-5"></div>

                    <div className="text-sm space-y-2 mt-4 font-kor">
                        <p><span className="font-bold">감독</span> 조나단 글레이저</p>
                        <p><span className="font-bold">주연</span> 산드라 휠러, 크리스티안 프리델</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import ZoneOfInterestIllustration from './ZoneOfInterestIllustration';

// const MovieCard: React.FC = () => {
//     const navigate = useNavigate();

//     return (
//         <div className="relative min-h-screen bg-[#fcfcfc] animate-fade-in-up flex flex-col items-center justify-center">
//             {/* Floating Back Button */}
//             <button 
//                 onClick={() => navigate('/')}
//                 className="fixed bottom-10 left-10 z-[60] w-14 h-14 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
//                 aria-label="Back to home"
//             >
//                 <svg 
//                     className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" 
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                 >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//             </button>

//             <div className="max-w-sm w-full bg-[#f4f3ed] rounded-xl shadow-2xl shadow-stone-400/30 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 ease-in-out">
//                 <div className="w-full h-auto">
//                     <ZoneOfInterestIllustration />
//                 </div>
//                 <div className="p-6 text-center text-[#5c5b57]">
//                     <h1 className="text-4xl font-semibold tracking-wider text-[#4a4a4a]">
//                         THE ZONE OF INTEREST
//                     </h1>
//                     <h2 className="font-kor text-xl mt-2 mb-4 text-[#6b6a66]">
//                         존 오브 인터레스트
//                     </h2>

//                     <div className="w-1/4 h-px bg-stone-300 mx-auto my-5"></div>

//                     <p className="font-kor text-lg italic my-4 text-[#63615b]">
//                         "행복의 벽 너머, 들려오는 비명"
//                     </p>
                    
//                     <div className="w-1/4 h-px bg-stone-300 mx-auto my-5"></div>

//                     <p className="font-kor text-xs my-4 text-[#63615b] text-left leading-relaxed px-2 break-keep">
//                         아우슈비츠 강제 수용소 담장 밖, 꽃으로 만발한 정원이 있는 그림 같은 집에는 수용소 소장 루돌프 회스와 그의 아내 헤트비히, 그리고 다섯 아이들이 살고 있다. 그들은 평범하고 행복한 일상을 꿈꾸지만, 담장 너머에서 들려오는 비명과 총성, 그리고 연기는 그들의 낙원을 미묘하게 뒤흔든다.
//                     </p>

//                     <div className="w-1/4 h-px bg-stone-300 mx-auto my-5"></div>

//                     <div className="text-sm space-y-2 mt-4 font-kor">
//                         <p><span className="font-bold">감독</span> 조나단 글레이저</p>
//                         <p><span className="font-bold">주연</span> 산드라 휠러, 크리스티안 프리델</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MovieCard;