import React, { useEffect, useRef } from 'react';
import { Link } from 'react-scroll';

export default function Hero() {
  const videoRef = useRef(null);

  // Respeita quem prefere menos movimento: fica só a imagem de capa
  useEffect(() => {
    const v = videoRef.current;
    if (v && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
    }
  }, []);

  return (
    <section id="hero" className="relative flex flex-col lg:flex-row lg:items-center lg:min-h-screen overflow-hidden pt-[72px] bg-green-900">
      {/* Vídeo de fundo em loop, sem áudio (versão sem trilha sonora) */}
      <video
        ref={videoRef}
        className="relative w-full aspect-[16/9] object-cover object-center lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-10 lg:aspect-auto lg:h-[calc(100%-2.5rem)]"
        src="/videos/polisul-hero.mp4"
        poster="/videos/polisul-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {/* Escurece o vídeo para o texto ficar legível */}
      <div className="hidden lg:block absolute inset-x-0 top-0 bottom-10 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

      <div className="relative z-10 w-full max-w-6xl px-6 pt-8 pb-24 mx-auto lg:pt-16 lg:pb-28">
        <div className="max-w-2xl animate-fade-in">
          <span className="section-tag !text-green-100">Do campo à sua mesa</span>
          <h1 className="mb-5 text-4xl font-bold leading-tight text-white font-display md:text-5xl xl:text-6xl">
            Alimentos de qualidade,<br />direto da terra gaúcha
          </h1>
          <p className="max-w-md mb-8 text-base leading-relaxed text-white/90">
            Mais de 20 anos de mercado levando arroz de qualidade constante,
            da região arrozeira de Pelotas para a mesa das famílias.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="produtos" smooth duration={600} offset={-80} className="btn-primary">
              Conheça os produtos
            </Link>
            <Link to="sobre" smooth duration={600} offset={-80}
              className="btn-outline !text-white !border-white hover:!bg-white/20">
              Nossa história
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
