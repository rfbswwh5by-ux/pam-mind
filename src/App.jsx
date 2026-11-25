import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import SiteLayout from '@/components/site/SiteLayout';
import Home from '@/pages/Home';
import Books from '@/pages/Books';
import BookDetail from '@/pages/BookDetail';
import Experiences from '@/pages/Experiences';
import About from '@/pages/About';
import News from '@/pages/News';
import Article from '@/pages/Article';
import Contact from '@/pages/Contact';
import Search from '@/pages/Search';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';

const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminCollection = lazy(() => import('@/pages/admin/AdminCollection'));
const AdminMessages = lazy(() => import('@/pages/admin/AdminMessages'));
const AdminNewsletter = lazy(() => import('@/pages/admin/AdminNewsletter'));
const AdminMedia = lazy(() => import('@/pages/admin/AdminMedia'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

const AppRoutes = () => {
  // Render the main app
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* The site has no visitor accounts: old sign-in links go to the dashboard. */}
        {["/login", "/register", "/forgot-password", "/reset-password", "/mfa"].map((p) => (
          <Route key={p} path={p} element={<Navigate to="/admin" replace />} />
        ))}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:slug" element={<BookDetail />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<Article />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<AdminCollection type="books" />} />
          <Route path="offerings" element={<AdminCollection type="offerings" />} />
          <Route path="videos" element={<AdminCollection type="videos" />} />
          <Route path="audio" element={<AdminCollection type="audio" />} />
          <Route path="news" element={<AdminCollection type="news" />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App