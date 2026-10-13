/**
 * security.js — Utilitários de segurança do lado cliente
 *
 * Camadas implementadas:
 *  1. Sanitização de saída com DOMPurify (anti-XSS)
 *  2. Validação de inputs no frontend (dupla validação — backend valida também)
 *  3. Proteção de tokens JWT (armazenamento seguro)
 *  4. Headers de segurança nas requisições axios
 *  5. Proteção contra clickjacking via CSP (configurado no nginx)
 */

import DOMPurify from 'dompurify';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// 1. SANITIZAÇÃO DE OUTPUT (anti-XSS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sanitiza string antes de renderizar no DOM.
 * Use sempre que exibir dados vindos da API ou de inputs do usuário.
 */
export function sanitize(text) {
  if (!text) return '';
  return DOMPurify.sanitize(String(text), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Sanitiza mas mantém formatação básica (negrito, itálico).
 */
export function sanitizeBasic(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. VALIDAÇÕES CLIENT-SIDE
// ─────────────────────────────────────────────────────────────────────────────

export const validators = {
  nome: (v) => {
    if (!v?.trim()) return 'Nome é obrigatório';
    if (v.trim().length < 2) return 'Nome muito curto';
    if (v.trim().length > 100) return 'Nome muito longo';
    if (!/^[\p{L}\s.'-]+$/u.test(v)) return 'Nome contém caracteres inválidos';
    return null;
  },
  email: (v) => {
    if (!v?.trim()) return 'E-mail é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'E-mail inválido';
    return null;
  },
  telefone: (v) => {
    if (!v) return null; // opcional
    if (!/^[\d\s()+-]*$/.test(v)) return 'Telefone inválido';
    return null;
  },
  mensagem: (v) => {
    if (!v?.trim()) return 'Mensagem é obrigatória';
    if (v.trim().length < 10) return 'Mensagem muito curta (mínimo 10 caracteres)';
    if (v.trim().length > 2000) return 'Mensagem muito longa (máximo 2000 caracteres)';
    return null;
  },
};

export function validarContato(form) {
  const erros = {};
  const campos = ['nome', 'email', 'telefone', 'mensagem'];
  campos.forEach(campo => {
    const erro = validators[campo]?.(form[campo]);
    if (erro) erros[campo] = erro;
  });
  return erros;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GERENCIAMENTO SEGURO DE TOKEN JWT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Armazenamento em memória (mais seguro que localStorage contra XSS).
 * O token é perdido ao fechar o navegador — adequado para admins.
 * Para persistência use httpOnly cookies (requer mudança no backend).
 */
let _token = null;
try { _token = sessionStorage.getItem('polisul_admin_token'); } catch { /* ignora */ }

export const tokenService = {
  set(token) {
    _token = token;
    try { sessionStorage.setItem('polisul_admin_token', token); } catch { /* ignora */ }
  },
  get() {
    return _token;
  },
  clear() {
    _token = null;
    try { sessionStorage.removeItem('polisul_admin_token'); sessionStorage.removeItem('polisul_admin_user'); } catch { /* ignora */ }
  },
  isValid() {
    if (!_token) return false;
    try {
      // Decodifica payload do JWT (sem verificar assinatura — apenas para expiração)
      const payload = JSON.parse(atob(_token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. AXIOS COM HEADERS DE SEGURANÇA
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // ajuda a distinguir requisições AJAX
  },
});

// Interceptor: injeta token JWT automaticamente se disponível
api.interceptors.request.use(config => {
  const token = tokenService.get();
  if (token && tokenService.isValid()) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: trata 401 globalmente (redireciona para login)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      tokenService.clear();
      // Se tiver rota de login: window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
