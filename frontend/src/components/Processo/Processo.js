import React from 'react';
import Reveal from '../Reveal/Reveal';

// Etapas baseadas apenas no que o vídeo institucional afirma.
const ETAPAS = [
  { img: 'pelotas', titulo: 'Origem em Pelotas', texto: 'Região arrozeira por excelência, no sul do Brasil, onde a Polisul tem mais de 20 anos de experiência.' },
  { img: 'tecnologia', titulo: 'Seleção por tecnologia', texto: 'Os grãos são minuciosamente selecionados, graças ao forte investimento em tecnologia de última geração.' },
  { img: 'controle-qualidade', titulo: 'Controle de qualidade', texto: 'Verificação feita periodicamente, sem misturas de variedades e sem aditivos, para manter a qualidade constante.' },
  { img: 'alta-qualidade', titulo: 'Do pacote à mesa', texto: 'Conhecimento aplicado em toda a linha de produção e distribuição, entregando produtos de alta qualidade.' },
  { img: 'rio-grande', titulo: 'Logística até o porto', texto: 'A 70 km do Porto de Rio Grande, em localização estratégica para produzir e distribuir com eficiência.' },
];

export default function Processo() {
  return (
    <section id="processo" className="py-24 bg-green-50">
      <div className="max-w-6xl px-6 mx-auto">
        <Reveal className="max-w-2xl mx-auto mb-16 text-center">
          <span className="section-tag">Como trabalhamos</span>
          <h2 className="mb-3 text-3xl text-green-900 font-display md:text-4xl">Do campo ao pacote, passo a passo</h2>
          <p className="text-gray-500">Cada etapa pensada para entregar o mesmo arroz de qualidade, pacote após pacote.</p>
        </Reveal>

        <div className="relative">
          <div className="absolute hidden w-px bg-green-100 md:block left-1/2 top-2 bottom-2" aria-hidden />
          <ol className="space-y-12 md:space-y-20">
            {ETAPAS.map((e, i) => (
              <li key={e.titulo} className="relative grid items-center gap-6 md:grid-cols-2 md:gap-20">
                <Reveal className={i % 2 ? 'md:order-2' : ''}>
                  <img src={`/images/destaques/${e.img}.jpg`} alt={e.titulo} loading="lazy"
                    className="object-cover w-full shadow-lg aspect-[16/10] rounded-2xl" />
                </Reveal>
                <Reveal delay={120} className={i % 2 ? 'md:order-1 md:text-right' : ''}>
                  <span className="text-5xl font-bold text-gold-400 font-display">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-1 mb-2 text-2xl text-green-900 font-display">{e.titulo}</h3>
                  <p className="leading-relaxed text-gray-500">{e.texto}</p>
                </Reveal>
                <span className="absolute hidden w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-4 border-green-50 rounded-full md:block left-1/2 top-1/2 bg-gold-500" aria-hidden />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
