# Polisul — site institucional e painel administrador

Site da Polisul (Pelotas/RS): landing page institucional com catálogo de produtos,
formulário de contato por e-mail e painel administrador para editar o conteúdo.

## Tecnologias
- **Frontend:** React 18 + Tailwind CSS
- **Backend:** Spring Boot 3 (Java 17), Spring Security + JWT
- **Banco:** MySQL 8
- **Infra:** Docker Compose (MySQL + backend + frontend/nginx)

## Como rodar
1. Crie um arquivo `.env` na raiz com as variáveis abaixo (o `.env` nunca vai para o Git):
   `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD`, `JWT_SECRET` (mín. 64 caracteres),
   `CORS_ALLOWED_ORIGINS`, `REACT_APP_API_URL`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`,
   `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_TO`, `MAIL_SSL`, `MAIL_STARTTLS`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Suba tudo:
   ```
   docker compose up -d --build
   ```
3. Site: http://localhost — Painel: http://localhost/admin

## Painel administrador (`/admin`)
- Produtos (nome, foto, descrição, embalagens, visibilidade)
- Publicações (seção "Novidades" do site)
- Fotos do carrossel da página inicial
- Mensagens recebidas pelo formulário
- Usuários (perfis Administrador e Editor)

O primeiro administrador é criado a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env`.

## Estrutura
```
backend/    API Spring Boot
frontend/   Site React + painel admin
docker/     Scripts SQL (criação e carga do catálogo)
```
