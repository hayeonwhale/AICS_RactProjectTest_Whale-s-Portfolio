import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Note, NoteColor } from './visitorTypes';
import StickyNote from './components/StickyNote';
import NoteForm from './components/NoteForm';
import BackButton from '../../BackButton';

const App: React.FC = () => {
  const navigate = useNavigate();
  // ✅ 수정됨: useState 초기화 시 바로 localStorage를 읽어오도록 변경 (Lazy Initialization)
  // 이렇게 하면 새로고침 시 빈 배열[]이 먼저 저장되는 문제를 방지할 수 있습니다.
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('simple-memo-wall');
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error);
      return [];
    }
  });

  // ❌ 삭제됨: 기존의 '불러오기 useEffect'는 위 useState 내부 로직으로 대체되었으므로 삭제합니다.

  // ✅ 유지됨: 메모 상태(notes)가 변할 때마다 로컬 저장소에 저장 (자동 저장)
  useEffect(() => {
    try {
      localStorage.setItem('simple-memo-wall', JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error);
    }
  }, [notes]);

  const addNote = (text: string, author: string, color: NoteColor) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      text,
      author,
      color,
      // 위치를 화면 중앙 근처에 랜덤하게 배치
      x: window.innerWidth / 2 - 128 + (Math.random() - 0.5) * 100,
      y: window.innerHeight / 2 - 100 + (Math.random() - 0.5) * 100,
      rotation: (Math.random() - 0.5) * 8,
      timestamp: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  // ✅ 이 함수가 호출될 때만(삭제 버튼 클릭 시) 메모가 영구적으로 사라짐
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const moveNote = useCallback((id: string, x: number, y: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-100">
      {/* bg-stone-100 등 배경색을 살짝 넣어주면 메모가 더 잘 보입니다 (선택사항) */}

      {/* 뒤로가기 버튼 */}
      {/* 뒤로가기 버튼 */}
      <BackButton />

      {/* Header UI */}
      <header className="fixed top-0 left-0 w-full p-10 flex flex-col items-center z-[150] pointer-events-none">
        <h1 className="text-2xl font-serif font-bold text-gray-800 pt-20 tracking-[0.2em] opacity-80">
          Whatever You Leave
        </h1>
        <div className="w-8 h-[1px] bg-gray-300 mt-4 opacity-50" />
      </header>

      {/* Main Board Container */}
      <main className="w-full h-full relative z-10 pt-24">
        {notes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            <p className="font-serif italic tracking-widest opacity-40">Fill the space...</p>
          </div>
        )}

        {notes.map(note => (
          <StickyNote
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onMove={moveNote}
          />
        ))}
      </main>

      {/* Footer / Interaction area */}
      <NoteForm onAdd={addNote} />
    </div>
  );
};

export default App;