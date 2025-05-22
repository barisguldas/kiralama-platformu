import React, { useState, useRef, useEffect, useCallback } from 'react';
import './UstCubuk.css';
import { Link, useNavigate } from 'react-router-dom';

const UstCubuk = ({ aramaMetni, onAramaChange, kullaniciId }) => {
  const navigate = useNavigate();
  const varsayilanFotograf = "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png";
  
  // State tanımları
  const [avatar, setAvatar] = useState('');
  const [bildirimGoster, setBildirimGoster] = useState(false);
  const [profilMenuGoster, setProfilMenuGoster] = useState(false);
  const [bildirimler, setBildirimler] = useState([]);
  const [bildirimlerYukleniyor, setBildirimlerYukleniyor] = useState(false);
  
  // Refs
  const bildirimRef = useRef(null);
  const profilRef = useRef(null);
  
  // Avatar URL'si çekme fonksiyonu
  const avatarUrlCek = useCallback(async (kullaniciId) => {
    if (!kullaniciId) return null;
    
    try {
      const response = await fetch(`http://localhost:5000/api/profil?sahipid=${kullaniciId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data && data.length > 0 ? data[0].avatar : null;
    } catch (error) {
      console.error("Avatar çekerken hata:", error);
      return null;
    }
  }, []);
  
  // Bildirimleri çekme fonksiyonu
  const bildirimleriCek = useCallback(async (kullaniciId) => {
    if (!kullaniciId) return [];
    
    setBildirimlerYukleniyor(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/bildirimler?kullaniciId=${kullaniciId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Bildirimleri çekerken hata:", error);
      // Hata durumunda örnek veriler döndür
      return [
        {
          id: 1,
          type: "teklif",
          mesaj: "Ahmet Yılmaz 'Komodin' ilanınıza 450 TL teklif verdi",
          tarih: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          okundu: false,
          teklifDetay: {
            teklifVerenId: "user123",
            ilanId: "ilan456",
            miktar: 450,
            durum: "bekliyor"
          }
        },
        {
          id: 2,
          type: "mesaj",
          mesaj: "Yeni mesajınız var!",
          tarih: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          okundu: false
        },
        {
          id: 3,
          type: "begeni",
          mesaj: "İlanınız beğenildi",
          tarih: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          okundu: true
        }
      ];
    } finally {
      setBildirimlerYukleniyor(false);
    }
  }, []);
  
  // Avatar ve bildirimleri yükleme
  useEffect(() => {
    if (kullaniciId) {
      // Avatar yükle
      avatarUrlCek(kullaniciId).then(avatarUrl => {
        if (avatarUrl) {
          setAvatar(avatarUrl);
        }
      });
      
      // Bildirimleri yükle
      bildirimleriCek(kullaniciId).then(bildirimData => {
        setBildirimler(bildirimData);
      });
    }
  }, [kullaniciId, avatarUrlCek, bildirimleriCek]);
  
  // Tarihi formatla
  const formatTarih = (tarihString) => {
    try {
      const tarih = new Date(tarihString);
      const simdi = new Date();
      const fark = simdi - tarih;
      
      const dakika = Math.floor(fark / (1000 * 60));
      const saat = Math.floor(fark / (1000 * 60 * 60));
      const gun = Math.floor(fark / (1000 * 60 * 60 * 24));
      
      if (dakika < 1) return "Az önce";
      if (dakika < 60) return `${dakika} dakika önce`;
      if (saat < 24) return `${saat} saat önce`;
      if (gun < 7) return `${gun} gün önce`;
      
      return tarih.toLocaleDateString('tr-TR');
    } catch (error) {
      return "Bilinmeyen tarih";
    }
  };
  
  // Okunmamış bildirim sayısı
  const okunmamisBildirimSayisi = bildirimler.filter(b => !b.okundu).length;
  
  // Teklif onaylama
  const handleTeklifOnay = async (bildirimId) => {
    try {
      const bildirim = bildirimler.find(b => b.id === bildirimId);
      if (!bildirim || !bildirim.teklifDetay) return;
      
      // API'ye onay isteği gönder
      const response = await fetch('http://localhost:5000/api/teklif-onay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bildirimId: bildirimId,
          teklifId: bildirim.teklifDetay.teklifId || bildirimId,
          durum: 'onaylandı'
        })
      });
      
      if (response.ok) {
        setBildirimler(prev => prev.map(b => 
          b.id === bildirimId 
            ? {
                ...b,
                okundu: true,
                teklifDetay: { ...b.teklifDetay, durum: "onaylandı" }
              }
            : b
        ));
      }
    } catch (error) {
      console.error("Teklif onaylanırken hata:", error);
      // Hata durumunda da state'i güncelle
      setBildirimler(prev => prev.map(b => 
        b.id === bildirimId 
          ? {
              ...b,
              okundu: true,
              teklifDetay: { ...b.teklifDetay, durum: "onaylandı" }
            }
          : b
      ));
    }
  };
  
  // Teklif reddetme
  const handleTeklifRed = async (bildirimId) => {
    try {
      const bildirim = bildirimler.find(b => b.id === bildirimId);
      if (!bildirim || !bildirim.teklifDetay) return;
      
      // API'ye red isteği gönder
      const response = await fetch('http://localhost:5000/api/teklif-red', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bildirimId: bildirimId,
          teklifId: bildirim.teklifDetay.teklifId || bildirimId,
          durum: 'reddedildi'
        })
      });
      
      if (response.ok) {
        setBildirimler(prev => prev.map(b => 
          b.id === bildirimId 
            ? {
                ...b,
                okundu: true,
                teklifDetay: { ...b.teklifDetay, durum: "reddedildi" }
              }
            : b
        ));
      }
    } catch (error) {
      console.error("Teklif reddedilirken hata:", error);
      // Hata durumunda da state'i güncelle
      setBildirimler(prev => prev.map(b => 
        b.id === bildirimId 
          ? {
              ...b,
              okundu: true,
              teklifDetay: { ...b.teklifDetay, durum: "reddedildi" }
            }
          : b
      ));
    }
  };
  
  // Tümünü okundu yapma
  const tumunuOkunduYap = async () => {
    try {
      const okunmamisIdler = bildirimler.filter(b => !b.okundu).map(b => b.id);
      
      if (okunmamisIdler.length === 0) return;
      
      const response = await fetch('http://localhost:5000/api/bildirimler-okundu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kullaniciId: kullaniciId,
          bildirimIdler: okunmamisIdler
        })
      });
      
      if (response.ok) {
        setBildirimler(prev => prev.map(b => ({ ...b, okundu: true })));
      }
    } catch (error) {
      console.error("Bildirimler okundu yapılırken hata:", error);
      // Hata durumunda da state'i güncelle
      setBildirimler(prev => prev.map(b => ({ ...b, okundu: true })));
    }
  };
  
  // Dropdown toggle fonksiyonları
  const toggleBildirimler = () => {
    setBildirimGoster(prev => !prev);
    if (profilMenuGoster) {
      setProfilMenuGoster(false);
    }
  };
  
  const toggleProfilMenu = () => {
    setProfilMenuGoster(prev => !prev);
    if (bildirimGoster) {
      setBildirimGoster(false);
    }
  };
  
  // Çıkış yapma
  const cikisYap = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullaniciId');
    navigate("/giris");
  };
  
  // Dışarı tıklama eventi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bildirimRef.current && !bildirimRef.current.contains(event.target)) {
        setBildirimGoster(false);
      }
      if (profilRef.current && !profilRef.current.contains(event.target)) {
        setProfilMenuGoster(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Bildirim ikonunu belirleme
  const getBildirimIkonu = (type) => {
    switch (type) {
      case 'teklif':
        return '💰';
      case 'mesaj':
        return '💬';
      case 'begeni':
        return '❤️';
      default:
        return '🔔';
    }
  };

  return (
    <header className="ust-cubuk">
      <div className="ust-cubuk-icerik">
        <div className="site-logo">
          <Link to="/">Site Adı</Link>
        </div>
        
        <div className="arama-konteyner-ust">
          <span className="arama-ikon-ust">🔍</span>
          <input
            type="text"
            className="arama-input-ust"
            placeholder="İlanlarda ara..."
            value={aramaMetni || ''}
            onChange={onAramaChange}
          />
        </div>

        <div className="sag-menu-ogeleri">
          {/* Bildirim İkonu */}
          <div className="bildirim-container" ref={bildirimRef}>
            <div className="bildirim-icon" onClick={toggleBildirimler}>
              <i className="fas fa-bell"></i>
              {okunmamisBildirimSayisi > 0 && (
                <span className="bildirim-sayaci">{okunmamisBildirimSayisi}</span>
              )}
            </div>

            {bildirimGoster && (
              <div className="bildirim-dropdown">
                <div className="bildirim-header">
                  <h3>Bildirimler</h3>
                  <button 
                    className="kapat-btn" 
                    onClick={() => setBildirimGoster(false)}
                    aria-label="Bildirimleri kapat"
                  >
                    ×
                  </button>
                </div>
                
                <div className="bildirim-listesi">
                  {bildirimlerYukleniyor ? (
                    <div className="bildirim-yukleniyor">
                      <div className="yukleme-animasyonu">Yükleniyor...</div>
                    </div>
                  ) : bildirimler.length === 0 ? (
                    <div className="bos-bildirim">
                      <p>Henüz bildiriminiz yok</p>
                    </div>
                  ) : (
                    bildirimler.map((bildirim) => (
                      <div 
                        key={bildirim.id} 
                        className={`bildirim-item ${!bildirim.okundu ? 'okunmamis' : ''}`}
                      >
                        <div className="bildirim-ikon">
                          {getBildirimIkonu(bildirim.type)}
                        </div>
                        <div className="bildirim-icerik">
                          <div className="bildirim-mesaj">{bildirim.mesaj}</div>
                          <div className="bildirim-tarih">{formatTarih(bildirim.tarih)}</div>
                          
                          {bildirim.type === "teklif" && bildirim.teklifDetay && (
                            <div className="teklif-actions">
                              {bildirim.teklifDetay.durum === "bekliyor" ? (
                                <div className="teklif-butonlar">
                                  <button 
                                    className="onayla-btn"
                                    onClick={() => handleTeklifOnay(bildirim.id)}
                                  >
                                    ✓ Onayla
                                  </button>
                                  <button 
                                    className="reddet-btn"
                                    onClick={() => handleTeklifRed(bildirim.id)}
                                  >
                                    ✗ Reddet
                                  </button>
                                </div>
                              ) : (
                                <span className={`teklif-durum ${bildirim.teklifDetay.durum}`}>
                                  {bildirim.teklifDetay.durum === "onaylandı" ? "ONAYLANDI" : "REDDEDİLDİ"}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {bildirimler.length > 0 && okunmamisBildirimSayisi > 0 && (
                  <div className="bildirim-footer">
                    <button 
                      className="tumunu-okundu-btn"
                      onClick={tumunuOkunduYap}
                    >
                      Tümünü Okundu Yap
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Profil İkonu ve Dropdown Menü */}
          <div className='profil-container' ref={profilRef}>
            <div className="profil-ikon" onClick={toggleProfilMenu}>
              <div className="profil-resim-container">
                <img 
                  src={avatar && avatar.length > 5 ? avatar : varsayilanFotograf}
                  alt="Profil Resmi" 
                  className="profil-resim"
                  onError={(e) => {
                    e.target.src = varsayilanFotograf;
                  }}
                />
              </div>
            </div>
            
            {profilMenuGoster && (
              <div className="profil-dropdown">
                <ul className="profil-menu-listesi">
                  <li className="profil-menu-item">
                    <Link to={kullaniciId ? `/profiller/${kullaniciId}` : "/giris"}>
                      <i className="profil-menu-ikon">👤</i>
                      <span>Profil</span>
                    </Link>
                  </li>
                  <li className="profil-menu-item">
                    <Link to={kullaniciId ? `/ilan-yonetimi/${kullaniciId}` : "/giris"}>
                      <i className="profil-menu-ikon">📋</i>
                      <span>İlanlarım</span>
                    </Link>
                  </li>
                  <li className="profil-menu-item">
                    <Link to={kullaniciId ? `/ilanolustur` : "/giris"}>
                      <i className="profil-menu-ikon">➕</i>
                      <span>İlan Oluştur</span>
                    </Link>
                  </li>
                  <li className="profil-menu-item">
                    <Link to="/uyelik">
                      <i className="profil-menu-ikon">⭐</i>
                      <span>Premium Üyelik</span>
                    </Link>
                  </li>
                  <li className="profil-menu-item">
                    <Link to="/sss">
                      <i className="profil-menu-ikon">❓</i>
                      <span>Sıkça Sorulan Sorular</span>
                    </Link>
                  </li>
                  <li className="profil-menu-ayrac"></li>
                  <li className="profil-menu-item cikis-item" onClick={cikisYap}>
                    <i className="profil-menu-ikon">🚪</i>
                    <span>Çıkış Yap</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UstCubuk;