import { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, Star, Flame, Trophy, Sparkles, Zap, 
  Search, SlidersHorizontal, X, Plus, Rocket, Loader2, RefreshCw
} from 'lucide-react';
import GameCard from '../components/games/GameCard';
import GameDetailModal from '../components/games/GameDetailModal';

import { searchGames, getExploreGames } from '../lib/rawg';

function FilterInput({ label, values, onAdd, onRemove, placeholder }) {
  const [draft, setDraft] = useState('');
  
  const apply = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onAdd(v);
    setDraft('');
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && apply()}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/10 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all pr-12"
        />
        <button 
          onClick={apply}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {values.map(v => (
            <span key={v} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[11px] font-medium animate-in fade-in zoom-in duration-300">
              {v}
              <button onClick={() => onRemove(v)} className="hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage({ appState }) {
  const { state, setGameStatus, removeGameStatus, setGameRating, setGameHours,
    toggleAchievement, addCustomAchievement, removeCustomAchievement,
    addGameToList, removeGameFromList, setGameFavorite } = appState;

  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [apiGames, setApiGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [devs, setDevs] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  const fetchFromAPI = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    try {
      if (query.trim() === '') {
        const explore = await getExploreGames();
        setApiGames(explore);
      } else {
        const results = await searchGames(query);
        setApiGames(results);
      }
    } catch (error) {
      console.error("Falha ao buscar jogos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFromAPI();
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const filtered = useMemo(() => {
    return apiGames.filter(g => {
      if (genres.length && !genres.every(genre => g.genre && g.genre.toLowerCase().includes(genre.toLowerCase()))) return false;
      if (years.length && !years.includes(String(g.releaseYear))) return false;
      if (devs.length && !devs.some(d => g.developer && g.developer.toLowerCase().includes(d.toLowerCase()))) return false;
      return true;
    });
  }, [apiGames, genres, years, devs]);

  const hasFilters = !!(genres.length || years.length || devs.length);
  const clearAll = () => { setGenres([]); setYears([]); setDevs([]); };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24 font-main text-white">
      <div className="relative flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white text-3xl font-black tracking-tighter">Alcance as Estrelas</h1>
          </div>
          <p className="text-white/30 text-sm font-medium ml-12 uppercase tracking-widest">
            {query ? 'Explorando setores específicos' : 'Sugestões da Central de Comando (Nota 4.0+)'}
          </p>
        </div>

        {!query && (
           <button 
            onClick={() => fetchFromAPI(true)} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
           >
             <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
             Novas Coordenadas
           </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-purple-400 transition-colors" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Digite o nome de um jogo..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-white/20 text-base focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all shadow-2xl"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-white/30 transition-all">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all border ${
            showFilters 
            ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros Avançados
          {hasFilters && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
        </button>
      </div>

      {showFilters && (
        <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FilterInput label="Gênero" values={genres} onAdd={v => setGenres(p => [...p, v])} onRemove={v => setGenres(p => p.filter(x => x !== v))} placeholder="Action, RPG..." />
            <FilterInput label="Ano" values={years} onAdd={v => setYears(p => [...p, v])} onRemove={v => setYears(p => p.filter(x => x !== v))} placeholder="2024, 1998..." />
          </div>
          {hasFilters && (
            <div className="flex justify-end pt-2 border-t border-white/5">
              <button onClick={clearAll} className="flex items-center gap-2 text-red-400/50 hover:text-red-400 text-[11px] font-black uppercase tracking-widest transition-all">
                <X className="w-3.5 h-3.5" /> Resetar Sensores
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> 
            {isLoading ? 'Escaneando a galáxia...' : `${filtered.length} Destinos Encontrados`}
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-32 flex flex-col items-center justify-center">
             <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
             <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Consultando banco de dados...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 rounded-3xl border border-dashed border-white/5 bg-white/[0.01]">
            <Search className="w-16 h-16 text-white/5 mx-auto mb-4" />
            <p className="text-white/40 font-bold text-lg">Sinais não encontrados.</p>
            <p className="text-white/10 text-sm mt-1">Tente ajustar a sua busca ou resetar os filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filtered.map(game => (
              <GameCard 
                key={game.id} 
                game={game} 
                libraryEntry={state.library[game.id]} 
                onClick={setSelectedGame} 
              />
            ))}
          </div>
        )}
      </div>

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