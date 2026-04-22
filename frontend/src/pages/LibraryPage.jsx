import { useState, useMemo } from 'react';
import GameCard from '../components/games/GameCard';
import GameDetailModal from '../components/games/GameDetailModal';
import { STATUSES } from '../components/games/StatusMenu';
import { Library, Search } from 'lucide-react';

export default function LibraryPage({ appState }) {
  const { 
    state, 
    setGameStatus, 
    removeGameStatus, 
    setGameRating, 
    setGameHours,
    toggleAchievement, 
    addCustomAchievement, 
    removeCustomAchievement,
    addGameToList, 
    removeGameFromList, 
    setGameFavorite 
  } = appState;

  const [filterStatus, setFilterStatus] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  const libraryGames = useMemo(() => {
    const q = searchQ.toLowerCase();
    
    return Object.values(state.library)
      .filter(entry => entry?.status && entry?.game) 
      .map(entry => entry.game)
      .filter(g => !filterStatus || state.library[g.id]?.status === filterStatus)
      .filter(g => {
        if (!q) return true;
        
        const gameGenres = Array.isArray(g.genres) ? g.genres.join(' ') : (g.genre || '');
        const displayYear = g.releaseYear || g.year || '';

        return (
          g.title?.toLowerCase().includes(q) ||
          g.developer?.toLowerCase().includes(q) ||
          gameGenres.toLowerCase().includes(q) ||
          String(displayYear).includes(q)
        );
      });
  }, [state.library, filterStatus, searchQ]);

  const totalInLib = Object.values(state.library).filter(entry => entry?.status && entry?.game).length;

  return (
    <div className="p-6 font-main">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold mb-2 tracking-tight">Minha Biblioteca</h1>
        <p className="text-white/40 text-sm">
          {totalInLib} jogo{totalInLib !== 1 ? 's' : ''} rastreado{totalInLib !== 1 ? 's' : ''} entre as estrelas
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
            !filterStatus 
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
              : 'bg-white/[0.03] text-white/40 border-white/[0.08] hover:text-white/60 hover:bg-white/[0.05]'
          }`}
        >
          Todos
        </button>

        {STATUSES.map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            onClick={() => setFilterStatus(filterStatus === label ? '' : label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              filterStatus === label 
                ? 'bg-white/[0.1] text-white border-white/20' 
                : 'bg-white/[0.03] text-white/40 border-white/[0.08] hover:text-white/60 hover:bg-white/[0.05]'
            }`}
          >
            <Icon className={`w-4 h-4 ${color}`} />
            {label}
          </button>
        ))}

        <div className="ml-auto relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Buscar na coleção..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl py-2.5 pl-10 pr-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all"
          />
        </div>
      </div>

      {libraryGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Library className="w-16 h-16 text-white/5 mb-4" />
          <p className="text-white/30 text-lg font-medium">
            {searchQ ? `Nenhum sinal de "${searchQ}"` : 'Sua biblioteca está vazia'}
          </p>
          <p className="text-white/15 text-sm mt-1 max-w-xs">
            {searchQ ? 'Tente outros termos ou remova os filtros.' : 'Explore o catálogo e adicione jogos para começar seu registro.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {libraryGames.map(game => (
            <GameCard 
              key={game.id} 
              game={game} 
              libraryEntry={state.library[game.id]} 
              onClick={setSelectedGame} 
            />
          ))}
        </div>
      )}

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