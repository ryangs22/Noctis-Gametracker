import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from "@/components/ui/toaster";

import Landing from './pages/Landing';
import PageNotFound from './lib/PageNotFound';

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">🌌 Universo NOCTIS</h1>
      <p className="text-white/60">Bem-vindo ao seu painel interno! Você está logado.</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;