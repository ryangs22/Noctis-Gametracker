import { useState, useRef, useEffect } from 'react';
import { 
  Star, Clock, Trophy, GamepadIcon, Edit2, Check, X, Camera, 
  TrendingUp, TrendingDown, Award, Heart, Eye, EyeOff, Zap,
  Settings, Shield, Gem, Hexagon, Compass, Leaf, Flame, Sparkles,
  BookOpen, Gamepad2, Crown, Swords, Wand2, Infinity as InfinityIcon
} from 'lucide-react';

const LIB_RANKS = [
  { name: 'Ferro', min: 0, max: 0, color: '#94a3b8', icon: Settings },
  { name: 'Bronze', min: 1, max: 2, color: '#cd7f32', icon: Shield },
  { name: 'Prata', min: 3, max: 5, color: '#cbd5e1', icon: Award },
  { name: 'Ouro', min: 6, max: 9, color: '#fbbf24', icon: Trophy },
  { name: 'Platina', min: 10, max: 14, color: '#6fe0f1', icon: Gem },
  { name: 'Diamante', min: 15, max: 19, color: '#60a5fa', icon: Hexagon },
  { name: 'Safira', min: 20, max: 29, color: '#3b82f6', icon: Compass },
  { name: 'Esmeralda', min: 30, max: 44, color: '#10b981', icon: Leaf },
  { name: 'Rubi', min: 45, max: 59, color: '#ef4444', icon: Flame },
  { name: 'Quartzo', min: 60, max: Infinity, color: '#d946ef', icon: Sparkles },
];

const RATING_TITLES = [
  { name: 'Aprendiz', min: 0, max: 0, color: '#94a3b8', icon: BookOpen },
  { name: 'Gamer', min: 1, max: 2, color: '#3b82f6', icon: Gamepad2 },
  { name: 'Super-Humano', min: 3, max: 5, color: '#10b981', icon: Zap },
  { name: 'Mestre', min: 6, max: 9, color: '#f59e0b', icon: Trophy },
  { name: 'Grão-Mestre', min: 10, max: 14, color: '#ea580c', icon: Crown },
  { name: 'Imperador', min: 15, max: 19, color: '#c026d3', icon: Swords },
  { name: 'Semideus', min: 20, max: 29, color: '#06b6d4', icon: Star },
  { name: 'Feiticeiro', min: 30, max: 44, color: '#8b5cf6', icon: Wand2 },
  { name: 'Celestial', min: 45, max: 59, color: '#f472b6', icon: Sparkles },
  { name: 'Deus de Noctis', min: 60, max: Infinity, color: '#ffffff', icon: InfinityIcon },
];

function getRank(list, count) {
  return list.find(r => count >= r.min && count <= r.max) || list[0];
}
function getNextRank(list, count) {
  const idx = list.findIndex(r => count >= r.min && count <= r.max);
  return idx < list.length - 1 ? list[idx + 1] : null;
}

function RankBar({ rank, nextRank, count, label }) {
  const pct = nextRank
    ? Math.min(100, Math.round(((count - rank.min) / (nextRank.min - rank.min)) * 100))
    : 100;
  
  const RankIcon = rank.icon;

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-widest font-bold">
        <span style={{ color: rank.color }} className="flex items-center gap-1.5">
          <RankIcon className="w-4 h-4" /> {rank.name}
        </span>
        {nextRank ? (
          <span className="text-white/20 group-hover:text-white/40 transition-colors">
            Faltam {nextRank.min - count} {label} para {nextRank.name}
          </span>
        ) : (
          <span className="text-amber-400 animate-pulse">Nível Máximo Alcançado</span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ 
            width: `${pct}%`, 
            background: `linear-gradient(90deg, ${rank.color}dd, ${nextRank?.color || rank.color}ff)`,
            boxShadow: `0 0 8px ${rank.color}40`
          }} 
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] flex flex-col items-center justify-center transition-all hover:bg-white/[0.04] hover:border-white/10 group">
      <Icon className={`w-5 h-5 ${color} mb-2 opacity-60 group-hover:opacity-100 transition-opacity`} />
      <p className="text-white font-black text-xl tracking-tight">{value}</p>
      <p className="text-white/30 text-[10px] uppercase tracking-tighter font-bold">{label}</p>
    </div>
  );
}

export default function ProfilePage({ appState }) {
  const { state, updateProfile } = appState;
  const { library } = state;
  const user = state.user || { name: 'Explorador', email: 'demo@noctis.app', avatar: 'E' };

  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPw, setEditPw] = useState('');
  const [editNewPw, setEditNewPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [photo, setPhoto] = useState(null);
  
  const fileRef = useRef();

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      if (user.avatar && user.avatar.length > 5) {
        setPhoto(user.avatar);
      } else {
        setPhoto(null);
      }
    }
  }, [user.name, user.email, user.avatar]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (ev) => { 
      const novaFotoBase64 = ev.target.result;
      setPhoto(novaFotoBase64); 
      setIsSaving(true);
      const success = await updateProfile({ avatar: novaFotoBase64 });
      setIsSaving(false);
      if (!success) {
        alert("Erro ao salvar a foto no servidor.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (editPw || editNewPw) {
      if (editPw !== editNewPw) {
        alert("As senhas não coincidem!");
        return;
      }
    }

    const payload = {};
    if (editName !== user.name) payload.username = editName;
    if (editEmail !== user.email) payload.email = editEmail;
    if (photo && photo !== user.avatar) payload.avatar = photo;
    if (editPw) payload.password = editPw;

    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }

    setIsSaving(true);
    const success = await updateProfile(payload);
    setIsSaving(false);

    if (success) {
      setEditing(false);
      setEditPw('');
      setEditNewPw('');
    }
  };

  const inLib = Object.values(library).filter(g => g && g.status);

  const byStatus = (s) => inLib.filter(g => g.status === s);
  const favorites = inLib.filter(g => g.favorite);
  const totalHours = inLib.reduce((s, g) => s + (parseFloat(g.hoursPlayed) || 0), 0);
  const totalAchs = inLib.reduce((s, g) => {
    const a = g.achievements || {};
    return s + Object.values(a).filter(Boolean).length;
  }, 0);

  const ratedGames = inLib.filter(g => g.rating !== undefined && g.rating !== null && Number(g.rating) > 0);
  const ratedCount = ratedGames.length;
  const libCount = inLib.length;

  const libRank = getRank(LIB_RANKS, libCount);
  const ratingTitle = getRank(RATING_TITLES, ratedCount);
  const libNextRank = getNextRank(LIB_RANKS, libCount);
  const ratingNextTitle = getNextRank(RATING_TITLES, ratedCount);

  const genreCount = {};
  inLib.forEach(g => {
    const gameData = g.game || g.gameInfo || g; 
    
    const genresArray = gameData.genres || [];
    
    if (Array.isArray(genresArray)) {
      genresArray.forEach(genre => { 
        if (genre && typeof genre === 'string' && genre !== "N/A") {
          genreCount[genre] = (genreCount[genre] || 0) + 1; 
        }
      });
    }
  });

  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  const favGenre = sortedGenres.length > 0 ? sortedGenres[0][0] : 'Explorando...';
  const worstGenre = sortedGenres.length > 1 ? sortedGenres[sortedGenres.length - 1][0] : '—';

  const sortedByRating = [...ratedGames].sort((a, b) => Number(b.rating) - Number(a.rating));
  const bestGame = sortedByRating.length > 0 ? sortedByRating[0] : null;
  const worstGame = sortedByRating.length > 1 ? sortedByRating[sortedByRating.length - 1] : null;

  const bestGameData = bestGame ? (bestGame.game || bestGame.gameInfo || bestGame) : null;
  const worstGameData = worstGame ? (worstGame.game || worstGame.gameInfo || worstGame) : null;

  const placeholderImage = 'https://via.placeholder.com/300x400?text=Sem+Capa';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20 font-main">
      <header className="flex items-center justify-between">
        <h1 className="text-white text-3xl font-black tracking-tight">Centro de Comando</h1>
      </header>

      <div className="relative p-8 rounded-3xl border border-white/10 overflow-hidden" style={{ background: 'rgba(15, 10, 30, 0.4)', backdropFilter: 'blur(20px)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 pointer-events-none" style={{ background: libRank.color }} />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <div 
              className="w-32 h-32 rounded-3xl overflow-hidden border-2 p-1 transition-transform duration-500 group-hover:scale-105" 
              style={{ borderColor: `${libRank.color}40`, background: `linear-gradient(135deg, ${libRank.color}20, transparent)` }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden bg-black/40">
                {photo && photo.length > 5 ? (
                  <img src={photo} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-5xl font-black">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                )}
              </div>
            </div>
            <button 
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-purple-600 hover:bg-purple-500 border-4 border-[#0a0514] flex items-center justify-center transition-all shadow-xl text-white"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            {editing ? (
              <div className="w-full max-w-sm space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1 block">Nome</label>
                    <input 
                      value={editName} onChange={e => setEditName(e.target.value)} 
                      className="w-full bg-white/5 border border-purple-500/30 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-500" 
                      placeholder="Nome de explorador"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1 block">E-mail</label>
                    <input 
                      value={editEmail} onChange={e => setEditEmail(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-500" 
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-white/60 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                      Segurança
                  </h4>
                  <div>
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1 block">Nova Senha (opcional)</label>
                    <div className="relative">
                      <input 
                        type={showPw ? "text" : "password"}
                        value={editPw}
                        onChange={e => setEditPw(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-500" 
                        placeholder="Insira a nova senha"
                      />
                      <button 
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {editPw && (
                    <div>
                      <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1 block">Confirmar Nova Senha</label>
                      <input 
                        type="password"
                        value={editNewPw}
                        onChange={e => setEditNewPw(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-500" 
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Salvando..." : "Salvar Dados"}
                  </button>
                  <button 
                    onClick={() => { setEditing(false); setEditPw(''); setEditNewPw(''); }} 
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 text-xs font-bold transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="group">
                <div className="flex items-center gap-3">
                  <h2 className="text-white font-black text-4xl tracking-tighter">{user.name}</h2>
                  <button onClick={() => setEditing(true)} className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white/60 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-purple-400/60 text-sm font-medium tracking-wide mt-1">{user.email}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                style={{ borderColor: `${libRank.color}30`, background: `${libRank.color}10`, color: libRank.color }}>
                <Zap className="w-3 h-3" /> Nível {libRank.name}
              </div>
              <div className="px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                style={{ borderColor: `${ratingTitle.color}30`, background: `${ratingTitle.color}10`, color: ratingTitle.color }}>
                <Award className="w-3 h-3" /> {ratingTitle.name}
              </div>
            </div>

            <div className="mt-8 w-full space-y-6">
              <RankBar rank={libRank} nextRank={libNextRank} count={libCount} label="jogos" />
              <RankBar rank={ratingTitle} nextRank={ratingNextTitle} count={ratedCount} label="críticas" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={GamepadIcon} label="Na Biblioteca" value={libCount} color="text-blue-400" />
        <StatCard icon={Check} label="Concluídos" value={byStatus('Jogado').length} color="text-green-400" />
        <StatCard icon={Award} label="Platinados" value={byStatus('Platinado').length} color="text-purple-400" />
        <StatCard icon={Trophy} label="Conquistas" value={totalAchs} color="text-yellow-400" />
        <StatCard icon={Clock} label="Tempo de Voo" value={`${Math.round(totalHours)}h`} color="text-cyan-400" />
        <StatCard icon={Heart} label="Favoritos" value={favorites.length} color="text-pink-400" />
        <StatCard icon={Star} label="Avaliações" value={ratedCount} color="text-amber-400" />
        <StatCard icon={X} label="Perdidos" value={byStatus('Abandonado').length} color="text-red-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold px-2">Registros de Elite</h3>
          {bestGame && (
            <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex gap-4 items-center group transition-all hover:bg-amber-500/10">
              <img 
                src={bestGameData.cover || placeholderImage} 
                alt={bestGameData.title} 
                className="w-16 h-20 object-cover rounded-xl shadow-2xl transition-transform group-hover:scale-105" 
              />
              <div>
                <p className="text-amber-400/60 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-amber-400" /> Preferência Máxima
                </p>
                <h4 className="text-white font-bold text-lg leading-tight">{bestGameData.title || "Título Desconhecido"}</h4>
                <p className="text-amber-200 text-sm font-black mt-1">{bestGame.rating}<span className="text-amber-200/40">/10</span></p>
              </div>
            </div>
          )}
         {worstGame && (
            <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex gap-4 items-center group transition-all hover:bg-red-500/10">
              <img 
                src={worstGameData.cover || placeholderImage} 
                alt={worstGameData.title} 
                className="w-16 h-20 object-cover rounded-xl shadow-2xl opacity-60 grayscale group-hover:grayscale-0 transition-all" 
              />
              <div>
                <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <TrendingDown className="w-3 h-3" /> Baixa Sincronia
                </p>
                <h4 className="text-white/60 font-bold text-lg leading-tight group-hover:text-white transition-colors">{worstGameData.title || "Título Desconhecido"}</h4>
                <p className="text-red-400/80 text-sm font-black mt-1">{worstGame.rating}<span className="text-red-400/30">/10</span></p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold px-2">Análise de Dados</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 rounded-3xl border border-white/[0.05] bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400"><TrendingUp className="w-6 h-6" /></div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">Gênero Predominante</p>
                  <p className="text-white text-2xl font-black">{favGenre}</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-3xl border border-white/[0.05] bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><TrendingDown className="w-6 h-6" /></div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">Menos Explorado</p>
                  <p className="text-white text-2xl font-black opacity-60">{worstGenre}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {inLib.length === 0 && (
        <div className="py-20 text-center rounded-3xl border border-dashed border-white/10">
          <GamepadIcon className="w-16 h-16 text-white/5 mx-auto mb-4" />
          <p className="text-white/40 font-medium">Nenhum dado de missão encontrado.</p>
          <p className="text-white/15 text-xs mt-1">Adicione jogos à sua biblioteca para gerar estatísticas.</p>
        </div>
      )}
    </div>
  );
}