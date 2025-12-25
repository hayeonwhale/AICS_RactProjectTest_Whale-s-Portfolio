import React, { useState } from 'react';
import PosterCanvas from './components/PosterCanvas';
import { PosterData } from './Ptypes';

// Default Data derived from the user's prompt (Monet's Poppy Field)
const DEFAULT_POSTER: PosterData = {
  // ID: 3, // id가 필요하다면 추가 (타입 정의에 따라 다를 수 있음)
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Claude_Monet_037.jpg/1200px-Claude_Monet_037.jpg",
  content: {
    title: "아르장퇴유 근처의 양귀비 들판",
    artist: "클로드 모네",
    year: "1873",
    intro: "이 작품은 프랑스-프로이센 전쟁 직후, 도시 전체가 우울하고 침체된 분위기에 잠겨 있던 시기에 그려졌다. 당시 인상주의 화가들은 이런 무겁고 답답한 현실에서 벗어나 지금 이 순간, 자연이 보여주는 찰나의 아름다움에 집중하자는 새로운 시각을 제시했다. 이 그림은 바로 그 변화의 한복판에서 태어난 작품이다.",
    pastTheme: "현실의 암울함에만 빠져 있지 말고, 지금 이 순간의 아름다움을 발견하자.",
    modernTheme: "비극적이고 통제 불가능한 삶이라도, 마음을 쉬게 해줄 작은 아름다움에 시선을 돌릴 줄 알아야 한다.",
    connection: "근대의 프랑스 사회나 오늘의 사회나, 사람들이 느끼는 현실의 무게는 크게 다르지 않다. 그럼에도 불구하고 우리는 늘 일상 속에서 잠깐씩 스쳐 지나가는 따뜻한 순간, 빛, 풍경에서 작은 위안을 발견해 왔다.",
    coreMessage: "항상 곁에 있는 작은 행복을 놓치지 말자.",
    tags: ["위로", "인상주의", "휴식"]
  }
};

const App: React.FC = () => {
  const [posterData] = useState<PosterData>(DEFAULT_POSTER);

  return (
    // 👇 [수정됨] py-10 -> pt-32 pb-20 으로 변경하여 위쪽 여백을 크게 늘렸습니다.
    <div className="min-h-screen bg-stone-100 font-sans text-ink pt-32 pb-20 px-4 flex justify-center">
      
      {/* Background Texture/Gradient */}
      <div className="fixed inset-0 bg-[#e8e6e1] opacity-50 pointer-events-none" />
        
      <div className="relative w-full max-w-5xl z-10">
          <PosterCanvas data={posterData} />
      </div>
    </div>
  );
};

export default App;

// import React, { useState } from 'react';
// import PosterCanvas from './components/PosterCanvas';
// import { PosterData } from './Ptypes';

// // Default Data derived from the user's prompt (Monet's Poppy Field)
// const DEFAULT_POSTER: PosterData = {
//   imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Claude_Monet_037.jpg/1200px-Claude_Monet_037.jpg",
//   content: {
//     title: "아르장퇴유 근처의 양귀비 들판",
//     artist: "클로드 모네",
//     year: "1873",
//     intro: "이 작품은 프랑스-프로이센 전쟁 직후, 도시 전체가 우울하고 침체된 분위기에 잠겨 있던 시기에 그려졌다. 당시 인상주의 화가들은 이런 무겁고 답답한 현실에서 벗어나 지금 이 순간, 자연이 보여주는 찰나의 아름다움에 집중하자는 새로운 시각을 제시했다. 이 그림은 바로 그 변화의 한복판에서 태어난 작품이다.",
//     pastTheme: "현실의 암울함에만 빠져 있지 말고, 지금 이 순간의 아름다움을 발견하자.",
//     modernTheme: "비극적이고 통제 불가능한 삶이라도, 마음을 쉬게 해줄 작은 아름다움에 시선을 돌릴 줄 알아야 한다.",
//     connection: "근대의 프랑스 사회나 오늘의 사회나, 사람들이 느끼는 현실의 무게는 크게 다르지 않다. 그럼에도 불구하고 우리는 늘 일상 속에서 잠깐씩 스쳐 지나가는 따뜻한 순간, 빛, 풍경에서 작은 위안을 발견해 왔다.",
//     coreMessage: "항상 곁에 있는 작은 행복을 놓치지 말자.",
//     tags: ["위로", "인상주의", "휴식"]
//   }
// };

// const App: React.FC = () => {
//   const [posterData] = useState<PosterData>(DEFAULT_POSTER);

//   return (
//     <div className="min-h-screen bg-stone-100 font-sans text-ink py-10 px-4 flex justify-center">
      
//       {/* Background Texture/Gradient */}
//       <div className="fixed inset-0 bg-[#e8e6e1] opacity-50 pointer-events-none" />
        
//       <div className="relative w-full max-w-5xl z-10">
//           <PosterCanvas data={posterData} />
//       </div>
//     </div>
//   );
// };

// export default App;