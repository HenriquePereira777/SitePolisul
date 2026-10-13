import React, { useCallback, useEffect, useRef, useState } from 'react';
import api from '../../utils/security';
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiVolume2 } from 'react-icons/fi';

const INTERVALO_MS = 6000;
const INTERVALO_VIDEO_MS = 9000;

// Textos baseados na narração do vídeo institucional.
const SLIDES_PADRAO = [
  { tipo: 'video', tag: 'Vídeo institucional', titulo: 'Conheça a Polisul por dentro',
    texto: 'Veja a nossa estrutura, a produção e o cuidado com a qualidade do arroz.' },
  { img: '/images/destaques/pelotas.jpg', tag: 'Onde estamos', titulo: 'Pelotas, no sul do Brasil',
    texto: 'Uma região arrozeira por excelência, com mais de 20 anos de experiência no mercado brasileiro.' },
  { img: '/images/destaques/rio-grande.jpg', tag: 'Logística', titulo: 'A 70 km do Porto de Rio Grande',
    texto: 'Localização estratégica para produzir e distribuir com eficiência.' },
  { img: '/images/destaques/alta-qualidade.jpg', tag: 'Produtos', titulo: 'Produtos de alta qualidade',
    texto: 'Conhecimento aplicado em toda a linha de produção e distribuição.' },
  { img: '/images/destaques/tecnologia.jpg', tag: 'Produção', titulo: 'Tecnologia de última geração',
    texto: 'Os grãos são minuciosamente selecionados, graças ao forte investimento em tecnologia.' },
  { img: '/images/destaques/controle-qualidade.jpg', tag: 'Qualidade', titulo: 'Qualidade constante',
    texto: 'Controle de qualidade feito periodicamente, sem misturas de variedades e sem aditivos.' },
  { img: '/images/destaques/anejo.jpg', tag: 'Polisul Añejo', titulo: 'Naturalmente puro, de grãos finos',
    texto: 'Alto rendimento no cozimento em cada pacote.' },
];

// Vídeo roda sozinho (mudo, em loop) enquanto o slide está ativo.
// O visitante pode ativar o som: aí o vídeo recomeça com controles e o carrossel espera terminar.
function SlideVideo({ ativo, comSom, onSom, onFim }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (ativo) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [ativo]);

  const ativarSom = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.loop = false;
    v.controls = true;
    v.currentTime = 0;
    v.play().catch(() => {});
    onSom(true);
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 object-cover w-full h-full bg-black"
        src="/videos/polisul-institucional.mp4"
        poster="/videos/polisul-poster.jpg"
        muted loop={!comSom} playsInline preload="auto" aria-hidden={!comSom}
        onEnded={() => { const v = ref.current; if (v) { v.muted = true; v.controls = false; v.loop = true; } onFim(); }}
      />
      {!comSom && (
        <button type="button" onClick={ativarSom}
          className="absolute z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-900 transition-colors rounded-full shadow-md top-4 left-4 bg-white/90 hover:bg-white">
          <FiVolume2 size={16} /> Ouvir com som
        </button>
      )}
    </>
  );
}

export default function Carrossel() {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);        // botão pausar/continuar
  const [videoAtivo, setVideoAtivo] = useState(false);   // vídeo tocando com som
  const [reduzMovimento, setReduzMovimento] = useState(false);
  const toqueX = useRef(null);
  const [slides, setSlides] = useState(SLIDES_PADRAO);
  const total = slides.length;

  // Slides cadastrados no painel admin (o vídeo continua como primeiro). Sem nenhum cadastrado, usa os padrão.
  useEffect(() => {
    api.get('/api/banners').then(r => {
      if (Array.isArray(r.data) && r.data.length > 0) {
        setSlides([SLIDES_PADRAO[0], ...r.data.map(b => ({ img: b.imagemUrl, tag: b.tag || '', titulo: b.titulo, texto: b.texto || '' }))]);
        setAtual(0);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setReduzMovimento(!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const ir = useCallback(i => { setVideoAtivo(false); setAtual((i + total) % total); }, [total]);

  useEffect(() => {
    if (pausado || videoAtivo || reduzMovimento) return undefined;
    const ms = slides[atual].tipo === 'video' ? INTERVALO_VIDEO_MS : INTERVALO_MS;
    const id = setTimeout(() => ir(atual + 1), ms);
    return () => clearTimeout(id);
  }, [atual, pausado, videoAtivo, reduzMovimento, ir, slides]);

  const onKeyDown = e => {
    if (e.key === 'ArrowLeft')  ir(atual - 1);
    if (e.key === 'ArrowRight') ir(atual + 1);
  };
  const onTouchStart = e => { toqueX.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (toqueX.current == null) return;
    const dx = e.changedTouches[0].clientX - toqueX.current;
    if (Math.abs(dx) > 50) ir(atual + (dx < 0 ? 1 : -1));
    toqueX.current = null;
  };

  return (
    <section id="destaques" className="py-20 bg-white" aria-roledescription="carrossel" aria-label="Destaques da Polisul">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="mb-9">
          <span className="section-tag">Conheça a Polisul</span>
          <h2 className="text-3xl text-green-900 font-display md:text-4xl">Do campo ao pacote, com qualidade</h2>
        </div>

        <div
          className="relative overflow-hidden shadow-lg rounded-2xl bg-green-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Trilho dos slides */}
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${atual * 100}%)` }}
          >
            {slides.map((s, i) => (
              <div
                key={s.titulo}
                className="relative flex-shrink-0 w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[1920/974]"
                role="group" aria-roledescription="slide" aria-label={`${i + 1} de ${total}`}
                aria-hidden={i !== atual}
              >
                {s.tipo === 'video'
                  ? <SlideVideo ativo={i === atual} comSom={videoAtivo && i === atual}
                      onSom={setVideoAtivo} onFim={() => { setVideoAtivo(false); ir(atual + 1); }} />
                  : <img src={s.img} alt={s.titulo} loading={i <= 1 ? 'eager' : 'lazy'} className="object-cover w-full h-full" />}

                {/* Legenda (some enquanto o vídeo toca, para não cobrir os controles) */}
                {!(s.tipo === 'video' && videoAtivo && i === atual) && (
                  <div className="absolute inset-x-0 bottom-0 p-6 pt-24 pointer-events-none md:p-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <span className="text-xs font-medium tracking-widest text-green-100 uppercase">{s.tag}</span>
                    <h3 className="mt-1 mb-2 text-2xl font-bold text-white md:text-4xl">{s.titulo}</h3>
                    <p className="max-w-xl text-sm text-white/90 md:text-base">{s.texto}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Barra de progresso do slide */}
          {!pausado && !videoAtivo && !reduzMovimento && (
            <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-white/20">
              <div key={atual} className="h-full bg-gold-300 origin-left"
                style={{ animation: `progresso ${slides[atual].tipo === 'video' ? INTERVALO_VIDEO_MS : INTERVALO_MS}ms linear forwards` }} />
            </div>
          )}

          {/* Setas */}
          <button type="button" onClick={() => ir(atual - 1)} aria-label="Slide anterior"
            className="absolute z-10 flex items-center justify-center w-11 h-11 text-white -translate-y-1/2 rounded-full top-1/2 left-3 bg-black/40 hover:bg-black/70 transition-colors">
            <FiChevronLeft size={24} />
          </button>
          <button type="button" onClick={() => ir(atual + 1)} aria-label="Próximo slide"
            className="absolute z-10 flex items-center justify-center w-11 h-11 text-white -translate-y-1/2 rounded-full top-1/2 right-3 bg-black/40 hover:bg-black/70 transition-colors">
            <FiChevronRight size={24} />
          </button>

          {/* Bolinhas */}
          <div className="absolute z-10 flex items-center gap-2 top-4 right-4">
            <button type="button" onClick={() => setPausado(p => !p)}
              aria-label={pausado ? 'Retomar rotação automática' : 'Pausar rotação automática'}
              className="flex items-center justify-center w-7 h-7 mr-1 text-white rounded-full bg-black/40 hover:bg-black/70">
              {pausado ? <FiPlay size={13} className="ml-0.5" /> : <FiPause size={13} />}
            </button>
            {slides.map((s, i) => (
              <button key={s.titulo} type="button" onClick={() => ir(i)}
                aria-label={`Ir para o slide ${i + 1}`} aria-current={i === atual}
                className={`h-2.5 rounded-full transition-all ${i === atual ? 'w-7 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
