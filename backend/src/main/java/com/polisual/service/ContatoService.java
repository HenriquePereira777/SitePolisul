package com.polisual.service;

import com.polisual.dto.ContatoDTO;
import com.polisual.model.Contato;
import com.polisual.repository.ContatoRepository;
import com.polisual.security.InputSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// ─────────────────────────────────────────────────────────────────────────────
// CONTATO SERVICE  — sanitização aplicada antes de persistir
// ─────────────────────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
 public class ContatoService {

    private final ContatoRepository repo;
    private final InputSanitizer sanitizer;
    private final EmailService emailService;

    public Contato salvar(ContatoDTO.Request dto, String ipOrigem) {
        Contato contato = Contato.builder()
            .nome(sanitizer.sanitizeText(dto.getNome()))
            .email(sanitizer.sanitizeEmail(dto.getEmail()))
            .telefone(sanitizer.sanitizeText(dto.getTelefone()))
            .empresa(sanitizer.sanitizeText(dto.getEmpresa()))
            .mensagem(sanitizer.sanitizeMessage(dto.getMensagem()))
            .ipOrigem(ipOrigem)
            .criadoEm(LocalDateTime.now())
            .build();

        log.info("Novo contato de: {} <{}>", contato.getNome(), contato.getEmail());
        Contato salvo = repo.save(contato);
        emailService.avisarNovoContato(salvo);   // assíncrono; não bloqueia nem quebra o envio
        return salvo;
    }

    public List<Contato> listarTodos() {
        return repo.findAllByOrderByCriadoEmDesc();
    }
}
