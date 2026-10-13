import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Reveal from '../Reveal/Reveal';

const PERGUNTAS = [
  { q: 'Onde fica a Polisul?', a: 'Em Pelotas, no Rio Grande do Sul, uma região arrozeira por excelência — a cerca de 70 km do Porto de Rio Grande.' },
  { q: 'O que é o arroz Polisul Añejo?', a: 'É uma linha naturalmente pura, de grãos finos e com alto rendimento no cozimento em cada pacote.' },
  { q: 'O arroz tem aditivos ou mistura de variedades?', a: 'Não. O controle de qualidade é feito periodicamente, sem misturas de variedades e sem aditivos.' },
  { q: 'Como peço uma proposta?', a: 'Preencha o formulário na seção de contato com o produto de interesse e a quantidade. Nossa equipe comercial retorna o mais breve possível.' },
  { q: 'Vocês atendem grandes volumes ou pedidos personalizados?', a: 'Sim, fale com o time comercial pelo formulário de contato para combinarmos volume, embalagem e entrega.' },
];

export default function Faq() {
  const [aberta, setAberta] = useState(0);
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="grid max-w-6xl gap-12 px-6 mx-auto lg:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <span className="section-tag">Dúvidas frequentes</span>
          <h2 className="mb-4 text-3xl text-green-900 font-display md:text-4xl">Perguntas que sempre recebemos</h2>
          <p className="text-gray-500">Não encontrou o que procurava? Fale com a gente pelo formulário de contato.</p>
        </Reveal>
        <Reveal delay={100}>
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-2xl">
            {PERGUNTAS.map((p, i) => {
              const on = aberta === i;
              return (
                <li key={p.q}>
                  <h3>
                    <button type="button" aria-expanded={on} aria-controls={`faq-${i}`}
                      onClick={() => setAberta(on ? -1 : i)}
                      className="flex items-center justify-between w-full gap-4 px-6 py-5 text-left text-green-900 font-medium hover:bg-gray-50">
                      {p.q}
                      <FiPlus size={20} className={`flex-shrink-0 text-gold-500 transition-transform ${on ? 'rotate-45' : ''}`} />
                    </button>
                  </h3>
                  <div id={`faq-${i}`} role="region" hidden={!on} className="px-6 pb-5 leading-relaxed text-gray-500">{p.a}</div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
