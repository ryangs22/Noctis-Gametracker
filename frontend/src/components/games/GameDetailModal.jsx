import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Clock, Calendar, Monitor, Heart, Loader2 } from 'lucide-react';
import StatusMenu from './StatusMenu';
import RatingModal from './RatingModal';
import AchievementsPanel from './AchievementsPanel';
import HalfStars from './HalfStars';
import { getGameDetails } from '../../lib/rawg';

const TABS = [
  { id: 'info', label: 'Detalhes' },
  { id: 'status', label: 'Status' },
  { id: 'rating', label: 'Avaliação' },
  { id: 'achievements', label: 'Conquistas' },
  { id: 'lists', label: 'Listas' },
];

const STATUS_COLORS = {
  'Jogado': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Jogando': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Quero Jogar': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Abandonado': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Platinado': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatFullDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function extractYear(game) {
  if (game?.released) return new Date(game.released + 'T12:00:00').getFullYear();
  if (game?.releaseYear && game.releaseYear !== 'N/A') return game.releaseYear;
  if (game?.year) return game.year;
  return 'N/A';
}

async function translateToPtBr(text) {
  if (!text) return null;
  const snippet = text.slice(0, 500);
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(snippet)}&langpair=en|pt-BR`
    );
    const data = await res.json();
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    return text;
  } catch {
    return text;
  }
}

export default function GameDetailModal({
  game: initialGame, libEntry, customAchs, lists,
  onSetStatus, onRemoveStatus, onSaveRating, onSetHours,
  onToggleAchievement, onAddCustomAchievement, onRemoveCustomAchievement,
  onAddToList, onRemoveFromList, onToggleFavorite, onClose,
}) {
  const [tab, setTab] = useState('info');
  const [showRating, setShowRating] = useState(false);
  const [hours, setHours] = useState(libEntry?.hoursPlayed || '');
  const [game, setGame] = useState(initialGame);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [description, setDescription] = useState(''); 

  useEffect(() => {
    if (!initialGame?.id) return;
    setGame(initialGame);
    setDescription('');
    setLoadingDetail(true);

    getGameDetails(initialGame.id)
      .then(async (details) => {
        if (details) {
          setGame(details);
          const rawDesc = details.description || details.synopsis || '';
          if (rawDesc) {
            const translated = await translateToPtBr(rawDesc);
            setDescription(translated || rawDesc);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoadingDetail(false));
  }, [initialGame?.id]);

  const status = libEntry?.status;
  const isFavorite = !!libEntry?.favorite;

  if (!game) return null;

  const platformsPreview = game?.platforms?.length
    ? game.platforms.slice(0, 3).join(', ')
    : game?.developer || '';

  return createPortal(
    <>
      <div className="fixed inset-0 md:pl-64 z-[50] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

        <div
          className="relative w-full max-w-4xl flex flex-col rounded-3xl overflow-hidden shadow-2xl font-main"
          style={{
            background: 'rgba(6,3,18,0.99)',
            border: '1px solid rgba(255,255,255,0.08)',
            maxHeight: '90vh',
          }}
        >
          <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Hero banner */}
          <div className="relative flex-shrink-0" style={{ height: '160px' }}>
            <img src={game?.cover} alt={game?.title} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,3,18,0) 0%, rgba(6,3,18,0.6) 60%, rgba(6,3,18,1) 100%)' }} />

            <button onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/60 text-white/70 hover:text-white border border-white/10 backdrop-blur-sm transition-all">
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-4 right-12">
              <h2 className="text-white font-black text-xl leading-tight drop-shadow-lg">{game?.title}</h2>
              <p className="text-white/50 text-xs mt-0.5">
                {platformsPreview}{platformsPreview ? ' · ' : ''}{extractYear(game)}
              </p>
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0 border-b border-white/[0.06]">
            {status ? (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[status] || 'bg-white/10 text-white/60 border-white/20'}`}>
                {status}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs border border-dashed border-white/20 text-white/30">Sem status</span>
            )}
            {isFavorite && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border bg-pink-500/15 text-pink-300 border-pink-500/25">
                <Heart className="w-3 h-3 fill-pink-300" />Favorito
              </span>
            )}
            {libEntry?.rating && (
              <span className="ml-auto flex items-center gap-1 text-yellow-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-yellow-300" />{libEntry.rating}/10
              </span>
            )}
            {loadingDetail && (
              <span className="ml-auto flex items-center gap-1.5 text-white/30 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" /> carregando detalhes...
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] flex-shrink-0 overflow-x-auto scrollbar-hide px-2">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 flex-shrink-0 ${tab === t.id ? 'text-purple-300 border-purple-500' : 'text-white/35 border-transparent hover:text-white/60'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch' }}>

            {tab === 'info' && (
              <div className="space-y-6 animate-in fade-in duration-300">

                {/* Gêneros */}
                <div className="flex flex-wrap gap-2">
                  {game?.genres?.map(g => (
                    <span key={g} className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {capitalize(g)}
                    </span>
                  ))}
                </div>

                {/* Descrição traduzida */}
                <div>
                  {loadingDetail ? (
                    <div className="flex items-center gap-2 text-white/30 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traduzindo as Estrelas...
                    </div>
                  ) : (
                    <p className="text-white/70 text-sm leading-relaxed max-h-40 overflow-y-auto pr-2">
                      {description || 'Nenhuma descrição disponível para este título.'}
                    </p>
                  )}
                </div>

                {/* Data e nota */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Lançamento
                    </p>
                    <p className="text-white text-sm font-bold">
                      {formatFullDate(game?.released) || game?.releaseYear || game?.year || 'N/A'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-500" /> Comunidade
                    </p>
                    <p className="text-white text-base font-bold">
                      {game?.rating
                        ? `${parseFloat(game.rating).toFixed(1)} / 5`
                        : game?.communityRating
                        ? `${game.communityRating} / 10`
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Plataformas */}
                {game?.platforms?.length > 0 && (
                  <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Monitor className="w-3 h-3" /> Sistemas Disponíveis
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {game.platforms.map(p => (
                        <span key={p} className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'status' && (
              <div className="space-y-4">
                <StatusMenu
                  current={status}
                  isFavorite={isFavorite}
                  onChange={(s) => { if (s) onSetStatus(game, s); else onRemoveStatus(game.id); }}
                  onToggleFavorite={() => onToggleFavorite && onToggleFavorite(game.id)}
                  onRemove={() => onRemoveStatus(game.id)}
                />
                <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                  <p className="text-white/40 text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4" />Horas jogadas</p>
                  <div className="flex gap-2">
                    <input
                      type="number" value={hours}
                      onChange={e => setHours(e.target.value)}
                      placeholder="0" min={0}
                      style={{ MozAppearance: 'textfield' }}
                      className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-base focus:outline-none focus:border-purple-500/40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button onClick={() => onSetHours(game.id, hours)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all">
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'rating' && (
              <div>
                {libEntry?.criteria ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-5 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/15">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-2xl font-black">{libEntry.rating}</span>
                      <span className="text-white/40">/10</span>
                      <button onClick={() => setShowRating(true)}
                        className="ml-auto text-sm text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30 px-3 py-1 rounded-lg">
                        Editar
                      </button>
                    </div>
                    {Object.entries(libEntry.criteria).map(([c, v]) => (
                      <div key={c} className="flex items-center justify-between gap-3 py-2 border-b border-white/[0.05]">
                        <span className="text-white/60 text-sm flex-1">{c}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-xs">{v}</span>
                          <HalfStars value={v} size="sm" />
                        </div>
                      </div>
                    ))}
                    {libEntry.comment && (
                      <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                        <p className="text-white/50 italic text-sm">"{libEntry.comment}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-14 h-14 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 mb-5">Ainda não avaliou este jogo</p>
                    <button onClick={() => setShowRating(true)}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold transition-all">
                      Avaliar agora
                    </button>
                  </div>
                )}
              </div>
            )}

            {tab === 'achievements' && (
              <AchievementsPanel
                game={game}
                libEntry={libEntry}
                customAchs={customAchs}
                onToggle={onToggleAchievement}
                onAddCustom={onAddCustomAchievement}
                onRemoveCustom={onRemoveCustomAchievement}
              />
            )}

            {tab === 'lists' && (
              <div className="space-y-3">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Adicionar a lista</p>
                {lists?.length === 0 && (
                  <p className="text-white/30 text-center py-6 text-sm">Nenhuma lista criada ainda.</p>
                )}
                {lists?.map(list => {
                  const inList = list.gameIds.includes(game.id);
                  return (
                    <div key={list.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                      <div>
                        <p className="text-white/80 font-medium text-sm">{list.name}</p>
                        <p className="text-white/30 text-xs">{list.gameIds.length} jogos</p>
                      </div>
                      <button
                        onClick={() => inList ? onRemoveFromList(list.id, game.id) : onAddToList(list.id, game.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${inList ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-purple-500/15 text-purple-300 hover:bg-purple-500/25'}`}>
                        {inList ? 'Remover' : 'Adicionar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="h-6" />
          </div>
        </div>
      </div>

      {showRating && (
        <RatingModal
          game={game}
          existing={libEntry}
          onSave={(data) => { onSaveRating(game.id, data); setShowRating(false); }}
          onClose={() => setShowRating(false)}
        />
      )}
    </>,
    document.body
  );
}