# Polisul — o que falta para ficar completo e em produção

Legenda: 🔴 fazer antes de publicar · 🟡 importante · 🟢 melhoria

## 1. Contato por e-mail (feito, falta configurar)
- [x] Backend envia e-mail para `polisulalimentos@polisulalimentos.com.br` a cada contato (`EmailService`).
- [ ] 🔴 Preencher `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` (e `MAIL_FROM`) no `.env` — modelo em `.env.example`.
      Sem isso a mensagem é salva no banco, mas o e-mail NÃO sai (aparece aviso no log).
- [ ] 🔴 Testar de ponta a ponta: enviar o formulário → conferir caixa de entrada (e spam).
- [ ] 🟡 Configurar SPF/DKIM do domínio `polisulalimentos.com.br` para o e-mail não cair no spam.

## 2. Segurança (antes de publicar)
- [ ] 🔴 Trocar a senha do admin padrão (`admin@polisual.com.br` / `Admin@2024`, está em `docker/init.sql`, é pública).
- [ ] 🔴 Gerar `JWT_SECRET` forte (`openssl rand -base64 48`) e senhas do MySQL no `.env`.
      O `application.properties` tem valores padrão fracos — remover os fallbacks em produção.
- [ ] 🔴 `CORS_ALLOWED_ORIGINS` = domínio real do site (https://...).
- [ ] 🔴 HTTPS (certificado Let's Encrypt) — hoje o nginx só escuta na porta 80. Depois ativar HSTS.
- [ ] 🟡 Não expor a porta 3307 do MySQL e a 8080 do backend na internet (remover `ports:` no compose; só o nginx na 80/443).
- [ ] 🟡 Backup automático do MySQL (volume `mysql_data`).

## 3. Administração (hoje não existe tela)
- [ ] 🟡 Tela de login + painel para: ver mensagens recebidas, cadastrar/editar produtos e fotos.
      (API pronta: `POST /api/auth/login`, `GET /api/contatos`, produtos.) Hoje só dá para mexer via banco.
- [ ] 🟢 Marcar mensagem como "respondida".

## 4. Conteúdo do site (confirmar com a empresa)
- [ ] 🔴 Confirmar números do site: 50 mil t/ano, 300+ clientes, 10+ países, "padrões MAPA", "qualidade certificada",
      "análises laboratoriais em cada lote", "rastreabilidade total", "marca própria", "1kg ao granel". Remover o que não for real.
- [ ] 🟡 Fotos reais dos produtos por marca (hoje 3 fotos genéricas servem a todos) — ver `docker/init.sql`.
- [ ] 🟡 Horário de atendimento real; endereço completo da fábrica (e mapa do Google).
- [ ] 🟡 Redes sociais reais (Instagram/Facebook) para o rodapé.
- [ ] 🟡 Página/trecho de Política de Privacidade (LGPD) e aviso no formulário.
- [ ] 🟢 Depoimentos/logos de clientes — somente com autorização.
- [ ] 🟢 Versão em espanhol (mercado peruano / Añejo).

## 5. Site / SEO / desempenho
- [ ] 🟡 Título, descrição e imagem de compartilhamento (Open Graph) para WhatsApp/Google.
- [ ] 🟡 `sitemap.xml` + `robots.txt`; cadastrar no Google Search Console e Google Meu Negócio (Pelotas).
- [ ] 🟡 Google Analytics (ou Plausible) para medir visitas e cliques no WhatsApp.
- [ ] 🟡 Reduzir peso do vídeo do hero para celular (versão menor) e garantir poster rápido.
- [ ] 🟢 Fontes hospedadas no próprio site (hoje vêm do Google Fonts).

## 6. Publicação
- [ ] 🔴 Servidor/VPS com Docker, domínio apontado (DNS) e `docker compose up -d --build`.
- [ ] 🟡 Rotina de atualização (git + deploy) e monitoramento (aviso se o site cair).
- [ ] 🟢 Testes automatizados do backend (contato, login) e CI.
