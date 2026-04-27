import React from 'react';
const TR = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

export default function LetterMenu({ activeLetter, setActiveLetter }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl flex justify-center gap-1 overflow-x-auto no-scrollbar">
        {TR.map(l => (
          <button key={l} onClick={() => setActiveLetter(l)} 
            className={`w-9 h-9 rounded-lg font-bold text-sm ${activeLetter === l ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}