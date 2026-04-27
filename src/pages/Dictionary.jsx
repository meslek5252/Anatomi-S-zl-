import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAnatomyTerms, removeTerm } from '../utils/api';
import { ADMIN_PASSWORD } from '../utils/config';

export default function Dictionary() {
  const [terms, setTerms] = useState([]);
  const [activeLetter, setActiveLetter] = useState('A');
  
  useEffect(() => {
    const loadTerms = async () => {
      const data = await fetchAnatomyTerms();
      setTerms(data);
    };
    loadTerms();
  }, []);

  const handleRemoveTerm = async (name) => {
    const password = prompt(`'${name}' terimini silmek için yetkili şifresini girin:`);
    
    if (password && password.trim() === ADMIN_PASSWORD) {
      const updatedTerms = await removeTerm(name);
      setTerms(updatedTerms);
      alert(`'${name}' başarıyla silindi.`);
    } else if (password !== null) {
      alert("Hatalı şifre! Silme işlemi iptal edildi.");
    }
  };

  const ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
  
  // Terimleri harfe göre filtrele
  const filtered = terms.filter(t => (t.harf || (t.isim && t.isim.charAt(0).toLocaleUpperCase('tr-TR'))) === activeLetter);

  return (
    <div className="main-layout bg-transparent"> 
      <div className="content-wrapper">
        <div className="glass-box">
          
          {/* HARFLER (Mevcut yapı korundu) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
            {ALPHABET.map(l => (
              <button 
                key={l} 
                onClick={() => setActiveLetter(l)} 
                className={`letter-btn ${activeLetter === l ? 'active-letter' : 'bg-white/70 text-gray-700'}`}
              >
                {l}
              </button>
            ))}
          </div>
          
          {/* GÜNCELLENMİŞ VE DÜZELTİLMİŞ KELİME KARTLARI GRİD'İ */}
          <style>{`
            .terms-grid {
              display: grid;
              /* Ekrana göre otomatik sığan grid (Min 180px, Max 1fr) */
              grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
              gap: 15px;
              justify-content: center;
              padding: 10px;
            }

            .term-card-wrapper {
              position: relative; /* "X" butonunu içine hapsetmek için */
              background-color: white; /* Baloncuk rengi */
              border-radius: 20px; /* Yuvarlak köşeler */
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              transition: transform 0.2s; /* Hover animasyonu */
              display: flex;
              align-items: center; /* Kelimeyi dikeyde ortala */
              justify-content: center; /* Kelimeyi yatayda ortala */
              height: 60px; /* Sabit yükseklik (görüntüyü düzeltir) */
              overflow: hidden; /* Taşmaları engelle */
            }

            .term-card-wrapper:hover {
              transform: translateY(-3px); /* Hafif yukarı kalkma efekti */
            }

            .term-link-clean {
              text-decoration: none;
              color: #1f2937; /* Koyu gri yazı */
              font-weight: 600;
              text-align: center;
              padding: 10px 25px; /* "X" butonu için boşluk bırak */
              width: 100%;
              text-overflow: ellipsis; /* Çok uzun kelimeleri kırar */
              white-space: nowrap;
              overflow: hidden;
            }

            /* Şeffaf ve Baloncuğun İçindeki "X" Butonu */
            .delete-btn-integrated {
              position: absolute;
              top: 50%;
              right: 10px; /* Sağ kenara sabitle */
              transform: translateY(-50%); /* Dikeyde tam ortala */
              background: transparent;
              border: none;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.2); /* Çok şeffaf, rahatsız etmeyen gri */
              cursor: pointer;
              transition: color 0.2s, opacity 0.2s;
              padding: 5px;
              font-family: Arial, sans-serif; /* Basit bir 'X' görüntüsü için */
              opacity: 0.5; /* İlk başta daha da şeffaf */
            }

            /* Fare üzerine gelince belirginleşir */
            .term-card-wrapper:hover .delete-btn-integrated {
              color: #ef4444; /* Canlı kırmızı */
              opacity: 1;
            }
          `}</style>
          
          <div className="terms-grid">
            {filtered.map((t, i) => (
              // Kelimeyi ve silme butonunu tutan yeni yapı
              <div key={i} className="term-card-wrapper">
                <Link to={`/terim/${t.isim}`} className="term-link-clean">
                  {t.isim}
                </Link>
                {/* Şeffaf Silme Butonu */}
                <button 
                  onClick={() => handleRemoveTerm(t.isim)} 
                  className="delete-btn-integrated"
                  title={`${t.isim} terimini sil`} // Hoverda açıklama çıkar
                >
                  ✕
                </button>
              </div>
            ))}
            
            {filtered.length === 0 && (
              <div style={{gridColumn: 'span 5', textAlign: 'center', color: '#6b7280', fontStyle: 'italic', padding: '20px'}}>
                Bu harfte henüz kelime bulunmuyor.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}