import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import logoPolisul from '../images/logo-polisul.webp';

const links = [
  { to: 'sobre',       label: 'Sobre' },
  { to: 'processo',    label: 'Processo' },
  { to: 'produtos',    label: 'Produtos' },
  { to: 'diferenciais',label: 'Qualidade' },
  { to: 'contato',     label: 'Contato' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm transition-shadow duration-300 ${scrolled ? 'shadow-md border-b border-green-100' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[72px]">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src={logoPolisul} alt="Polisul" className="object-contain w-11 h-11" />
          <div>
            <span className="block font-bold leading-none text-green-900 text-ms font-display">Polisul</span>
            <span className="block text-[9px] tracking-[2px] text-green-600 font-medium">Indústria e Comércio de Alimentos </span>
          </div>
        </div>

        {/* Desktop links */}
        <nav className="items-center hidden gap-8 md:flex">
          {links.map(l => (
            <Link key={l.to} to={l.to} smooth duration={600} offset={-80}
              className="text-sm text-gray-500 transition-colors cursor-pointer hover:text-green-600">
              {l.label}
            </Link>
          ))}
          <Link to="contato" smooth duration={600} offset={-80} className="btn-primary !py-2.5 !px-5">
            Fale conosco
          </Link>
        </nav>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-1" aria-label="Menu">
          <span className={`block w-5 h-0.5 bg-green-900 transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-green-900 transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-green-900 transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-green-100 shadow-lg px-6 py-5 flex flex-col gap-4 animate-slide-down">
          {links.map(l => (
            <Link key={l.to} to={l.to} smooth duration={600} offset={-80}
              className="text-base text-gray-600 cursor-pointer hover:text-green-600"
              onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to="contato" smooth duration={600} offset={-80} className="text-center btn-primary" onClick={() => setOpen(false)}>
            Fale conosco
          </Link>
        </div>
      )}
    </header>
  );
}
