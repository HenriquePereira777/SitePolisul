package com.polisual.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate Limiting por IP usando Bucket4j (token bucket algorithm).
 *
 * Regras:
 *  - POST /api/contatos  → máx 5 req/minuto por IP (anti-spam formulário)
 *  - POST /api/auth/**   → máx 10 req/minuto por IP (anti brute-force login)
 *  - Demais endpoints    → máx 100 req/minuto por IP
 */
@Component
@Order(1)
@Slf4j
public class RateLimitFilter implements Filter {

    @Value("${app.rate-limit.contato.capacity:5}")
    private int contatoCapacity;

    @Value("${app.rate-limit.contato.refill-minutes:1}")
    private int contatoRefill;

    @Value("${app.rate-limit.api.capacity:100}")
    private int apiCapacity;

    @Value("${app.rate-limit.api.refill-minutes:1}")
    private int apiRefill;

    // Mapa: IP -> Bucket (para contato)
    private final Map<String, Bucket> contatoBuckets = new ConcurrentHashMap<>();
    // Mapa: IP -> Bucket (para auth)
    private final Map<String, Bucket> authBuckets = new ConcurrentHashMap<>();
    // Mapa: IP -> Bucket (geral)
    private final Map<String, Bucket> apiBuckets = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  request  = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String ip     = getClientIp(request);
        String method = request.getMethod();
        String path   = request.getRequestURI();

        Bucket bucket;

        if ("POST".equalsIgnoreCase(method) && path.startsWith("/api/contatos")) {
            bucket = contatoBuckets.computeIfAbsent(ip, k -> buildBucket(contatoCapacity, contatoRefill));
        } else if (path.startsWith("/api/auth")) {
            bucket = authBuckets.computeIfAbsent(ip, k -> buildBucket(10, 1));
        } else {
            bucket = apiBuckets.computeIfAbsent(ip, k -> buildBucket(apiCapacity, apiRefill));
        }

        if (bucket.tryConsume(1)) {
            // Adiciona header informativo
            response.setHeader("X-Rate-Limit-Remaining", String.valueOf(bucket.getAvailableTokens()));
            chain.doFilter(req, res);
        } else {
            log.warn("Rate limit atingido — IP: {} | {} {}", ip, method, path);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                "{\"erro\":\"Muitas requisições. Aguarde um momento e tente novamente.\",\"status\":429}"
            );
        }
    }

    private Bucket buildBucket(int capacity, int refillMinutes) {
        Bandwidth limit = Bandwidth.classic(
            capacity,
            Refill.greedy(capacity, Duration.ofMinutes(refillMinutes))
        );
        return Bucket.builder().addLimit(limit).build();
    }

    private String getClientIp(HttpServletRequest request) {
        // Respeita proxies reversos (nginx, load balancer)
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }
}
