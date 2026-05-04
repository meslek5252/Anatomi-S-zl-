import React from 'react';
import { ADMIN_PASSWORD } from '../utils/config';
import { addTerm, removeTerm, updateTerm } from '../utils/api';

export default function Footer() {
  const handleAction = async (type) => {
    const termName = prompt("İşlem yapılacak terim adı:");
    if (!termName) return;
    const password = prompt("Yönetici şifresi:");
    
    if (password && password.trim() === ADMIN_PASSWORD) {
      if (type === 'add') {
        await addTerm(termName);
        alert("Eklendi!");
      } else if (type === 'edit') {
        const newName = prompt("Yeni isim:", termName);
        if (newName) {
          await updateTerm(termName, newName);
          alert("Düzenlendi!");
        }
      } else {
        await removeTerm(termName);
        alert("Silindi!");
      }
    } else {
      alert("Hata: Yetkisiz erişim!");
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="address-text">
          <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Ordu/Altınordu Atatürk Mesleki ve Teknik Anadolu Lisesi</p>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>İletişim: <a href="mailto:miracardabayr@gmail.com" style={{ color: '#0284c7', textDecoration: 'none' }}>miracardabayr@gmail.com</a></p>
        </div>
        <div className="action-buttons">
          <button onClick={() => handleAction('add')} className="action-btn">+ Yeni Ekle</button>
          <button onClick={() => handleAction('edit')} className="action-btn">✎ Düzenle</button>
          <button onClick={() => handleAction('delete')} className="action-btn">× Terim Sil</button>
        </div>
      </div>
      <style>{`
        .site-footer {
          width: 100%;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(229, 231, 235, 0.5);
          padding: 15px 30px;
          margin-top: auto;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 15px;
        }
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          padding: 6px 14px;
          border-radius: 20px;
          border: none;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          background: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}