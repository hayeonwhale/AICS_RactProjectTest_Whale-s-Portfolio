import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#fcfcfc] pt-24 pb-16 text-slate-500 border-t border-slate-100">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left/Center: ABOUT */}
          <div className="md:col-span-8">
            <h4 className="text-slate-800 font-bold mb-8 text-sm uppercase tracking-[0.2em]">About</h4>
            <div className="space-y-6 max-w-xl">
              <p className="text-[13px] md:text-[14px] leading-relaxed text-slate-400 font-light">
                Whale's Portfolio is a curated digital space showcasing a collection of personal projects and creative works at the intersection of design and technology.
              </p>
            </div>
          </div>

          {/* Right: CONTACT & SNS */}
          <div className="md:col-span-4 flex flex-col items-end text-right">
            {/* Contact Text Info */}
            <div className="text-[11px] md:text-[12px] lowercase tracking-[0.1em] leading-loose text-slate-400 mb-8">
              <h4 className="text-slate-800 font-bold mb-2 text-[13px] tracking-[0.2em] uppercase">Contact</h4>
              <p className="text-slate-500">hayeonwhale07@gmail.com</p>
              <p>@hayeonrhfo</p>
              <p>storyofthelostletter</p>
            </div>

            {/* Social Icons (Moved below contact text) */}
            <div className="flex gap-4">
               {/* Gmail */}
               <a href="mailto:hayeonwhale07@gmail.com" className="w-9 h-9 bg-white border border-slate-100 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer group shadow-sm" title="Gmail">
                 <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                   <polyline points="22,6 12,13 2,6"></polyline>
                 </svg>
               </a>
               {/* Instagram */}
               <a href="https://instagram.com/hayeonrhfo" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white border border-slate-100 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors cursor-pointer group shadow-sm" title="Instagram">
                 <svg className="w-4 h-4 text-slate-400 group-hover:text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                   <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                   <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                 </svg>
               </a>
               {/* Naver Blog */}
               <a href="https://blog.naver.com/storyofthelostletter" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white border border-slate-100 rounded-full flex items-center justify-center hover:bg-green-50 transition-colors cursor-pointer group shadow-sm" title="Naver Blog">
                 <svg className="w-4 h-4 text-slate-400 group-hover:text-green-600" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"></path>
                 </svg>
               </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;