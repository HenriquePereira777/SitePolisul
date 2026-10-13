import React, { useState, useEffect } from 'react';
import { FiCheck, FiGrid } from 'react-icons/fi';
import api from '../../utils/security';
import { sanitize } from '../../utils/security';
import { WheatIcon, SproutIcon } from '../icons';
import { empresa } from '../../config/empresa';

// Filtros mostrados na vitrine. "Soja" e "Orgânico" ficam ocultos enquanto o catálogo
// não tiver nenhum produto dessas categorias (hoje é 100% Arroz) — assim que existir
// produto com categoria SOJA ou organico=true, é só descomentar as linhas abaixo.
const FILTROS = [
  { key: null,     label: 'Todos', Icon: FiGrid },
  { key: 'ARROZ', label: 'Arroz', Icon: WheatIcon },
  // { key: 'SOJA',     label: 'Soja',     Icon: SproutIcon },
  // { key: 'organico', label: 'Orgânico', Icon: FiRefreshCw },
];

function useProdutos(filtro) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [erro, setErro]         = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filtro === 'ARROZ' || filtro === 'SOJA') params.categoria = filtro;
    else if (filtro === 'organico') params.organico = true;

    api.get('/api/produtos', { params })
      .then(r => setProdutos(r.data))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setLoading(false));
  }, [filtro]);

  return { produtos, loading, erro };
}

function ProdutoCard({ produto, ativo, onClick }) {
  const isSoja    = produto.categoria === 'SOJA';
  const isOrg     = produto.organico;
  const headerBg  = isOrg ? 'bg-teal-50' : isSoja ? 'bg-amber-50' : 'bg-green-50';
  const iconColor = isOrg ? 'text-teal-600' : isSoja ? 'text-amber-600' : 'text-green-600';
  const badge     = isOrg ? 'badge-teal' : isSoja ? 'badge-amber' : 'badge-green';
  const badgeText = isOrg ? 'Orgânico' : produto.categoria;
  const [imgError, setImgError] = useState(false);
  const showImage = produto.imagemUrl && !imgError;

  return (
    <div
      role="button" tabIndex={0}
      onClick={() => onClick(produto)}
      onKeyDown={e => e.key === 'Enter' && onClick(produto)}
      className={`card cursor-pointer overflow-hidden transition-all duration-200
        hover:-translate-y-0.5 hover:border-green-200
        ${ativo ? 'ring-2 ring-green-600 border-green-600' : 'border border-gray-100'}`}
    >
      <div className={`${headerBg} aspect-[4/3] flex items-center justify-center relative overflow-hidden`}>
        {showImage ? (
          <img
            src={produto.imagemUrl}
            alt={produto.nome}
            onError={() => setImgError(true)}
            className="absolute inset-0 object-cover w-full h-full"
          />
        ) : (
          isSoja
            ? <SproutIcon className={iconColor} size={40} />
            : <WheatIcon className={iconColor} size={40} />
        )}
        {produto.destaque && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            Destaque
          </span>
        )}
      </div>
      <div className="p-4">
        <span className={`${badge} mb-2 inline-block`}>{badgeText}</span>
        <h3 className="text-[15px] font-medium text-gray-900 mb-1.5">{sanitize(produto.nome)}</h3>
        <p className="mb-3 text-xs leading-relaxed text-gray-500 line-clamp-2">{sanitize(produto.descricao)}</p>
        <div className="flex gap-1.5 flex-wrap">
          {produto.embalagens?.split(',').slice(0, 2).map(e => (
            <span key={e} className="pill">{sanitize(e.trim())}</span>
          ))}
          {produto.embalagens?.split(',').length > 2 && (
            <span className="pill">+{produto.embalagens.split(',').length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Produtos() {
  const [filtro, setFiltro]         = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const { produtos, loading, erro } = useProdutos(filtro);

  const handleClick = (p) => setSelecionado(prev => prev?.id === p.id ? null : p);

  return (
    <section id="produtos" className="py-20 bg-gray-50">
      <div className="max-w-6xl px-6 mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
          <div>
            <span className="section-tag">Nosso portfólio</span>
            <h2 className="text-3xl text-green-900 font-display md:text-4xl">Produtos Polisul</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTROS.map(f => (
              <button key={f.key ?? 'todos'}
                onClick={() => { setFiltro(f.key); setSelecionado(null); }}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium border transition-all duration-200
                  ${filtro === f.key
                    ? 'bg-green-600 text-green-50 border-green-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'}`}>
                <f.Icon size={14} />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="py-16 text-center text-gray-400">Carregando produtos...</p>}
        {erro    && <p className="py-16 text-center text-red-500">{erro}</p>}

        {!loading && !erro && (
          <div className="grid grid-cols-1 gap-5 mb-4 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map(p => (
              <ProdutoCard key={p.id} produto={p} ativo={selecionado?.id === p.id} onClick={handleClick} />
            ))}
          </div>
        )}

        {/* Detalhe */}
        {selecionado && (
          <div className="p-6 mt-2 bg-white border border-green-100 rounded-xl animate-slide-down">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center flex-shrink-0 w-14 h-14 rounded-xl bg-green-50 text-green-600">
                {selecionado.categoria === 'SOJA'
                  ? <SproutIcon size={28} />
                  : <WheatIcon size={28} />}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{sanitize(selecionado.nome)}</h3>
                <span className={selecionado.organico ? 'badge-teal' : selecionado.categoria === 'SOJA' ? 'badge-amber' : 'badge-green'}>
                  {selecionado.categoria}{selecionado.organico ? ' · Orgânico' : ''}
                </span>
              </div>
            </div>
            <hr className="mb-4 border-gray-100" />
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-2">Descrição</p>
                <p className="text-sm leading-relaxed text-gray-600">{sanitize(selecionado.descricao)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-2">Embalagens</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selecionado.embalagens?.split(',').map(e => <span key={e} className="pill">{sanitize(e.trim())}</span>)}
                </div>
                <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-2">Diferenciais</p>
                <ul className="space-y-1.5">
                  {selecionado.atributos?.split(',').map(a => (
                    <li key={a} className="flex items-center gap-2 text-sm text-green-800">
                      <FiCheck className="text-green-600 flex-shrink-0" size={15} />{sanitize(a.trim())}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Marcas */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-8 py-6 mt-10 bg-green-50 rounded-xl">
          <span className="text-xs font-medium tracking-widest text-green-600 uppercase">Marcas</span>
          {empresa.marcas.map(m => (
            <span key={m} className="text-xl text-green-900 font-display">{m}</span>
          ))}
        </div>

        <div className="p-8 mt-6 text-center bg-white border border-green-100 rounded-xl">
          <p className="mb-4 text-gray-500">Precisa de volume maior ou produto personalizado?</p>
          <a href="#contato" className="btn-primary">Falar com o comercial</a>
        </div>
      </div>
    </section>
  );
}
