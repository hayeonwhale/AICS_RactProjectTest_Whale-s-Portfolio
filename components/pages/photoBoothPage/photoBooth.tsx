
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Heart, Cloud, Trash2, CameraIcon, ImageIcon, CheckCircle2, X } from 'lucide-react';

// --- Types ---
type AppState = 'IDLE' | 'COUNTDOWN' | 'CAPTURING' | 'SELECTING' | 'REVIEW';

interface Photo {
  id: string;
  dataUrl: string;
}

interface StickerInstance {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

const FRAME_COLORS = [
  { name: 'Pure White', class: 'bg-white', text: 'text-gray-500' },
  { name: 'Cloud White', class: 'bg-[#F8FAFC]', text: 'text-slate-400' },
  { name: 'Soft Mint', class: 'bg-[#F0FDF4]', text: 'text-emerald-400' },
  { name: 'Lavender', class: 'bg-[#F5F3FF]', text: 'text-violet-400' },
  { name: 'Peach', class: 'bg-[#FFF7ED]', text: 'text-orange-300' },
  { name: 'Sky Blue', class: 'bg-[#F0F9FF]', text: 'text-sky-400' },
  { name: 'Rose Petal', class: 'bg-[#FFF1F2]', text: 'text-rose-300' },
  { name: 'Lemon', class: 'bg-[#FEFCE8]', text: 'text-yellow-400' },
  { name: 'Matcha', class: 'bg-[#F7FEE7]', text: 'text-lime-400' },
  { name: 'Dreamy Ink', class: 'bg-[#1E293B]', text: 'text-slate-400' },
  { name: 'Blush', class: 'bg-[#FDF2F8]', text: 'text-pink-300' },
  { name: 'Soft Sage', class: 'bg-[#F1F5F9]', text: 'text-slate-400' },
];

const STICKERS = ['☁️', '🌸', '🦋', '✨', '❤️', '🌟', '🎀', '🧸', '🍦', '🍭', '🍓', '🍰', '🌈', '🍀', '🐶', '🐱'];

const PRESET_CAPTIONS = [
  "A beautiful day to remember",
  "Simple moments of pure joy",
  "Chasing the soft pastel dreams",
  "Love in every single frame",
  "Our shining moments together",
  "Collecting pieces of happiness",
  "Forever starts with this smile",
  "Soft hues and happy views"
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>('IDLE');
  const [capturedPhotos, setCapturedPhotos] = useState<Photo[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_COLORS[0]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [stickers, setStickers] = useState<StickerInstance[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { aspectRatio: 3/4, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  const takeCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      setCapturedPhotos(prev => {
        const newList = [...prev, { id: Date.now().toString() + Math.random(), dataUrl }];
        if (newList.length >= 6) {
          setState('SELECTING');
        } else {
          // Trigger next countdown
          setCountdown(3);
          setState('COUNTDOWN');
        }
        return newList;
      });
    }
  }, []);

  useEffect(() => {
    let timer: number;
    if (state === 'COUNTDOWN' && countdown !== null) {
      if (countdown > 0) {
        timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setState('CAPTURING');
        takeCapture();
      }
    }
    return () => clearTimeout(timer);
  }, [state, countdown, takeCapture]);

  const startSession = () => {
    setCapturedPhotos([]);
    setSelectedPhotoIds([]);
    setCaption('');
    setStickers([]);
    setState('COUNTDOWN');
    setCountdown(3);
  };

  const togglePhotoSelection = (id: string) => {
    setSelectedPhotoIds(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length < 4) return [...prev, id];
      return prev;
    });
  };

  const confirmSelection = () => {
    if (selectedPhotoIds.length === 4) {
      const randomCaption = PRESET_CAPTIONS[Math.floor(Math.random() * PRESET_CAPTIONS.length)];
      setCaption(randomCaption);
      setState('REVIEW');
    }
  };

  const reset = () => {
    setCapturedPhotos([]);
    setSelectedPhotoIds([]);
    setStickers([]);
    setState('IDLE');
    setCaption('');
  };

  const addSticker = (emoji: string) => {
    const newSticker: StickerInstance = {
      id: Date.now().toString() + Math.random(),
      emoji,
      x: 130,
      y: 400,
    };
    setStickers([...stickers, newSticker]);
  };

  const removeSticker = (id: string) => {
    setStickers(prev => prev.filter(s => s.id !== id));
  };

  const clearAllStickers = () => setStickers([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !stripRef.current) return;
    const rect = stripRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    setStickers(prev => prev.map(s => s.id === draggingId ? { ...s, x, y } : s));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggingId || !stripRef.current) return;
    const touch = e.touches[0];
    const rect = stripRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - 20;
    const y = touch.clientY - rect.top - 20;
    setStickers(prev => prev.map(s => s.id === draggingId ? { ...s, x, y } : s));
  };

  const downloadStrip = () => {
    const stripElement = stripRef.current;
    if (!stripElement) return;

    const finalCanvas = document.createElement('canvas');
    const stripWidth = 400;
    const stripHeight = 1200;
    finalCanvas.width = stripWidth;
    finalCanvas.height = stripHeight;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    const bgColorMap: Record<string, string> = {
      'bg-white': '#FFFFFF',
      'bg-[#F8FAFC]': '#F8FAFC',
      'bg-[#F0FDF4]': '#F0FDF4',
      'bg-[#F5F3FF]': '#F5F3FF',
      'bg-[#FFF7ED]': '#FFF7ED',
      'bg-[#F0F9FF]': '#F0F9FF',
      'bg-[#FFF1F2]': '#FFF1F2',
      'bg-[#FEFCE8]': '#FEFCE8',
      'bg-[#F7FEE7]': '#F7FEE7',
      'bg-[#1E293B]': '#1E293B',
      'bg-[#FDF2F8]': '#FDF2F8',
      'bg-[#F1F5F9]': '#F1F5F9',
    };
    
    ctx.fillStyle = bgColorMap[selectedFrame.class] || '#FFFFFF';
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    const imgPadding = 20;
    const imgWidth = stripWidth - (imgPadding * 2);
    const imgHeight = (imgWidth * 3) / 4;

    const orderedPhotos = selectedPhotoIds.map(id => capturedPhotos.find(p => p.id === id)!);

    const drawEverything = async () => {
      for (let i = 0; i < orderedPhotos.length; i++) {
        const img = new Image();
        img.src = orderedPhotos[i].dataUrl;
        await new Promise(r => img.onload = r);
        ctx.drawImage(img, imgPadding, imgPadding + (i * (imgHeight + imgPadding)), imgWidth, imgHeight);
      }

      ctx.fillStyle = selectedFrame.class === 'bg-[#1E293B]' ? '#94A3B8' : '#64748B';
      ctx.font = '32px "Dancing Script", cursive';
      ctx.textAlign = 'center';
      ctx.fillText(caption, stripWidth / 2, stripHeight - 75);
      
      ctx.font = '14px "Quicksand"';
      ctx.letterSpacing = '2px';
      ctx.fillText(new Date().toLocaleDateString('en-US').toUpperCase(), stripWidth / 2, stripHeight - 40);

      ctx.font = '40px serif';
      const scale = stripWidth / 320;
      stickers.forEach(s => {
        ctx.fillText(s.emoji, (s.x + 20) * scale, (s.y + 35) * scale);
      });

      const link = document.createElement('a');
      link.download = `PastelMemory-${Date.now()}.png`;
      link.href = finalCanvas.toDataURL('image/png');
      link.click();
    };

    drawEverything();
  };

  const finalPhotos = selectedPhotoIds.map(id => capturedPhotos.find(p => p.id === id)!);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
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
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Cloud className="text-sky-200 w-10 h-10 fill-sky-50" />
          <h1 className="text-4xl font-bold tracking-tight pastel-text-gradient">
            Pastel Memories
          </h1>
          <Cloud className="text-pink-200 w-8 h-8 fill-pink-50" />
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Your moments, softly captured</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Section: Camera or Selection */}
        <section className="flex flex-col gap-8">
          {state === 'SELECTING' ? (
            <div className="bg-white p-8 rounded-[40px] soft-shadow border border-slate-50">
              <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-sky-400" /> Select 4 of 6 Photos
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {capturedPhotos.map(photo => (
                  <button
                    key={photo.id}
                    onClick={() => togglePhotoSelection(photo.id)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all border-4 ${selectedPhotoIds.includes(photo.id) ? 'border-sky-300 scale-95 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={photo.dataUrl} className="w-full h-full object-cover" alt="" />
                    {selectedPhotoIds.includes(photo.id) && (
                      <div className="absolute top-2 right-2 bg-sky-400 text-white rounded-full p-1 shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={confirmSelection}
                disabled={selectedPhotoIds.length !== 4}
                className={`w-full py-4 rounded-full font-bold text-white transition-all shadow-xl flex items-center justify-center gap-2 ${selectedPhotoIds.length === 4 ? 'bg-sky-300 hover:bg-sky-400' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                Confirm Selection ({selectedPhotoIds.length}/4)
              </button>
            </div>
          ) : (
            <>
              <div className="relative aspect-[3/4] bg-white rounded-[40px] overflow-hidden soft-shadow border-[16px] border-white group">
                {hasPermission === false ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
                    <CameraIcon className="w-20 h-20 text-slate-200 mb-6" />
                    <p className="text-slate-500 font-semibold text-lg">Camera Access Needed</p>
                    <button onClick={startCamera} className="mt-6 px-8 py-3 bg-sky-300 text-white rounded-full hover:bg-sky-400 transition-all shadow-lg font-bold">
                      Enable Camera
                    </button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-transform duration-700 ${state === 'CAPTURING' ? 'scale-110 blur-[1px]' : 'scale-100'}`} />
                    {state === 'COUNTDOWN' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px]">
                        <span className="text-[12rem] font-bold text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)] animate-ping">{countdown}</span>
                      </div>
                    )}
                    {state === 'IDLE' && (
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="bg-white/80 backdrop-blur px-8 py-3 rounded-full text-slate-500 font-bold flex items-center gap-2 shadow-xl border border-white/50">
                          Smile for the Camera
                        </p>
                      </div>
                    )}
                    {(state === 'COUNTDOWN' || state === 'CAPTURING') && (
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <div key={num} className={`w-4 h-4 rounded-full transition-all duration-500 ${capturedPhotos.length >= num ? 'bg-sky-300 scale-125 shadow-[0_0_15px_rgba(125,211,252,0.8)]' : 'bg-white/60'}`} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur p-8 rounded-[40px] soft-shadow flex flex-col gap-6 border border-white">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Frame Settings</p>
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-md font-bold uppercase">{selectedFrame.name}</span>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {FRAME_COLORS.map(frame => (
                    <button
                      key={frame.name}
                      onClick={() => setSelectedFrame(frame)}
                      className={`w-full aspect-square rounded-2xl border-2 transition-all hover:scale-110 active:scale-95 ${frame.class} ${selectedFrame.name === frame.name ? 'border-sky-300 ring-4 ring-sky-50' : 'border-slate-50'}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={startSession}
                  disabled={state !== 'IDLE'}
                  className={`mt-4 w-full py-5 rounded-full font-bold text-white transition-all shadow-xl flex items-center justify-center gap-4 text-xl ${state === 'IDLE' ? 'bg-sky-300 hover:bg-sky-400 hover:-translate-y-1 active:translate-y-0 active:shadow-md' : 'bg-slate-100 cursor-not-allowed text-slate-300'}`}
                >
                  <CameraIcon className="w-7 h-7" />
                  Take 6 Shots
                </button>
              </div>
            </>
          )}
        </section>

        {/* Right Section: Results Strip */}
        <section className="flex flex-col items-center">
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Stickers & Decoration</p>
              {stickers.length > 0 && (
                <button onClick={clearAllStickers} className="text-[10px] font-bold text-rose-300 hover:text-rose-400 flex items-center gap-1 uppercase tracking-tighter">
                  <X className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 bg-white/40 backdrop-blur p-5 rounded-3xl border border-white shadow-sm">
              {STICKERS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addSticker(emoji)}
                  disabled={state !== 'REVIEW'}
                  className={`text-3xl p-2 hover:bg-white rounded-2xl transition-all hover:scale-125 active:scale-90 ${state !== 'REVIEW' ? 'opacity-20 grayscale cursor-not-allowed' : 'shadow-sm hover:shadow-md'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div 
            ref={stripRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={() => setDraggingId(null)}
            onTouchEnd={() => setDraggingId(null)}
            className={`w-[320px] min-h-[980px] p-5 transition-all duration-700 soft-shadow rounded-sm ${selectedFrame.class} flex flex-col gap-4 items-center relative overflow-hidden select-none border-white/20`}
          >
            {state === 'REVIEW' && finalPhotos.length === 4 ? (
              <>
                {finalPhotos.map((photo, i) => (
                  <div key={photo.id} className="w-full aspect-[3/4] bg-slate-50/50 overflow-hidden shadow-sm relative rounded-[2px]">
                    <img src={photo.dataUrl} className="w-full h-full object-cover pointer-events-none" alt="" />
                    <div className="absolute top-2 left-2 bg-white/40 backdrop-blur w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {i + 1}
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 text-center px-6 w-full pb-6">
                  <p className={`font-handwriting text-[2.1rem] leading-none mb-4 ${selectedFrame.text}`}>
                    {caption}
                  </p>
                  <p className={`text-[10px] font-bold tracking-[0.25em] uppercase opacity-60 ${selectedFrame.text}`}>
                    {new Date().toLocaleDateString('en-US')} • PASTEL MEMORIES
                  </p>
                </div>

                {stickers.map(s => (
                  <div
                    key={s.id}
                    onMouseDown={() => setDraggingId(s.id)}
                    onTouchStart={() => setDraggingId(s.id)}
                    onDoubleClick={() => removeSticker(s.id)}
                    title="Double-click to remove"
                    style={{ left: s.x, top: s.y }}
                    className={`absolute sticker text-4xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${draggingId === s.id ? 'z-50 scale-150 drop-shadow-lg' : 'z-40 drop-shadow-sm'}`}
                  >
                    {s.emoji}
                  </div>
                ))}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 p-12 text-center opacity-40">
                <ImageIcon className="w-20 h-20 mb-6" />
                <p className="text-sm font-bold uppercase tracking-widest">
                  {state === 'SELECTING' ? 'Selecting Photos...' : 'Awaiting Memories'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 flex gap-4 w-full max-w-[320px]">
            {state === 'REVIEW' && (
              <>
                <button onClick={downloadStrip} className="flex-1 flex items-center justify-center gap-3 py-5 bg-sky-300 text-white rounded-full hover:bg-sky-400 transition-all shadow-xl font-bold text-lg active:scale-95">
                  <Download className="w-6 h-6" /> Save Strip
                </button>
                <button onClick={reset} className="px-6 py-5 bg-white text-slate-300 rounded-full hover:bg-rose-50 hover:text-rose-300 transition-all shadow-xl border border-slate-50 active:scale-95">
                  <Trash2 className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </section>
      </main>

      <canvas ref={canvasRef} className="hidden" />

      <footer className="mt-24 text-center text-slate-300 text-xs font-bold tracking-widest uppercase flex flex-col items-center gap-4 mb-12">
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-12 bg-slate-100"></div>
          <Heart className="w-4 h-4 text-pink-200 fill-pink-100" />
          <div className="h-[1px] w-12 bg-slate-100"></div>
        </div>
        Softly made for your beautiful moments
      </footer>
    </div>
  );
};

export default App;
