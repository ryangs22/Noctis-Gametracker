import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, ListMusic, X, Check, ArrowLeft, GripVertical, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import GameCard from '../components/games/GameCard';
import GameDetailModal from '../components/games/GameDetailModal';

function ListCover({ games }) {
  const covers = games.slice(0, 4).map(g => g.cover || g.background_image);
  
  if (covers.length === 0) return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-blue-900/20">
      <ListMusic className="w-12 h-12 text-purple-400/20" />
    </div>
  );
  
  if (covers.length < 4) return (
    <img src={covers[0]} alt="" className="w-full h-full object-cover" />
  );
  
  return (
    <div className="grid grid-cols-2 w-full h-full">
      {covers.map((c, i) => (
        <img key={i} src={c} alt="" className="w-full h-full object-cover border-[0.5px] border-black/20" />
      ))}
    </div>
  );
}

function ListCard({ list, games, onOpen, onEdit, onDelete }) {
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
      style={{ background: 'rgba(20, 15, 35, 0.4)' }}
      onClick={onOpen}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <ListCover games={games} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-md">
            {games.length} {games.length === 1 ? 'Jogo' : 'Jogos'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white text-base font-bold truncate group-hover:text-purple-300 transition-colors">
          {list.name}
        </h3>
        {list.description && (
          <p className="text-white/30 text-xs mt-1 truncate font-light leading-relaxed">
            {list.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="flex-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-white/40 hover:text-white/80 text-[11px] font-medium transition-all flex items-center justify-center gap-1.5"
          >
            <Edit2 className="w-3 h-3" /> Editar
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListsPage({ appState }) {
  const { 
    state, createList, updateList, deleteList, reorderListGames,
    setGameStatus, removeGameStatus, setGameRating, setGameHours,
    toggleAchievement, addCustomAchievement, removeCustomAchievement,
    addGameToList, removeGameFromList, setGameFavorite 
  } = appState;

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingList, setEditingList] = useState(null);
  const [openListId, setOpenListId] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAddGames, setShowAddGames] = useState(false);
  const [addSearch, setAddSearch] = useState('');

  const libraryGames = useMemo(() => {
    return Object.keys(state.library)
      .filter(id => state.library[id]?.status) 
      .map(id => state.library[id].game) 
      .filter(Boolean);
  }, [state.library]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createList(newName, newDesc);
    setNewName(''); setNewDesc(''); setCreating(false);
  };

  const handleUpdate = () => {
    if (!editingList) return;
    updateList(editingList.id, { name: editingList.name, description: editingList.description });
    setEditingList(null);
  };

  const openList = state.lists.find(l => l.id === openListId);
  
  const openListGames = openList
    ? openList.gameIds.map(id => state.library[id]?.game).filter(Boolean)
    : [];

  const onDragEnd = (result) => {
    if (!result.destination || !openList) return;
    const ids = Array.from(openList.gameIds);
    const [removed] = ids.splice(result.source.index, 1);
    ids.splice(result.destination.index, 0, removed);
    reorderListGames(openList.id, ids);
  };

  if (openList) {
    return (
      <div className="p-6 font-main">
        <button 
          onClick={() => setOpenListId(null)} 
          className="flex items-center gap-2 text-white/30 hover:text-white/80 text-sm mb-6 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para listas
        </button>

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-white text-4xl font-black tracking-tight">{openList.name}</h1>
            {openList.description && <p className="text-white/40 text-lg mt-2 font-light">{openList.description}</p>}
            <p className="text-purple-400/50 text-[10px] uppercase tracking-[0.2em] mt-3 font-bold">
              {openListGames.length} títulos selecionados • Arraste para organizar
            </p>
          </div>
          <button 
            onClick={() => setShowAddGames(true)}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-lg shadow-purple-900/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Adicionar Jogos
          </button>
        </div>

        {showAddGames && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAddGames(false)} />
            <div className="relative w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl" style={{ background: 'rgba(10, 5, 20, 0.98)', maxHeight: '85vh' }}>
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Minha Biblioteca</h3>
                <button onClick={() => setShowAddGames(false)} className="p-2 rounded-xl hover:bg-white/5 text-white/40 transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    value={addSearch} 
                    onChange={e => setAddSearch(e.target.value)} 
                    placeholder="Filtrar biblioteca..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/40" 
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 px-4 pb-6 space-y-2">
               {libraryGames
                  .filter(g => {
                    const title = g.title || '';
                    return !addSearch || title.toLowerCase().includes(addSearch.toLowerCase());
                  })
                  .map(g => {
                    const inList = openList.gameIds.includes(g.id);
                    
                    const title = g.title;
                    const cover = g.cover;
                    const year = g.releaseYear || 'N/A'; 
                    const platforms = g.developer || 'N/A';

                    return (
                      <button 
                        key={g.id}
                        onClick={() => inList ? removeGameFromList(openList.id, g.id) : addGameToList(openList.id, g.id)}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${inList ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.05]'}`}
                      >
                        <img src={cover} alt="" className="w-12 h-16 object-cover rounded-lg shadow-lg" />
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-white font-bold text-sm truncate">{title}</p>
                          <p className="text-white/30 text-xs uppercase tracking-tighter mt-1 truncate">
                            {platforms} • {year}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${inList ? 'bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'border-white/20'}`}>
                          {inList && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {openListGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
            <ListMusic className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium italic">Sua lista está orbitando o vazio...</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list-games" direction="horizontal">
              {(provided) => (
                <div 
                  ref={provided.innerRef} {...provided.droppableProps}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                >
                  {openListGames.map((game, index) => (
                    <Draggable key={game.id} draggableId={String(game.id)} index={index}>
                      {(prov, snapshot) => (
                        <div 
                          ref={prov.innerRef} {...prov.draggableProps}
                          className={`relative group/item ${snapshot.isDragging ? 'z-50' : ''}`}
                        >
                          <div 
                            {...prov.dragHandleProps}
                            className="absolute top-2 left-2 z-20 p-2 rounded-xl bg-black/60 text-white/20 hover:text-white/90 backdrop-blur-md opacity-0 group-hover/item:opacity-100 transition-all cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className={snapshot.isDragging ? 'rotate-3 scale-105 shadow-2xl transition-transform' : ''}>
                            <GameCard game={game} libraryEntry={state.library[game.id]} onClick={setSelectedGame} />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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

  return (
    <div className="p-6 font-main">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-white text-3xl font-black tracking-tight">Minhas Listas</h1>
          <p className="text-white/40 text-sm mt-1">{state.lists.length} coleções personalizadas</p>
        </div>
        <button 
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-bold transition-all"
        >
          <Plus className="w-5 h-5 text-purple-400" /> Nova Lista
        </button>
      </div>

      {creating && (
        <div className="mb-10 p-6 rounded-3xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-white font-bold mb-4 text-lg">Criar Nova Coleção</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              placeholder="Ex: RPGs de Turno, Para Platinar..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50" 
            />
            <input 
              value={newDesc} 
              onChange={e => setNewDesc(e.target.value)} 
              placeholder="Uma breve descrição (opcional)"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50" 
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-all shadow-lg shadow-purple-900/20">Criar Lista</button>
            <button onClick={() => setCreating(false)} className="px-6 py-3 rounded-2xl bg-white/5 text-white/50 text-sm font-medium hover:text-white transition-all">Cancelar</button>
          </div>
        </div>
      )}

      {editingList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setEditingList(null)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-white/10 p-6 shadow-2xl" style={{ background: 'rgba(15,10,30,0.98)' }}>
            <h3 className="text-white font-black text-xl mb-6">Editar Coleção</h3>
            <div className="space-y-4">
              <input value={editingList.name} onChange={e => setEditingList({ ...editingList, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:border-purple-500/40 outline-none" />
              <input value={editingList.description || ''} onChange={e => setEditingList({ ...editingList, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm focus:border-purple-500/40 outline-none" />
              <div className="flex gap-3 mt-4">
                <button onClick={handleUpdate} className="flex-1 py-3 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all">Salvar</button>
                <button onClick={() => setEditingList(null)} className="flex-1 py-3 rounded-2xl bg-white/5 text-white/50 hover:text-white transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.lists.length === 0 && !creating ? (
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6 border border-white/[0.05]">
            <ListMusic className="w-10 h-10 text-white/10" />
          </div>
          <p className="text-white/40 text-lg font-light max-w-xs leading-relaxed">
            Nenhuma lista encontrada. Comece criando uma para organizar seus jogos favoritos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {state.lists.map(list => {
            const games = list.gameIds.map(id => state.library[id]?.game).filter(Boolean);
            return (
              <ListCard
                key={list.id}
                list={list}
                games={games}
                onOpen={() => setOpenListId(list.id)}
                onEdit={() => setEditingList({ ...list })}
                onDelete={() => deleteList(list.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}