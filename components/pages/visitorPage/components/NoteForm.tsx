
import React, { useState } from 'react';
import { NoteColor } from '../visitorTypes';
import { Plus } from 'lucide-react';

interface NoteFormProps {
  onAdd: (text: string, author: string, color: NoteColor) => void;
}

const colors: NoteColor[] = ['white', 'cream', 'mint', 'rose', 'sky'];

const NoteForm: React.FC<NoteFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedColor, setSelectedColor] = useState<NoteColor>('white');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, author || 'Anonymous', selectedColor);
    setText('');
    setAuthor('');
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mb-12 mt-10 px-6 z-[200]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-4"
      >
        <div className="flex justify-between items-center px-1">
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full border transition-all ${selectedColor === color ? 'border-gray-800 scale-125' : 'border-gray-200'
                  } ${color === 'white' ? 'bg-white' :
                    color === 'cream' ? 'bg-[#fffdf0]' :
                      color === 'mint' ? 'bg-[#f0f9f4]' :
                        color === 'rose' ? 'bg-[#fff5f5]' : 'bg-[#f0f7ff]'
                  }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-serif text-gray-400 tracking-widest uppercase">Add Memory</span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full h-24 p-2 bg-transparent border-none focus:ring-0 outline-none resize-none font-handwriting text-2xl placeholder:text-gray-300"
          maxLength={120}
        />

        <div className="flex items-center gap-4">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="flex-1 bg-transparent border-b border-gray-100 py-1 text-sm font-serif focus:border-gray-300 outline-none transition-colors placeholder:text-gray-300"
          />

          <button
            type="submit"
            disabled={!text.trim()}
            className="px-5 py-2 bg-gray-900 text-white rounded-full hover:bg-black disabled:opacity-20 transition-all flex items-center gap-2 text-sm font-serif shadow-lg active:scale-95"
          >
            <Plus size={16} />
            Add Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
