package com.polisual.controller;

import com.polisual.dto.ContatoDTO;
import com.polisual.model.Contato;
import com.polisual.service.ContatoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ─────────────────────────────────────────────────────────────────────────────
// CONTATO CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/contatos")
@RequiredArgsConstructor
public class ContatoController {

    private final ContatoService contatoService;

    // Público — formulário do site
    @PostMapping
    public ResponseEntity<Map<String,String>> enviar(
            @Valid @RequestBody ContatoDTO.Request dto,
            HttpServletRequest request) {

        String ip = obterIp(request);
        contatoService.salvar(dto, ip);
        return ResponseEntity.ok(Map.of("mensagem", "Mensagem enviada com sucesso!"));
    }

    // Protegido — somente admin vê as mensagens
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Contato>> listar() {
        return ResponseEntity.ok(contatoService.listarTodos());
    }

    private String obterIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null) return forwarded.split(",")[0].trim();
        return request.getRemoteAddr();
    }
}
