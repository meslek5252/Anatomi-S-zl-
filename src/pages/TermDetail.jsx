import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWikiData } from '../utils/api';
import Footer from '../components/Footer';

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
    <div className="main-layout bg-transparent">
      <div className="content-wrapper">
        <div className="detail-container">
          
          {/* Geri Dön Butonu */}
          <button onClick={() => navigate(-1)} className="back-btn">← Geri Dön</button>

          <div className="detail-header">
            <h1 className="term-title">{id.toLocaleUpperCase('tr-TR')}</h1>
          </div>

          <div className="detail-content">
            {data.gorsel && (
              <div className="term-image-box">
                <img src={data.gorsel} alt={id} className="term-main-img" />
              </div>
            )}
            
            <div className="term-text-box">
              <p className="term-description">
                {data.aciklama}
              </p>
            </div>
          </div>

          <style>{`
            .detail-container {
              min-height: 70vh;
              padding: 40px 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
            }

            .detail-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              max-width: 900px;
              margin-bottom: 30px;
            }

            .term-title {
              font-size: 2.5rem;
              font-weight: 800;
              color: #1f2937;
              margin: 0 auto;
            }

            .detail-content {
              display: flex;
              gap: 40px;
              max-width: 900px;
              width: 100%;
              align-items: flex-start;
              background: rgba(255, 255, 255, 0.6);
              padding: 30px;
              border-radius: 25px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            }

            .term-image-box {
              flex: 1;
              max-width: 350px;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .term-main-img {
              width: 100%;
              height: 250px;
              object-fit: cover;
              display: block;
            }

            .term-text-box {
              flex: 2;
            }

            .term-description {
              font-size: 1.2rem;
              line-height: 1.8;
              color: #000000;
              font-weight: 700;
              text-align: justify;
            }

            .back-btn {
              position: absolute;
              top: 40px;
              left: 40px;
              padding: 8px 18px;
              background: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 50px;
              font-weight: 600;
              color: #4b5563;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              transition: all 0.2s;
            }

            .back-btn:hover {
              background: #f3f4f6;
            }

            @media (max-width: 768px) {
              .detail-content {
                flex-direction: column;
                align-items: center;
                gap: 20px;
              }
              .term-image-box {
                max-width: 100%;
                width: 100%;
              }
              .term-main-img {
                height: 200px;
              }
              .back-btn {
                position: static;
                margin-bottom: 20px;
              }
            }
          `}</style>
        </div>
      </div>
      <Footer />
    </div>
  );
}