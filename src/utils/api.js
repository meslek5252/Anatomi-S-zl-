import { getGlobalTerms, saveGlobalTerms } from './firebase';

// Firebase'den terimleri çeken ana fonksiyon
export const fetchAnatomyTerms = async () => {
  const terms = await getGlobalTerms();
  return terms || [];
};

// Yeni terim ekleme - Güncel listeyi döndürür
export const addTerm = async (name) => {
  const terms = await getGlobalTerms() || [];
  const harf = name.charAt(0).toLocaleUpperCase('tr-TR');
  
  if (!terms.find(t => t.isim === name)) {
    const updatedTerms = [...terms, { isim: name, harf: harf }];
    await saveGlobalTerms(updatedTerms);
    return updatedTerms; // İşlem sonrası güncel listeyi döndür
  }
  return terms; // Değişiklik yoksa mevcut listeyi döndür
};

// Terim silme - Güncel listeyi döndürür
export const removeTerm = async (name) => {
  const terms = await getGlobalTerms() || [];
  const filtered = terms.filter(t => t.isim !== name);
  await saveGlobalTerms(filtered);
  return filtered; // İşlem sonrası güncel listeyi döndür
};

// Yerel veriyi Firebase'e taşıyan taşıyıcı fonksiyon
export const migrateLocalToFirebase = async () => {
  const localData = JSON.parse(localStorage.getItem('anatomi_terms') || '[]');
  if (localData.length > 0) {
    const existing = await getGlobalTerms() || [];
    const merged = [...existing, ...localData];
    
    // Benzersiz olanları al
    const unique = Array.from(new Set(merged.map(a => a.isim)))
      .map(name => merged.find(a => a.isim === name));
      
    await saveGlobalTerms(unique);
    localStorage.removeItem('anatomi_terms'); 
    window.location.reload(); 
  }
};

// Wikipedia'dan dinamik veri ve görsel çeken API
export const fetchWikiData = async (term) => {
  try {
    const res = await fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
    const data = await res.json();
    
    return { 
      aciklama: data.extract || "Bu terim hakkında Wikipedia üzerinde özet bilgi bulunamadı.", 
      gorsel: data.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Human_Anatomy.jpg/640px-Human_Anatomy.jpg" 
    };
  } catch (e) { 
    return { 
      aciklama: "Sunucuya bağlanılamadı, internet bağlantınızı kontrol edin.", 
      gorsel: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Human_Anatomy.jpg/640px-Human_Anatomy.jpg" 
    }; 
  }
};