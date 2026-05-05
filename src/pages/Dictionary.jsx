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
          
          <div className="alphabet-container">
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
        .alphabet-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-bottom: 28px;
        }

        .letter-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: none;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.88);
          color: #374151;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }
        
        .letter-btn:hover, .active-letter {
          background: #2563eb;
          color: white;
          transform: translateY(-1px);
        }
        
        .terms-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 10px; 
          padding: 6px; 
          justify-content: center;
        }
        
        .term-card { 
          background: rgba(255, 255, 255, 0.92); 
          border-radius: 9999px;
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 0 12px; 
          height: 30px; 
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: all 0.15s ease;
          width: 100%;
          box-sizing: border-box;
          overflow: visible;
        }
        
        .term-card:hover { 
          transform: translateY(-1px); 
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06);
          background: #ffffff;
          border-color: rgba(37, 99, 235, 0.2);
        }
        
        .term-link {
          font-size: 0.65rem;
          text-decoration: none;
          color: #111827;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 68%;
          line-height: 28px;
        }
        
        .btn-group {
          display: flex;
          gap: 4px;
          opacity: 0.4;
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
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
        }
        
        .edit-btn {
          color: #16a34a;
        }
        
        .edit-btn:hover {
          background: rgba(22, 163, 74, 0.15);
        }
        
        .delete-btn {
          color: #dc2626;
        }
        
        .delete-btn:hover {
          background: rgba(220, 38, 38, 0.15);
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