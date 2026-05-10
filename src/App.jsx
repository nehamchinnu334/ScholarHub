import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Discover } from './pages/Discover';
import { ResourceDetails } from './pages/ResourceDetails';
import { UploadPortal } from './pages/UploadPortal';
import { AdminConsole } from './pages/AdminConsole';
import { MyMaterials } from './pages/MyMaterials';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { supabase } from './supabase'; // Added supabase import

export default function App() {
  const [currentPage, setCurrentPage] = useState('discover');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check Supabase Auth session on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
      setIsInitializing(false);
    };
    checkUser();

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('discover');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentPage('discover');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'discover':
        return <Discover onPageChange={handlePageChange} />;
      case 'resource-details':
        return <ResourceDetails />;
      case 'upload':
        return <UploadPortal />;
      case 'admin-console': // Updated to match the Header/Navbar click
        return <AdminConsole />;
      case 'my-materials':
        return <MyMaterials onPageChange={handlePageChange} />;
      case 'settings':
        return <Settings />;
      default:
        return <Discover onPageChange={handlePageChange} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-500">
      {/* Navbar updated to receive current page and logout function */}
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow w-full pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full flex flex-col"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
        
        <Footer />
      </main>
    </div>
  );
}