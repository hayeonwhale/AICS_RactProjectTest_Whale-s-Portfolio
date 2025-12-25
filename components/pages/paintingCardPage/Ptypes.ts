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

export interface PosterData {
  imageUrl: string;
  content: PosterContent;
}

export enum ViewMode {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW'
}