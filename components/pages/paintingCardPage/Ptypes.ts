// src/components/pages/paintingCardPage/Ptypes.ts

export interface PosterContent {
  title: string;
  artist: string;
  year: string;
  intro: string;
  pastTheme: string;
  modernTheme: string;
  connection: string;
  coreMessage: string;
  tags: string[];
}

// 👇 [핵심] PosterData도 추가해서 에러 해결!
export interface PosterData {
  id: number;
  imageUrl: string;
  content: PosterContent;
}