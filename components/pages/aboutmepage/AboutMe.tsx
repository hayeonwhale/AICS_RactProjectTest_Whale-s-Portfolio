import React from 'react';
import { motion } from "framer-motion";

// 👇 [핵심] 외부 파일에서 불러오지 않고, 여기서 직접 정의합니다. (import 문 없음!)
interface Profile {
  name: string;
  role: string;
  location: string;
  shortBio: string;
  interests: string[];
  email: string;
  blog: string;
  instagram: string;
}

// --- Icons ---
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const MailIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const BlogIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

const InstagramIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const HeartBandageIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <defs>
            <pattern id="bandage-dots" x="0" y="0" width="1.5" height="1.5" patternUnits="userSpaceOnUse">
                <circle cx="0.5" cy="0.5" r="0.2" fill="black" opacity="0.1" />
            </pattern>
        </defs>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#bandage-dots)" />
        <rect x="7" y="7" width="10" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="8" y="8" width="8" height="4" rx="1" fill="black" fillOpacity="0.07" />
    </svg>
);

// --- UI Components ---
const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white text-slate-950 rounded-lg border border-slate-200 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  asChild?: boolean;
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  variant = 'default',
  asChild = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variantClasses = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
  };
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;

  if (asChild && React.isValidElement(children)) {
     const childProps = children.props as any;
     return React.cloneElement(children, {
       ...childProps,
       className: `${combinedClasses} ${childProps.className || ''}`,
     });
  }
  return <button className={combinedClasses} {...props}>{children}</button>;
};

// --- Data ---
const defaultProfile: Profile = {
  name: "방하연 (Hayeon Bang)",
  role: "학생",
  location: "대한민국 서울",
  shortBio: "사랑 노래처럼 살아가고자 합니다.",
  interests: ["예술 작품 만들기/보기", "고래", "달", "감성", "지브리 스튜디오 애니메이션", "<The Zone of Interest>", "생각하기", "자연 속에서 혼자 시간 보내기", "바다", "노을", "영화", "노래", "카페에서 과제하기", "겨울", "눈", "사람 관찰하기", "새로움", "친구 얘기 들어주기", "사랑"],
  email: "hayeonwhale07@gmail.com",
  blog: "https://blog.naver.com/storyofthelostletter",
  instagram: "https://www.instagram.com/rhfoyhb/",
};

// --- Main IntroCard Component ---
const IntroCard: React.FC<{ profile?: Profile }> = ({ profile = defaultProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      // 👇 위치 조정 (mt-32)
      className="max-w-sm mx-auto w-full mt-32"
    >
      <Card className="rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-white to-slate-50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center p-1 border">
              <HeartBandageIcon className="w-full h-full text-slate-200" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold leading-tight text-slate-800">{profile.name}</h2>
              <p className="text-sm text-slate-600">{profile.role}</p>
              <p className="text-xs text-slate-500 mt-1">{profile.location}</p>
            </div>
          </div>

          <CardContent className="px-0 pt-4">
            <p className="text-sm text-slate-700 mt-2">{profile.shortBio}</p>
            <div className="mt-4">
              <h3 className="text-xs text-slate-500 uppercase tracking-wide font-semibold">관심사・좋아하는 것</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map((it) => (
                  <span key={it} className="text-xs px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {it}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button asChild className="flex-1">
                <a href={`mailto:${profile.email}`} aria-label="이메일 보내기">
                  <div className="flex items-center justify-center gap-2">
                    <MailIcon size={16} />
                    <span className="text-sm">메일 보내기</span>
                  </div>
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={profile.blog} target="_blank" rel="noreferrer">
                  <div className="flex items-center gap-2">
                    <BlogIcon size={16} />
                    <span className="text-sm">블로그</span>
                  </div>
                </a>
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>프로필 업데이트: 2025-09-27</span>
              <a href={profile.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
                <InstagramIcon size={14} />
                <span>인스타그램</span>
              </a>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

export default IntroCard;


// import React from 'react';
// import { motion } from "framer-motion";

// // 👇 [핵심] 외부 파일에서 불러오지 않고, 여기서 직접 정의합니다. (import 문 없음!)
// interface Profile {
//   name: string;
//   role: string;
//   location: string;
//   shortBio: string;
//   interests: string[];
//   email: string;
//   blog: string;
//   instagram: string;
// }

// // --- Icons ---
// interface IconProps extends React.SVGProps<SVGSVGElement> {
//   size?: number;
// }

// const MailIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//     <rect width="20" height="16" x="2" y="4" rx="2" />
//     <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//   </svg>
// );

// const BlogIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//         <path d="M12 20h9" />
//         <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//     </svg>
// );

// const InstagramIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
//         <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
//         <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
//         <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
//     </svg>
// );

// const HeartBandageIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
//         <defs>
//             <pattern id="bandage-dots" x="0" y="0" width="1.5" height="1.5" patternUnits="userSpaceOnUse">
//                 <circle cx="0.5" cy="0.5" r="0.2" fill="black" opacity="0.1" />
//             </pattern>
//         </defs>
//         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
//         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#bandage-dots)" />
//         <rect x="7" y="7" width="10" height="6" rx="1.5" fill="white" fillOpacity="0.6" />
//         <rect x="8" y="8" width="8" height="4" rx="1" fill="black" fillOpacity="0.07" />
//     </svg>
// );

// // --- UI Components ---
// const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
//   <div className={`bg-white text-slate-950 rounded-lg border border-slate-200 shadow-sm ${className}`} {...props}>
//     {children}
//   </div>
// );

// const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
//   <div className={`${className}`} {...props}>
//     {children}
//   </div>
// );

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'default' | 'outline';
//   asChild?: boolean;
// }

// const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
//   children,
//   className,
//   variant = 'default',
//   asChild = false,
//   ...props
// }) => {
//   const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
//   const variantClasses = {
//     default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
//     outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
//   };
//   const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;

//   if (asChild && React.isValidElement(children)) {
//      const childProps = children.props as any;
//      return React.cloneElement(children, {
//        ...childProps,
//        className: `${combinedClasses} ${childProps.className || ''}`,
//      });
//   }
//   return <button className={combinedClasses} {...props}>{children}</button>;
// };

// // --- Data ---
// const defaultProfile: Profile = {
//   name: "방하연 (Hayeon Bang)",
//   role: "학생",
//   location: "대한민국 서울",
//   shortBio: "사랑 노래처럼 살아가고자 합니다.",
//   interests: ["예술 작품 만들기/보기", "고래", "달", "감성", "지브리 스튜디오 애니메이션", "<The Zone of Interest>", "생각하기", "자연 속에서 혼자 시간 보내기", "바다", "노을", "영화", "노래", "카페에서 과제하기", "겨울", "눈", "사람 관찰하기", "새로움", "친구 얘기 들어주기", "사랑"],
//   email: "hayeonwhale07@gmail.com",
//   blog: "https://blog.naver.com/storyofthelostletter",
//   instagram: "https://www.instagram.com/rhfoyhb/",
// };

// // --- Main IntroCard Component ---
// const IntroCard: React.FC<{ profile?: Profile }> = ({ profile = defaultProfile }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.45 }}
//       // 👇 [수정됨] mt-32를 추가하여 카드를 아래로 내렸습니다.
//       className="max-w-sm mx-auto w-full mt-32"
//     >
//       <Card className="rounded-2xl shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-br from-white to-slate-50 p-6">
//           <div className="flex items-center gap-4">
//             <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center p-1 border">
//               <HeartBandageIcon className="w-full h-full text-slate-200" />
//             </div>
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold leading-tight text-slate-800">{profile.name}</h2>
//               <p className="text-sm text-slate-600">{profile.role}</p>
//               <p className="text-xs text-slate-500 mt-1">{profile.location}</p>
//             </div>
//           </div>

//           <CardContent className="px-0 pt-4">
//             <p className="text-sm text-slate-700 mt-2">{profile.shortBio}</p>
//             <div className="mt-4">
//               <h3 className="text-xs text-slate-500 uppercase tracking-wide font-semibold">관심사・좋아하는 것</h3>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {profile.interests.map((it) => (
//                   <span key={it} className="text-xs px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
//                     {it}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-5 flex gap-2">
//               <Button asChild className="flex-1">
//                 <a href={`mailto:${profile.email}`} aria-label="이메일 보내기">
//                   <div className="flex items-center justify-center gap-2">
//                     <MailIcon size={16} />
//                     <span className="text-sm">메일 보내기</span>
//                   </div>
//                 </a>
//               </Button>
//               <Button asChild variant="outline">
//                 <a href={profile.blog} target="_blank" rel="noreferrer">
//                   <div className="flex items-center gap-2">
//                     <BlogIcon size={16} />
//                     <span className="text-sm">블로그</span>
//                   </div>
//                 </a>
//               </Button>
//             </div>

//             <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
//               <span>프로필 업데이트: 2025-09-27</span>
//               <a href={profile.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
//                 <InstagramIcon size={14} />
//                 <span>인스타그램</span>
//               </a>
//             </div>
//           </CardContent>
//         </div>
//       </Card>
//     </motion.div>
//   );
// }

// export default IntroCard;