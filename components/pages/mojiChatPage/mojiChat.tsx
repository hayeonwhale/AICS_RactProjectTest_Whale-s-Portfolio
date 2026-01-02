import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sender, Message } from './chatTypes';
import { sendMessageToGemini } from './services/geminiService';
import { ChatBubble } from './components/ChatBubble';
import { Button } from './components/Button';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      text: '( ^_^)／',
      sender: Sender.AI,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Only scroll if messages length increases (new message added by user or AI)
    // Initial length is 1, so we wait for > 1 to avoid scroll on mount
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages.length]);

  // Keep focus on input when loading finishes, but prevent scroll
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    // Ensure focus remains immediately after submit, prevent scroll
    inputRef.current?.focus({ preventScroll: true });

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: Sender.USER,
      timestamp: new Date(),
    };

    // Optimistically update UI
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const aiResponseText = await sendMessageToGemini(messages, userText);

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: Sender.AI,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap');
          .font-gaegu {
            font-family: 'Gaegu', cursive;
          }
          .bg-polka-dot {
            background-color: #fffdf5;
            background-image: radial-gradient(#ffc8dd 20%, transparent 20%);
            background-size: 20px 20px;
          }
        `}
      </style>

      {/* Floating Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed bottom-10 left-10 z-[60] w-14 h-14 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        aria-label="Back to home"
      >
        <svg
          className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Main Container */}
      <div className="min-h-screen bg-polka-dot font-gaegu flex items-center justify-center p-4 pt-24">

        {/* Chat Phone/Card Container */}
        <div className="flex flex-col w-full max-w-md h-[80vh] bg-[#fffdf5] border-4 border-gray-800 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">

          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b-4 border-gray-800 bg-[#ffafcc] relative z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#bde0fe] border-2 border-gray-800 rounded-full flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] animate-[bounce_3s_infinite]">
                <span className="text-xl">🧸</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold leading-none text-gray-900 tracking-wide">MojiChat</h1>
                <p className="text-xs text-gray-800 font-bold bg-white/50 px-2 py-0.5 rounded-full inline-block mt-0.5 self-start">
                  Only Emoji Talk 🎀
                </p>
              </div>
            </div>
            <div className="text-3xl animate-pulse">
              💖
            </div>
          </header>

          {/* Chat Area */}
          <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex justify-start w-full pl-2">
                <div className="bg-[#e0fbfc] border-2 border-gray-800 rounded-3xl rounded-tl-none px-5 py-2 shadow-[-3px_3px_0px_0px_rgba(0,0,0,1)] flex gap-2 items-center">
                  <span className="text-gray-900 font-bold">Thinking</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Input Area */}
          <footer className="p-3 bg-[#fff0f3] border-t-4 border-gray-800 shrink-0">
            <form
              onSubmit={handleSend}
              className="relative flex items-end gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here..."
                className="w-full bg-white text-lg text-gray-900 p-3 pr-4 border-2 border-gray-800 rounded-xl outline-none focus:bg-[#f0f8ff] focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all placeholder:text-gray-300 disabled:opacity-50"
              />
              <Button
                type="submit"
                variant="icon"
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 shrink-0 mb-0"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-gray-900"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </Button>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;