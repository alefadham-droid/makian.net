import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import DailyEntry from './pages/DailyEntry';
import Reports from './pages/Reports';
import Calculators from './pages/Calculators';
import Settings from './pages/Settings';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import './App.css';

function App() {
  useEffect(() => {
    // ثبت Service Worker برای PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker ثبت شد:', registration);
          })
          .catch(error => {
            console.log('خطا در ثبت ServiceWorker:', error);
          });
      });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 mt-16 mr-64">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/daily-entry" element={<DailyEntry />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
