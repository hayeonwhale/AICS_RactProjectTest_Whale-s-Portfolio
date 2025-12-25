import React from 'react';
import { PosterData } from '../Ptypes';
import { Quote, Sparkles } from 'lucide-react';

interface PosterCanvasProps {
  data: PosterData;
  scale?: number;
}

const PosterCanvas: React.FC<PosterCanvasProps> = ({ data, scale = 1 }) => {
  const { imageUrl, content } = data;

  return (
    <div 
      className="bg-paper shadow-2xl relative overflow-hidden flex flex-col md:flex-row w-full max-w-5xl mx-auto transition-all duration-500"
      style={{ 
        minHeight: '800px',
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
      }}
    >
      {/* Visual Section */}
      <div className="w-full md:w-1/2 relative h-[400px] md:h-auto bg-stone-200">
         <img 
          src={imageUrl} 
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
          <h1 className="text-white font-serif text-3xl tracking-wide leading-snug">{content.title}</h1>
          <p className="text-white/90 font-sans text-sm mt-2 opacity-90">{content.artist}, {content.year}</p>
        </div>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white relative">
        {/* Decorative Elements */}
        <div className="absolute top-6 right-8 text-secondary/20">
          <Sparkles size={64} strokeWidth={1} />
        </div>

        <div>
          {/* Intro */}
          <div className="mb-8">
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400 mb-2">작품 소개</h3>
            <p className="text-stone-600 font-serif leading-relaxed text-lg break-keep">
              {content.intro}
            </p>
          </div>

          {/* Dual Themes */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-stone-50 p-5 rounded-sm">
              <h4 className="text-secondary font-serif font-bold text-xl mb-2">과거의 주제</h4>
              <p className="text-sm text-stone-600 font-sans leading-6 break-keep">{content.pastTheme}</p>
            </div>
            <div className="bg-stone-50 p-5 rounded-sm border border-stone-100">
              <h4 className="text-accent font-serif font-bold text-xl mb-2">오늘날의 주제</h4>
              <p className="text-sm text-stone-600 font-sans leading-6 break-keep">{content.modernTheme}</p>
            </div>
          </div>

          {/* Connection */}
          <div className="mb-10">
             <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-stone-400 mb-2">두 주제의 연결</h3>
             <p className="text-stone-700 font-serif leading-relaxed break-keep">
              {content.connection}
             </p>
          </div>
        </div>

        {/* Footer / Core Message */}
        <div className="mt-auto pt-8 border-t border-stone-100">
          <div className="flex items-center gap-3">
            <Quote className="text-accent shrink-0" size={24} />
            <p className="text-lg md:text-xl font-serif text-ink leading-snug whitespace-nowrap">
              {content.coreMessage}
            </p>
          </div>
          
          <div className="flex gap-2 mt-6 flex-wrap">
            {content.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] uppercase tracking-widest border border-stone-200 px-2 py-1 text-stone-400 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCanvas;