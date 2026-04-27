import React, { useState } from 'react';
import { addTerm } from '../utils/api';

export default function AddTerm() {
  const [pass, setPass] = useState('');
  const [term, setTerm] = useState('');

  const executeAdd = () => {
    if (pass === "admin123") {
      addTerm(term);
      alert("Kelime başarıyla eklendi!");
    } else { alert("Hatalı Şifre!"); }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t p-6 flex justify-center items-center gap-4 z-50">
      <input type="password" placeholder="Şifre" onChange={(e) => setPass(e.target.value)} className="p-3 border rounded-xl" />
      <input type="text" placeholder="Kelime Adı" onChange={(e) => setTerm(e.target.value)} className="p-3 border rounded-xl" />
      <button onClick={executeAdd} className="bg-black text-white px-8 py-3 rounded-xl font-bold">EKLE</button>
    </div>
  );
}