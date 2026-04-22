import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Loader2, Sparkles } from 'lucide-react';

const INPUT_CLASSES = "w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 pl-11 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-purple-500/20 transition-all duration-300";
const BUTTON_CLASSES = "w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 disabled:opacity-50";

function InputField({ icon: Icon, type = "text", placeholder, value, onChange, showToggle, onToggle, toggleState }) {
  return (
    <div className="relative group">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-purple-400 transition-colors duration-300" />
      <input
        type={showToggle ? (toggleState ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={INPUT_CLASSES}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
        >
          {toggleState ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
};

export default function AuthCard() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // login | signup | forgot | reset
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', loginEmail); 
    formData.append('password', loginPassword);

    try {
      const resposta = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (resposta.ok) {
        const data = await resposta.json();
        login({ name: loginEmail }, data.access_token);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        const erro = await resposta.json();
        alert("Erro ao entrar: " + (erro.detail || "Verifique suas credenciais"));
      }
    } catch (error) {
      alert("Servidor offline. Verifique se o Uvicorn está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resposta = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: signupName, email: signupEmail, password: signupPassword })
      });

      if (resposta.ok) {
        const data = await resposta.json();
        alert(`Conta criada com sucesso! Bem-vindo, ${data.username}!`);
        setSignupName(''); setSignupEmail(''); setSignupPassword('');
        setMode('login');
      } else {
        const erro = await resposta.json();
        alert("Erro ao criar conta: " + (erro.detail || "Email já em uso"));
      }
    } catch (error) {
      alert("Servidor offline. Verifique se o Uvicorn está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/password-recovery/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      if (res.ok) {
        setCodeSent(true);
        alert("Código de recuperação enviado para o seu email!");
      } else {
        const err = await res.json();
        alert("Erro: " + (err.detail || "Falha ao solicitar código"));
      }
    } catch (error) {
      alert("Servidor offline. Verifique se o Uvicorn está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPw = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/password-recovery/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code: resetCode, new_password: newPassword })
      });

      if (res.ok) {
        alert("Senha redefinida com sucesso! Faça login.");
        setMode('login');
        setForgotEmail(''); setResetCode(''); setNewPassword(''); setCodeSent(false);
      } else {
        const err = await res.json();
        alert("Erro: " + (err.detail || "Código inválido ou expirado"));
      }
    } catch (error) {
      alert("Servidor offline. Verifique se o Uvicorn está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <motion.div
        className="relative backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-purple-900/10"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute -inset-1 bg-gradient-to-b from-purple-600/10 via-transparent to-blue-600/5 rounded-2xl blur-xl -z-10" />

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.form key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} onSubmit={handleLogin} className="space-y-5"
            >
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Bem-vindo ao Universo NOCTIS</h2>
                <p className="text-white/35 text-sm mt-1">Entre na sua conta</p>
              </div>

              <InputField icon={Mail} type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <InputField icon={Lock} type="password" placeholder="Senha" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} showToggle onToggle={() => setShowPassword(!showPassword)} toggleState={showPassword} />

              <button type="button" onClick={() => { setMode('forgot'); setCodeSent(false); setForgotEmail(''); setResetCode(''); setNewPassword(''); }} className="text-xs text-purple-400/70 hover:text-purple-300 transition-colors duration-300 block ml-1">
                Esqueceu sua senha?
              </button>

              <button type="submit" disabled={loading} className={`${BUTTON_CLASSES} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/25 hover:shadow-purple-900/40`}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Entrar"}
              </button>

              <p className="text-center text-white/30 text-sm">Não tem uma conta?{' '}
                <button type="button" onClick={() => setMode('signup')} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Criar conta</button>
              </p>
            </motion.form>
          )}

          {mode === 'signup' && (
            <motion.form key="signup" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} onSubmit={handleSignup} className="space-y-5"
            >
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Criar conta</h2>
                <p className="text-white/35 text-sm mt-1">Junte-se ao universo NOCTIS</p>
              </div>

              <InputField icon={User} placeholder="Nome de usuário" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
              <InputField icon={Mail} type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              <InputField icon={Lock} type="password" placeholder="Senha" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} showToggle onToggle={() => setShowPassword(!showPassword)} toggleState={showPassword} />

              <button type="submit" disabled={loading} className={`${BUTTON_CLASSES} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/25 hover:shadow-purple-900/40`}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (
                  <span className="flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" />Criar conta</span>
                )}
              </button>

              <p className="text-center text-white/30 text-sm">Já tem uma conta?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Entrar</button>
              </p>
            </motion.form>
          )}

          {mode === 'forgot' && (
            <motion.div key="forgot" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
              <button type="button" onClick={() => setMode('login')} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors mb-2">
                <ArrowLeft className="w-4 h-4" />Voltar
              </button>

              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Recuperar senha</h2>
                <p className="text-white/35 text-sm mt-1">{codeSent ? "Insira o código e a nova senha" : "Informe seu email para receber o código"}</p>
              </div>

              {!codeSent ? (
                <form onSubmit={handleSendCode} className="space-y-5">
                  <InputField icon={Mail} type="email" placeholder="Seu email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                  <button type="submit" disabled={loading} className={`${BUTTON_CLASSES} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/25`}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Enviar código"}
                  </button>
                </form>
              ) : (
                <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} onSubmit={handleResetPw} className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Mail className="w-4 h-4 text-green-400" />
                    <span className="text-green-300/80 text-xs">Código enviado para {forgotEmail}</span>
                  </div>

                  <div className="relative group">
                    <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-purple-400 transition-colors duration-300" />
                    <input type="text" placeholder="Código de verificação" value={resetCode} onChange={(e) => setResetCode(e.target.value)} className={INPUT_CLASSES} maxLength={6} />
                  </div>

                  <InputField icon={Lock} type="password" placeholder="Nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} showToggle onToggle={() => setShowPassword(!showPassword)} toggleState={showPassword} />

                  <button type="submit" disabled={loading} className={`${BUTTON_CLASSES} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/25`}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Redefinir senha"}
                  </button>
                </motion.form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}