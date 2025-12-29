import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // URL 파라미터를 기반으로 활성 탭 결정
  const getActiveId = () => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    // 카테고리가 없거나 비어있으면 'all' 반환
    return category || 'all';
  };

  const activeId = getActiveId();



  // 스크롤 감지 및 프로젝트 섹션 이동 로직
  // (이전 로직은 새로고침 시 강제로 홈으로 보내는 문제가 있어 제거함)

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (id: string) => {
    if (id === 'all') {
      navigate('/');
    } else {
      navigate(`/?category=${id}`);
    }

    // 네비게이션 후 프로젝트 섹션으로 스크롤 이동
    setTimeout(() => {
      scrollToProjects();
    }, 100);
  };

  const handleLogoClick = () => {
    // 로고 클릭 시 스크롤 복원 플래그 제거 (무조건 맨 위로 가야 함)
    sessionStorage.removeItem('restoreScroll');
    sessionStorage.removeItem('scrollPos');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'all', label: 'View All' },
    { id: 'visual', label: 'Visual Design' },
    { id: 'art', label: 'Art' },
    { id: 'playground', label: 'Playground' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'bg-[#f0f6f9] shadow-sm py-4' : 'bg-[#dde9ef] py-8'
      }`}>
      <div className="container mx-auto px-10 flex items-center justify-between">
        <div
          onClick={handleLogoClick}
          className={`text-2xl font-serif tracking-tighter transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-95 text-slate-900`}
        >
          Whale's Portfolio
        </div>

        <div className="flex items-center">
          <ul className="flex items-center gap-12">
            {navLinks.map((link) => {
              const isActive = activeId === link.id;

              return (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className="nav-item flex flex-col items-center group relative outline-none cursor-pointer"
                  >
                    <span className={`text-[12px] tracking-[0.2em] uppercase transition-all duration-500 ${isActive
                      ? 'font-bold text-slate-900'
                      : 'text-slate-400 font-medium hover:text-slate-600'
                      }`}>
                      {link.label}
                    </span>
                    <div className={`h-[2px] w-4 mt-2 transition-all duration-500 ease-out origin-center ${isActive
                      ? 'bg-slate-900 scale-x-100 opacity-100'
                      : 'bg-slate-400 scale-x-100 opacity-100 group-hover:bg-slate-600'
                      }`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;