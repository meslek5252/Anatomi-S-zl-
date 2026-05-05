import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnatomyTerms, removeTerm, updateTerm } from '../utils/api';
import { ADMIN_PASSWORD } from '../utils/config';

export default function Dictionary() {
  const [terms, setTerms] = useState([]);
  const [activeLetter, setActiveLetter] = useState('A');

  useEffect(() => {
    const loadTerms = async () => { 
      const data = await fetchAnatomyTerms();
      setTerms(data || []); 
    };
    loadTerms();
  }, []);

  const handleEdit = async (oldName) => {
    const pass = prompt("Düzenleme için şifre girin:");
    if (pass && pass.trim() === ADMIN_PASSWORD) {
      const newName = prompt("Yeni isim girin:", oldName);
      const newDesc = prompt("Yeni açıklama metnini girin:");
      const newImg = prompt("Yeni görsel URL'ini girin:");

      const updated = await updateTerm(oldName, newName, newDesc, newImg);
      setTerms(updated);
    } else if (pass !== null) { 
      alert("Hatalı şifre!"); 
    }
  };

  const handleRemove = async (name) => {
    const pass = prompt("Silme için şifre girin:");
    if (pass && pass.trim() === ADMIN_PASSWORD) {
      const updated = await removeTerm(name);
      setTerms(updated);
    } else if (pass !== null) { 
      alert("Hatalı şifre!"); 
    }
  };

  const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
  
  // Güvenli filtreleme: Dönen verinin nesne olup olmadığını ve isim içerip içermediğini kontrol eder
  const filtered = terms.filter(t => {
    if (!t || typeof t !== 'object') return false;
    const currentName = t.isim || "";
    return currentName.charAt(0).toLocaleUpperCase('tr-TR') === activeLetter;
  });

  return (
    <div className="main-layout bg-transparent" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="content-wrapper" style={{ flex: 1, minHeight: '80vh', padding: '20px' }}>
        <div className="glass-box">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', marginBottom: '30px' }}>
            {ALPHABET.map(l => (
              <button 
                key={l} 
                onClick={() => setActiveLetter(l)} 
                className={`letter-btn ${activeLetter === l ? 'active-letter' : ''}`}
              >
                {l}
              </button>
            ))}
          </div>
          
          <div className="terms-grid">
            {filtered.length > 0 ? (
              filtered.map((t, i) => (
                <div key={i} className="term-card-wrapper">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(t.isim);
                    }} 
                    className="edit-btn"
                  >
                    ✎
                  </button>
                  
                  <Link to={`/terim/${t.isim}`} className="term-link" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', color: '#1f2937', fontWeight: '600' }}>
                    {t.isim}
                  </Link>

                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(t.isim);
                    }} 
                    className="delete-btn"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#4b5563' }}>Bu harfle başlayan terim bulunamadı.</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .letter-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.7);
          color: #374151;
          transition: all 0.2s;
        }
        .letter-btn:hover, .active-letter {
          background: #2563eb;
          color: white;
        }
        .terms-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
          gap: 15px; 
          padding: 10px; 
        }
        .term-card-wrapper { 
          position: relative; 
          background: white; 
          border-radius: 20px; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 0 10px; 
          height: 60px; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); 
          transition: transform 0.2s; 
        }
        .term-card-wrapper:hover { transform: translateY(-3px); }
        .edit-btn { background: none; border: none; color: #22c55e; cursor: pointer; padding: 5px; opacity: 0.5; }
        .term-card-wrapper:hover .edit-btn { opacity: 1; }
        .delete-btn { background: none; border: none; color: #ef4444; cursor: pointer; padding: 5px; opacity: 0.5; }
        .term-card-wrapper:hover .delete-btn { opacity: 1; }
      `}</style>
    </div>
  );
}