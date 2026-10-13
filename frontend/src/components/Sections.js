import React from 'react';
import { Link } from 'react-scroll';
import {
  FiAward, FiUsers, FiTruck, FiSearch, FiClipboard, FiGlobe,
  FiSettings, FiRefreshCw, FiPackage,   FiMessageCircle, FiPhone, FiMail, FiMapPin, FiClock,
} from 'react-icons/fi';
import logoPolisul from '../components/images/logo-polisul.webp';
import { LeafIcon } from './icons';
import { empresa } from '../config/empresa';
// ── SOBRE ─────────────────────────────────────────────────────────────────────
const valores = [
  { Icon: LeafIcon, titulo: 'Sustentabilidade', desc: 'Práticas que respeitam o solo e o futuro do agronegócio.' },
  { Icon: FiAward, titulo: 'Qualidade certificada', desc: 'Processos auditados e rastreabilidade completa.' },
  { Icon: FiUsers, titulo: 'Parceria duradoura', desc: 'Relações de longo prazo com clientes e produtores.' },
  { Icon: FiTruck, titulo: 'Logística eficiente', desc: 'Entrega pontual para todo o Brasil.' },
];

export function Sobre() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="grid items-start max-w-6xl gap-16 px-6 mx-auto md:grid-cols-2">
        <div>
          <span className="section-tag">Quem somos</span>
          <h2 className="mb-5 text-3xl text-green-900 font-display md:text-4xl">
            Uma empresa com raízes sólidas no agronegócio
          </h2>
          <p className="mb-4 leading-relaxed text-gray-500">
            A Polisul Alimentos nasceu da vocação agrícola do Rio Grande do Sul, combinando
            o conhecimento tradicional do campo com processos modernos de produção.
          </p>
          <p className="leading-relaxed text-gray-500">
            Com mais de 20 anos de atuação, atendemos distribuidores, redes supermercadistas,
            cooperativas e o mercado de exportação, mantendo padrão de referência no setor.
          </p>
        </div>
        <div className="space-y-4">
          {valores.map(v => (
            <div key={v.titulo} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 text-green-600">
                <v.Icon size={19} />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-green-900">{v.titulo}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── DIFERENCIAIS ──────────────────────────────────────────────────────────────
const itens = [
  { Icon: FiSearch, titulo: 'Controle de qualidade', desc: 'Análises laboratoriais em cada lote, garantindo pureza e granulometria nos padrões MAPA.' },
  { Icon: FiClipboard, titulo: 'Rastreabilidade total', desc: 'Do produtor rural ao consumidor final. Cada embalagem tem origem identificada.' },
  { Icon: FiGlobe, titulo: 'Foco em exportação', desc: 'Padrões internacionais de fitossanidade, atendendo mais de 10 países.' },
  { Icon: FiSettings, titulo: 'Tecnologia de ponta', desc: 'Equipamentos modernos de beneficiamento e armazenagem que preservam a qualidade.' },
  { Icon: FiRefreshCw, titulo: 'Produção sustentável', desc: 'Certificação de boas práticas agrícolas e manejo responsável do solo.' },
  { Icon: FiPackage, titulo: 'Flexibilidade de embalagem', desc: 'Do varejo ao atacado: 1kg ao granel, com possibilidade de marca própria.' },
];

export function Diferenciais() {
  return (
    <section id="diferenciais" className="py-20 bg-green-900">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="mb-12 text-center">
          <span className="section-tag !text-green-100">Por que escolher a Polisul</span>
          <h2 className="text-3xl text-white font-display md:text-4xl">Qualidade em cada etapa</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map(i => (
            <div key={i.titulo} className="p-6 transition-colors border bg-white/10 border-white/15 rounded-xl hover:bg-white/15">
              <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-lg bg-white/15 text-white">
                <i.Icon size={19} />
              </div>
              <h3 className="mb-2 text-sm font-medium text-white">{i.titulo}</h3>
              <p className="text-xs leading-relaxed text-white/65">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── NÚMEROS ───────────────────────────────────────────────────────────────────
const numeros = [
  { valor: '20+',    label: 'Anos de experiência', desc: 'No mercado brasileiro' },
  { valor: '50 mil', label: 'Toneladas por ano',   desc: 'Em capacidade de produção' },
  { valor: '300+',   label: 'Clientes ativos',     desc: 'No Brasil e exterior' },
  { valor: '10+',    label: 'Países atendidos',    desc: 'Em exportação direta' },
];

export function Numeros() {
  return (
    <section id="numeros" className="py-16 bg-green-50">
      <div className="grid max-w-6xl grid-cols-2 gap-5 px-6 mx-auto md:grid-cols-4">
        {numeros.map(n => (
          <div key={n.label} className="p-6 text-center border border-green-100 card">
            <span className="block mb-2 text-4xl font-bold text-green-600 font-display">{n.valor}</span>
            <span className="block mb-1 text-sm font-medium text-green-900">{n.label}</span>
            <span className="block text-xs text-gray-400">{n.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────


export function Footer() {
  return (
    <footer className="pt-16 pb-0 text-white bg-green-900">
      <div className="grid max-w-6xl gap-10 px-6 pb-12 mx-auto md:grid-cols-4">
        {/* Brand */}
        <div>
           <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center bg-white/95 rounded-xl p-1.5">
              <img src={logoPolisul} alt="Polisul" className="object-contain w-9 h-9" />
            </div>
            <div>
                      <span className="block font-bold leading-none text-white text-ms font-display">Polisul</span>
                      <span className="block text-[9px] tracking-[2px] text-green-100 font-medium">Indústria e Comércio de Alimentos </span>
                    </div>
                  </div>
          <p className="mb-5 text-sm leading-relaxed text-white/55">
            Do campo à sua mesa com qualidade e responsabilidade.
          </p>
          <div className="flex gap-2.5">
            <a href={`https://wa.me/${empresa.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className="flex items-center justify-center transition-colors rounded-lg w-9 h-9 bg-white/10 hover:bg-white/20">
              <FiMessageCircle size={16} />
            </a>
            <a href={`mailto:${empresa.email}`} aria-label="E-mail"
              className="flex items-center justify-center transition-colors rounded-lg w-9 h-9 bg-white/10 hover:bg-white/20">
              <FiMail size={16} />
            </a>
          </div>
        </div>

        {/* Navegação */}
        <div>
          <h4 className="mb-4 text-xs font-medium tracking-widest text-green-100 uppercase">Navegação</h4>
          <div className="flex flex-col gap-2.5">
            {['sobre','processo','produtos','diferenciais','faq','contato'].map(to => (
              <Link key={to} to={to} smooth duration={600} offset={-80}
                className="text-sm capitalize transition-colors cursor-pointer text-white/60 hover:text-white">
                {to}
              </Link>
            ))}
          </div>
        </div>

        {/* Produtos */}
        <div>
          <h4 className="mb-4 text-xs font-medium tracking-widest text-green-100 uppercase">Produtos</h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/60">
            {empresa.marcas.map(p => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>

        {/* Contato */}
        <div>
          <h4 className="mb-4 text-xs font-medium tracking-widest text-green-100 uppercase">Contato</h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/60">
            <a href={`https://wa.me/${empresa.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white"><FiPhone size={13} className="text-green-200" />{empresa.telefone}</a>
            <a href={`mailto:${empresa.email}`} className="flex items-center gap-2 break-all hover:text-white"><FiMail size={13} className="text-green-200" />{empresa.email}</a>
            <span className="flex items-center gap-2"><FiMapPin size={13} className="text-green-200" />{empresa.local}</span>
            <span className="flex items-center gap-2"><FiClock size={13} className="text-green-200" />{empresa.horario}</span>
          </div>
        </div>
      </div>

      <div className="py-4 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between max-w-6xl gap-2 px-6 mx-auto text-xs text-white/40">
          <span>© {new Date().getFullYear()} Polisul Alimentos. Todos os direitos reservados.</span>
          <span>Desenvolvido por Henrique Pereira</span>
        </div>
      </div>
    </footer>
  );
}
