import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWikiData, addTerm } from '../utils/api';

export default function TermDetail() {
  const { isim } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ aciklama: 'Yükleniyor...', gorsel: '' });

  useEffect(() => {
    fetchWikiData(isim).then(setData);
    addTerm(isim); // Lokal listeye manuel ekleme desteği
  }, [isim]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 min-h-screen">
      <button 
        onClick={() => navigate('/sozluk')} 
        className="mb-8 text-gray-400 hover:text-black transition-colors text-sm font-bold uppercase"
      >
        ← Geri Dön
      </button>

      <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-lg border border-gray-100">
        <div className="w-full h-64 md:h-80 bg-gray-50 rounded-2xl mb-8 overflow-hidden">
          <img 
            src={data.gorsel || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Human_Anatomy.jpg/640px-Human_Anatomy.jpg"} 
            alt={isim} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Human_Anatomy.jpg/640px-Human_Anatomy.jpg" }}
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 break-words">{isim}</h1>
        
        <p className="text-lg text-gray-700 leading-relaxed text-justify">
          {data.aciklama}
        </p>
      </div>
    </div>
  );
}