import React, { useEffect, useState } from 'react';
import api from '../utils/security';
import { Vazio, mensagemErro } from './ui';

export default function MensagensAdmin() {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/api/contatos').then(r => setLista([...r.data].sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''))))
      .catch(e => setErro(mensagemErro(e, 'Erro ao carregar mensagens.')));
  }, []);

  if (erro) return <p className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">{erro}</p>;
  if (lista === null) return <p className="text-gray-500">Carregando…</p>;
  if (lista.length === 0) return <Vazio>Nenhuma mensagem recebida ainda.</Vazio>;

  return (
    <div className="grid gap-3">
      {lista.map(c => (
        <div key={c.id} className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium text-green-900">{c.nome} {c.empresa && <span className="font-normal text-gray-500">· {c.empresa}</span>}</p>
            <span className="text-xs text-gray-400">{c.criadoEm ? new Date(c.criadoEm).toLocaleString('pt-BR') : ''}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            <a className="underline" href={`mailto:${c.email}`}>{c.email}</a>
            {c.telefone && <> · <a className="underline" href={`https://wa.me/55${String(c.telefone).replace(/\D/g, '').replace(/^55/, '')}`} target="_blank" rel="noreferrer">{c.telefone}</a></>}
          </p>
          <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">{c.mensagem}</p>
        </div>
      ))}
    </div>
  );
}
