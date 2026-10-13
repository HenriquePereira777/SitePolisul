package com.polisual.controller;

import com.polisual.dto.AuthDTO;
import com.polisual.dto.ContatoDTO;
import com.polisual.model.Contato;
import com.polisual.model.Produto;
import com.polisual.service.AuthService;
import com.polisual.service.ContatoService;
import com.polisual.service.ProdutoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ─────────────────────────────────────────────────────────────────────────────
// AUTH CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.LoginResponse> login(@Valid @RequestBody AuthDTO.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request.getEmail(), request.getSenha()));
    }
}

