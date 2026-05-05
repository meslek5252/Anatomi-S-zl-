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
      
      <div className="content-wrapper" style={{ flex: 1, padding: '20px 40px', marginTop: '10px' }}>
        <div className="glass-box" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
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
                  <div key={i} className="term-card-wrapper">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(displayName);
                      }} 
                      className="edit-btn"
                      title="Düzenle"
                    >
                      ✎
                    </button>
                    
                    <Link to={`/terim/${displayName}`} className="term-link" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', color: '#1f2937', fontWeight: '600' }}>
                      {displayName}
                    </Link>

                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(displayName);
                      }} 
                      className="delete-btn"
                      title="Sil"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#4b5563', padding: '40px' }}>
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
          border-radius: 8px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.85);
          color: #374151;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .letter-btn:hover, .active-letter {
          background: #2563eb;
          color: white;
        }
        .terms-grid { 
          display: grid; 
          grid-template-columns: repeat(4, minmax(200px, 1fr)); 
          gap: 12px; 
          padding: 8px; 
          justify-content: center;
        }
        .term-card-wrapper { 
          position: relative; 
          background: rgba(255, 255, 255, 0.95); 
          border-radius: 50px; /* Baloncuk (oval/kapsül) görünümü */
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 0 16px; 
          height: 40px; /* İstediğiniz daha küçük ve kibar boyut */
          box-shadow: 0 1px 3px rgba(0,0,0,0.06); 
          transition: transform 0.2s, box-shadow 0.2s; 
          border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
          width: 100%;
        }
        .term-card-wrapper:hover { 
          transform: translateY(-1px); 
          box-shadow: 0 3px 6px rgba(0,0,0,0.08);
        }
        .term-link {
          font-size: 0.78rem; /* Fontu küçülttük */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 6px;
        }
        .edit-btn { 
          background: none; 
          border: none; 
          color: #16a34a; 
          cursor: pointer; 
          padding: 4px; 
          opacity: 0; 
          font-size: 0.9rem;
          transition: opacity 0.2s;
        }
        .term-card-wrapper:hover .edit-btn { opacity: 1; }
        
        .delete-btn { 
          background: none; 
          border: none; 
          color: #dc2626; 
          cursor: pointer; 
          padding: 4px; 
          opacity: 0; 
          font-size: 0.9rem;
          transition: opacity 0.2s;
        }
        .term-card-wrapper:hover .delete-btn { opacity: 1; }
        
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