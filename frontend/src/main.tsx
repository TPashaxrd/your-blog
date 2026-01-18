import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import { config } from './components/config';

// Sayfalar
import NoPage from './Pages/NoPage/NoPage.tsx';
import LockedScreen from './Pages/NoPage/LockedScreen.tsx'; // Bunu oluşturduğunu varsayıyorum
import Blog from './Pages/Blogs/Blog.tsx';
import Contact from './Pages/Contact.tsx';
import Blogs from './Pages/Blogs/Blogs.tsx';
import CreateBlog from './Pages/Admin/Admin.tsx';
import Toprak from './Pages/Toprak.tsx';
import Stats from './Pages/Stats/Stats.tsx';
import Time from './Pages/Time.tsx';
import Repaste from './Pages/Repaste/Repaste.tsx';
import ReadNote from './Pages/Repaste/ReadNote.tsx';
import Play from './Pages/Game/Play.tsx';
import Start from './Pages/Game/Start.tsx';
import WallStreet from './Pages/Backgrounds/WallStreet/App.tsx';
import Privates from './Pages/Privates/Privates.tsx';
import Panic from './Pages/Admin/Panic.tsx';

const AppRouter = () => {
  const [isSystemOnline, setIsSystemOnline] = useState<boolean | null>(null);
  const location = useLocation();

  const checkSystemStatus = async () => {
    try {
      const res = await axios.get(`${config.api}/api/admin/system-status`);
      setIsSystemOnline(res.data.systemMode);
    } catch (err) {
      setIsSystemOnline(true);
    }
  };

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isSystemOnline === null) return null;

  if (isSystemOnline === false) {
    return (
      <Routes>
        <Route path="/admin/panic" element={<Panic />} />
        <Route path="*" element={<LockedScreen />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog/:slug" element={<Blogs />} />
      <Route path="/time" element={<Time />} />

      <Route path="/admin" element={<CreateBlog />} />
      <Route path="/admin/stats" element={<Stats />} />
      <Route path="/admin/private" element={<Privates />} />
      <Route path="/admin/panic" element={<Panic />} />

      <Route path="/repaste" element={<Repaste />} />
      <Route path="/note/:id" element={<ReadNote />} />

      <Route path="/game/play" element={<Play />} />
      <Route path="/game/start" element={<Start />} />

      <Route path="/toprak" element={<Toprak />} />
      <Route path="/about" element={<Toprak />} />

      <Route path="/trading" element={<WallStreet />} />

      <Route path="*" element={<NoPage />} />
    </Routes>
  );
};

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </HelmetProvider>
);