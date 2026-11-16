import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloating } from './components/ui/WhatsAppFloating';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { TrackingConsent } from './components/ui/TrackingConsent';
import { initMetaPixel } from './services/analytics';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { BatchesPage } from './pages/BatchesPage';
import { BatchDetailPage } from './pages/BatchDetailPage';
import { OurTeamPage } from './pages/OurTeamPage';
import { EventsPage } from './pages/EventsPage';
import { StudentFeedbackPage } from './pages/StudentFeedbackPage';
import { GalleryPage } from './pages/GalleryPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy-loaded Admin CMS Pages (Code-split to reduce main public visitor bundle)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminBatchesPage = lazy(() => import('./pages/admin/AdminBatchesPage').then(m => ({ default: m.AdminBatchesPage })));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage').then(m => ({ default: m.AdminServicesPage })));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage').then(m => ({ default: m.AdminGalleryPage })));

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 text-forest-950 font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-forest-900 rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-widest text-forest-800">Loading SK Relax Admin...</p>
      </div>
    </div>
  );
}

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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    initMetaPixel();
  }, []);

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-cream-100 selection:bg-gold-200 selection:text-forest-950">
        <ScrollToTopOnRoute />
        <Suspense fallback={<AdminLoadingFallback />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/batches" element={<AdminBatchesPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/gallery" element={<AdminGalleryPage />} />
            <Route path="/admin" element={<Navigate to="/admin/services" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-luxury-ivory selection:bg-rose-200 selection:text-forest-950">
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
          <Route path="/academy" element={<Navigate to="/batches" replace />} />
          <Route path="/academy/*" element={<Navigate to="/batches" replace />} />
          <Route path="/batches" element={<BatchesPage />} />
          <Route path="/batches/:id" element={<BatchDetailPage />} />
          <Route path="/team" element={<OurTeamPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/student-feedback" element={<StudentFeedbackPage />} />
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
