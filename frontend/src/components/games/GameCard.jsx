import { Star, Heart } from 'lucide-react';

const STATUS_COLORS = {
  'Jogado': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Jogando': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Quero Jogar': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Abandonado': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Platinado': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

export default function GameCard({ game, libraryEntry, onClick }) {
  const status = libraryEntry?.status;
  const favorite = libraryEntry?.favorite;
  const rating = libraryEntry?.rating;

  if (!game) return null;

  const displayYear = game?.year || game?.releaseYear;
  
  const genresArray = Array.isArray(game?.genres) 
    ? game.genres 
    : (typeof game?.genre === 'string' ? game.genre.split(', ') : []);

  return (
    <div
      onClick={() => onClick(game)}
      className="group relative cursor-pointer rounded-xl border border-white/[0.07] hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-900/20"
      style={{ background: 'rgba(15,8,35,0.6)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}
    >
      <div className="relative" style={{ aspectRatio: '2/2.8', overflow: 'hidden' }}>
        <img
          src={game?.cover}
          alt={game?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ display: 'block' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {status && (
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status] || 'bg-white/10 text-white/60 border-white/20'}`}>
              {status}
            </div>
          )}
          {favorite && (
            <div className="px-2 py-0.5 rounded-full text-xs font-medium border bg-pink-500/20 text-pink-300 border-pink-500/30 flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 fill-pink-300" />Fav
            </div>
          )}
        </div>
        {rating && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-medium">{rating}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-white text-sm font-semibold truncate group-hover:text-purple-200 transition-colors">{game?.title}</h3>
        
        <p className="text-white/40 text-xs mt-0.5 truncate">
          {displayYear || 'Ano desconhecido'}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {genresArray.slice(0, 2).map(g => (
            <span key={g} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300/70 border border-purple-500/20">{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
}