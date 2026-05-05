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
  
  // Güvenli filtreleme motoru
  const filtered = terms.filter(t => {
    if (!t || typeof t !== 'object') return false;
    
    let nameValue = "";
    if (typeof t.isim === 'object' && t.isim !== null) {
      nameValue = t.isim.isim || "";
    } else {
      nameValue = t.isim || "";
    }
    
    return nameValue.charAt(0).toLocaleUpperCase('tr-TR') === activeLetter;
  });

  return (
    <div className="main-layout bg-transparent" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, padding: 0 }}>
      
      <div className="content-wrapper" style={{ flex: 1, padding: '20px 30px', marginTop: '10px' }}>
        <div className="glass-box" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
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
              filtered.map((t, i) => {
                const displayName = typeof t.isim === 'object' && t.isim !== null ? t.isim.isim : t.isim;

                return (
                  <div key={i} className="term-card">
                    <Link to={`/terim/${displayName}`} className="term-link" title={displayName}>
                      {displayName}
                    </Link>

                    <div className="btn-group">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(displayName);
                        }} 
                        className="action-btn edit-btn"
                        title="Düzenle"
                      >
                        ✎
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(displayName);
                        }} 
                        className="action-btn delete-btn"
                        title="Sil"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#4b5563', padding: '30px' }}>
                Bu harfle başlayan terim bulunamadı.
              </p>
            )}
          </div>
          
        </div>
      </div>

      <style>{`
        .letter-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.9);
          color: #374151;
          transition: all 0.15s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .letter-btn:hover, .active-letter {
          background: #2563eb;
          color: white;
          transform: translateY(-1px);
        }
        
        .terms-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 12px; 
          padding: 8px; 
        }
        
        .term-card { 
          background: rgba(255, 255, 255, 0.85); 
          border-radius: 20px;
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 4px 14px; 
          height: 34px; 
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          transition: all 0.15s ease;
          width: 100%;
          box-sizing: border-box;
        }
        
        .term-card:hover { 
          transform: translateY(-1px); 
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(37, 99, 235, 0.2);
        }
        
        .term-link {
          font-size: 0.7rem;
          text-decoration: none;
          color: #111827;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70%;
        }
        
        .btn-group {
          display: flex;
          gap: 6px;
          opacity: 0.35;
          transition: opacity 0.15s ease;
        }
        
        .term-card:hover .btn-group {
          opacity: 1;
        }
        
        .action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
        }
        
        .edit-btn {
          color: #16a34a;
        }
        
        .edit-btn:hover {
          background: rgba(22, 163, 74, 0.12);
        }
        
        .delete-btn {
          color: #dc2626;
        }
        
        .delete-btn:hover {
          background: rgba(220, 38, 38, 0.12);
        }
        
        @media (max-width: 1200px) {
          .terms-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .terms-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .terms-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}