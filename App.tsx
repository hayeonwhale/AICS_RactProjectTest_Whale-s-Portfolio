import React from 'react';
import { HashRouter as Router, Routes, Route, useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import WebsiteCard from './components/WebsiteCard';
import MovieCard from './components/pages/MovieCardPage/MovieCard';
import AboutMe from './components/pages/aboutmepage/AboutMe';
import PaintingCard from './components/pages/paintingCardPage/paintingCard';
import ThreeDInteractiveArt from './components/pages/threeDInteractiveArtPage/threeDInteractiveArt';
import ThreeDSaturn from './components/pages/threeDSaturnPage/threeDSaturn';
import JellyfishVoxelArt from './components/pages/jellyfishVoxelArt';
import PhotoBooth from './components/pages/photoBoothPage/photoBooth';
import OceanCube from './components/pages/oceanCubeVoxelArt';
import VisitorsBook from './components/pages/visitorPage/visitor';
import RainyDay from './components/pages/rainyDayPage/rainyDay';

import Navbar from './components/Navbar';
import type { Website } from './types';
import Footer from './components/Footer';

const myWebsites: Website[] = [
  {
    id: 1,
    title: 'Movie Introduction Cards',
    description: 'A movie introduction card UI design project that delivers my favorite movie information effectively.',
    imageUrl: 'https://i.namu.wiki/i/iPmI8zrQPGXAnMK_7jWNK-iY1vFvEBQE84mExy0G_e__5g0QtpiUWvRSI0kHRxJrVS1RVKJkI5cYLVC9wfnIoQ.webp',
    url: '/MovieCard',
    tags: ['UI/UX', 'Movie', 'Design', 'Information'],
    category: 'visual'
  },
  {
    id: 2,
    title: 'Self-Introduction Cards',
    description: 'A sensory profile design that expresses personal identity through visual elements.',
    imageUrl: 'https://i.namu.wiki/i/EWQ2T7b3KLjDCWZ-t0b_dykFpMzju_JM1YlCHEGroCkg-fejUaSo87DfdptMoTOcfKPCR5Iw6HOIE6jIRT4i5g.webp',
    url: '/AboutMe',
    tags: ['Identity', 'Profile', 'Introduction', 'Design'],
    category: 'visual'
  },
  {
    id: 3,
    title: 'Impressionism Art Introduction',
    description: 'A digital portfolio page for an Impressionist artwork.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Claude_Monet_-_Poppy_Field_-_Google_Art_Project.jpg',
    url: '/paintingCard',
    tags: ['Art', 'History', 'Claude Monet', 'Impressionism'],
    category: 'visual'
  },
  {
    id: 4,
    title: '3D Interactive Art Scene',
    description: 'An interactive 3D art scene that allows users to engage with digital sculptures in a virtual space.',
    imageUrl: 'https://i.pinimg.com/1200x/7c/86/97/7c86975e6e63ddf9764c10baa42b726a.jpg',
    url: '/ThreeDInteractiveArt',
    tags: ['3D', 'Interactive Art', 'User Experience'],
    category: 'art'
  },
  {
    id: 5,
    title: '🪐',
    description: 'An interactive 3D art scene that allows users to interact with an interesting Saturn.',
    imageUrl: 'https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13371511&filePath=L2Rpc2sxL25ld2RhdGEvMjAyNC8wMS8wMS9jNTc5NDgyZjE4YmU1ZjVlODg5MzE4MmNmNTc3YjA1ZDg3YjljZTM3MzJmYTUyNGM2ODE5NGM3YjE1NDliNTI1&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004',
    url: '/ThreeDSaturn',
    tags: ['3D', 'Interactive Art', 'User Experience', 'Saturn', 'Space'],
    category: 'art'
  },
  {
    id: 6,
    title: '🪼🪼🪼',
    description: 'A voxel art that allows users to interact with a few jellyfish.',
    imageUrl: 'https://i.pinimg.com/736x/5d/a9/61/5da961c4ac1431967d002254e8b5a354.jpg',
    url: '/JellyfishVoxelArt',
    tags: ['3D', 'Voxel Art', 'User Experience', 'Jellyfish', 'Abyss'],
    category: 'art'
  },
  {
    id: 7,
    title: 'Photo Booth',
    description: 'A playful photo booth web application where users can take 4-cut pictures and save them.',
    imageUrl: 'https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/3kT/image/N20qL4EX5gsJEEh-U-iGLbcmyeI.jpg',
    url: '/PhotoBooth',
    tags: ['Photo Booth', 'Web Application', 'Entertainment', 'Decorative'],
    category: 'playground'
  },
  {
    id: 8,
    title: '🐬🧊',
    description: 'A playful photo booth web application where users can take 4-cut pictures and save them.',
    imageUrl: 'https://i1.ruliweb.com/img/21/06/12/179fdcea595387902.jpg',
    url: '/OceanCube',
    tags: ['Photo Booth', 'Web Application', 'Entertainment', 'Decorative'],
    category: 'art'
  },
  {
    id: 9,
    title: "Visitor's Book  ☁︎ ભઅુ?ˀ",
    description: "A visitor's Book that looks like a memo board web application where visitors can leave their thoughts and messages.",
    imageUrl: 'https://i.pinimg.com/736x/37/d8/97/37d8976aecf6d4fa478cddda322245a2.jpg',
    url: '/VisitorsBook',
    tags: ['Visitor Book', 'Web Application', 'Messages', 'Memo'],
    category: 'playground'
  },
  {
    id: 10,
    title: 'Rainy Day Interactive Art Scene',
    description: 'An interactive 3D art scene that allows users to interact with a rainy day environment.',
    imageUrl: 'https://images.hive.blog/p/C3TZR1g81UNaPs7vzNXHueW5ZM76DSHWEY7onmfLxcK2iQSL4HiAotpPC98ZWgtsbk12dYu4DRDwLfw4PHNo6S29szqjvE7peTX4S4D3hzhu5soz9jzzu4r?format=match&mode=fit&width=1536',
    url: '/RainyDay',
    tags: ['Interactive Art', 'User Experience', 'Rain', 'Water Texture'],
    category: 'art'
  }
];

const Hero: React.FC = () => {
  const backgroundImages = [
    `${import.meta.env.BASE_URL}images/dayOcean.jpeg`, // Uploaded Ghibli-style image
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=2000', // Nature/Green
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000', // Tech/Abstract
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=2000', // Books/Knowledge
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000'  // Waterfall/Landscape
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50">
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out`}
          style={{
            backgroundImage: `url('${img}')`,
            opacity: currentImageIndex === index ? 1 : 0,
            zIndex: 0
          }}
        />
      ))}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-[1]"></div>

      <div className="relative z-10 text-center px-6 max-w-6xl animate-fade-in-up">
        <h1 className="text-[#2a2a2a] text-6xl md:text-9xl font-serif font-light mb-12 tracking-tight leading-tight drop-shadow-sm">
          Whale's <br className="md:hidden" /> Website Portfolio
        </h1>
        <div className="w-20 h-[1px] bg-[#2a2a2a]/20 mx-auto mb-12"></div>
        <p className="text-[#2a2a2a]/60 text-base md:text-xl font-light tracking-[0.4em] uppercase">
          Digital Exploration & Creative Curation
        </p>
      </div>
    </div>
  );
};

const PortfolioContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredWebsites = (!categoryFilter || categoryFilter === 'all' || categoryFilter === '')
    ? myWebsites
    : myWebsites.filter(w => w.category === categoryFilter);

  const getCategoryTitle = () => {
    switch (categoryFilter) {
      case 'visual': return 'Visual Design';
      case 'art': return 'Art Works';
      case 'playground': return 'Playground';
      default: return 'View All';
    }
  };

  return (
    <>
      <Hero />
      <section id="projects" className="py-24 bg-white min-h-screen">
        <div className="container mx-auto px-10">
          <div className="mb-24 text-center">
            <h2 className="text-3xl font-serif text-slate-800 font-medium tracking-[0.1em] mb-4 transition-all duration-700">
              {getCategoryTitle()}
            </h2>
            <div className="w-10 h-[2px] bg-slate-100 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {filteredWebsites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
          {filteredWebsites.length === 0 && (
            <div className="text-center py-32 text-slate-300 font-serif italic text-xl">
              Projects coming soon...
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] animate-fade-in-up flex flex-col items-center justify-center">
      {/* Floating Back Button */}
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

      <div className="text-center p-20">
        <h2 className="text-4xl font-serif text-slate-800 mb-4">Project Detail</h2>
        <p className="text-slate-400 font-light tracking-widest uppercase text-sm italic">Coming Soon</p>
      </div>
    </div>
  );
};

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans selection:bg-slate-200">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/project/1" element={<MovieCard />} />
            <Route path="/project/2" element={<AboutMe />} />
            <Route path="/project/3" element={<PaintingCard />} />
            <Route path="/project/4" element={<ThreeDInteractiveArt />} />
            <Route path="/project/5" element={<ThreeDSaturn />} />
            <Route path="/project/6" element={<JellyfishVoxelArt />} />
            <Route path="/project/7" element={<PhotoBooth />} />
            <Route path="/project/8" element={<OceanCube />} />
            <Route path="/project/9" element={<VisitorsBook />} />
            <Route path="/project/10" element={<RainyDay />} />
            <Route path="/" element={<PortfolioContent />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;