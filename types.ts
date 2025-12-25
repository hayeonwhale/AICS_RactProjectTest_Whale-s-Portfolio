export interface Website {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  tags: string[];
  category: 'visual' | 'art' | 'playground';
}