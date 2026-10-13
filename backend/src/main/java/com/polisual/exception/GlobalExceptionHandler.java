package com.polisual.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Trata TODAS as exceções da API de forma centralizada.
 *
 * Segurança: nunca expõe stack trace, detalhes internos ou tecnologias usadas.
 * Retorna apenas mensagens genéricas ou de validação para o cliente.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Erros de validação (@Valid) — retorna quais campos falharam
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> errosCampos = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String campo = ((FieldError) error).getField();
            String mensagem = error.getDefaultMessage();
            errosCampos.put(campo, mensagem);
        });
        return resposta(400, "Dados inválidos", errosCampos);
    }

    // Credenciais erradas no login
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleCredenciais(BadCredentialsException ex) {
        log.warn("Tentativa de login com credenciais inválidas");
        return resposta(401, "E-mail ou senha incorretos", null);
    }

    // Acesso negado (token válido mas sem permissão)
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, Object> handleAcesso(AccessDeniedException ex) {
        return resposta(403, "Você não tem permissão para acessar este recurso", null);
    }

    // Erros genéricos — nunca expõe detalhes internos
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleGeral(Exception ex) {
        log.error("Erro interno não tratado: {}", ex.getMessage(), ex);
        return resposta(500, "Ocorreu um erro interno. Tente novamente mais tarde.", null);
    }

    private Map<String, Object> resposta(int status, String mensagem, Object detalhes) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", status);
        body.put("erro", mensagem);
        body.put("timestamp", LocalDateTime.now().toString());
        if (detalhes != null) body.put("detalhes", detalhes);
        return body;
    }
}
