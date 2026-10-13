# Polisul — site institucional e painel administrador

Site da Polisul (Pelotas/RS): landing page institucional com catálogo de produtos,
formulário de contato por e-mail e painel administrador para editar o conteúdo.

## Tecnologias
- **Frontend:** React 18 + Tailwind CSS
- **Backend:** Spring Boot 3 (Java 17), Spring Security + JWT
- **Banco:** MySQL 8
- **Infra:** Docker Compose (MySQL + backend + frontend/nginx)

## Como rodar
1. Copie `.env.example` para `.env` e preencha as senhas (o `.env` nunca vai para o Git).
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
