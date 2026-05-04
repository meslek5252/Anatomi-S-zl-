import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="main-layout bg-transparent">
      <div className="content-wrapper">
        <div className="glass-box text-center p-12">
          
          {/* Görsel Bölümü */}
          <img 
            src="https://i.hizliresim.com/1vjg1ir.png"
            alt="Anatomi ve Fizyoloji Görseli"
            style={{ 
              width: '100%', 
              maxWidth: '350px', 
              margin: '0 auto 20px auto', 
              borderRadius: '20px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
            }} 
          />

          {/* Başlık ve Metin Bölümü */}
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Anatomi & Fizyoloji
          </h1>
          
          <p style={{ color: '#4b5563', marginBottom: '30px', fontSize: '18px', fontWeight: '500' }}>
            Sağlık & Tıbbi Terimler Sözlüğü
          </p>
          
          {/* Buton Bölümü */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link to="/sozluk" style={{ 
              padding: '12px 24px', 
              background: '#0284c7', 
              color: 'white', 
              borderRadius: '25px', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)', 
              transition: 'all 0.2s ease' 
            }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
              Sözlüğü Keşfet
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}