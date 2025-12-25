
import React, { useState } from 'react';
import { Note, NoteColor } from '../visitorTypes';
import { Trash2 } from 'lucide-react';

interface StickyNoteProps {
  note: Note;
  onDelete: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

const colorClasses: Record<NoteColor, string> = {
  white: 'bg-white border-gray-100 text-gray-800',
  cream: 'bg-[#fffdf0] border-[#f5f1da] text-gray-800',
  mint: 'bg-[#f0f9f4] border-[#e0f0e6] text-gray-800',
  rose: 'bg-[#fff5f5] border-[#fbe4e4] text-gray-800',
  sky: 'bg-[#f0f7ff] border-[#e1effe] text-gray-800',
};

const StickyNote: React.FC<StickyNoteProps> = ({ note, onDelete, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      onMove(note.id, e.clientX - offset.x, e.clientY - offset.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`sticky-note absolute p-6 w-64 min-h-[12rem] shadow-soft border rounded-sm cursor-grab active:cursor-grabbing select-none flex flex-col justify-between group ${colorClasses[note.color]}`}
      style={{
        left: note.x,
        top: note.y,
        transform: `rotate(${note.rotation}deg)`,
        zIndex: isDragging ? 100 : 10,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex-1">
        <p className="font-handwriting text-2xl leading-relaxed break-words opacity-90">
          {note.text}
        </p>
      </div>
      
      <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
        <span className="text-[12px] font-serif tracking-tight opacity-40">
          {note.author || 'Anonymous'}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-black/5 rounded-full transition-all text-gray-300 hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default StickyNote;
