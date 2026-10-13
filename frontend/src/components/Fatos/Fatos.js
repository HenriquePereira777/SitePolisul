import React from 'react';
import { empresa } from '../../config/empresa';

// Fatos tirados da narração do vídeo institucional.
const fatos = [
  { valor: `+${empresa.anosDeMercado} anos`, label: 'no mercado brasileiro' },
  { valor: '70 km',        label: 'do Porto de Rio Grande' },
  { valor: 'Pelotas',      label: 'região arrozeira por excelência' },
  { valor: 'Sem aditivos', label: 'nem mistura de variedades' },
];

export default function Fatos() {
  return (
    <section aria-label="Polisul em fatos" className="relative z-10 px-6 -mt-12">
      <div className="grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 mx-auto bg-white shadow-xl rounded-2xl md:grid-cols-4 md:px-10">
        {fatos.map(f => (
          <div key={f.label}>
            <span className="block text-2xl font-bold text-green-800 font-display md:text-3xl">{f.valor}</span>
            <span className="block mt-1 text-sm text-gray-500">{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
