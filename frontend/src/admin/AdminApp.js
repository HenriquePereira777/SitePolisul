import React, { useState } from 'react';
import api, { tokenService } from '../utils/security';
import ProdutosAdmin from './ProdutosAdmin';
import PublicacoesAdmin from './PublicacoesAdmin';
import BannersAdmin from './BannersAdmin';
import MensagensAdmin from './MensagensAdmin';
import UsuariosAdmin from './UsuariosAdmin';
import { Campo, inputCls, btnPrimario, btnSecundario } from './ui';

const ABAS = [
  { id: 'produtos', rotulo: 'Produtos' },
  { id: 'publicacoes', rotulo: 'Publicações' },
  { id: 'fotos', rotulo: 'Fotos do carrossel' },
  { id: 'mensagens', rotulo: 'Mensagens' },
  { id: 'usuarios', rotulo: 'Usuários', soAdmin: true },
];

function lerSessao() {
  try {
    if (!tokenService.isValid()) return null;
    return JSON.parse(sessionStorage.getItem('polisul_admin_user') || 'null');
  } catch { return null; }
}

function Login({ onEntrar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const entrar = async e => {
    e.preventDefault();
    setErro(''); setCarregando(true);
    try {
      const r = await api.post('/api/auth/login', { email: email.trim(), senha });
      tokenService.set(r.data.token);
      const u = { email: r.data.email, role: r.data.role };
      try { sessionStorage.setItem('polisul_admin_user', JSON.stringify(u)); } catch { /* ignora */ }
      onEntrar(u);
    } catch (err) {
      const st = err?.response?.status;
      setErro(
        st === 401 ? 'E-mail ou senha incorretos.' :
        st === 429 ? 'Muitas tentativas. Aguarde um minuto.' :
        st === 400 ? 'Dados inválidos (a senha precisa ter pelo menos 8 caracteres).' :
        !err?.response ? 'Não consegui falar com o servidor. Verifique se o backend está no ar (porta 8080).' :
        `Erro no servidor (${st}). Veja o log do backend.`
      );
    } finally { setCarregando(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-green-50">
      <form onSubmit={entrar} className="w-full max-w-sm p-8 space-y-4 bg-white shadow-lg rounded-2xl">
        <div className="text-center">
          <h1 className="text-2xl text-green-900 font-display">Polisul</h1>
          <p className="text-sm text-gray-500">Painel administrador</p>
        </div>
        <Campo label="E-mail"><input type="email" autoComplete="username" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} required /></Campo>
        <Campo label="Senha"><input type="password" autoComplete="current-password" className={inputCls} value={senha} onChange={e => setSenha(e.target.value)} required /></Campo>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button className={`${btnPrimario} w-full`} disabled={carregando}>{carregando ? 'Entrando…' : 'Entrar'}</button>
        <a href="/" className="block text-sm text-center text-gray-500 underline">← Voltar ao site</a>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(lerSessao);
  const [aba, setAba] = useState('produtos');

  // Token expirado/inválido durante o uso: volta para o login.
  React.useEffect(() => {
    const id = api.interceptors.response.use(r => r, e => {
      if (e?.response?.status === 401) setUser(null);
      return Promise.reject(e);
    });
    return () => api.interceptors.response.eject(id);
  }, []);

  React.useEffect(() => { document.title = 'Painel Polisul'; }, []);

  if (!user) return <Login onEntrar={setUser} />;

  const sair = () => { tokenService.clear(); setUser(null); };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 mx-auto max-w-5xl">
          <div>
            <span className="text-lg text-green-900 font-display">Polisul</span>
            <span className="ml-2 text-sm text-gray-500">Painel administrador</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-gray-500 sm:inline">{user.email}</span>
            <a href="/" target="_blank" rel="noreferrer" className={btnSecundario}>Ver site</a>
            <button className={btnSecundario} onClick={sair}>Sair</button>
          </div>
        </div>
        <nav className="flex gap-1 px-4 mx-auto overflow-x-auto max-w-5xl" aria-label="Seções">
          {ABAS.filter(a => !a.soAdmin || user.role === 'ADMIN').map(a => (
            <button key={a.id} onClick={() => setAba(a.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${aba === a.id ? 'border-green-800 text-green-900' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {a.rotulo}
            </button>
          ))}
        </nav>
      </header>
      <main className="px-4 py-6 mx-auto max-w-5xl">
        {aba === 'produtos' && <ProdutosAdmin role={user.role} />}
        {aba === 'publicacoes' && <PublicacoesAdmin />}
        {aba === 'fotos' && <BannersAdmin />}
        {aba === 'mensagens' && <MensagensAdmin />}
        {aba === 'usuarios' && user.role === 'ADMIN' && <UsuariosAdmin eu={user.email} />}
      </main>
    </div>
  );
}
