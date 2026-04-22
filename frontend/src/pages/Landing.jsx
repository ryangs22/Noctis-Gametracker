import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../lib/useAppState';
import { useAuth } from '../lib/AuthContext';
import StarfieldBackground from '../components/StarfieldBackground';
import AuthCard from '../components/AuthCard';
import AppShell from '../components/layout/AppShell';
import SearchPage from './SearchPage';
import LibraryPage from './LibraryPage';
import ListsPage from './ListsPage';
import TrendingPage from './TrendingPage';
import ProfilePage from './ProfilePage';

export default function Landing() {
  const appState = useAppState();
  const { user, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('noctis_current_tab') || 'search';
  });

  useEffect(() => {
    localStorage.setItem('noctis_current_tab', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Sincronizando biblioteca da nova conta...");
      appState.syncLibrary();
    }
  }, [isAuthenticated]);

  const handleSairDoSistema = () => {
    appState.logout(); 
    logout();          
    localStorage.setItem('noctis_current_tab', 'search'); 
    setCurrentPage('search'); 
  };

  if (isAuthenticated) { 
    const renderPage = () => {
      switch (currentPage) {
        case 'search':   return <SearchPage appState={appState} />;
        case 'library':  return <LibraryPage appState={appState} />;
        case 'lists':    return <ListsPage appState={appState} />;
        case 'trending': return <TrendingPage appState={appState} />;
        case 'profile':  return <ProfilePage appState={appState} />;
        default:         return <SearchPage appState={appState} />;
      }
    };

    return (
      <AppShell 
        user={user || { name: "Explorador" }} 
        onLogout={handleSairDoSistema} 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
      >
        {renderPage()}
      </AppShell>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-main">
      <StarfieldBackground />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', top: '-5%', left: '-10%',
          width: '70vw', height: '70vw',
          background: 'radial-gradient(ellipse at 40% 40%, rgba(140,60,255,0.55) 0%, rgba(100,50,220,0.35) 25%, rgba(60,90,210,0.18) 50%, transparent 72%)',
          filter: 'blur(60px)', borderRadius: '60% 40% 55% 45%', transform: 'rotate(-20deg)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: '65vw', height: '60vw',
          background: 'radial-gradient(ellipse at 55% 55%, rgba(100,50,230,0.5) 0%, rgba(70,110,230,0.3) 30%, rgba(110,60,200,0.14) 55%, transparent 72%)',
          filter: 'blur(55px)', borderRadius: '45% 60% 40% 55%', transform: 'rotate(15deg)',
        }} />
      </div>

      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80 pointer-events-none" style={{ zIndex: 2 }} />

      <div className="relative flex flex-col items-center w-full py-12 px-4" style={{ zIndex: 3 }}>
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-3xl bg-purple-600/20 rounded-full scale-150" />
            <h1
              className="relative text-6xl sm:text-7xl md:text-8xl font-black tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 select-none"
              style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 60px rgba(180,120,255,0.4)' }}
            >
              NOCTIS
            </h1>
          </div>
          <p className="mt-3 text-white/25 text-sm tracking-[0.3em] uppercase font-light">Game Tracker</p>
        </motion.div>

        <div className="relative w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <AuthCard />
          </motion.div>
        </div>

        <p className="mt-10 text-white/15 text-xs tracking-widest">
          © 2026 NOCTIS — Rastreie suas conquistas entre as estrelas
        </p>
      </div>
    </div>
  );
}