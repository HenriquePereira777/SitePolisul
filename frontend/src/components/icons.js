// Ícones desenhados à mão no mesmo estilo (stroke, 24x24, currentColor) dos ícones
// da biblioteca react-icons/fi usados no resto do site — cobrem os poucos conceitos
// (arroz, soja/broto, folha) que a Feather não tem prontos.
import React from 'react';

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function WheatIcon({ className, size }) {
  return (
    <svg {...base} className={className} width={size} height={size}>
      <path d="M12 21V3" />
      <path d="M8.5 6.5 12 4l3.5 2.5" />
      <path d="M8.5 10 12 7.5 15.5 10" />
      <path d="M8.5 13.5 12 11l3.5 2.5" />
      <path d="M8.5 17 12 14.5 15.5 17" />
    </svg>
  );
}

export function SproutIcon({ className, size }) {
  return (
    <svg {...base} className={className} width={size} height={size}>
      <path d="M12 21v-9" />
      <path d="M12 12c0-3.5-2.5-6-6.5-6C5 9.5 8 12 12 12Z" />
      <path d="M12 9c0-3 2.2-5.5 5.8-5.5C18.3 6.8 15.6 9 12 9Z" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function LeafIcon({ className, size }) {
  return (
    <svg {...base} className={className} width={size} height={size}>
      <path d="M12 2c5 4 8 8.5 8 12.5A6 6 0 0 1 4 14.5C4 10.5 7 6 12 2Z" />
      <path d="M12 5v15" />
    </svg>
  );
}
