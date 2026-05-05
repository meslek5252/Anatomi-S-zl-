import { getGlobalTerms, saveGlobalTerms } from './firebase';

export const fetchAnatomyTerms = async () => {
  const terms = await getGlobalTerms();
  if (!Array.isArray(terms)) return [];
  return terms.filter(t => t && typeof t === 'object');
};

export const addTerm = async (name, aciklama = "", gorsel = "") => {
  const terms = await getGlobalTerms() || [];
  const harf = name.charAt(0).toLocaleUpperCase('tr-TR');
  
  if (!terms.find(t => t.isim === name)) {
    const updatedTerms = [...terms, { isim: name, harf: harf, aciklama, gorsel }];
    await saveGlobalTerms(updatedTerms);
    return updatedTerms;
  }
  return terms;
};

export const removeTerm = async (name) => {
  const terms = await getGlobalTerms() || [];
  const filtered = terms.filter(t => t && t.isim !== name);
  await saveGlobalTerms(filtered);
  return filtered;
};

export const updateTerm = async (oldName, newName, newDesc, newImg) => {
  const terms = await getGlobalTerms() || [];
  const updated = terms.map(t => {
    if (!t || typeof t !== 'object') return null;
    if (t.isim === oldName) {
      return {
        ...t,
        isim: newName || t.isim,
        aciklama: newDesc !== undefined && newDesc !== null ? newDesc : t.aciklama,
        gorsel: newImg !== undefined && newImg !== null ? newImg : t.gorsel
      };
    }
    return t;
  }).filter(Boolean); // Bozuk/null verileri tamamen listeden çıkarır.

  await saveGlobalTerms(updated);
  return updated;
};

export const migrateLocalToFirebase = async () => {
  const localData = JSON.parse(localStorage.getItem('anatomi_terms') || '[]');
  if (localData.length > 0) {
    const existing = await getGlobalTerms() || [];
    const merged = [...existing, ...localData];
    const unique = Array.from(new Set(merged.map(a => a.isim)))
      .map(name => merged.find(a => a.isim === name));
    await saveGlobalTerms(unique);
    localStorage.removeItem('anatomi_terms');
    window.location.reload();
  }
};

export const fetchWikiData = async (term) => {
  try {
    const res = await fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
    const data = await res.json();
    return {
      aciklama: data.extract || "Bu terim hakkında bilgi henüz yüklenmedi...",
      gorsel: data.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Human_Anatomy.jpg/640px-Human_Anatomy.jpg"
    };
  } catch (e) {
    return {
      aciklama: "Sunucuya bağlanılamadı, internet bağlantınızı kontrol edin.",
      gorsel: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Human_Anatomy.jpg/640px-Human_Anatomy.jpg"
    };
  }
};