import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import AnaSayfa from './AnaSayfa';
import GirisPaneli from './GirisPaneli';
import KayitPaneli from './KayitPaneli';
import IlanOlusturma from './ilanolusturma';
import Profil from './ProfilSayfa'; // Profil sayfasının doğru yolu
import KullaniciProfil from './KullaniciProfil';

function App() {
  return (
    <Router>
      <div>
        {/* Sayfa içeriği */}
        <Routes>
          <Route path="/" element={<Navigate to="/anasayfa" />} />
          <Route path="/anasayfa" element={<AnaSayfa />} />
          <Route path="/giris" element={<GirisPaneli />} />
          <Route path="/kayit" element={<KayitPaneli />} />
          <Route path="/ilanolustur" element={<IlanOlusturma />} />
          <Route path="/profil" element={<Profil />} /> {/* Profil sayfası */}
          <Route path="/kullaniciprofil" element={<KullaniciProfil />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
