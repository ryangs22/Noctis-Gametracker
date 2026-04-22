import { Gamepad2, Play, Clock, XCircle, Trophy, Heart, Trash2, Check } from 'lucide-react';

export const STATUSES = [
  { label: 'Jogado', icon: Gamepad2, color: 'text-green-400' },
  { label: 'Jogando', icon: Play, color: 'text-blue-400' },
  { label: 'Quero Jogar', icon: Clock, color: 'text-yellow-400' },
  { label: 'Abandonado', icon: XCircle, color: 'text-red-400' },
  { label: 'Platinado', icon: Trophy, color: 'text-purple-400' },
];

export default function StatusMenu({ current, isFavorite, onChange, onToggleFavorite, onRemove }) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: 'rgba(10,5,25,0.95)', backdropFilter: 'blur(20px)' }}>
      <p className="text-white/40 text-xs px-3 pt-3 pb-1 uppercase tracking-wider">Status principal</p>
      {STATUSES.map(({ label, icon: Icon, color }) => (
        <button
          key={label}
          onClick={() => onChange(current === label ? null : label)}
          className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-all hover:bg-white/[0.06] ${current === label ? 'bg-white/[0.08]' : ''}`}
        >
          <Icon className={`w-4 h-4 ${color}`} />
          <span className={current === label ? 'text-white font-medium' : 'text-white/70'}>{label}</span>
          {current === label && <Check className="ml-auto w-4 h-4 text-purple-400" />}
        </button>
      ))}

      <div className="border-t border-white/[0.06] mx-3 my-1" />
      <p className="text-white/40 text-xs px-3 pb-1 uppercase tracking-wider">Adicional</p>
      <button
        onClick={onToggleFavorite}
        className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-all hover:bg-white/[0.06] ${isFavorite ? 'bg-pink-500/10' : ''}`}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'text-pink-400 fill-pink-400' : 'text-pink-400/50'}`} />
        <span className={isFavorite ? 'text-pink-300 font-medium' : 'text-white/70'}>Favorito</span>
        {isFavorite && <Check className="ml-auto w-4 h-4 text-pink-400" />}
      </button>

      {(current || isFavorite) && (
        <>
          <div className="border-t border-white/[0.06] mx-3 my-1" />
          <button onClick={onRemove} className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Trash2 className="w-4 h-4" />Remover tudo
          </button>
        </>
      )}
    </div>
  );
}