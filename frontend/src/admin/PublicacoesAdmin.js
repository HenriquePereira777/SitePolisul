import React, { useCallback, useEffect, useState } from 'react';
import api from '../utils/security';
import ImagemInput from './ImagemInput';
import { Campo, Modal, Vazio, inputCls, btnPrimario, btnSecundario, btnPerigo, mensagemErro } from './ui';

const NOVO = { titulo: '', resumo: '', conteudo: '', imagemUrl: '', publicado: true };

const aoInput = iso => (iso ? iso.slice(0, 16) : '');
const fmt = iso => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '');

export default function PublicacoesAdmin() {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');
  const [edit, setEdit] = useState(null);

  const carregar = useCallback(() => {
    api.get('/api/admin/publicacoes').then(r => setLista(r.data)).catch(e => setErro(mensagemErro(e, 'Erro ao carregar.')));
  }, []);
  useEffect(carregar, [carregar]);

  const excluir = async p => {
    if (!window.confirm(`Excluir a publicação "${p.titulo}"?`)) return;
    try { await api.delete(`/api/admin/publicacoes/${p.id}`); carregar(); } catch (e) { setErro(mensagemErro(e)); }
  };
  const alternar = async p => {
    try { await api.put(`/api/admin/publicacoes/${p.id}`, { ...p, publicado: !p.publicado }); carregar(); } catch (e) { setErro(mensagemErro(e)); }
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <p className="text-sm text-gray-600">Notícias e novidades que aparecem na seção “Novidades” do site.</p>
        <button className={btnPrimario} onClick={() => setEdit({ ...NOVO })}>+ Nova publicação</button>
      </div>
      {erro && <p className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">{erro}</p>}
      {lista === null && !erro && <p className="text-gray-500">Carregando…</p>}
      {lista && lista.length === 0 && <Vazio>Nenhuma publicação ainda. Clique em “Nova publicação”.</Vazio>}
      <div className="grid gap-3">
        {(lista || []).map(p => (
          <div key={p.id} className={`flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl ${p.publicado ? '' : 'opacity-60'}`}>
            <div className="flex-shrink-0 w-24 h-16 overflow-hidden bg-gray-100 rounded-lg">
              {p.imagemUrl && <img src={p.imagemUrl} alt="" className="object-cover w-full h-full" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-green-900 truncate">{p.titulo}</p>
              <p className="text-xs text-gray-500">{fmt(p.dataPublicacao)} · {p.publicado ? 'publicada' : 'rascunho (oculta)'}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button className={btnSecundario} onClick={() => setEdit({ ...NOVO, ...p })}>Editar</button>
              <button className={btnSecundario} onClick={() => alternar(p)}>{p.publicado ? 'Ocultar' : 'Publicar'}</button>
              <button className={btnPerigo} onClick={() => excluir(p)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
      {edit && <Form inicial={edit} onClose={() => setEdit(null)} onSalvo={() => { setEdit(null); carregar(); }} />}
    </div>
  );
}

function Form({ inicial, onClose, onSalvo }) {
  const [f, setF] = useState(inicial);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  const salvar = async e => {
    e.preventDefault();
    if (!f.titulo.trim()) { setErro('Informe o título.'); return; }
    setSalvando(true); setErro('');
    try {
      const corpo = { ...f, titulo: f.titulo.trim(), dataPublicacao: f.dataPublicacao || null };
      if (f.id) await api.put(`/api/admin/publicacoes/${f.id}`, corpo); else await api.post('/api/admin/publicacoes', corpo);
      onSalvo();
    } catch (err) { setErro(mensagemErro(err)); setSalvando(false); }
  };

  return (
    <Modal titulo={f.id ? 'Editar publicação' : 'Nova publicação'} onClose={onClose}>
      <form onSubmit={salvar} className="space-y-4">
        <Campo label="Título"><input className={inputCls} maxLength={150} value={f.titulo} onChange={e => set('titulo', e.target.value)} /></Campo>
        <Campo label="Resumo" dica="Aparece no card (até 300 caracteres).">
          <textarea rows={2} maxLength={300} className={inputCls} value={f.resumo || ''} onChange={e => set('resumo', e.target.value)} />
        </Campo>
        <Campo label="Texto completo" dica="Opcional. Aparece ao abrir a publicação.">
          <textarea rows={6} className={inputCls} value={f.conteudo || ''} onChange={e => set('conteudo', e.target.value)} />
        </Campo>
        <Campo label="Foto"><ImagemInput valor={f.imagemUrl} onChange={v => set('imagemUrl', v)} proporcao="aspect-[16/9]" fundo="bg-gray-100" /></Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Data"><input type="datetime-local" className={inputCls} value={aoInput(f.dataPublicacao)} onChange={e => set('dataPublicacao', e.target.value)} /></Campo>
          <label className="flex items-center gap-2 text-sm sm:mt-7"><input type="checkbox" checked={!!f.publicado} onChange={e => set('publicado', e.target.checked)} /> Publicada (visível no site)</label>
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
