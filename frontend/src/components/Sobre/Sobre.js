import React from 'react';
import { FiAward, FiUsers, FiTruck } from 'react-icons/fi';
import { LeafIcon } from '../icons';
import Reveal from '../Reveal/Reveal';
import { empresa } from '../../config/empresa';

const valores = [
  { Icon: LeafIcon, titulo: 'Origem gaúcha', desc: 'Arroz da região arrozeira de Pelotas, no sul do Brasil.' },
  { Icon: FiAward, titulo: 'Qualidade constante', desc: 'Controle de qualidade feito periodicamente.' },
  { Icon: FiUsers, titulo: 'Parceria duradoura', desc: 'Relação de longo prazo com clientes e produtores.' },
  { Icon: FiTruck, titulo: 'Logística estratégica', desc: 'A 70 km do Porto de Rio Grande.' },
];

export default function Sobre() {
  return (
    <section id="sobre" className="py-24 overflow-hidden bg-white">
      <div className="grid items-center max-w-6xl gap-16 px-6 mx-auto lg:grid-cols-2">
        {/* Colagem de fotos */}
        <Reveal className="relative pb-12 pr-8 sm:pr-14">
          <img src="/images/destaques/anejo.jpg" alt="Arroz Polisul Añejo"
            className="object-cover w-full shadow-xl aspect-[4/3] rounded-2xl" loading="lazy" />
          <img src="/images/destaques/alta-qualidade.jpg" alt="Produtos Polisul"
            className="absolute bottom-0 right-0 object-cover w-1/2 border-4 border-white shadow-xl aspect-[4/3] rounded-2xl" loading="lazy" />
          <div className="absolute top-4 -left-2 sm:top-6 sm:-left-8 w-32 h-32 sm:w-36 sm:h-36 p-1.5 rounded-full shadow-xl bg-white">
            <div className="flex flex-col items-center justify-center w-full h-full text-center text-white rounded-full bg-gold-500 ring-2 ring-inset ring-gold-300/70">
              <span className="text-4xl font-bold leading-none sm:text-5xl font-display">+{empresa.anosDeMercado}</span>
              <span className="mt-1.5 text-[10px] sm:text-[11px] font-medium leading-tight tracking-[0.18em] uppercase">
                anos<br />de mercado
              </span>
            </div>
          </div>
        </Reveal>

        {/* Texto + valores */}
        <div>
          <Reveal>
            <span className="section-tag">Quem somos</span>
            <h2 className="mb-5 text-3xl text-green-900 font-display md:text-4xl">
              Uma empresa com raízes sólidas no agronegócio
            </h2>
            <p className="mb-4 leading-relaxed text-gray-500">
              A Polisul Alimentos nasceu da vocação agrícola do Rio Grande do Sul, combinando
              o conhecimento tradicional do campo com processos modernos de produção.
            </p>
            <p className="mb-8 leading-relaxed text-gray-500">
              Com mais de {empresa.anosDeMercado} anos de atuação no mercado brasileiro, levamos arroz de
              qualidade constante, da região arrozeira de Pelotas para a mesa das famílias.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {valores.map((v, i) => (
              <Reveal key={v.titulo} delay={i * 90}>
                <div className="h-full p-4 border border-gray-100 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 mb-3 text-green-600 rounded-lg bg-green-50">
                    <v.Icon size={19} />
                  </div>
                  <h3 className="mb-1 text-sm font-medium text-green-900">{v.titulo}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
