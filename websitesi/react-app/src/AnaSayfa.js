import React, { useState,useEffect } from 'react';

import './AnaSayfa.css';

// Kategori listesi
const kategoriler = [
  "Tüm Kategoriler",
  "Mobilya",
  "Elektronik",
  "Ev Eşyaları",
  "Beyaz Eşya",
  "Mutfak Eşyaları",
  "Dekorasyon",
  "Bahçe",
  "Diğer"
];

const AnaSayfa = () => {
  const [aramaMetni, setAramaMetni] = useState('');
  const [seciliKategori, setSeciliKategori] = useState('Tüm Kategoriler');
  const [gorunumTipi, setGorunumTipi] = useState('grid');
  const [detayliIlan, setDetayliIlan] = useState(null);
  const [siralama, setSiralama] = useState('en-yeni');
  const [ilanlar, setIlanlar] = useState([]);


  useEffect(() => { //başlangıçta ilanları çekebilmek için
    const fetchIlanlarstart = async () => {
      try {
        const params = new URLSearchParams();
        params.append('limit', '3');
        const url = `http://localhost:5000/api/ilanlar?${params.toString()}`;
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json; charset=utf-8',
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
        
        if (!response.ok) {
          throw new Error('API yanıtı başarısız oldu');
        }
        
        // Debug için yanıtın ham metnini kontrol edin
        const rawText = await response.text();
        console.log('Ham API yanıtı:', rawText);
        
        // Metni JSON'a dönüştürün
        const data = JSON.parse(rawText);
        console.log('Dönüştürülen veri:', data);
        
        setIlanlar(data);
      } catch (error) {
        console.error('Veri alınırken bir hata oluştu', error);
      }
    };
    fetchIlanlarstart();
  }, []);


const fetchIlanlar = async () => {
  try {
    // Query parametrelerini oluştur
    const params = new URLSearchParams();
    if (aramaMetni) {
      params.append('arama', aramaMetni);
    }
    if (seciliKategori && seciliKategori !== 'Tüm Kategoriler') {
      params.append('kategori', seciliKategori);
    }
    if (siralama) {
      params.append('siralama', siralama);
    }
    const url = `http://localhost:5000/api/ilanlar?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('API yanıtı başarısız oldu');
    }
    const data = await response.json();
    setIlanlar(data);
  } catch (error) {
    console.error('Veri alınırken bir hata oluştu', error);
  }
};

  const filtreliVeSiraliIlanlar = () => {
    let sonuclar = ilanlar.filter((ilan) => {
      const metinUyumu = ilan.baslik.toLowerCase().includes(aramaMetni.toLowerCase());
      const kategoriUyumu = seciliKategori === 'Tüm Kategoriler' || ilan.kategori === seciliKategori;
      return metinUyumu && kategoriUyumu;
    });

    if (siralama === 'fiyat-artan') {
      sonuclar.sort((a, b) => a.fiyat - b.fiyat);
    } else if (siralama === 'fiyat-azalan') {
      sonuclar.sort((a, b) => b.fiyat - a.fiyat);
    } else if (siralama === 'en-yeni') {
      // Tarih sıralaması backend tarafından yapılıyorsa bu kısım opsiyoneldir
      sonuclar.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
    }

    return sonuclar;
  };

  const sonucIlanlar = filtreliVeSiraliIlanlar();

  // Detaylı ilan görüntüleme
  const ilanDetayiniGoster = (ilan) => {
    setDetayliIlan(ilan);
  };

  // Detaylı ilan görünümünü kapat
  const ilanDetayiniKapat = () => {
    setDetayliIlan(null);
  };

  // Sıralama değiştiğinde
  const siralamaDeğiştir = (e) => {
    setSiralama(e.target.value);
  };

  // Kategori değiştiğinde
  const kategoriDegistir = (e) => {
    setSeciliKategori(e.target.value);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>İkinci El Eşya İlanları</h1>
        <p>İhtiyacınız olan eşyaları bulun veya kullanmadıklarınızı satın</p>
      </header>

      <button className="filter-button" onClick={fetchIlanlar}>
          Filtrele AÇIK
        </button>

      {/* Arama ve Filtreleme */}
      <div className="search-filter-container">
        <div className="search-filter-wrapper">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="İlan ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
            />
          </div>
          <div className="filter-container">
            <span className="filter-icon">🔍</span>
            <select
              className="filter-select"
              value={seciliKategori}
              onChange={kategoriDegistir}
            >
              {kategoriler.map((kategori, index) => (
                <option key={index} value={kategori}>{kategori}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-sort-view">
          <div className="results-sort">
            <p className="results-count">{sonucIlanlar.length} ilan bulundu</p>
            <div className="sort-container">
              <span className="sort-icon">↕️</span>
              <span className="sort-label">Sırala:</span>
              <select 
                className="sort-select"
                value={siralama}
                onChange={siralamaDeğiştir}
              >
                <option value="en-yeni">En Yeniler</option>
                <option value="fiyat-artan">Fiyat (Artan)</option>
                <option value="fiyat-azalan">Fiyat (Azalan)</option>
              </select>
            </div>
          </div>
          <div className="view-options">
            <button
              className={`view-button ${gorunumTipi === 'grid' ? 'active' : ''}`}
              onClick={() => setGorunumTipi('grid')}
            >
              □
            </button>
            <button
              className={`view-button ${gorunumTipi === 'list' ? 'active' : ''}`}
              onClick={() => setGorunumTipi('list')}
            >
              ≡
            </button>
          </div>
        </div>
      </div>

      {/* İlan Listesi */}
      <div className={`ilan-listesi ${gorunumTipi}`}>
        {sonucIlanlar.length > 0 ? (
          sonucIlanlar.map(ilan => (
            <div 
              key={ilan.id} 
              className="ilan-karti"
              onClick={() => ilanDetayiniGoster(ilan)}
            >
              <img src={ilan.resim} alt={ilan.baslik} className="ilan-resmi" />
              <div className="ilan-bilgileri">
                <div className="ilan-baslik-fiyat">
                  <h2 className="ilan-baslik">{ilan.baslik}</h2>
                  <span className="ilan-fiyat">{ilan.fiyat} TL</span>
                </div>
                <p className="ilan-lokasyon">{ilan.lokasyon}</p>
                <div className="ilan-kategori">Kategori: {ilan.kategori}</div>
                <p className="ilan-aciklama">{ilan.aciklama}</p>
                <div className="ilan-alt-bilgiler">
                  <span className="ilan-tarih">{ilan.tarih}</span>
                  <div className="ilan-favori">
                    <span className="favori-ikon">♥</span>
                    <span className="favori-sayi">{ilan.favoriSayisi}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>Aramanızla eşleşen ilan bulunamadı.</p>
            <button onClick={() => {setAramaMetni(''); setSeciliKategori('Tüm Kategoriler');}}>
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* Detaylı İlan Modalı */}
      {detayliIlan && (
        <div className="modal-arkaplan">
          <div className="modal-icerik">
            <div className="modal-header">
              <h2 className="modal-baslik">{detayliIlan.baslik}</h2>
              <button 
                className="modal-kapat"
                onClick={ilanDetayiniKapat}
              >
                ✕
              </button>
            </div>
            
            <img src={detayliIlan.resim} alt={detayliIlan.baslik} className="modal-resim" />
            
            <div className="modal-fiyat-tarih">
              <span className="modal-fiyat">{detayliIlan.fiyat} TL</span>
              <span className="modal-tarih">{detayliIlan.tarih}</span>
            </div>
            
            <div className="modal-detaylar">
              <div className="modal-detay">
                <h3 className="detay-baslik">Konum</h3>
                <p className="detay-icerik">{detayliIlan.lokasyon}</p>
              </div>
              <div className="modal-detay">
                <h3 className="detay-baslik">Durum</h3>
                <p className="detay-icerik">{detayliIlan.durum}</p>
              </div>
              <div className="modal-detay">
                <h3 className="detay-baslik">Kategori</h3>
                <p className="detay-icerik">{detayliIlan.kategori}</p>
              </div>
            </div>
            
            <div className="modal-aciklama">
              <h3 className="detay-baslik">Açıklama</h3>
              <p className="detay-icerik">{detayliIlan.aciklama}</p>
            </div>
            
            <div className="modal-butonlar">
              <button className="favori-buton">
                ♥ Favorilere Ekle
              </button>
              <button className="mesaj-buton">
                ✉ Mesaj Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnaSayfa;