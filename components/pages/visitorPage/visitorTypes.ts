// src/components/pages/visitorPage/visitorTypes.ts

// ✅ 여기서 색깔 이름을 정확하게 정의해줘야 에러가 사라집니다.
export type NoteColor = 'white' | 'cream' | 'mint' | 'rose' | 'sky';

export interface Note {
  id: string;
  text: string;
  author: string;
  color: NoteColor;
  x: number;
  y: number;
  rotation: number;
  timestamp: number;
}

// export interface Note {
//   id: string;
//   text: string;
//   author: string;
//   color: NoteColor;
//   x: number;
//   y: number;
//   rotation: number;
//   timestamp: number;
// }

// export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange';