import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { fetchAnatomyTerms, removeTerm, updateTerm } from '../utils/api';
import { ADMIN_PASSWORD } from '../utils/config';

export default function Dictionary() {
  const [terms, setTerms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // URL kontrolü için eklendi
  
  // Kalıcı Ayarlar
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('isSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isRainEnabled, setIsRainEnabled] = useState(() => {
    const saved = localStorage.getItem('isRainEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeLetter, setActiveLetter] = useState(() => {
    return sessionStorage.getItem('selectedLetter') || 'A';
  });

  const [ripple, setRipple] = useState(null);
  
  // Sürükle ve Bırak Durumları
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringSearch, setIsHoveringSearch] = useState(false);
  
  // Fiziksel Yağmur Nesneleri Durumu
  const [rainItems, setRainItems] = useState([]);

  const searchContainerRef = useRef(null);

  const playHoverSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audio = new Audio('/hover.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const playClickSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audio = new Audio('/click.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  useEffect(() => {
    localStorage.setItem('isSoundEnabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  useEffect(() => {
    localStorage.setItem('isRainEnabled', JSON.stringify(isRainEnabled));
  }, [isRainEnabled]);

  useEffect(() => {
    sessionStorage.setItem('selectedLetter', activeLetter);
  }, [activeLetter]);

  // Kelimeleri yükleme ve rastgele 8 tanesini seçme
  useEffect(() => {
    const loadTerms = async () => { 
      const data = await fetchAnatomyTerms();
      setTerms(data || []); 
      
      if (data && data.length > 0) {
        // Tüm kelimeleri rastgele karıştır (Fisher-Yates)
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        
        const initialItems = shuffled.slice(0, 8).map((termObj) => {
          const name = typeof termObj.isim === 'object' && termObj.isim !== null ? termObj.isim.isim : termObj.isim;
          return {
            id: Math.random(),
            name,
            x: Math.random() * 80 + 5, // %5 ile %85 arası
            y: -100 - Math.random() * 200,
            vx: 0,
            vy: 0.6 + Math.random() * 0.4,
            rotation: (Math.random() - 0.5) * 20,
            rotationSpeed: (Math.random() - 0.5) * 0.5,
            width: 120,
            height: 40,
            isDragged: false,
          };
        });
        setRainItems(initialItems);
      }
    };
    loadTerms();
  }, []);

  // Elastik Çarpışma ve Fizik Motoru
  useEffect(() => {
    if (!isRainEnabled || location.pathname !== '/' || rainItems.length === 0) return;

    let animationFrame;
    const updatePhysics = () => {
      setRainItems((prevItems) => {
        let newItems = prevItems.map(item => {
          if (item.isDragged) return item;

          let newX = item.x + item.vx;
          let newY = item.y + item.vy;

          let newVx = item.vx * 0.98;
          let newVy = item.vy + 0.03;

          // Ekranın altına düşen kelimeyi rastgele yeni bir kelimeyle değiştir
          if (newY > window.innerHeight + 60) {
            if (terms.length > 0) {
              const randomIndex = Math.floor(Math.random() * terms.length);
              const randomTerm = terms[randomIndex];
              const newName = typeof randomTerm.isim === 'object' && randomTerm.isim !== null 
                ? randomTerm.isim.isim 
                : randomTerm.isim;

              newY = -50 - Math.random() * 100;
              newX = Math.random() * 80 + 5;
              item.name = newName; // İsmi güncelle
              newVy = 0.6 + Math.random() * 0.4;
              newVx = 0;
            }
          }

          return {
            ...item,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: item.rotation + item.rotationSpeed
          };
        });

        // Çarpışma Çözümleyicisi
        for (let i = 0; i < newItems.length; i++) {
          for (let j = i + 1; j < newItems.length; j++) {
            const itemA = newItems[i];
            const itemB = newItems[j];

            const dx = itemB.x - itemA.x;
            const dy = itemB.y - itemA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
              const overlap = 80 - distance;
              const nx = dx / distance;
              const ny = dy / distance;

              newItems[i].x -= nx * overlap * 0.5;
              newItems[i].y -= ny * overlap * 0.5;
              newItems[j].x += nx * overlap * 0.5;
              newItems[j].y += ny * overlap * 0.5;

              const kx = itemA.vx - itemB.vx;
              const ky = itemA.vy - itemB.vy;
              const p = 2 * (nx * kx + ny * ky) / 2;

              newItems[i].vx -= p * nx;
              newItems[i].vy -= p * ny;
              newItems[j].vx += p * nx;
              newItems[j].vy += p * ny;
              
              newItems[i].rotationSpeed += (Math.random() - 0.5) * 1.5;
              newItems[j].rotationSpeed += (Math.random() - 0.5) * 1.5;
            }
          }
        }
        return newItems;
      });

      animationFrame = requestAnimationFrame(updatePhysics);
    };

    animationFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrame);
  }, [isRainEnabled, rainItems, location.pathname, terms]);

  // Sürükle ve Bırak İşlemleri
  const handleMouseDown = (e, itemId) => {
    playClickSound();
    playClickSound(); // Eski uyarıyı da engellemek için eklendi
    const item = rainItems.find(i => i.id === itemId);
    if (!item) return;

    setDraggedItem(itemId);
    setRainItems(prev => prev.map(i => i.id === itemId ? { ...i, isDragged: true, vx: 0, vy: 0 } : i));
    setDragOffset({
      x: e.clientX - (item.x / 100) * window.innerWidth,
      y: e.clientY - item.y
    });
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (draggedItem !== null) {
      const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
      const newY = e.clientY - dragOffset.y;

      setRainItems(prev => prev.map(item => {
        if (item.id === draggedItem) {
          return {
            ...item,
            x: Math.max(2, Math.min(92, newX)),
            y: Math.max(0, Math.min(window.innerHeight, newY)),
            vx: 0,
            vy: 0,
          };
        }
        return item;
      }));

      if (searchContainerRef.current) {
        const rect = searchContainerRef.current.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setIsHoveringSearch(true);
        } else {
          setIsHoveringSearch(false);
        }
      }
    }
  };

  const handleMouseUp = (item) => {
    if (draggedItem === null) return;

    if (isHoveringSearch && item) {
      setSearchTerm(item.name);
      setIsHoveringSearch(false);
      navigate(`/terim/${item.name}`);
    }

    setRainItems(prev => prev.map(i => {
      if (i.id === draggedItem) {
        return {
          ...i,
          isDragged: false,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
        };
      }
      return i;
    }));
    
    setDraggedItem(null);
  };

  const handleItemHover = (e, itemId) => {
    playHoverSound();
    setRainItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          vx: item.vx + (Math.random() - 0.5) * 6,
          vy: item.vy + (Math.random() - 0.5) * 6,
          rotationSpeed: item.rotationSpeed + (Math.random() - 0.5) * 0.5
        };
      }
      return item;
    }));
  };

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!isSoundEnabled) return;

      const isRightClick = e.button === 2;
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
        type: isRightClick ? 'right' : 'left'
      };
      
      setRipple(newRipple);
      setTimeout(() => setRipple(null), 600);
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('contextmenu', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('contextmenu', handleGlobalClick);
    };
  }, [isSoundEnabled]);

  const handleEdit = async (termObject) => {
    playClickSound();
    const oldName = typeof termObject.isim === 'object' && termObject.isim !== null 
      ? termObject.isim.isim 
      : termObject.isim;
    const oldDesc = termObject.aciklama || "";
    const oldImg = termObject.gorsel || "";

    const pass = prompt("Düzenleme için şifre girin:");
    if (pass && pass.trim() === ADMIN_PASSWORD) {
      const newName = prompt("Yeni isim girin:", oldName);
      const descInput = prompt("Yeni açıklama metnini girin:", oldDesc);
      const imgInput = prompt("Yeni görsel URL'ini girin:", oldImg);

      if (newName !== null) {
        const newDesc = descInput !== null ? descInput : oldDesc;
        const newImg = imgInput !== null ? imgInput : oldImg;

        const updated = await updateTerm(oldName, newName, newDesc, newImg);
        if (updated) {
          setTerms(updated);
          alert("Terim başarıyla güncellendi.");
        }
      }
    } else if (pass !== null) { 
      alert("Hatalı şifre!"); 
    }
  };

  const handleRemove = async (name) => {
    playClickSound();
    const pass = prompt("Silme için şifre girin:");
    if (pass && pass.trim() === ADMIN_PASSWORD) {
      const updated = await removeTerm(name);
      if (updated) {
        setTerms(updated);
        alert("Terim başarıyla silindi.");
      }
    } else if (pass !== null) { 
      alert("Hatalı şifre!"); 
    }
  };

  const ALPHABET = "ABCÇDEFGHIİJKLMNOÖPQRSŞTUÜVWXYZ".split("");
  
  const filtered = terms.filter(t => {
    if (!t || typeof t !== 'object') return false;
    
    let nameValue = "";
    if (typeof t.isim === 'object' && t.isim !== null) {
      nameValue = t.isim.isim || "";
    } else {
      nameValue = t.isim || "";
    }
    
    if (searchTerm.trim() !== "") {
      return nameValue.toLocaleLowerCase('tr-TR').includes(searchTerm.trim().toLocaleLowerCase('tr-TR'));
    }
    
    return nameValue.charAt(0).toLocaleUpperCase('tr-TR') === activeLetter;
  });

  return (
    <div 
      className="main-layout bg-transparent" 
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, padding: 0 }}
      onMouseMove={handleMouseMove}
    >
      
      {/* Tıklama Efekti */}
      {isSoundEnabled && ripple && (
        <div 
          className={`ripple-effect ${ripple.type === 'right' ? 'ripple-right' : 'ripple-left'}`}
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
          }}
        />
      )}

      {/* Dinamik Kelime Yağmuru (Yalnızca ana sayfada - '/' - render edilir) */}
      {isRainEnabled && location.pathname === '/' && rainItems.length > 0 && (
        <div className="rain-container">
          {rainItems.map((item) => (
            <span 
              key={item.id} 
              className="rain-item"
              style={{
                left: `${item.x}%`,
                top: `${item.y}px`,
                transform: `rotate(${item.rotation}deg)`,
                cursor: draggedItem === item.id ? 'grabbing' : 'grab'
              }}
              onMouseDown={(e) => handleMouseDown(e, item.id)}
              onMouseUp={() => handleMouseUp(item)}
              onMouseEnter={(e) => handleItemHover(e, item.id)}
            >
              {item.name}
            </span>
          ))}
        </div>
      )}
      
      <div className="content-wrapper" style={{ flex: 1, padding: '40px 20px', marginTop: '10px' }}>
        <div className="glass-box" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          
          <div className="top-right-controls">
            <button 
              className="control-icon-btn" 
              onClick={() => {
                playClickSound();
                setIsSoundEnabled(!isSoundEnabled);
              }}
              onMouseEnter={playHoverSound}
              title={isSoundEnabled ? "Sesleri ve Efektleri Kapat" : "Sesleri ve Efektleri Aç"}
            >
              {isSoundEnabled ? "🔊" : "🔇"}
            </button>
            <button 
              className="control-icon-btn" 
              onClick={() => {
                playClickSound();
                setIsRainEnabled(!isRainEnabled);
              }}
              onMouseEnter={playHoverSound}
              title={isRainEnabled ? "Kelime Yağmurunu Durdur" : "Kelime Yağmurunu Başlat"}
            >
              {isRainEnabled ? "🛑" : "✨"}
            </button>
          </div>
          
          <div 
            className="search-container" 
            ref={searchContainerRef}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', marginTop: '30px' }}
          >
            <input 
              type="text"
              placeholder={isHoveringSearch ? "Sözlükte Ara" : "Terim arayın (Örneğin: amigdala)..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              style={{
                width: '100%',
                maxWidth: '600px',
                padding: '14px 24px',
                borderRadius: '30px',
                border: isHoveringSearch ? '1px solid #c48b64' : '1px solid rgba(196, 139, 100, 0.5)',
                background: isHoveringSearch ? 'rgba(196, 139, 100, 0.2)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#594a3e',
                outline: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>

          <div className="alphabet-container">
            {ALPHABET.map(l => (
              <button 
                key={l} 
                onClick={() => {
                  playClickSound();
                  setSearchTerm('');
                  setActiveLetter(l);
                }}
                onMouseEnter={playHoverSound}
                className={`letter-btn ${activeLetter === l && searchTerm === '' ? 'active-letter' : ''}`}
              >
                {l}
              </button>
            ))}
          </div>
          
          <div className="terms-grid">
            {filtered.length > 0 ? (
              filtered.map((t, i) => {
                const displayName = typeof t.isim === 'object' && t.isim !== null ? t.isim.isim : t.isim;

                return (
                  <div key={i} className="term-card">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(t);
                      }} 
                      onMouseEnter={playHoverSound}
                      className="action-btn edit-btn"
                      title="Düzenle"
                      style={{ 
                        padding: '6px 12px', 
                        background: '#0284c7', 
                        color: 'white', 
                        borderRadius: '20px', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      Düzenle
                    </button>

                    <Link 
                      to={`/terim/${displayName}`} 
                      className="term-link" 
                      title={displayName}
                      onClick={playClickSound}
                      onMouseEnter={playHoverSound}
                    >
                      {displayName}
                    </Link>

                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(displayName);
                      }} 
                      onMouseEnter={playHoverSound}
                      className="action-btn delete-btn"
                      title="Sil"
                      style={{ 
                        padding: '6px 12px', 
                        background: '#e11d48', 
                        color: 'white', 
                        borderRadius: '20px', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(225, 29, 72, 0.3)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      Sil
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <p>Bu arama kriterine uygun terim bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .top-right-controls {
          position: absolute;
          top: 15px;
          right: 25px;
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .control-icon-btn {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(196, 139, 100, 0.4);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .control-icon-btn:hover {
          transform: translateY(-2px) scale(1.05);
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(196, 139, 100, 0.2);
        }

        .ripple-effect {
          position: fixed;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9999;
          animation: rippleAnim 0.6s ease-out forwards;
        }

        .ripple-left {
          border: 2px solid #0284c7;
        }

        .ripple-right {
          border: 2px solid #e11d48;
          transform: translate(-50%, -50%) rotate(45deg);
        }

        @keyframes rippleAnim {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: 120px;
            height: 120px;
            opacity: 0;
          }
        }

        .rain-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: auto;
          overflow: hidden;
        }

        .rain-item {
          position: absolute;
          color: rgba(68, 60, 52, 0.6);
          font-weight: 800;
          font-size: 1.4rem;
          white-space: nowrap;
          padding: 5px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.35);
          border: 1px solid rgba(196, 139, 100, 0.2);
          box-shadow: 0 4px 6px rgba(0,0,0,0.04);
          transition: transform 0.05s linear;
        }

        .alphabet-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 40px;
          padding: 12px;
          background: rgba(250, 245, 235, 0.5);
          border-radius: 24px;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(230, 215, 195, 0.6);
          position: relative;
          z-index: 1;
        }

        .letter-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid transparent;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.75);
          color: #594a3e;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .letter-btn:hover {
          background: #ffffff;
          color: #c48b64;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(196, 139, 100, 0.15);
        }

        .active-letter {
          background: #c48b64;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(196, 139, 100, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .terms-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 20px; 
          padding: 6px;
          position: relative;
          z-index: 1;
        }
        
        .term-card { 
          background: #faf8f5;
          border-radius: 20px;
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 12px 24px; 
          border: 1px solid #e1d5c9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          box-sizing: border-box;
        }

        .term-card:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 6px 15px rgba(196, 139, 100, 0.08);
          background: #ffffff;
          border-color: #c48b64;
        }
        
        .term-link {
          font-size: 0.95rem;
          text-decoration: none;
          color: #443c34;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 40%;
          letter-spacing: 0.2px;
          transition: color 0.2s ease;
          text-align: center;
        }

        .term-card:hover .term-link {
          color: #8b5a3e;
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 30px;
          border: 1px dashed #d1c7bd;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .empty-state p {
          color: #8a7a6c;
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
        }
        
        @media (max-width: 1200px) {
          .terms-grid { grid-template-columns: repeat(1, 1fr); }
        }
        @media (max-width: 600px) {
          .terms-grid { grid-template-columns: 1fr; }
          .alphabet-container { gap: 4px; padding: 6px; }
          .letter-btn { width: 28px; height: 28px; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}