import React from 'react';
import { ADMIN_PASSWORD } from '../utils/config';
import { addTerm, removeTerm, updateTerm } from '../utils/api';

export default function Footer() {
  const handleAction = async (type) => {
    const termName = prompt("İşlem yapılacak terim adı:");
    if (!termName) return;
    const password = prompt("Yönetici şifresi:");
    
    if (password && password.trim() === ADMIN_PASSWORD) {
      if (type === 'add') { await addTerm(termName); alert("Eklendi!"); }
      else if (type === 'edit') {
        const newName = prompt("Yeni isim:");
        await updateTerm(termName, newName);
        alert("Düzenlendi!");
      } else { await removeTerm(termName); alert("Silindi!"); }
    } else { alert("Hata: Yetkisiz erişim!"); }
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="address-text">
          <p style={{ fontWeight: '600' }}>Ordu/Altınordu Atatürk Mesleki ve Teknik Anadolu Lisesi</p>
          <p style={{ fontSize: '13px', color: '#666' }}>İletişim: <a href="mailto:miracardabayr@gmail.com">miracardabayr@gmail.com</a></p>
        </div>
        <div className="action-buttons">
          <button onClick={() => handleAction('add')} className="action-btn">+ Yeni Ekle</button>
          <button onClick={() => handleAction('edit')} className="action-btn">✎ Düzenle</button>
          <button onClick={() => handleAction('delete')} className="action-btn">× Terim Sil</button>
        </div>
      </div>
    </footer>
  );
}