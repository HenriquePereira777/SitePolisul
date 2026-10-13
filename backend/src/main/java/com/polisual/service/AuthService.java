package com.polisual.service;

import com.polisual.dto.AuthDTO;
import com.polisual.model.Usuario;
import com.polisual.repository.UsuarioRepository;
import com.polisual.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService  {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;


    public AuthDTO.LoginResponse login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            log.warn("Tentativa de login com senha incorreta: {}", email);
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = jwtService.generateToken(usuario);
        log.info("Login bem-sucedido: {}", email);

        return new AuthDTO.LoginResponse(token, usuario.getEmail(), usuario.getRole().name(), expirationMs);
    }
}

