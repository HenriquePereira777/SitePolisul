import React, { useCallback, useEffect, useState } from 'react';
import api from '../utils/security';
import ImagemInput from './ImagemInput';
import { Campo, Modal, Vazio, inputCls, btnPrimario, btnSecundario, btnPerigo, mensagemErro } from './ui';

const NOVO = { tag: '', titulo: '', texto: '', imagemUrl: '', ordem: 0, ativo: true };

export default function BannersAdmin() {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');
  const [edit, setEdit] = useState(null);

  const carregar = useCallback(() => {
    api.get('/api/admin/banners').then(r => setLista(r.data)).catch(e => setErro(mensagemErro(e, 'Erro ao carregar.')));
  }, []);
  useEffect(carregar, [carregar]);

  const excluir = async b => {
    if (!window.confirm(`Excluir o slide "${b.titulo}"?`)) return;
    try { await api.delete(`/api/admin/banners/${b.id}`); carregar(); } catch (e) { setErro(mensagemErro(e)); }
  };
  const alternar = async b => {
    try { await api.put(`/api/admin/banners/${b.id}`, { ...b, ativo: !b.ativo }); carregar(); } catch (e) { setErro(mensagemErro(e)); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <p className="max-w-xl text-sm text-gray-600">
          Fotos do carrossel da página inicial. O vídeo institucional continua sempre como primeiro slide.
          Se nenhum slide for cadastrado aqui, o site usa os slides padrão.
        </p>
        <button className={btnPrimario} onClick={() => setEdit({ ...NOVO, ordem: (lista?.length || 0) + 1 })}>+ Novo slide</button>
      </div>
      {erro && <p className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">{erro}</p>}
      {lista === null && !erro && <p className="text-gray-500">Carregando…</p>}
      {lista && lista.length === 0 && <Vazio>Nenhum slide próprio ainda — o site está mostrando os slides padrão.</Vazio>}
      <div className="grid gap-3">
        {(lista || []).map(b => (
          <div key={b.id} className={`flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl ${b.ativo ? '' : 'opacity-60'}`}>
            <span className="w-6 text-sm text-center text-gray-400">{b.ordem}</span>
            <div className="flex-shrink-0 w-28 h-16 overflow-hidden bg-gray-100 rounded-lg">
              {b.imagemUrl && <img src={b.imagemUrl} alt="" className="object-cover w-full h-full" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-green-900 truncate">{b.titulo}</p>
              <p className="text-xs text-gray-500 truncate">{b.tag} {!b.ativo && '· oculto'}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button className={btnSecundario} onClick={() => setEdit({ ...NOVO, ...b })}>Editar</button>
              <button className={btnSecundario} onClick={() => alternar(b)}>{b.ativo ? 'Ocultar' : 'Mostrar'}</button>
              <button className={btnPerigo} onClick={() => excluir(b)}>Excluir</button>
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
    if (!f.imagemUrl) { setErro('Envie a foto do slide.'); return; }
    setSalvando(true); setErro('');
    try {
      const corpo = { ...f, titulo: f.titulo.trim(), ordem: Number(f.ordem) || 0 };
      if (f.id) await api.put(`/api/admin/banners/${f.id}`, corpo); else await api.post('/api/admin/banners', corpo);
      onSalvo();
    } catch (err) { setErro(mensagemErro(err)); setSalvando(false); }
  };

  return (
    <Modal titulo={f.id ? 'Editar slide' : 'Novo slide'} onClose={onClose}>
      <form onSubmit={salvar} className="space-y-4">
        <Campo label="Foto" dica="Foto horizontal (paisagem), ideal 1920×974 px.">
          <ImagemInput valor={f.imagemUrl} onChange={v => set('imagemUrl', v)} proporcao="aspect-[1920/974]" fundo="bg-gray-100" />
        </Campo>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2"><Campo label="Etiqueta (pequena, acima do título)"><input className={inputCls} maxLength={60} value={f.tag || ''} onChange={e => set('tag', e.target.value)} /></Campo></div>
          <Campo label="Ordem"><input type="number" className={inputCls} value={f.ordem} onChange={e => set('ordem', e.target.value)} /></Campo>
        </div>
        <Campo label="Título"><input className={inputCls} maxLength={120} value={f.titulo} onChange={e => set('titulo', e.target.value)} /></Campo>
        <Campo label="Texto"><textarea rows={2} maxLength={300} className={inputCls} value={f.texto || ''} onChange={e => set('texto', e.target.value)} /></Campo>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.ativo} onChange={e => set('ativo', e.target.checked)} /> Visível no site</label>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={btnSecundario} onClick={onClose}>Cancelar</button>
          <button className={btnPrimario} disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
        </div>
      </form>
    </Modal>
  );
}
