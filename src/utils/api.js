import { getGlobalTerms, saveGlobalTerms } from './firebase';

export const fetchAnatomyTerms = async () => {
  const terms = await getGlobalTerms();
  return terms || [];
};

export const addTerm = async (name) => {
  const terms = await getGlobalTerms() || [];
  const harf = name.charAt(0).toLocaleUpperCase('tr-TR');
  if (!terms.find(t => t.isim === name)) {
    const updatedTerms = [...terms, { isim: name, harf: harf }];
    await saveGlobalTerms(updatedTerms);
    return updatedTerms;
  }
  return terms;
};

export const removeTerm = async (name) => {
  const terms = await getGlobalTerms() || [];
  const filtered = terms.filter(t => t.isim !== name);
  await saveGlobalTerms(filtered);
  return filtered;
};

export const updateTerm = async (oldName, newName) => {
  const terms = await getGlobalTerms() || [];
  const updated = terms.map(t => t.isim === oldName ? { ...t, isim: newName } : t);
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