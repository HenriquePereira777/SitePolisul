import React from 'react';
import { FiMapPin, FiGlobe } from 'react-icons/fi';
import Reveal from '../Reveal/Reveal';

const MERCADOS = [
  { Icon: FiMapPin, titulo: 'Mercado brasileiro', texto: 'Mais de 20 anos levando arroz de qualidade constante a quem vende e a quem consome em todo o Brasil.' },
  { Icon: FiGlobe, titulo: 'Mercado peruano', texto: 'A linha Polisul Añejo — naturalmente pura, de grãos finos e alto rendimento no cozimento — pensada para o consumidor peruano.' },
];

export default function Mercados() {
  return (
    <section id="mercados" className="relative py-24 overflow-hidden">
      <img src="/images/destaques/rio-grande.jpg" alt="" aria-hidden className="absolute inset-0 object-cover w-full h-full" loading="lazy" />
      <div className="absolute inset-0 bg-green-900/85" />
      <div className="relative max-w-6xl px-6 mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <span className="section-tag !text-gold-300">Onde atuamos</span>
          <h2 className="mb-3 text-3xl text-white font-display md:text-4xl">Do sul do Brasil para onde o arroz é preciso</h2>
          <p className="text-white/70">Com o Porto de Rio Grande a 70 km, a Polisul produz e distribui com eficiência.</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {MERCADOS.map((m, i) => (
            <Reveal key={m.titulo} delay={i * 120}>
              <div className="h-full p-8 border bg-white/10 border-white/20 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-xl bg-gold-500">
                  <m.Icon size={22} />
                </div>
                <h3 className="mb-2 text-xl text-white font-display">{m.titulo}</h3>
                <p className="leading-relaxed text-white/75">{m.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
