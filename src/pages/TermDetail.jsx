import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnatomyTerms, fetchWikiData } from '../utils/api';

export default function TermDetail() {
  const { isim } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ aciklama: 'Yükleniyor...', gorsel: '' });

  useEffect(() => {
    const loadData = async () => {
      if (!isim) return;

      try {
        
        const terms = await fetchAnatomyTerms();
        
        
        const foundTerm = terms.find(t => {
          const termName = typeof t.isim === 'object' && t.isim !== null ? t.isim.isim : t.isim;
          return termName === isim;
        });

        
        if (foundTerm && foundTerm.aciklama && foundTerm.aciklama.trim() !== "") {
          setData({
            aciklama: foundTerm.aciklama,
            gorsel: foundTerm.gorsel || ''
          });
        } else {
          
          try {
            const wikiResult = await fetchWikiData(isim);
            if (wikiResult && (wikiResult.aciklama || wikiResult.gorsel)) {
              setData({
                aciklama: wikiResult.aciklama || 'Bu terim için Wikipedia açıklaması bulunamadı.',
                gorsel: wikiResult.gorsel || ''
              });
            } else {
              setData({ 
                aciklama: 'Bu terime ait herhangi bir açıklama bulunamadı.', 
                gorsel: '' 
              });
            }
          } catch (wikiError) {
            
            setData({
              aciklama: foundTerm ? 'Bu terim sistemde bulunuyor ancak açıklaması girilmemiş.' : 'Bu terim sistemde bulunamadı.',
              gorsel: foundTerm?.gorsel || ''
            });
          }
        }
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
        setData({ 
          aciklama: 'Veriler yüklenirken bir hata oluştu.', 
          gorsel: '' 
        });
      }
    };

    loadData();
  }, [isim]);

  return (
    <div className="main-layout bg-transparent" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="content-wrapper" style={{ flex: 1, padding: '20px 0' }}>
        <div className="detail-container">
          
          <button onClick={() => navigate(-1)} className="back-btn">← Geri Dön</button>

          <div className="term-content-wrapper">
            <h1 className="term-title">
              {isim ? String(isim).toLocaleUpperCase('tr-TR') : 'Yükleniyor...'}
            </h1>

            {data.gorsel && (
              <div className="term-image-box">
                <img src={data.gorsel} alt={isim || ''} className="term-main-img" />
              </div>
            )}

            <div className="description-glass-box">
              <p className="term-description">
                {data.aciklama}
              </p>
            </div>
          </div>

          <style>{`
            .detail-container {
              min-height: 75vh;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
              position: relative;
            }
            .term-content-wrapper {
              max-width: 750px;
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 24px;
            }
            .term-title {
              font-size: 2.8rem;
              font-weight: 900;
              color: #1a1a1a;
              text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.6);
              margin-bottom: 5px;
              text-align: center;
            }
            .term-image-box {
              width: 100%;
              max-width: 450px;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(0,0,0,0.18);
              border: 4px solid #ffffff;
            }
            .term-main-img {
              width: 100%;
              height: auto;
              display: block;
            }
            .description-glass-box {
              background: rgba(255, 255, 255, 0.75);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              border-radius: 24px;
              padding: 32px;
              border: 1px solid rgba(255, 255, 255, 0.35);
              box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
              width: 100%;
            }
            .term-description {
              font-size: 1.25rem;
              line-height: 1.8;
              color: #000000;
              font-weight: 700;
              text-align: justify;
              margin: 0;
            }
            .back-btn {
              position: absolute;
              top: 20px;
              left: 20px;
              padding: 10px 22px;
              background: #ffffff;
              border: none;
              border-radius: 50px;
              font-weight: 700;
              color: #333;
              cursor: pointer;
              box-shadow: 0 4px 10px rgba(0,0,0,0.08);
              transition: transform 0.2s;
              z-index: 100;
            }
            .back-btn:hover {
              transform: translateY(-2px);
            }
            @media (max-width: 768px) {
              .back-btn {
                position: static;
                margin-bottom: 10px;
              }
              .term-title { font-size: 2.2rem; }
              .term-description { font-size: 1.05rem; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}