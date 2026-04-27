import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dictionary from './pages/Dictionary';
import TermDetail from './pages/TermDetail';
import AddTerm from './pages/AddTerm';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <div className="font-sans text-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sozluk" element={<Dictionary />} />
          <Route path="/terim/:isim" element={<TermDetail />} />
          <Route path="/ekle" element={<AddTerm />} />
        </Routes>
        <Footer /> {/* Footer'ı buraya, tüm routes'un altına koyduk */}
      </div>
    </Router>
  );
}