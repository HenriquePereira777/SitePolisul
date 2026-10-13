import React from 'react';
import { Link } from 'react-scroll';
import { FiArrowRight } from 'react-icons/fi';
import { empresa } from '../../config/empresa';
import Reveal from '../Reveal/Reveal';

export default function CtaFinal() {
  return (
    <section className="py-20 bg-gold-500">
      <Reveal className="max-w-4xl px-6 mx-auto text-center">
        <h2 className="mb-4 text-3xl text-white font-display md:text-4xl">Vamos levar o arroz Polisul até você?</h2>
        <p className="max-w-xl mx-auto mb-8 text-white/90">Conte o que você precisa e receba uma proposta da nossa equipe comercial.</p>
        <Link to="contato" smooth duration={600} offset={-80}
          className="inline-flex items-center gap-2 px-8 py-3.5 font-medium text-green-900 transition-colors bg-white rounded-lg cursor-pointer hover:bg-green-50">
          Solicitar proposta <FiArrowRight />
        </Link>
        <p className="mt-6 text-sm text-white/90">
          Ou chame no WhatsApp:{' '}
          <a href={`https://wa.me/${empresa.whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-medium underline">{empresa.telefone}</a>
        </p>
      </Reveal>
    </section>
  );
}
