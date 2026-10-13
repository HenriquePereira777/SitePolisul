package com.polisual.config;

import com.polisual.model.Usuario;
import com.polisual.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Se ADMIN_EMAIL e ADMIN_PASSWORD estiverem no .env, cria (ou atualiza a senha do administrador ao subir.
// Assim a senha de produção nunca fica escrita no código nem no init.sql.
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminBootstrap implements CommandLineRunner {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    @Value("${app.admin.email:}")    private String email;
    @Value("${app.admin.password:}") private String senha;

    @Override
    public void run(String... args) {
        if (email == null || email.isBlank() || senha == null || senha.isBlank()) {
            log.info("ADMIN_EMAIL/ADMIN_PASSWORD não definidos: usuário admin não foi alterado.");
            return;
        }
        if (senha.length() < 8) {
            log.warn("ADMIN_PASSWORD precisa ter pelo menos 8 caracteres. Admin não alterado.");
            return;
        }
        Usuario u = repo.findByEmail(email.trim()).orElseGet(Usuario::new);
        boolean novo = u.getId() == null;
        u.setEmail(email.trim());
        u.setSenha(encoder.encode(senha));
        u.setRole(Usuario.Role.ADMIN);
        u.setAtivo(true);
        repo.save(u);
        log.info("Administrador {} {}.", email.trim(), novo ? "criado" : "atualizado");
    }
}
