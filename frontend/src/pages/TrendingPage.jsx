import { useState, useEffect } from 'react';
import { 
  TrendingUp, Star, Flame, Trophy, Sparkles, Zap, Loader2 
} from 'lucide-react';
import { getTrendingGames, getTopRatedGames } from '../lib/rawg'; 
import GameCard from '../components/games/GameCard';
import GameDetailModal from '../components/games/GameDetailModal';

export default function TrendingPage({ appState }) {
  const { state, setGameStatus, removeGameStatus, setGameRating, setGameHours,
    toggleAchievement, addCustomAchievement, removeCustomAchievement,
    addGameToList, removeGameFromList, setGameFavorite } = appState;

  const [selectedGame, setSelectedGame] = useState(null);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function loadData() {
      setLoading(true); 
      try {
        const [trendingData, topRatedData] = await Promise.all([
          getTrendingGames(),
          getTopRatedGames()
        ]);

        const sortedTop5 = [...topRatedData].sort((a, b) => (b.rating || 0) - (a.rating || 0));

        setTrending(trendingData);
        setTopRated(sortedTop5);
      } catch (err) {
        console.error("Erro ao carregar dados do radar:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-widest animate-pulse">Sincronizando com a Galáxia...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 pb-24 font-main text-white">
      <header className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-wide">Pulso da Galáxia</h1>
        </div>
        <p className="text-white/50 text-xs font-medium ml-12 uppercase tracking-widest">
          O que está brilhando mais forte no radar da comunidade.
        </p>
      </header>

      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
        <div className="relative p-6 rounded-3xl border border-white/10 bg-[#0f0823]/60 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-yellow-400 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
              <Trophy className="w-4 h-4 fill-yellow-400/20" /> Constelações de Elite (Top 5)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {topRated.map((g, i) => (
              <div 
                key={g.id} 
                onClick={() => setSelectedGame(g)}
                className="relative flex lg:flex-col items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 cursor-pointer transition-all group/item overflow-hidden"
              >
                <div className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm italic z-10 
                  ${i === 0 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 
                    i === 1 ? 'bg-slate-300 text-black' : 
                    i === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/40'}`}
                >
                  #{i + 1}
                </div>

                <div className="relative w-16 lg:w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
                  <img src={g.cover} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                </div>

                <div className="flex-1 lg:w-full min-w-0 lg:text-center">
                  <h3 className="text-white font-bold text-sm lg:text-base truncate group-hover/item:text-yellow-400 transition-colors">{g.title}</h3>
                  <div className="flex items-center lg:justify-center gap-1.5 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/80 text-xs font-black tracking-widest">{g.rating || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-purple-500 rounded-full" />
            <h2 className="text-white font-black text-xl tracking-tighter flex items-center gap-2">
              Supernovas <Sparkles className="w-4 h-4 text-purple-400" />
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {trending.map(game => (
            <div key={game.id} className="relative group">
              <div className="absolute -top-2 -left-2 z-10 px-2 py-1 rounded-md bg-orange-600 text-white text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg shadow-orange-900/40">
                <Zap className="w-2.5 h-2.5 fill-white" /> Hot
              </div>
              <GameCard 
                game={game} 
                libraryEntry={state.library[game.id]} 
                onClick={setSelectedGame} 
              />
            </div>
          ))}
        </div>
      </section>

      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          libEntry={state.library[selectedGame.id]}
          customAchs={state.customAchievements[selectedGame.id]}
          lists={state.lists}
          onSetStatus={setGameStatus}
          onRemoveStatus={removeGameStatus}
          onSaveRating={setGameRating}
          onSetHours={setGameHours}
          onToggleAchievement={toggleAchievement}
          onAddCustomAchievement={addCustomAchievement}
          onRemoveCustomAchievement={removeCustomAchievement}
          onAddToList={addGameToList}
          onRemoveFromList={removeGameFromList}
          onToggleFavorite={(id) => setGameFavorite(id, !state.library[id]?.favorite)}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}