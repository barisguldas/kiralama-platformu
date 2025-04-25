import React, { useState, useEffect } from 'react';
import './profil.css';

const ProfilSayfasi = () => {
  // Kullanıcı verilerini tanımlayalım (normalde bir API'den alınır)
  const [kullaniciVerileri, setKullaniciVerileri] = useState({
    kullaniciAdi: "yorumcu_arkadaş",
    profilResmi: "/api/placeholder/150/150",
    adres: "İstanbul, Türkiye",
    iletisimBilgileri: "ornek@email.com | +90 555 123 4567",
    sosyalMedya: "@kullaniciadi",
    ilanlar: [
      { id: 1, baslik: "Kiralık Daire", aciklama: "İstanbul'da 2+1 daire", fiyat: "5000₺/ay" },
      { id: 2, baslik: "Kiralık Villa", aciklama: "Antalya'da havuzlu villa", fiyat: "12000₺/ay" },
      { id: 3, baslik: "Kiralık İş Yeri", aciklama: "İzmir'de 150m² dükkan", fiyat: "8000₺/ay" }
    ],
    yorumlar: [
      { id: 1, kullanici: "Ahmet K.", icerik: "Bu adam bir harika adamın dibi", tarih: "12.04.2025" },
      { id: 2, kullanici: "Mehmet Y.", icerik: "Çok güvenilir bir ev sahibi", tarih: "10.04.2025" },
      { id: 3, kullanici: "Ayşe T.", icerik: "Hızlı iletişim, temiz ev", tarih: "05.04.2025" }
    ]
  });

  // Aktif sekme durumu
  const [aktifSekme, setAktifSekme] = useState('ilanlarim');

  // Mesaj gönderme işlevi
  const mesajGonder = () => {
    alert("Mesaj gönderme işlevi henüz eklenmedi!");
  };

  // Sayfalama için aktif sayfayı takip etme
  const [aktifSayfa, setAktifSayfa] = useState(1);

  // Sayfa değiştirme fonksiyonu
  const sayfaDegistir = (sayfaNumarasi) => {
    setAktifSayfa(sayfaNumarasi);
    console.log("Sayfa değiştirildi: " + sayfaNumarasi);
  };

  return (
    <div className="profil-sayfasi">
      {/* Başlık Bölümü */}
      <div className="profil-baslik">
        <div className="profil-avatar">
          <img src={kullaniciVerileri.profilResmi} alt="Profil" />
          <h3>{kullaniciVerileri.kullaniciAdi}</h3>
        </div>
        
        <div className="profil-sekmeler">
          <button 
            className={`sekme-buton ${aktifSekme === 'ilanlarim' ? 'aktif' : ''}`} 
            onClick={() => setAktifSekme('ilanlarim')}
          >
            İlanlarım
          </button>
          <button 
            className={`sekme-buton ${aktifSekme === 'yorumlarim' ? 'aktif' : ''}`} 
            onClick={() => setAktifSekme('yorumlarim')}
          >
            Yorumlar
          </button>
          <button 
            className={`sekme-buton ${aktifSekme === 'iletisim' ? 'aktif' : ''}`} 
            onClick={() => setAktifSekme('iletisim')}
          >
            İletişim
          </button>
        </div>
        
        <div className="mesaj-buton">
          <button onClick={mesajGonder}>Mesaj Gönder</button>
        </div>
      </div>

      {/* Ana İçerik Bölümü */}
      <div className="profil-icerik">
        <div className="icerik-alani">
          {/* İlanlarım Sekmesi */}
          <div id="ilanlarim" style={{ display: aktifSekme === 'ilanlarim' ? 'block' : 'none' }}>
            <h3>İlanlarım</h3>
            <div className="ilan-listesi">
              {kullaniciVerileri.ilanlar.map(ilan => (
                <div key={ilan.id} className="ilan-kutusu">
                  <div className="ilan-gorsel">
                    <img src="/api/placeholder/200/150" alt="İlan görseli" />
                  </div>
                  <div className="ilan-detaylari">
                    <h4>{ilan.baslik}</h4>
                    <p>{ilan.aciklama}</p>
                    <p className="fiyat">{ilan.fiyat}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sayfalama">
              <span>Toplam {kullaniciVerileri.ilanlar.length} ilan, 1-3 arası gösteriliyor</span>
              <div className="sayfa-numaralari">
                {[1, 2, 3].map(sayfaNo => (
                  <a 
                    key={sayfaNo} 
                    href="#" 
                    className={sayfaNo === aktifSayfa ? 'aktif' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      sayfaDegistir(sayfaNo);
                    }}
                  >
                    {sayfaNo}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Yorumlar Sekmesi */}
          <div id="yorumlarim" style={{ display: aktifSekme === 'yorumlarim' ? 'block' : 'none' }}>
            <h3>Yorumlar</h3>
            <div className="yorum-listesi">
              {kullaniciVerileri.yorumlar.map(yorum => (
                <div key={yorum.id} className="yorum-kutusu">
                  <div className="yorum-baslik">
                    <span className="yorum-kullanici">{yorum.kullanici}</span>
                    <span className="yorum-tarih">{yorum.tarih}</span>
                  </div>
                  <p className="yorum-icerik">{yorum.icerik}</p>
                </div>
              ))}
            </div>
            <div className="yorumlar-alt">
              Toplam {kullaniciVerileri.yorumlar.length} yorum gösteriliyor
            </div>
          </div>

          {/* İletişim Sekmesi */}
          <div id="iletisim" style={{ display: aktifSekme === 'iletisim' ? 'block' : 'none' }}>
            <h3>İletişim Bilgileri</h3>
            <div className="iletisim-bilgileri">
              <p><strong>Adres:</strong> {kullaniciVerileri.adres}</p>
              <p><strong>E-posta / Telefon:</strong> {kullaniciVerileri.iletisimBilgileri}</p>
              <p><strong>Sosyal Medya:</strong> {kullaniciVerileri.sosyalMedya}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bilgi Bölümü */}
      <div className="profil-altbilgi">
        <div className="altbilgi-icerik">
          <div className="kullanici-bilgi">
            <img src={kullaniciVerileri.profilResmi} alt="Profil" className="kucuk-avatar" />
            <span>{kullaniciVerileri.kullaniciAdi}</span>
          </div>
          <div className="altbilgi-metin">
            Profil Son Güncelleme: 25.04.2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilSayfasi;