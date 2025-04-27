import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

//-----------------------JAVASCIPT KODLARI BASLANGIC---------------------------------------------------------------
function IlanArayuzu() {
  const { ilanid } = useParams(); //useParams ile URL icindeki ilanid'si cekilir
  const [_ILAN, fIlan] = useState('');

  //-----------URL'DE KAYITLI OLAN ID'YE GORE VERITABANINDA HEDEF ILAN BULUNUR
   useEffect(() => { 
        const ilanlari_cek = async () => {
          try {
            const params = new URLSearchParams();
            params.append('ilanid', ilanid);
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
            
            const rawText = await response.text();
            console.log('Ham API yanıtı:', rawText);
            
            const data = JSON.parse(rawText);
            console.log('Dönüştürülen veri:', data);
            
            fIlan(data);
          } catch (error) {
            console.error('Veri alınırken bir hata oluştu', error);
          }
        };
        ilanlari_cek();
      }, []);

  if (!_ILAN) return <p>Yükleniyor...</p>;
//-----------------------JAVASCIPT KODLARI BİTİŞ------------------------------------------------------------------------

//-----------------------JSX BLOGU BASLANGIC----------------------------------------------------------------------------
  return (
    <div>       
     { _ILAN.map(ilan => (
  <div key={ilan.id}>
    <h2>{ilan.baslik}</h2>
    <p>{ilan.aciklama}</p>
  </div>
)) }
    </div>
  );

}
//-----------------------JSX BLOGU BITIS---------------------------------------------------------------------------------

export default IlanArayuzu;
