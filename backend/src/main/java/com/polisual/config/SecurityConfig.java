package com.polisual.config;

import com.polisual.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ── Desabilita CSRF (API stateless usa JWT) ──────────────────────
            .csrf(AbstractHttpConfigurer::disable)

            // ── CORS configurado via bean abaixo ──────────────────────────────
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ── Sessão stateless (JWT, sem HttpSession) ───────────────────────
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ── Regras de autorização ─────────────────────────────────────────
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos (leitura e formulário de contato)
                .requestMatchers(HttpMethod.GET,  "/api/produtos/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/banners/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/publicacoes/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contatos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                // Tudo mais exige autenticação (admin)
                .anyRequest().authenticated()
            )

            // ── Headers de segurança HTTP ─────────────────────────────────────
            .headers(headers -> headers
                // Previne clickjacking
                .frameOptions(f -> f.deny())
                // Força HTTPS por 1 ano (ative em produção com HTTPS)
                // .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
                // Bloqueia MIME sniffing
                .contentTypeOptions(c -> {})
                // Política de referrer segura
                .referrerPolicy(r -> r.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                // Content Security Policy
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                    "default-src 'self'; " +
                    "script-src 'self'; " +
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                    "font-src 'self' https://fonts.gstatic.com; " +
                    "img-src 'self' data: https:; " +
                    "connect-src 'self'; " +
                    "frame-ancestors 'none';"
                ))
            )

            // ── Filtro JWT antes do filtro padrão de autenticação ─────────────
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Apenas origens configuradas são permitidas
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt com custo 12 — adequado para produção
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
