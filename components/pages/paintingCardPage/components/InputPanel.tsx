import React, { useRef, useState } from 'react';
import { Upload, RefreshCw, Wand2, Image as ImageIcon } from 'lucide-react';

interface InputPanelProps {
  onImageUpload: (file: File) => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  currentTitle: string;
}

const InputPanel: React.FC<InputPanelProps> = ({ onImageUpload, onGenerate, isGenerating, currentTitle }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full md:w-[400px] shrink-0 bg-white border-r border-stone-200 p-6 flex flex-col h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-ink mb-2">Art & Soul</h1>
        <p className="text-stone-500 text-sm font-sans">당신의 평온한 순간을 큐레이션합니다.</p>
      </div>

      {/* Image Upload */}
      <div className="mb-8">
        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">작품 선택</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-200 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-stone-50 transition-colors group"
        >
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-secondary/10 transition-colors">
            <ImageIcon className="text-stone-400 group-hover:text-secondary" size={24} />
          </div>
          <p className="text-sm text-stone-500 font-sans text-center">이미지를 업로드하려면 클릭하세요</p>
          <p className="text-xs text-stone-400 mt-1">또는 기본 모네 그림 사용</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>

      {/* Context Input */}
      <div className="mb-8 flex-1">
        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">큐레이터 노트 (선택사항)</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 도시 생활이 너무 지쳐요. 이 그림이 어떻게 위로가 될까요?"
          className="w-full h-32 p-4 bg-stone-50 border border-stone-200 rounded-lg text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-accent resize-none font-sans"
        />
        <p className="text-[10px] text-stone-400 mt-2">
          비워두면 AI가 자유롭게 해석합니다.
        </p>
      </div>

      {/* Action */}
      <div className="mt-auto">
        <button
          onClick={() => onGenerate(prompt)}
          disabled={isGenerating}
          className="w-full bg-ink text-paper py-4 rounded-lg font-serif text-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              큐레이팅 중...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              생성하기
            </>
          )}
        </button>
      </div>

      {/* API Key Notice */}
      <div className="mt-6 pt-6 border-t border-stone-100">
         <p className="text-[10px] text-stone-400 text-center">
           Gemini 2.5 Flash 기반 <br/>
           환경 변수에 API Key가 필요합니다.
         </p>
      </div>
    </div>
  );
};

export default InputPanel;