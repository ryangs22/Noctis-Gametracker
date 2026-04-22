import { useState } from 'react';
import { Search, Library, ListMusic, User, TrendingUp, LogOut, Menu, X, Sparkles } from 'lucide-react';
import StarfieldBackground from '../StarfieldBackground';

const NAV_ITEMS = [
  { id: 'search', label: 'Explorar', icon: Search },
  { id: 'library', label: 'Biblioteca', icon: Library },
  { id: 'lists', label: 'Listas', icon: ListMusic },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function AppShell({ user, onLogout, currentPage, onNavigate, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const active = currentPage === item.id;
    return (
      <button
        onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
          ? 'bg-purple-600/25 text-purple-300 border border-purple-500/30'
          : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05]'}`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{item.label}</span>
      </button>
    );
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <span className="text-white font-black tracking-[0.15em] text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>NOCTIS</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(item => <NavLink key={item.id} item={item} />)}
      </nav>
      <div className="border-t border-white/[0.07] pt-4 mt-4">
       <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 border border-purple-500/30 flex items-center justify-center text-purple-200 text-sm font-bold flex-shrink-0 overflow-hidden">
            {user?.avatar && user.avatar.length > 10 ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-white/80 text-sm font-medium truncate">
              {user?.name || 'Explorador'}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <StarfieldBackground />
      {/* Nebulosas */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '-5%', left: '-10%', width: '70vw', height: '70vw', background: 'radial-gradient(ellipse at 40% 40%, rgba(140,60,255,0.55) 0%, rgba(100,50,220,0.35) 25%, rgba(60,90,210,0.18) 50%, transparent 72%)', filter: 'blur(60px)', borderRadius: '60% 40% 55% 45%', transform: 'rotate(-20deg)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '65vw', height: '60vw', background: 'radial-gradient(ellipse at 55% 55%, rgba(100,50,230,0.5) 0%, rgba(70,110,230,0.3) 30%, rgba(110,60,200,0.14) 55%, transparent 72%)', filter: 'blur(55px)', borderRadius: '45% 60% 40% 55%', transform: 'rotate(15deg)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '15%', width: '70vw', height: '40vw', background: 'radial-gradient(ellipse at 50% 50%, rgba(80,40,190,0.3) 0%, rgba(60,90,200,0.18) 40%, transparent 68%)', filter: 'blur(70px)', borderRadius: '50%' }} />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" style={{ zIndex: 2 }} />

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col z-[60]"
        style={{ background: 'rgba(8,4,20,0.75)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <Sidebar />
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(8,4,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-white font-black tracking-[0.15em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>NOCTIS</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/60 hover:text-white p-2 -mr-1 touch-manipulation">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 z-[80]"
            style={{ background: 'rgba(8,4,20,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="md:ml-60 relative z-10 min-h-screen pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}