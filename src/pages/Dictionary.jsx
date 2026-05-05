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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(displayName);
                        }} 
                        className="action-btn delete-btn"
                        title="Sil"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
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
        /* ALFABE BAR TASARIMI */
        .alphabet-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 40px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .letter-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid transparent;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.7);
          color: #4b5563;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .letter-btn:hover {
          background: #ffffff;
          color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.1);
        }

        .active-letter {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        /* IZGARA YAPISI */
        .terms-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 16px; 
          padding: 10px; 
        }
        
        /* BALONCUK (PILL) KART TASARIMI */
        .term-card { 
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          border-radius: 50px;
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 8px 16px 8px 20px; 
          min-height: 54px; 
          border: 1px solid rgba(255, 255, 255, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .term-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .term-card:hover { 
          transform: translateY(-3px) scale(1.02); 
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.12);
          background: #ffffff;
          border-color: rgba(59, 130, 246, 0.2);
          z-index: 2;
        }

        .term-card:hover::before {
          opacity: 1;
        }
        
        /* TERİM LİNK TASARIMI */
        .term-link {
          font-size: 0.9rem;
          text-decoration: none;
          color: #1f2937;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 75%;
          letter-spacing: 0.2px;
          z-index: 1;
          transition: color 0.2s ease;
        }

        .term-card:hover .term-link {
          color: #1d4ed8;
        }
        
        /* BUTON GRUBU VE EFEKTLERİ */
        .btn-group {
          display: flex;
          gap: 6px;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }
        
        .term-card:hover .btn-group {
          opacity: 1;
          transform: translateX(0);
        }
        
        .action-btn {
          background: #f3f4f6;
          border: 1px solid rgba(0,0,0,0.05);
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .icon {
          width: 14px;
          height: 14px;
        }
        
        .edit-btn {
          color: #059669;
        }
        
        .edit-btn:hover {
          background: #10b981;
          color: white;
          border-color: #10b981;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
        }
        
        .delete-btn {
          color: #dc2626;
        }
        
        .delete-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
        }

        /* BOŞ DURUM (EMPTY STATE) TASARIMI */
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 30px;
          border: 1px dashed rgba(156, 163, 175, 0.5);
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .empty-state p {
          color: #6b7280;
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
        }
        
        /* RESPONSIVE TASARIM */
        @media (max-width: 1200px) {
          .terms-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .terms-grid { grid-template-columns: repeat(2, 1fr); }
          .term-card { min-height: 48px; }
        }
        @media (max-width: 600px) {
          .terms-grid { grid-template-columns: 1fr; }
          .alphabet-container { gap: 4px; padding: 6px; }
          .letter-btn { width: 30px; height: 30px; font-size: 0.8rem; }
          /* Mobilde butonlar hep görünür olsun ki dokunmatik ekranda kullanılabilsin */
          .btn-group { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}