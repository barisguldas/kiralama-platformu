import React, { useState, useEffect } from 'react';
import './ilanArayuzu.css';

//-----------------------------------JAVASCRIPT KODU BASLANGIC------------------------------------------------

function IlanArayuzu() {
  const ilanid = 1; // URL parametresi yerine sabit bir değer kullanıldı
  const [_ILAN, fIlan] = useState(null);
  const [loading, yuklenmeDurumunuAyarla] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, sekmeAyarla] = useState('yorumlar'); // Default active tab is now 'yorumlar'

  // URL'DE KAYITLI OLAN ID'YE GORE VERITABANINDA HEDEF ILAN BULUNUR
  useEffect(() => { 
    const ilanlari_cek = async () => {
      try {
        yuklenmeDurumunuAyarla(true);
        const params = new URLSearchParams();
        params.append('ilanid', ilanid);
        const url = `http://localhost:5000/api/ilanlar?${params.toString()}`;
        const yanit = await fetch(url, {
          headers: {
            'Accept': 'application/json; charset=utf-8',
            'Content-Type': 'application/json; charset=utf-8'
          }
        });

        if (!yanit.ok) {
          throw new Error('API yanıtı başarısız oldu');
        }

        const hamVeri = await yanit.text();
        console.log('Ham API yanıtı:', hamVeri);

        const data = JSON.parse(hamVeri);
        console.log('Dönüştürülen veri:', data);

        fIlan(data);
      } catch (error) {
        console.error('Veri alınırken bir hata oluştu', error);
        setError('İlan bilgisi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        yuklenmeDurumunuAyarla(false);
      }
    };
    ilanlari_cek();
  }, [ilanid]);

  // Tab değiştirme fonksiyonu
  const sekmeDegistir = (tab) => {
    sekmeAyarla(tab);
  };

  // Mesaj gönderme fonksiyonu
  const mesajGonder = (e) => {
    e.preventDefault();
    alert('Mesaj gönderildi!');
  };

  // Teklif verme fonksiyonu
  const teklifVer = (e) => {
    e.preventDefault();
    alert('Teklifiniz iletildi!');
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!_ILAN || _ILAN.length === 0) return <div className="error">İlan bulunamadı.</div>;

  const ilan = _ILAN[0]; // İlk ilanı al

//---------------------------------JAVASCRIPT KODU BITIS----------------------------------------------------  

//----------------------------------JSX BLOGU BASLANGIC--------------------------------------
  
return (
    <div className="ilan-container">
      <div className="ilan-content">
        <div className="ilan-left">
          <div className="ilan-header">
            <h1>{ilan.baslik}</h1>
          </div>
          <div className="ilan-image">
            {ilan.resim ? (
              <img src={ilan.resim} alt={ilan.baslik} />
            ) : (
              <div className="placeholder-image">Görsel Yok</div>
            )}
          </div>
        </div>

        <div className="ilan-right">
          <div className="ilan-owner">
            <div className="owner-avatar">
              {/* Profil resmi varsa göster, yoksa ilk harfi göster */}
              {ilan.sahipResim ? (
                <img src={ilan.sahipResim} alt={ilan.sahip} />
              ) : (
                <div className="avatar-placeholder">
                  {ilan.sahip ? ilan.sahip.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <div className="owner-info">
              <h3>{ilan.sahip || 'İlan Sahibi'}</h3>
            </div>
          </div>

          <div className="ilan-details">
            <div className="detail-description">
              <p>{ilan.aciklama || 'Bu ilan için açıklama bulunmuyor.'}</p>
            </div>
            <div className="detail-price">
              <h2>{ilan.fiyat ? `${ilan.fiyat} TL` : 'Fiyat belirtilmemiş'}</h2>
            </div>
          </div>

          <div className="ilan-actions">
            <button className="action-button message" onClick={mesajGonder}>
              Mesaj Gönder
            </button>
            <button className="action-button offer" onClick={teklifVer}>
              Teklif Ver
            </button>
          </div>
        </div>
      </div>

      <div className="ilan-tabs">
        <div 
          className={`tab ${activeTab === 'yorumlar' ? 'active' : ''}`}
          onClick={() => sekmeDegistir('yorumlar')}
        >
          Kullanıcı Yorumları
        </div>
      </div>

      <div className="tab-content">
        <div className="yorumlar-content">
          <h3>Kullanıcı Yorumları</h3>
          {/* Örnek yorumlar */}
          <div className="comments">
            <div className="comment-item">
              <div className="comment-header">
                <strong>Ahmet K.</strong>
                <span className="comment-date">12.04.2025</span>
              </div>
              <div className="comment-text">
                Çok memnun kaldım, tavsiye ederim.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//---------------------JSX BLOGU BITIS----------------------------------
export default IlanArayuzu;