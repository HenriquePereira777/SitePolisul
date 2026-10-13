package com.polisual.controller;

import com.polisual.model.Usuario;
import com.polisual.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Gestão de quem tem acesso ao painel. Somente ADMIN. Nunca devolve o hash da senha.
@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UsuarioAdminController {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    private static Map<String, Object> vista(Usuario u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("email", u.getEmail());
        m.put("role", u.getRole().name());
        m.put("ativo", Boolean.TRUE.equals(u.getAtivo()));
        m.put("criadoEm", u.getCriadoEm());
        return m;
    }

    private static ResponseEntity<?> erro(String msg) {
        return ResponseEntity.badRequest().body(Map.of("mensagem", msg));
    }

    @GetMapping
    public List<Map<String, Object>> listar() {
        return repo.findAll().stream().map(UsuarioAdminController::vista).toList();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, String> b) {
        String email = b.getOrDefault("email", "").trim().toLowerCase();
        String senha = b.getOrDefault("senha", "");
        String role = b.getOrDefault("role", "EDITOR");
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") || email.length() > 100) return erro("E-mail inválido.");
        if (senha.length() < 8 || senha.length() > 100) return erro("A senha precisa ter de 8 a 100 caracteres.");
        if (!role.equals("ADMIN") && !role.equals("EDITOR")) return erro("Perfil inválido.");
        if (repo.findByEmail(email).isPresent()) return erro("Já existe um usuário com esse e-mail.");
        Usuario u = new Usuario();
        u.setEmail(email);
        u.setSenha(encoder.encode(senha));
        u.setRole(Usuario.Role.valueOf(role));
        u.setAtivo(true);
        return ResponseEntity.ok(vista(repo.save(u)));
    }

    // Altera perfil, ativo e/ou senha (campos ausentes ficam como estão).
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Map<String, Object> b, Authentication auth) {
        Usuario u = repo.findById(id).orElse(null);
        if (u == null) return ResponseEntity.notFound().build();
        boolean eu = u.getEmail().equalsIgnoreCase(auth.getName());

        if (b.get("senha") instanceof String s && !s.isEmpty()) {
            if (s.length() < 8 || s.length() > 100) return erro("A senha precisa ter de 8 a 100 caracteres.");
            u.setSenha(encoder.encode(s));
        }
        if (b.get("role") instanceof String r) {
            if (!r.equals("ADMIN") && !r.equals("EDITOR")) return erro("Perfil inválido.");
            if (eu && !r.equals("ADMIN")) return erro("Você não pode tirar o seu próprio acesso de administrador.");
            u.setRole(Usuario.Role.valueOf(r));
        }
        if (b.get("ativo") instanceof Boolean a) {
            if (eu && !a) return erro("Você não pode desativar o seu próprio usuário.");
            u.setAtivo(a);
        }
        return ResponseEntity.ok(vista(repo.save(u)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id, Authentication auth) {
        Usuario u = repo.findById(id).orElse(null);
        if (u == null) return ResponseEntity.notFound().build();
        if (u.getEmail().equalsIgnoreCase(auth.getName())) return erro("Você não pode excluir o seu próprio usuário.");
        repo.delete(u);
        return ResponseEntity.noContent().build();
    }
}
