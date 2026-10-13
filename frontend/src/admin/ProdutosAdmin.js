import React, { useCallback, useEffect, useState } from 'react';
import api from '../utils/security';
import ImagemInput from './ImagemInput';
import { Campo, Modal, Vazio, inputCls, btnPrimario, btnSecundario, btnPerigo, mensagemErro } from './ui';

const NOVO = { nome: '', categoria: 'ARROZ', descricao: '', imagemUrl: '', embalagens: '', atributos: '', organico: false, destaque: false, ativo: true };

export default function ProdutosAdmin({ role }) {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');
  const [edit, setEdit] = useState(null);
  const [busca, setBusca] = useState('');

  const carregar = useCallback(() => {
    api.get('/api/admin/produtos').then(r => setLista(r.data)).catch(e => setErro(mensagemErro(e, 'Erro ao carregar produtos.')));
  }, []);
  useEffect(carregar, [carregar]);

  const alternarAtivo = async p => {
    try { await api.put(`/api/produtos/${p.id}`, { ...p, ativo: !p.ativo }); carregar(); }
    catch (e) { setErro(mensagemErro(e)); }
  };
  const excluir = async p => {
    if (!window.confirm(`Excluir "${p.nome}" definitivamente? Isso não pode ser desfeito.\n(Para só tirar do site, use "Ocultar".)`)) return;
    try { await api.delete(`/api/admin/produtos/${p.id}/definitivo`); carregar(); }
    catch (e) { setErro(mensagemErro(e)); }
  };

  const filtrada = (lista || []).filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <input className={`${inputCls} max-w-xs`} placeholder="Buscar produto…" value={busca} onChange={e => setBusca(e.target.value)} />
        <button className={btnPrimario} onClick={() => setEdit({ ...NOVO })}>+ Novo produto</button>
      </div>
      {erro && <p className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">{erro}</p>}
      {lista === null && !erro && <p className="text-gray-500">Carregando…</p>}
      {lista && filtrada.length === 0 && <Vazio>Nenhum produto encontrado.</Vazio>}
      <div className="grid gap-3">
        {filtrada.map(p => (
          <div key={p.id} className={`flex items-center gap-4 p-3 bg-white border rounded-xl ${p.ativo ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
            <div className="flex-shrink-0 w-20 h-16 overflow-hidden bg-gray-50 rounded-lg">
              {p.imagemUrl && <img src={p.imagemUrl} alt="" className="object-contain w-full h-full" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-green-900 truncate">{p.nome}</p>
              <p className="text-xs text-gray-500">{p.categoria} · {p.embalagens || 'sem embalagem'} {!p.ativo && '· oculto no site'}{p.destaque && ' · destaque'}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button className={btnSecundario} onClick={() => setEdit({ ...NOVO, ...p })}>Editar</button>
              <button className={btnSecundario} onClick={() => alternarAtivo(p)}>{p.ativo ? 'Ocultar' : 'Mostrar'}</button>
              {role === 'ADMIN' && <button className={btnPerigo} onClick={() => excluir(p)}>Excluir</button>}
            </div>
          </div>
        ))}
      </div>
      {edit && <FormProduto inicial={edit} onClose={() => setEdit(null)} onSalvo={() => { setEdit(null); carregar(); }} />}
    </div>
  );
}

function FormProduto({ inicial, onClose, onSalvo }) {
  const [f, setF] = useState(inicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  const salvar = async e => {
    e.preventDefault();
    if (!f.nome.trim()) { setErro('Informe o nome.'); return; }
    setSalvando(true); setErro('');
    try {
      const corpo = { ...f, nome: f.nome.trim() };
      if (f.id) await api.put(`/api/produtos/${f.id}`, corpo); else await api.post('/api/produtos', corpo);
      onSalvo();
    } catch (err) { setErro(mensagemErro(err)); setSalvando(false); }
  };

  return (
    <Modal titulo={f.id ? 'Editar produto' : 'Novo produto'} onClose={onClose}>
      <form onSubmit={salvar} className="space-y-4">
        <Campo label="Nome"><input className={inputCls} maxLength={100} value={f.nome} onChange={e => set('nome', e.target.value)} /></Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Categoria">
            <select className={inputCls} value={f.categoria} onChange={e => set('categoria', e.target.value)}>
              <option value="ARROZ">Arroz</option><option value="SOJA">Soja</option>
            </select>
          </Campo>
          <Campo label="Embalagens" dica="Separe por vírgula. Ex.: 1kg,5kg">
            <input className={inputCls} value={f.embalagens || ''} onChange={e => set('embalagens', e.target.value)} />
          </Campo>
        </div>
        <Campo label="Descrição"><textarea rows={3} className={inputCls} value={f.descricao || ''} onChange={e => set('descricao', e.target.value)} /></Campo>
        <Campo label="Características" dica="Separe por vírgula. Ex.: Tipo 1,Longo fino,Polido">
          <input className={inputCls} value={f.atributos || ''} onChange={e => set('atributos', e.target.value)} />
        </Campo>
        <Campo label="Foto do produto" dica="Ideal: fundo branco, produto em pé, proporção 4:3.">
          <ImagemInput valor={f.imagemUrl} onChange={v => set('imagemUrl', v)} />
        </Campo>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.ativo} onChange={e => set('ativo', e.target.checked)} /> Visível no site</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.destaque} onChange={e => set('destaque', e.target.checked)} /> Destaque</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.organico} onChange={e => set('organico', e.target.checked)} /> Orgânico</label>
        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={btnSecundario} onClick={onClose}>Cancelar</button>
          <button className={btnPrimario} disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
        </div>
      </form>
    </Modal>
  );
}
