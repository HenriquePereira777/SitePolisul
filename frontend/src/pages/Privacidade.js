import React, { useEffect } from 'react';
import { empresa } from '../config/empresa';
import logoPolisul from '../components/images/logo-polisul.webp';

const ATUALIZADO_EM = '3 de novembro de 2026';

const SECOES = [
  {
    titulo: '1. Quem é o responsável pelos seus dados',
    texto: [
      `A ${empresa.nomeCompleto}, de ${empresa.local}, é a responsável pelo tratamento dos dados pessoais coletados neste site, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).`,
      `Para qualquer assunto sobre seus dados, escreva para ${empresa.email}.`,
    ],
  },
  {
    titulo: '2. Quais dados coletamos',
    lista: [
      'Dados que você informa no formulário de contato: nome, e-mail, telefone (opcional), empresa (opcional) e a mensagem que você escrever.',
      'Dados técnicos de acesso, como endereço IP, tipo de navegador e data e hora do acesso, que os servidores podem registrar para segurança e funcionamento do site.',
      'Se você clicar nos botões de WhatsApp, a conversa acontece no WhatsApp e passa a seguir as regras e a política de privacidade dele.',
    ],
  },
  {
    titulo: '3. Para que usamos',
    lista: [
      'Responder à sua mensagem e enviar propostas comerciais.',
      'Manter o relacionamento comercial com distribuidores, redes, cooperativas e exportadores que nos procuram.',
      'Manter o site seguro e funcionando.',
    ],
    texto: ['Não vendemos seus dados e não os usamos para publicidade de terceiros.'],
  },
  {
    titulo: '4. Base legal',
    texto: [
      'Tratamos os dados do formulário com base no seu consentimento, dado quando você marca a caixa de concordância e envia a mensagem, e para dar andamento ao contato ou à proposta que você pediu. Os registros técnicos de acesso são tratados para a segurança do site, por legítimo interesse.',
    ],
  },
  {
    titulo: '5. Com quem compartilhamos',
    texto: [
      'Os dados ficam em servidores de hospedagem na nuvem da Oracle Cloud Infrastructure, em data center no Brasil (São Paulo), inclusive nas cópias de segurança. Também podemos compartilhar dados quando a lei ou uma autoridade exigir.',
    ],
  },
  {
    titulo: '6. Por quanto tempo guardamos',
    texto: [
      'Guardamos seus dados pelo tempo necessário para atender ao seu contato e manter o relacionamento comercial, ou pelo prazo exigido por lei. Depois disso, eles são eliminados ou anonimizados.',
    ],
  },
  {
    titulo: '7. Cookies',
    texto: [
      'Este site não usa cookies de publicidade nem de análise de audiência. As fontes de letra e os vídeos são servidos pelo próprio site. O painel administrativo, de uso interno da empresa, guarda apenas uma sessão temporária no navegador de quem faz login.',
    ],
  },
  {
    titulo: '8. Como protegemos',
    texto: [
      'O site usa conexão segura (HTTPS), e o acesso aos contatos recebidos é restrito a usuários autorizados da empresa, com login. Nenhum sistema é totalmente livre de riscos, mas trabalhamos para manter as proteções atualizadas.',
    ],
  },
  {
    titulo: '9. Seus direitos',
    texto: ['Você pode pedir, a qualquer momento e sem custo:'],
    lista: [
      'confirmação de que tratamos seus dados e acesso a eles;',
      'correção de dados incompletos, inexatos ou desatualizados;',
      'anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desacordo com a lei;',
      'portabilidade dos dados, conforme a regulamentação;',
      'informação sobre com quem compartilhamos seus dados;',
      'eliminação dos dados tratados com base no consentimento e revogação do consentimento.',
    ],
    depois: [`Para fazer um pedido, escreva para ${empresa.email}. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).`],
  },
  {
    titulo: '10. Mudanças nesta política',
    texto: ['Podemos atualizar esta política. A data da última atualização aparece no topo desta página.'],
  },
];

export default function Privacidade() {
  useEffect(() => {
    document.title = 'Política de Privacidade | Polisul Alimentos';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="flex items-center justify-between max-w-3xl px-6 py-4 mx-auto">
          <a href="/" className="flex items-center gap-2.5" aria-label="Voltar ao site da Polisul">
            <img src={logoPolisul} alt="" className="object-contain w-10 h-10" />
            <span className="text-lg font-bold text-green-900 font-display">Polisul</span>
          </a>
          <a href="/" className="text-sm font-medium text-green-800 hover:underline">← Voltar ao site</a>
        </div>
      </header>

      <main className="max-w-3xl px-6 py-12 mx-auto md:py-16">
        <h1 className="mb-2 text-3xl text-green-900 md:text-4xl">Política de Privacidade</h1>
        <p className="mb-10 text-sm text-gray-500">Última atualização: {ATUALIZADO_EM}</p>

        {SECOES.map(s => (
          <section key={s.titulo} className="mb-8">
            <h2 className="mb-3 text-xl text-green-900">{s.titulo}</h2>
            {s.texto && s.texto.map(t => <p key={t} className="mb-3 leading-relaxed text-gray-600">{t}</p>)}
            {s.lista && (
              <ul className="pl-5 mb-3 space-y-2 leading-relaxed text-gray-600 list-disc">
                {s.lista.map(i => <li key={i}>{i}</li>)}
              </ul>
            )}
            {s.depois && s.depois.map(t => <p key={t} className="mb-3 leading-relaxed text-gray-600">{t}</p>)}
          </section>
        ))}
      </main>

      <footer className="py-6 text-xs text-center text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} {empresa.nomeCompleto}
      </footer>
    </div>
  );
}
