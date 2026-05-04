import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWikiData } from '../utils/api';

export default function TermDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ aciklama: '', gorsel: '' });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchWikiData(id);
      setData(result);
    };
    loadData();
  }, [id]);

  return (
    <div className="detail-container">
      {/* Geri Dön Butonu */}
      <button onClick={() => navigate(-1)} className="back-btn">← Geri Dön</button>

      <div className="term-content-wrapper">
        {/* Kelime Başlığı - Resmin Üstünde ve Ortada */}
        <h1 className="term-title">{id.toLocaleUpperCase('tr-TR')}</h1>

        {/* Görsel - Ortalanmış */}
        {data.gorsel && (
          <div className="term-image-box">
            <img src={data.gorsel} alt={id} className="term-main-img" />
          </div>
        )}

        {/* Açıklama Alanı - Buzlu Cam Efekti ve Siyah Belirgin Yazı */}
        <div className="description-glass-box">
          <p className="term-description">
            {data.aciklama}
          </p>
        </div>
      </div>

      <style>{`
        .detail-container {
          min-height: 100vh;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .term-content-wrapper {
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .term-title {
          font-size: 3rem;
          font-weight: 900;
          color: #1a1a1a;
          text-shadow: 2px 2px 4px rgba(255,255,255,0.5); /* Hafif parlama */
          margin-bottom: 10px;
          text-align: center;
        }

        .term-image-box {
          width: 100%;
          max-width: 500px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border: 4px solid white;
        }

        .term-main-img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Buzlu Cam (Glassmorphism) Efekti */
        .description-glass-box {
          background: rgba(255, 255, 255, 0.7); /* Beyaz şeffaf arka plan */
          backdrop-filter: blur(12px); /* Arkadaki resmi bulanıklaştırır */
          -webkit-backdrop-filter: blur(12px);
          border-radius: 25px;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          margin-top: 20px;
        }

        .term-description {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #000000; /* Saf siyah */
          font-weight: 700; /* Kalın font */
          text-align: justify;
        }

        .back-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          padding: 10px 20px;
          background: white;
          border: none;
          border-radius: 50px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          z-index: 100;
        }

        @media (max-width: 600px) {
          .term-title { font-size: 2rem; }
          .term-description { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}