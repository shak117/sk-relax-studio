import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloating } from './components/ui/WhatsAppFloating';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { TrackingConsent } from './components/ui/TrackingConsent';
import { initMetaPixel } from './services/analytics';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AcademyPage } from './pages/AcademyPage';
import { GalleryPage } from './pages/GalleryPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTopOnRoute() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Only scroll if there isn't a hash anchor in the URL
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
}

export function App() {
  useEffect(() => {
    initMetaPixel();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-ivory selection:bg-rose-200 selection:text-forest-950">
      <ScrollToTopOnRoute />
      
      {/* 4A. Slim Announcement Strip */}
      <AnnouncementBar />

      {/* Persistent Header */}
      <Header />

      {/* Main Multi-page Routes */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Global Interactive Float Controls */}
      <WhatsAppFloating />
      <ScrollToTop />
      
      {/* Privacy & Cookie Consent Banner */}
      <TrackingConsent />
    </div>
  );
}

export default App;
