import { useState } from 'react';
import { 
  Plus, Trash2, CheckCircle2, Circle, ChevronDown, ChevronRight, Trophy,
  Target, Compass, Swords, Gem, Palette, Users, BookOpen, Wrench 
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'progressao', label: 'Progressão', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', icon: Target, desc: 'História, chefes, missões principais' },
  { id: 'exploracao', label: 'Exploração', color: '#eab308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.25)', icon: Compass, desc: 'Mapas, segredos, áreas ocultas' },
  { id: 'desafio', label: 'Desafio', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', icon: Swords, desc: 'Dificuldade, speedrun, restrições' },
  { id: 'coleta', label: 'Coleta', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', icon: Gem, desc: 'Itens, recursos, colecionáveis' },
  { id: 'estilo', label: 'Estilo de Jogo', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)', icon: Palette, desc: 'Pacifista, estrategista, criativo' },
  { id: 'social', label: 'Social', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', icon: Users, desc: 'Multiplayer, cooperativo, comunidade' },
  { id: 'narrativa', label: 'Narrativa', color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)', icon: BookOpen, desc: 'Diálogos, escolhas morais, finais' },
  { id: 'tecnico', label: 'Técnico', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', icon: Wrench, desc: 'Bugs, glitches, mecânicas avançadas' },
];

export const GENERAL_ACHIEVEMENTS = [
  // Progressão
  { id: 'prog-1', cat: 'progressao', title: 'Primeira Vitória', desc: 'Derrotou o primeiro chefe' },
  { id: 'prog-2', cat: 'progressao', title: 'Metade do Caminho', desc: 'Completou 50% da história' },
  { id: 'prog-3', cat: 'progressao', title: 'A Grande Jornada', desc: 'Completou a história principal' },
  { id: 'prog-4', cat: 'progressao', title: 'Nem Descansou', desc: 'Jogou por mais de 5h seguidas' },
  { id: 'prog-5', cat: 'progressao', title: 'Lenda Viva', desc: 'Completou todas as missões secundárias' },
  // Exploração
  { id: 'expl-1', cat: 'exploracao', title: 'Curioso Nato', desc: 'Descobriu uma área secreta' },
  { id: 'expl-2', cat: 'exploracao', title: 'Cartógrafo', desc: 'Explorou 100% do mapa' },
  { id: 'expl-3', cat: 'exploracao', title: 'Detetive', desc: 'Encontrou todos os easter eggs' },
  { id: 'expl-4', cat: 'exploracao', title: 'Sem GPS', desc: 'Navegou sem usar o minimapa' },
  { id: 'expl-5', cat: 'exploracao', title: 'Turista Virtual', desc: 'Ficou parado admirando a paisagem' },
  // Desafio
  { id: 'desa-1', cat: 'desafio', title: 'Masoquista', desc: 'Jogou na dificuldade máxima' },
  { id: 'desa-2', cat: 'desafio', title: 'Velocista', desc: 'Completou em menos de 10 horas' },
  { id: 'desa-3', cat: 'desafio', title: 'Imortal', desc: 'Completou sem morrer nenhuma vez' },
  { id: 'desa-4', cat: 'desafio', title: 'Sem Game Over', desc: 'Passou uma fase sem continuar' },
  { id: 'desa-5', cat: 'desafio', title: 'Perfecionista', desc: 'Zerou com 100% de conclusão' },
  // Coleta
  { id: 'cole-1', cat: 'coleta', title: 'Colecionador', desc: 'Coletou 50 itens únicos' },
  { id: 'cole-2', cat: 'coleta', title: 'Saqueador', desc: 'Abriu todos os baús do jogo' },
  { id: 'cole-3', cat: 'coleta', title: 'Milionário', desc: 'Acumulou o máximo de recursos' },
  { id: 'cole-4', cat: 'coleta', title: 'Gourmet', desc: 'Experimentou todos os itens consumíveis' },
  { id: 'cole-5', cat: 'coleta', title: 'Arsenal Completo', desc: 'Desbloqueou todas as armas' },
  // Estilo
  { id: 'esti-1', cat: 'estilo', title: 'Pacifista', desc: 'Completou sem matar nenhum inimigo' },
  { id: 'esti-2', cat: 'estilo', title: 'Fantasma', desc: 'Passou despercebido por toda a fase' },
  { id: 'esti-3', cat: 'estilo', title: 'Estrategista', desc: 'Venceu sem tomar dano' },
  { id: 'esti-4', cat: 'estilo', title: 'Improviso Total', desc: 'Usou apenas itens encontrados' },
  { id: 'esti-5', cat: 'estilo', title: 'Minimalista', desc: 'Zerou usando o mínimo de recursos' },
  // Social
  { id: 'soci-1', cat: 'social', title: 'Cooperativo', desc: 'Jogou com um amigo no co-op' },
  { id: 'soci-2', cat: 'social', title: 'Competitivo', desc: 'Venceu 10 partidas online' },
  { id: 'soci-3', cat: 'social', title: 'Guia da Comunidade', desc: 'Seguiu um guia para encontrar segredo' },
  { id: 'soci-4', cat: 'social', title: 'Streamado', desc: 'Jogou ao vivo para alguém assistir' },
  // Narrativa
  { id: 'narr-1', cat: 'narrativa', title: 'Leitor Ávido', desc: 'Leu todos os diálogos opcionais' },
  { id: 'narr-2', cat: 'narrativa', title: 'Todos os Fins', desc: 'Viu todos os finais possíveis' },
  { id: 'narr-3', cat: 'narrativa', title: 'Coração de Pedra', desc: 'Tomou a decisão mais cruel' },
  { id: 'narr-4', cat: 'narrativa', title: 'Herói Moral', desc: 'Escolheu sempre a opção mais nobre' },
  // Técnico
  { id: 'tecn-1', cat: 'tecnico', title: 'Bug Hunter', desc: 'Encontrou um glitch acidentalmente' },
  { id: 'tecn-2', cat: 'tecnico', title: 'Sem Tutorial', desc: 'Pulou todas as dicas do tutorial' },
  { id: 'tecn-3', cat: 'tecnico', title: 'Combo Master', desc: 'Executou uma mecânica avançada' },
  { id: 'tecn-4', cat: 'tecnico', title: 'Arquiteto', desc: 'Criou algo impressionante no modo criativo' },
];

function CategoryBadge({ cat }) {
  const c = CATEGORIES.find(x => x.id === cat);
  if (!c) return null;
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border"
      style={{ background: c.bg, borderColor: c.border, color: c.color }}>
      <Icon className="w-3 h-3" /> {c.label}
    </span>
  );
}

function AchievementRow({ ach, done, onToggle, isCustom, onRemove }) {
  const cat = CATEGORIES.find(c => c.id === ach.cat);
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${done ? 'border-white/10' : 'border-white/[0.04]'}`}
      style={{ background: done && cat ? cat.bg : 'rgba(255,255,255,0.02)' }}>
      <button onClick={onToggle} className="flex-shrink-0">
        {done
          ? <CheckCircle2 className="w-5 h-5" style={{ color: cat?.color || '#fff' }} />
          : <Circle className="w-5 h-5 text-white/20" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${done ? 'text-white' : 'text-white/55'}`}>{ach.title}</p>
        {ach.desc && <p className="text-white/30 text-xs truncate">{ach.desc}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {cat && <CategoryBadge cat={ach.cat} />}
        {isCustom && (
          <button onClick={onRemove} className="text-white/15 hover:text-red-400 transition-colors ml-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPanel({ game, libEntry, customAchs, onToggle, onAddCustom, onRemoveCustom }) {
  const [openCats, setOpenCats] = useState({ progressao: true });
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('progressao');
  const [tab, setTab] = useState('geral'); 

  const achievements = libEntry?.achievements || {};
  const custom = customAchs || [];

  const allAchs = [...GENERAL_ACHIEVEMENTS, ...custom.map(c => ({ ...c, _isCustom: true }))];
  const doneCount = allAchs.filter(a => achievements[a.id]).length;
  const pct = allAchs.length ? Math.round((doneCount / allAchs.length) * 100) : 0;

  const toggleCat = (id) => setOpenCats(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddCustom(game?.id, { id: `custom-${Date.now()}`, title: newTitle, desc: newDesc, cat: newCat });
    setNewTitle(''); setNewDesc(''); setAdding(false);
  };

  const generalByCat = CATEGORIES.map(cat => ({
    ...cat,
    achs: GENERAL_ACHIEVEMENTS.filter(a => a.cat === cat.id),
  })).filter(c => c.achs.length > 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-semibold">Conquistas</span>
          <span className="text-white/35 text-xs">{doneCount}/{allAchs.length}</span>
        </div>
        <span className="text-white/40 text-xs font-medium">{pct}% completo</span>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #22c55e, #a855f7, #ef4444)' }} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
        {[['geral', 'Gerais'], ['custom', 'Personalizadas']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-white/[0.1] text-white' : 'text-white/35 hover:text-white/60'}`}>
            {label}
            <span className="ml-1.5 text-xs opacity-60">
              {id === 'geral' ? GENERAL_ACHIEVEMENTS.filter(a => achievements[a.id]).length : custom.filter(a => achievements[a.id]).length}
              /{id === 'geral' ? GENERAL_ACHIEVEMENTS.length : custom.length}
            </span>
          </button>
        ))}
      </div>

      {/* General tab — grouped by category */}
      {tab === 'geral' && (
        <div className="space-y-2">
          {generalByCat.map(cat => {
            const catDone = cat.achs.filter(a => achievements[a.id]).length;
            const isOpen = openCats[cat.id];
            const CatIcon = cat.icon;
            return (
              <div key={cat.id} className="rounded-xl border overflow-hidden"
                style={{ borderColor: isOpen ? cat.border : 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
                <button onClick={() => toggleCat(cat.id)}
                  className="w-full flex items-center gap-3 px-3 py-3 transition-all hover:bg-white/[0.04]">
                  <span className="flex items-center justify-center p-1.5 rounded-lg" style={{ background: cat.bg }}>
                    <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
                  </span>
                  <span className="text-white font-semibold text-sm flex-1 text-left">{cat.label}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
                    {catDone}/{cat.achs.length}
                  </span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronRight className="w-4 h-4 text-white/20" />}
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 space-y-1.5 border-t border-white/[0.05]" style={{ paddingTop: '10px' }}>
                    <p className="text-white/25 text-xs mb-2">{cat.desc}</p>
                    {cat.achs.map(a => (
                      <AchievementRow key={a.id} ach={a} done={!!achievements[a.id]}
                        onToggle={() => onToggle(game?.id, a.id)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Custom tab */}
      {tab === 'custom' && (
        <div className="space-y-3">
          <button onClick={() => setAdding(!adding)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-300 text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nova conquista personalizada
          </button>

          {adding && (
            <div className="p-4 rounded-xl border border-purple-500/25 bg-purple-500/8 space-y-3">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Nome da conquista *"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/40" />
              <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descrição (opcional)"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/40" />
              <div>
                <p className="text-white/35 text-xs mb-2">Tipo de conquista</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(c => {
                    const CatIcon = c.icon;
                    return (
                      <button key={c.id} onClick={() => setNewCat(c.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                        style={{
                          background: newCat === c.id ? c.bg : 'rgba(255,255,255,0.04)',
                          borderColor: newCat === c.id ? c.border : 'rgba(255,255,255,0.08)',
                          color: newCat === c.id ? c.color : 'rgba(255,255,255,0.4)',
                        }}>
                        <CatIcon className="w-3 h-3" /> {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd} disabled={!newTitle.trim()}
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm font-medium transition-all">
                  Adicionar
                </button>
                <button onClick={() => { setAdding(false); setNewTitle(''); setNewDesc(''); }}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-white/50 text-sm transition-all">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {custom.length === 0 && !adding && (
            <div className="text-center py-8 text-white/25 text-sm">
              Nenhuma conquista personalizada ainda.<br />
              <span className="text-xs">Crie conquistas únicas para este jogo!</span>
            </div>
          )}

          <div className="space-y-1.5">
            {custom.map(a => (
              <AchievementRow key={a.id} ach={a} done={!!achievements[a.id]}
                onToggle={() => onToggle(game?.id, a.id)}
                isCustom
                onRemove={() => onRemoveCustom(game?.id, a.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}