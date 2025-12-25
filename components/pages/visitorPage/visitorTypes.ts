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

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange';