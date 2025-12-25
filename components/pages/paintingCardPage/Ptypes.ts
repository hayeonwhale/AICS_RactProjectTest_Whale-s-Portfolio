export interface PosterData {
  imageUrl: string;
  content: {
    title: string;
    artist: string;
    year: string;
    intro: string;
    pastTheme: string;
    modernTheme: string;
    connection: string;
    coreMessage: string;
    tags: string[];
  };
}