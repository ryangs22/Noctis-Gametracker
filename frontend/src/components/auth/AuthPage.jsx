import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import StarfieldBackground from '../StarfieldBackground';

const INPUT = "w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 pl-11 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-purple-500/20 transition-all duration-300";
const BTN = "w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/25";

function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePassword(p) { return p.length >= 6; }

const variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
};

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, showToggle, toggled, onToggle, error }) {
  return (
    <div>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-purple-400 transition-colors" />
        <input
          type={showToggle ? (toggled ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${INPUT} ${error ? 'border-red-500/50 focus:border-red-500/60' : ''}`}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
            {toggled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}

function Alert({ type, msg }) {
  if (!msg) return null;
  const isErr = type === 'error';
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${isErr ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-green-500/10 border-green-500/20 text-green-300'}`}>
      {isErr ? <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
      {msg}
    </div>
  );
}

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [lEmail, setLEmail] = useState('');
  const [lPw, setLPw] = useState('');
  const [lErrors, setLErrors] = useState({});

  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPw, setSPw] = useState('');
  const [sErrors, setSErrors] = useState({});

  const [fEmail, setFEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [fCode, setFCode] = useState('');
  const [fNewPw, setFNewPw] = useState('');

  const go = (m) => { setMode(m); setAlert(null); setLErrors({}); setSErrors({}); setCodeSent(false); };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!validateEmail(lEmail)) errors.email = 'Email inválido';
    if (!validatePassword(lPw)) errors.password = 'Senha deve ter ao menos 6 caracteres';
    if (Object.keys(errors).length) { setLErrors(errors); return; }
    
    setLErrors({});
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', lEmail);
    formData.append('password', lPw);

    try {
      const res = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setAlert(null);
        onLogin(lEmail, data.access_token);
      } else {
        const err = await res.json();
        setAlert({ type: 'error', msg: err.detail || 'Email ou senha incorretos.' });
      }
    } catch (error) {
      setAlert({ type: 'error', msg: 'Servidor offline. Verifique o Uvicorn.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!sName.trim()) errors.name = 'Nome obrigatório';
    if (!validateEmail(sEmail)) errors.email = 'Email inválido';
    if (!validatePassword(sPw)) errors.password = 'Senha deve ter ao menos 6 caracteres';
    if (Object.keys(errors).length) { setSErrors(errors); return; }
    
    setSErrors({});
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: sName, email: sEmail, password: sPw })
      });

      if (res.ok) {
        setAlert({ type: 'success', msg: 'Conta criada! Redirecionando para o login...' });
        setTimeout(() => go('login'), 1500);
      } else {
        const err = await res.json();
        setAlert({ type: 'error', msg: err.detail || 'Este email já está cadastrado.' });
      }
    } catch (error) {
      setAlert({ type: 'error', msg: 'Servidor offline. Verifique o Uvicorn.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!validateEmail(fEmail)) { setAlert({ type: 'error', msg: 'Email inválido' }); return; }
    
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/password-recovery/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fEmail })
      });

      if (res.ok) {
        setCodeSent(true);
        setAlert({ type: 'success', msg: 'Código enviado para o seu email!' });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', msg: err.detail || 'Erro ao solicitar código.' });
      }
    } catch (error) {
      setAlert({ type: 'error', msg: 'Servidor offline. Verifique o Uvicorn.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPw = async (e) => {
    e.preventDefault();
    if (!fCode) { setAlert({ type: 'error', msg: 'Insira o código de verificação.' }); return; }
    if (!validatePassword(fNewPw)) { setAlert({ type: 'error', msg: 'Nova senha deve ter ao menos 6 caracteres.' }); return; }
    
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/password-recovery/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fEmail, code: fCode, new_password: fNewPw })
      });

      if (res.ok) {
        setAlert({ type: 'success', msg: 'Senha redefinida! Redirecionando...' });
        setTimeout(() => go('login'), 1500);
      } else {
        const err = await res.json();
        setAlert({ type: 'error', msg: err.detail || 'Código inválido ou expirado.' });
      }
    } catch (error) {
      setAlert({ type: 'error', msg: 'Servidor offline. Verifique o Uvicorn.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-main">
      <StarfieldBackground />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '-5%', left: '-10%', width: '70vw', height: '70vw', background: 'radial-gradient(ellipse at 40% 40%, rgba(140,60,255,0.55) 0%, rgba(100,50,220,0.35) 25%, transparent 72%)', filter: 'blur(60px)', borderRadius: '60% 40% 55% 45%', transform: 'rotate(-20deg)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '65vw', height: '60vw', background: 'radial-gradient(ellipse at 55% 55%, rgba(100,50,230,0.5) 0%, rgba(70,110,230,0.3) 30%, transparent 72%)', filter: 'blur(55px)', borderRadius: '45% 60% 40% 55%', transform: 'rotate(15deg)' }} />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" style={{ zIndex: 2 }} />

      <div className="relative w-full max-w-md mx-auto px-4 py-12" style={{ zIndex: 3 }}>
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl font-black tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 select-none"
            style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 60px rgba(180,120,255,0.4)' }}>NOCTIS</h1>
          <p className="mt-2 text-white/25 text-xs tracking-[0.3em] uppercase">Game Tracker</p>
        </motion.div>

        <motion.div className="relative backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-purple-900/10"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="absolute -inset-1 bg-gradient-to-b from-purple-600/10 via-transparent to-blue-600/5 rounded-2xl blur-xl -z-10" />

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.form key="login" variants={variants} initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.3 }} onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-1">
                  <h2 className="text-xl font-bold text-white">Bem-vindo de volta</h2>
                  <p className="text-white/35 text-sm mt-1">Entre na sua conta NOCTIS</p>
                </div>
                <Alert type={alert?.type} msg={alert?.msg} />
                <Field icon={Mail} type="email" placeholder="Email" value={lEmail} onChange={e => setLEmail(e.target.value)} error={lErrors.email} />
                <Field icon={Lock} placeholder="Senha" value={lPw} onChange={e => setLPw(e.target.value)} showToggle toggled={showPw} onToggle={() => setShowPw(!showPw)} error={lErrors.password} />
                <button type="button" onClick={() => go('forgot')} className="text-xs text-purple-400/70 hover:text-purple-300 transition-colors ml-1">Esqueceu sua senha?</button>
                <button type="submit" disabled={loading} className={BTN}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Entrar'}
                </button>
                <p className="text-center text-white/30 text-sm">Não tem conta?{' '}
                  <button type="button" onClick={() => go('signup')} className="text-purple-400 hover:text-purple-300 font-medium">Criar conta</button>
                </p>
              </motion.form>
            )}

            {mode === 'signup' && (
              <motion.form key="signup" variants={variants} initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.3 }} onSubmit={handleSignup} className="space-y-4">
                <div className="text-center mb-1">
                  <h2 className="text-xl font-bold text-white">Criar conta</h2>
                  <p className="text-white/35 text-sm mt-1">Junte-se ao universo NOCTIS</p>
                </div>
                <Alert type={alert?.type} msg={alert?.msg} />
                <Field icon={User} placeholder="Nome de usuário" value={sName} onChange={e => setSName(e.target.value)} error={sErrors.name} />
                <Field icon={Mail} type="email" placeholder="Email" value={sEmail} onChange={e => setSEmail(e.target.value)} error={sErrors.email} />
                <Field icon={Lock} placeholder="Senha (mín. 6 caracteres)" value={sPw} onChange={e => setSPw(e.target.value)} showToggle toggled={showPw} onToggle={() => setShowPw(!showPw)} error={sErrors.password} />
                <button type="submit" disabled={loading} className={BTN}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <span className="flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" />Criar conta</span>}
                </button>
                <p className="text-center text-white/30 text-sm">Já tem conta?{' '}
                  <button type="button" onClick={() => go('login')} className="text-purple-400 hover:text-purple-300 font-medium">Entrar</button>
                </p>
              </motion.form>
            )}

            {mode === 'forgot' && (
              <motion.div key="forgot" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                <button onClick={() => go('login')} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-1">
                  <ArrowLeft className="w-4 h-4" />Voltar
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">Recuperar senha</h2>
                  <p className="text-white/35 text-sm mt-1">{codeSent ? 'Insira o código e nova senha' : 'Informe seu email'}</p>
                </div>
                <Alert type={alert?.type} msg={alert?.msg} />
                {!codeSent ? (
                  <form onSubmit={handleSendCode} className="space-y-4">
                    <Field icon={Mail} type="email" placeholder="Seu email" value={fEmail} onChange={e => setFEmail(e.target.value)} />
                    <button type="submit" disabled={loading} className={BTN}>{loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Enviar código'}</button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPw} className="space-y-4">
                    <Field icon={Sparkles} placeholder="Código de verificação" value={fCode} onChange={e => setFCode(e.target.value)} />
                    <Field icon={Lock} placeholder="Nova senha" value={fNewPw} onChange={e => setFNewPw(e.target.value)} showToggle toggled={showPw} onToggle={() => setShowPw(!showPw)} />
                    <button type="submit" disabled={loading} className={BTN}>{loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Redefinir senha'}</button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}