import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { empresa } from '../../config/empresa';

// Botão flutuante: abre conversa no WhatsApp da Polisul.
export default function WhatsApp() {
  const href = `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent('Olá! Vim pelo site da Polisul e gostaria de uma proposta.')}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Falar pelo WhatsApp"
      className="fixed z-40 flex items-center gap-2 px-4 py-3.5 text-white transition-transform bg-[#25A244] rounded-full shadow-xl bottom-5 right-5 hover:scale-105">
      <FiMessageCircle size={22} />
      <span className="hidden text-sm font-medium sm:inline">Fale pelo WhatsApp</span>
    </a>
  );
}
