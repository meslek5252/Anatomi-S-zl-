import React from 'react';
import { ADMIN_PASSWORD } from '../utils/config';
import { addTerm, removeTerm, updateTerm } from '../utils/api';

export default function Footer() {
  const handleAction = async (type) => {
    const termName = prompt("İşlem yapılacak terim adını girin:");
    if (!termName) return;
    
    const password = prompt("Yönetici şifresini girin:");
    if (password && password.trim() === ADMIN_PASSWORD) {
      if (type === 'add') {
        const desc = prompt("Terim için açıklama girin:");
        const img = prompt("Görsel URL'i girin (İsteğe bağlı):");
        await addTerm(termName, desc, img); 
        alert("Terim başarıyla eklendi!"); 
      } 
      else if (type === 'edit') {
        const newName = prompt("Yeni isim (Değiştirmek istemiyorsanız aynı bırakın):", termName);
        const newDesc = prompt("Yeni açıklama metnini girin:");
        const newImg = prompt("Yeni görsel URL'ini girin:");
        
        await updateTerm(termName, newName, newDesc, newImg);
        alert("Terim başarıyla güncellendi!");
      } 
      else if (type === 'delete') {
        await removeTerm(termName);
        alert("Terim ve içeriği silindi!");
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
          <button onClick={() => handleAction('add')} className="action-btn add-btn">+ Yeni Ekle</button>
          <button onClick={() => handleAction('edit')} className="action-btn add-btn">✎ Düzenle</button>
          <button onClick={() => handleAction('delete')} className="action-btn delete-btn">× Terim Sil</button>
        </div>
      </div>
    </footer>
  );
}