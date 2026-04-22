import { useState } from 'react';
import { Star, X } from 'lucide-react';
import HalfStars from './HalfStars';

const CRITERIA = [
  'JOGABILIDADE (GAMEPLAY)',
  'HISTÓRIA (NARRATIVA)',
  'GRÁFICOS',
  'TRILHA SONORA (ÁUDIO)',
  'DIVERSÃO (ENTRETENIMENTO)',
  'DESAFIO (DIFICULDADE)',
  'PERFORMANCE (OTIMIZAÇÃO)',
  'CONTEÚDO (ATUALIZAÇÕES/DLCs)',
  'MULTIPLAYER (ONLINE)',
  'PROGRESSÃO DO JOGO',
];

export default function RatingModal({ game, existing, onSave, onClose }) {
  const [criteria, setCriteria] = useState(existing?.criteria || {});
  const [comment, setComment] = useState(existing?.comment || '');

  const ratedList = CRITERIA.filter(c => criteria[c] > 0);
  const avg = ratedList.length
    ? (ratedList.reduce((s, c) => s + criteria[c], 0) / ratedList.length).toFixed(1)
    : null;

  const handleSave = () => {
    const rating = avg ? parseFloat(avg) : null;
    onSave({ criteria, comment, rating });
  };

  if (!game) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] shadow-2xl shadow-purple-900/30 flex flex-col max-h-[90vh]"
        style={{ background: 'rgba(8,4,22,0.97)', backdropFilter: 'blur(20px)' }}>
        
        <div className="flex items-start justify-between p-5 pb-3 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">Avaliar</h2>
            <p className="text-purple-300 text-sm font-medium">{game.title}</p>
          </div>
          <div className="flex items-center gap-3">
            {avg && (
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-300 font-bold text-sm">{avg}</span>
                <span className="text-yellow-300/50 text-xs">/10</span>
              </div>
            )}
            <button onClick={onClose} className="text-white/30 hover:text-white/70 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-2">
          <div className="space-y-3">
            {CRITERIA.map(c => (
              <div key={c} className="flex items-center justify-between gap-3 py-1.5 border-b border-white/[0.05]">
                <span className="text-white/60 text-xs font-medium flex-1">{c}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-white/40 text-xs w-6 text-right">{criteria[c] || 0}</span>
                  <HalfStars value={criteria[c] || 0} onChange={v => setCriteria(prev => ({ ...prev, [c]: v }))} />
                </div>
              </div>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comentário (opcional)..."
            rows={3}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2.5 text-white/80 placeholder-white/20 text-sm resize-none focus:outline-none focus:border-purple-500/40 mt-4"
          />
        </div>

        <div className="p-5 pt-3 flex-shrink-0">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold transition-all"
          >
            Salvar avaliação
          </button>
        </div>
      </div>
    </div>
  );
}