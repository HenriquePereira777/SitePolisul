import React, { useEffect, useState } from 'react';
import api, { sanitize } from '../../utils/security';
import Reveal from '../Reveal/Reveal';

const fmt = iso => (iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '');

// Publicações cadastradas no painel admin. Se não houver nenhuma, a seção nem aparece.
export default function Novidades() {
  const [lista, setLista] = useState([]);
  const [aberta, setAberta] = useState(null);

  useEffect(() => {
    api.get('/api/publicacoes').then(r => setLista(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  if (lista.length === 0) return null;

  return (
    <section id="novidades" className="py-20 bg-green-50">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="mb-9">
          <span className="section-tag">Novidades</span>
          <h2 className="text-3xl text-green-900 font-display md:text-4xl">Fique por dentro da Polisul</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lista.slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={i * 60} className="h-full">
              <article className="flex flex-col h-full overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
                {p.imagemUrl && <img src={p.imagemUrl} alt={sanitize(p.titulo)} loading="lazy" className="object-cover w-full aspect-[16/9]" />}
                <div className="flex flex-col flex-1 p-5">
                  <time className="text-xs tracking-wide text-gray-500 uppercase">{fmt(p.dataPublicacao)}</time>
                  <h3 className="mt-1 mb-2 text-xl text-green-900 font-display">{sanitize(p.titulo)}</h3>
                  {p.resumo && <p className="text-sm text-gray-600">{sanitize(p.resumo)}</p>}
                  {p.conteudo && (
                    <button type="button" onClick={() => setAberta(p)} className="mt-auto pt-4 text-sm font-medium text-left text-green-800 hover:underline">
                      Ler mais →
                    </button>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {aberta && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/60" onMouseDown={e => e.target === e.currentTarget && setAberta(null)}>
          <div className="w-full max-w-2xl my-8 overflow-hidden bg-white shadow-xl rounded-2xl" role="dialog" aria-modal="true" aria-label={sanitize(aberta.titulo)}>
            {aberta.imagemUrl && <img src={aberta.imagemUrl} alt="" className="object-cover w-full aspect-[16/9]" />}
            <div className="p-6">
              <time className="text-xs tracking-wide text-gray-500 uppercase">{fmt(aberta.dataPublicacao)}</time>
              <h3 className="mt-1 mb-3 text-2xl text-green-900 font-display">{sanitize(aberta.titulo)}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{sanitize(aberta.conteudo)}</p>
              <button type="button" onClick={() => setAberta(null)} className="px-4 py-2 mt-6 text-sm font-medium text-white bg-green-800 rounded-lg hover:bg-green-900">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
