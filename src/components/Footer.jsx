import React from 'react';
import { ADMIN_PASSWORD } from '../utils/config'; // Merkezi şifreyi çekiyoruz
import { addTerm, removeTerm } from '../utils/api'; // API fonksiyonlarını bağladık

export default function Footer() {
  const handleAction = async (type) => {
    const termName = prompt(`İşlem yapılacak terim adını giriniz (${type === 'add' ? 'Ekleme' : 'Silme'}):`);
    if (!termName) return; // İptal edilirse çık
    
    const password = prompt("Yönetici yetkilendirme şifresi:");
    
    // Şifreyi config dosyasından gelenle karşılaştır
    if (password && password.trim() === ADMIN_PASSWORD) {
      if (type === 'add') {
        await addTerm(termName);
        alert(`Başarılı: '${termName}' terimi eklendi. Sayfayı yenilemen gerekebilir.`);
      } else {
        await removeTerm(termName);
        alert(`Başarılı: '${termName}' terimi silindi. Sayfayı yenilemen gerekebilir.`);
      }
    } else if (password !== null) {
      alert("Hata: Yetkisiz erişim denemesi!");
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        
        {/* Kurumsal Adres ve Bilgi Bloğu */}
        <div className="address-text">
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>
            Ordu/Altınordu Atatürk Mesleki ve Teknik Anadolu Lisesi | Sağlık Hizmetleri Bölümü
          </p>
          <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
            İletişim: <a href="mailto:miracardabayr@gmail.com" style={{ color: '#0284c7', textDecoration: 'none' }}>miracardabayr@gmail.com</a>
          </p>
          <p style={{ fontSize: '11px', marginTop: '10px', color: '#999', letterSpacing: '0.5px' }}>
            © 2026 Anatomi ve Fizyoloji Sözlüğü. Tüm hakları saklıdır.
          </p>
        </div>

        {/* Yönetim Paneli Butonları */}
        <div className="action-buttons">
          <button onClick={() => handleAction('add')} className="action-btn add-btn">+ Yeni Terim Ekle</button>
          <button onClick={() => handleAction('delete')} className="action-btn delete-btn">× Terim Sil</button>
        </div>
        
      </div>
    </footer>
  );
}