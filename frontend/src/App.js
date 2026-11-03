import React, { Suspense, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Fatos from './components/Fatos/Fatos';
import Carrossel from './components/Carrossel/Carrossel';
import Sobre from './components/Sobre/Sobre';
import Processo from './components/Processo/Processo';
import Mercados from './components/Mercados/Mercados';
import Faq from './components/Faq/Faq';
import WhatsApp from './components/WhatsApp/WhatsApp';
import CtaFinal from './components/CtaFinal/CtaFinal';
import Produtos from './components/Produtos/Produtos';
import { Diferenciais } from './components/Diferenciais/Diferenciais';
import { Numeros } from './components/Numeros/Numeros';
import Contato from './components/Contato/Contato';
import { Footer } from './components/Footer/Footer';
import Novidades from './components/Novidades/Novidades';
import './index.css';

const AdminApp = React.lazy(() => import('./admin/AdminApp'));
const Privacidade = React.lazy(() => import('./pages/Privacidade'));

const caminhoAtual = () => window.location.pathname.replace(/\/+$/, '');

function App() {
  const caminho = caminhoAtual();

  // O painel administrativo não deve aparecer em buscas.
  useEffect(() => {
    if (caminho !== '/admin') return;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [caminho]);

  if (caminho === '/privacidade') {
    return <Suspense fallback={null}><Privacidade /></Suspense>;
  }
  if (caminho === '/admin') {
    return <Suspense fallback={null}><AdminApp /></Suspense>;
  }
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Fatos />
        <Carrossel />
        <Sobre />
        <Processo />
        <Produtos />
        <Novidades />
        <Diferenciais />
        <Mercados />
        <Numeros />
        <Faq />
        <CtaFinal />
        <Contato />
      </main>
      <Footer />
      <WhatsApp />
    </>
  );
}

export default App;
