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

  // [수정된 부분] 페이지 로드(새로고침) 시 무조건 'View All'로 초기화
  useEffect(() => {
    // 현재 URL에 쿼리 파라미터(category 등)가 있다면 제거하고 메인으로 이동
    if (location.search) {
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 배열을 비워 마운트 시 1회만 실행
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 스크롤 감지 로직
  useEffect(() => {
    // 1. 현재 주소가 메인('/')이 아니거나, 뒤에 이상한 검색어(?category=..)가 붙어있으면?
    if (location.pathname !== '/' || location.search) {

      // 2. 강제로 메인 화면('/')으로 이동시킵니다.
      navigate('/', { replace: true });

      // 3. 스크롤도 맨 위로 올립니다.
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] 빈 배열이므로 새로고침(또는 처음 접속) 시 딱 한 번만 실행됨!

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
  };

  const handleLogoClick = () => {
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