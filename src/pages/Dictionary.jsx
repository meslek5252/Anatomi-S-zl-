import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnatomyTerms, removeTerm, updateTerm } from '../utils/api';
import { ADMIN_PASSWORD } from '../utils/config';

export default function Dictionary() {
  const [terms, setTerms] = useState([]);
  const [activeLetter, setActiveLetter] = useState('A');

  useEffect(() => {
    const loadTerms = async () => { setTerms(await fetchAnatomyTerms()); };
    loadTerms();
  }, []);

  const handleEdit = async (oldName) => {
    const pass = prompt("Düzenleme için şifre girin:");
    if (pass && pass.trim() === ADMIN_PASSWORD) {
      const newName = prompt("Yeni isim girin:", oldName);
      if (newName) {
        const updated = await updateTerm(oldName, newName);
        setTerms(updated);
      }
    } else if (pass !== null) { alert("Hatalı şifre!"); }
  };

  const handleRemove = async (name) => {
    const pass = prompt("Silme için şifre girin:");
    if (pass && pass.trim() === ADMIN_PASSWORD) {
      setTerms(await removeTerm(name));
    } else if (pass !== null) { alert("Hatalı şifre!"); }
  };

  const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
  const filtered = terms.filter(t => (t.harf || (t.isim && t.isim.charAt(0).toLocaleUpperCase('tr-TR'))) === activeLetter);

  return (
    <div className="main-layout bg-transparent">
      <div className="content-wrapper">
        <div className="glass-box">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
            {ALPHABET.map(l => (
              <button key={l} onClick={() => setActiveLetter(l)} className={`letter-btn ${activeLetter === l ? 'active-letter' : 'bg-white/70 text-gray-700'}`}>
                {l}
              </button>
            ))}
          </div>
          
          <style>{`
            .terms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; padding: 10px; }
            .term-card-wrapper { position: relative; background: white; border-radius: 20px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px; height: 60px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: transform 0.2s; }
            .term-card-wrapper:hover { transform: translateY(-3px); }
            .edit-btn { background: none; border: none; color: rgba(34, 197, 94, 0.3); cursor: pointer; padding: 5px; opacity: 0.5; }
            .delete-btn { background: none; border: none; color: rgba(239, 68, 68, 0.3); cursor: pointer; padding: 5px; opacity: 0.5; }
            .term-card-wrapper:hover .edit-btn { color: #22c55e; opacity: 1; }
            .term-card-wrapper:hover .delete-btn { color: #ef4444; opacity: 1; }
          `}</style>
          
          <div className="terms-grid">
            {filtered.map((t, i) => (
              <div key={i} className="term-card-wrapper">
                <button onClick={() => handleEdit(t.isim)} className="edit-btn">✎</button>
                <Link to={`/terim/${t.isim}`} style={{ flex: 1, textAlign: 'center', textDecoration: 'none', color: '#1f2937', fontWeight: '600' }}>{t.isim}</Link>
                <button onClick={() => handleRemove(t.isim)} className="delete-btn">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}