import React, { useEffect, useRef, useState } from 'react';

// Aparece suavemente (fade + sobe) quando entra na tela. Sem JS/IntersectionObserver, já aparece.
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(
    typeof window === 'undefined' || !('IntersectionObserver' in window)
  );

  useEffect(() => {
    if (visivel) return undefined;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisivel(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [visivel]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visivel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
