import React from 'react';
import { Link } from 'react-router-dom';
import type { Website } from '../types';

interface WebsiteCardProps {
  website: Website;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website }) => {
  // 이미지에서 제공된 색상 팔레트 적용
  const bgColors = {
    visual: 'bg-[#e2eef4]',     // Ice Blue (SH S 0510-R90B)
    art: 'bg-[#d9d9d9]',        // Pure Gray (SH S 1000-N)
    playground: 'bg-[#ede5d8]', // Warm Light (SH S 0804-Y50R)
  };

  return (
    <Link
      to={`/project/${website.id}`}
      onClick={() => {
        sessionStorage.setItem('restoreScroll', 'true');
        sessionStorage.setItem('scrollPos', window.scrollY.toString());
      }}
      className={`flex flex-col ${bgColors[website.category]} rounded-none overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group block border border-black/5`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden m-5 rounded-none">
        <img
          src={website.imageUrl}
          alt={website.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="px-9 pb-9 flex flex-col flex-grow">
        {/* 텍스트의 두께를 줄이고 자간을 넓혀 감성적이고 심플한 스타일로 변경했습니다. */}
        <h3 className="text-[22px] font-serif font-normal text-slate-700 mb-3 tracking-wide leading-relaxed">
          {website.title}
        </h3>
        <p className="text-slate-800 text-[13px] font-normal leading-relaxed mb-8 opacity-70">
          {website.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {website.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-white/40 backdrop-blur-md border border-black/5 rounded-full text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-white/80"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Indicator */}
        <div className="mt-auto flex justify-end">
          <div className="flex items-center gap-2 text-slate-900 text-[12px] font-bold uppercase tracking-widest group">
            <span className="relative">
              view project
              <div className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-slate-900 transition-all duration-300 group-hover:w-full" />
            </span>
            <svg
              className="w-4 h-4 transform transition-transform group-hover:translate-x-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WebsiteCard;