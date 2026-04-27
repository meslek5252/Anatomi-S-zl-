import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCYXnnyZpJApGNdRApdWrXZrTS1GiXiET0",
  authDomain: "nova-a3989.firebaseapp.com",
  databaseURL: "https://nova-a3989-default-rtdb.firebaseio.com",
  projectId: "nova-a3989",
  storageBucket: "nova-a3989.firebasestorage.app",
  messagingSenderId: "569911873374",
  appId: "1:569911873374:web:626e253819035de41a49cf"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Global Kelimeleri Çek
export const getGlobalTerms = async () => {
  const snapshot = await get(ref(db, 'anatomy_terms'));
  return snapshot.val() || [];
};

// Global Kelimeleri Güncelle (Ekle/Sil sonrası)
export const saveGlobalTerms = async (terms) => {
  await set(ref(db, 'anatomy_terms'), terms);
};