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

  const handleEdit = async (termObject) => {
    // Nesne içinden mevcut alanları güvenli bir şekilde alıyoruz
    const oldName = typeof termObject.isim === 'object' && termObject.isim !== null 
      ? termObject.isim.isim 
      : termObject.isim;
    const oldDesc = termObject.aciklama || "";
    const oldImg = termObject.gorsel || "";

    const pass = prompt("Düzenleme için şifre girin:");
    if (pass && pass.trim() === ADMIN_PASSWORD) {
      const newName = prompt("Yeni isim girin:", oldName);
      
      // Prompt değerlerinin doğru okunmasını sağlamak için doğrudan değişkenlere alıyoruz
      const descInput = prompt("Yeni açıklama metnini girin:", oldDesc);
      const imgInput = prompt("Yeni görsel URL'ini girin:", oldImg);

      if (newName !== null) {
        // Kullanıcı iptal etmediği sürece yeni veya eski değerleri koruyarak atama yapıyoruz
        const newDesc = descInput !== null ? descInput : oldDesc;
        const newImg = imgInput !== null ? imgInput : oldImg;

        const updated = await updateTerm(oldName, newName, newDesc, newImg);
        if (updated) {
          setTerms(updated);
          alert("Terim başarıyla güncellendi.");
        }
      }
    } else if (pass !== null) { 
      alert("Hatalı şifre!"); 
    }
  };

  const handleRemove = async (name) => {
    const pass = prompt("Silme için şifre girin:");
    if (pass && pass.trim() === ADMIN_PASSWORD) {
      const updated = await removeTerm(name);
      if (updated) {
        setTerms(updated);
        alert("Terim başarıyla silindi.");
      }
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
                    {/* Düzenle Butonu */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(t);
                      }} 
                      className="action-btn edit-btn"
                      title="Düzenle"
                      style={{ 
                        padding: '6px 12px', 
                        background: '#0284c7', 
                        color: 'white', 
                        borderRadius: '20px', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Düzenle
                    </button>

                    <Link to={`/terim/${displayName}`} className="term-link" title={displayName}>
                      {displayName}
                    </Link>

                    {/* Sil Butonu */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(displayName);
                      }} 
                      className="action-btn delete-btn"
                      title="Sil"
                      style={{ 
                        padding: '6px 12px', 
                        background: '#e11d48', 
                        color: 'white', 
                        borderRadius: '20px', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(225, 29, 72, 0.3)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Sil
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
          grid-template-columns: repeat(2, 1fr); 
          gap: 20px; 
          padding: 6px; 
        }
        
        .term-card { 
          background: #faf8f5;
          border-radius: 20px;
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 12px 24px; 
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
          font-size: 0.95rem;
          text-decoration: none;
          color: #443c34;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 40%;
          letter-spacing: 0.2px;
          transition: color 0.2s ease;
          text-align: center;
        }

        .term-card:hover .term-link {
          color: #8b5a3e;
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
          .terms-grid { grid-template-columns: repeat(1, 1fr); }
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