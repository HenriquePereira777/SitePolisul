import React, { useCallback, useEffect, useState } from 'react';
import api from '../utils/security';
import { Campo, Modal, inputCls, btnPrimario, btnSecundario, btnPerigo, mensagemErro } from './ui';

const ROTULO = { ADMIN: 'Administrador', EDITOR: 'Editor' };

export default function UsuariosAdmin({ eu }) {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');
  const [modal, setModal] = useState(null); // {tipo:'novo'} | {tipo:'senha', u}

  const carregar = useCallback(() => {
    api.get('/api/admin/usuarios').then(r => setLista(r.data)).catch(e => setErro(mensagemErro(e, 'Erro ao carregar usuários.')));
  }, []);
  useEffect(carregar, [carregar]);

  const agir = async fn => { setErro(''); try { await fn(); carregar(); } catch (e) { setErro(mensagemErro(e)); } };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <p className="max-w-xl text-sm text-gray-600">
          Quem tem acesso ao painel. <b>Administrador</b> faz tudo (inclusive gerenciar usuários e ver mensagens);
          <b> Editor</b> altera produtos, publicações e fotos.
        </p>
        <button className={btnPrimario} onClick={() => setModal({ tipo: 'novo' })}>+ Novo usuário</button>
      </div>
      {erro && <p className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">{erro}</p>}
      {lista === null && !erro && <p className="text-gray-500">Carregando…</p>}
      <div className="grid gap-3">
        {(lista || []).map(u => {
          const sou = u.email.toLowerCase() === (eu || '').toLowerCase();
          return (
            <div key={u.id} className={`flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl ${u.ativo ? '' : 'opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-900 truncate">{u.email} {sou && <span className="text-xs font-normal text-gray-400">(você)</span>}</p>
                <p className="text-xs text-gray-500">{ROTULO[u.role]} {!u.ativo && '· acesso bloqueado'}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button className={btnSecundario} onClick={() => setModal({ tipo: 'senha', u })}>Trocar senha</button>
                {!sou && (
                  <>
                    <button className={btnSecundario} onClick={() => agir(() => api.put(`/api/admin/usuarios/${u.id}`, { role: u.role === 'ADMIN' ? 'EDITOR' : 'ADMIN' }))}>
                      Tornar {u.role === 'ADMIN' ? 'Editor' : 'Administrador'}
                    </button>
                    <button className={btnSecundario} onClick={() => agir(() => api.put(`/api/admin/usuarios/${u.id}`, { ativo: !u.ativo }))}>{u.ativo ? 'Bloquear' : 'Liberar'}</button>
                    <button className={btnPerigo} onClick={() => window.confirm(`Excluir o usuário ${u.email}?`) && agir(() => api.delete(`/api/admin/usuarios/${u.id}`))}>Excluir</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {modal?.tipo === 'novo' && <FormNovo onClose={() => setModal(null)} onSalvo={() => { setModal(null); carregar(); }} />}
      {modal?.tipo === 'senha' && <FormSenha u={modal.u} onClose={() => setModal(null)} onSalvo={() => { setModal(null); carregar(); }} />}
    </div>
  );
}

function FormNovo({ onClose, onSalvo }) {
  const [f, setF] = useState({ email: '', senha: '', role: 'EDITOR' });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const salvar = async e => {
    e.preventDefault(); setErro(''); setSalvando(true);
    try { await api.post('/api/admin/usuarios', f); onSalvo(); } catch (err) { setErro(mensagemErro(err)); setSalvando(false); }
  };
  return (
    <Modal titulo="Novo usuário" onClose={onClose}>
      <form onSubmit={salvar} className="space-y-4">
        <Campo label="E-mail (será o login)"><input type="email" className={inputCls} value={f.email} onChange={e => set('email', e.target.value)} required /></Campo>
        <Campo label="Senha" dica="Mínimo 8 caracteres. Repasse para a pessoa, que poderá pedir troca a um administrador."><input type="text" autoComplete="off" className={inputCls} value={f.senha} onChange={e => set('senha', e.target.value)} minLength={8} required /></Campo>
        <Campo label="Perfil">
          <select className={inputCls} value={f.role} onChange={e => set('role', e.target.value)}>
            <option value="EDITOR">Editor (produtos, publicações e fotos)</option>
            <option value="ADMIN">Administrador (tudo)</option>
          </select>
        </Campo>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <div className="flex justify-end gap-2"><button type="button" className={btnSecundario} onClick={onClose}>Cancelar</button><button className={btnPrimario} disabled={salvando}>{salvando ? 'Criando…' : 'Criar usuário'}</button></div>
      </form>
    </Modal>
  );
}

function FormSenha({ u, onClose, onSalvo }) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const salvar = async e => {
    e.preventDefault(); setErro('');
    try { await api.put(`/api/admin/usuarios/${u.id}`, { senha }); onSalvo(); } catch (err) { setErro(mensagemErro(err)); }
  };
  return (
    <Modal titulo={`Trocar senha — ${u.email}`} onClose={onClose}>
      <form onSubmit={salvar} className="space-y-4">
        <Campo label="Nova senha" dica="Mínimo 8 caracteres."><input type="text" autoComplete="off" className={inputCls} value={senha} onChange={e => setSenha(e.target.value)} minLength={8} required /></Campo>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <div className="flex justify-end gap-2"><button type="button" className={btnSecundario} onClick={onClose}>Cancelar</button><button className={btnPrimario}>Salvar senha</button></div>
      </form>
    </Modal>
  );
}
