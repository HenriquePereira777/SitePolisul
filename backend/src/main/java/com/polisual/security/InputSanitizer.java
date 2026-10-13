package com.polisual.security;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;

/**
 * Utilitário de sanitização de entradas.
 *
 * Protege contra:
 *  - XSS (Cross-Site Scripting): remove tags HTML e scripts maliciosos
 *  - Injeção de conteúdo: normaliza strings
 *
 * Nota: SQL Injection já é prevenido pelo JPA/Hibernate com Prepared Statements.
 */
@Component
public class InputSanitizer {

    /**
     * Remove TODA tag HTML — usado para campos de texto simples
     * como nome, e-mail, telefone.
     */
    public String sanitizeText(String input) {
        if (input == null) return null;
        return Jsoup.clean(input.trim(), Safelist.none());
    }

    /**
     * Permite apenas formatação básica (negrito, itálico, links seguros).
     * Usado para campos de mensagem/descrição.
     */
    public String sanitizeMessage(String input) {
        if (input == null) return null;
        return Jsoup.clean(
            input.trim(),
            Safelist.basic()    // permite <b>, <i>, <u>, <a> com rel="nofollow"
                    .removeTags("a")    // remove links completamente
        );
    }

    /**
     * Sanitiza strings que virão para o banco mas podem ter conteúdo rico.
     */
    public String sanitizeRich(String input) {
        if (input == null) return null;
        return Jsoup.clean(input.trim(), Safelist.basicWithImages());
    }

    /**
     * Valida e normaliza e-mail — não executa sanitização HTML pois
     * o Bean Validation já trata isso, mas garante lowercase e trim.
     */
    public String sanitizeEmail(String input) {
        if (input == null) return null;
        return input.trim().toLowerCase();
    }
}
