import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Anasayfa from './Deneme';
import KayitPaneli from './KayitPaneli';

function App() {
  return (
    <Router>
      <Routes>
        {/* "/" adresine girince otomatik olarak "/anasayfa"ya yönlendir */}
        <Route path="/" element={<Navigate to="/anasayfa" />} />
        <Route path="/anasayfa" element={<Anasayfa />} />
        <Route path="/login" element={<KayitPaneli />} />
      </Routes>
    </Router>
  );
}

export default App;
