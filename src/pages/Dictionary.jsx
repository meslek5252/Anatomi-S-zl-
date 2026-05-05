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

  const handleEdit = async () => {}; // Hatalı tanımı önlemek için temizlendi

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
      
      <div className="content-wrapper" style={{ flex: 1, padding: '40px 20px', marginTop: '10px' }}>
        <div className="glass-box" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
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
                    {/* Düzenle Butonu (Kalem Simgesi) */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(displayName);
                      }} 
                      className="action-btn edit-btn"
                      title="Düzenle"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </button>

                    <Link to={`/terim/${displayName}`} className="term-link" title={displayName}>
                      {displayName}
                    </Link>

                    {/* Sil Butonu (Çöp Kutusu Simgesi) */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(displayName);
                      }} 
                      className="action-btn delete-btn"
                      title="Sil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <p>Bu harfle başlayan terim bulunamadı.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>

      <style>{`
        .alphabet-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 40px;
          padding: 12px;
          background: rgba(250, 245, 235, 0.5);
          border-radius: 24px;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(230, 215, 195, 0.6);
        }

        .letter-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid transparent;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.75);
          color: #594a3e;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .letter-btn:hover {
          background: #ffffff;
          color: #c48b64;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(196, 139, 100, 0.15);
        }

        .active-letter {
          background: #c48b64;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(196, 139, 100, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .terms-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 12px; 
          padding: 6px; 
        }
        
        .term-card { 
          background: #faf8f5;
          border-radius: 50px;
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 4px 10px; 
          min-height: 40px;
          border: 1px solid #e1d5c9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          box-sizing: border-box;
        }

        .term-card:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 6px 15px rgba(196, 139, 100, 0.08);
          background: #ffffff;
          border-color: #c48b64;
        }
        
        .term-link {
          font-size: 0.82rem;
          text-decoration: none;
          color: #443c34;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 50%;
          letter-spacing: 0.1px;
          transition: color 0.2s ease;
        }

        .term-card:hover .term-link {
          color: #8b5a3e;
        }
        
        .action-btn {
          border: none;
          cursor: pointer;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .edit-btn {
          background: rgba(46, 139, 87, 0.18);
          color: #2e8b57;
        }
        
        .edit-btn:hover {
          background: #2e8b57;
          color: white;
          box-shadow: 0 2px 6px rgba(46, 139, 87, 0.3);
        }
        
        .delete-btn {
          background: rgba(178, 34, 34, 0.18);
          color: #b22222;
        }
        
        .delete-btn:hover {
          background: #b22222;
          color: white;
          box-shadow: 0 2px 6px rgba(178, 34, 34, 0.3);
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 30px;
          border: 1px dashed #d1c7bd;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .empty-state p {
          color: #8a7a6c;
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
        }
        
        @media (max-width: 1200px) {
          .terms-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .terms-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .terms-grid { grid-template-columns: 1fr; }
          .alphabet-container { gap: 4px; padding: 6px; }
          .letter-btn { width: 28px; height: 28px; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}