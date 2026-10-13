package com.polisual.service;

import com.polisual.model.Contato;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL SERVICE — avisa a equipe comercial quando chega um contato pelo site.
// Roda em segundo plano (@Async): se o SMTP falhar, o visitante não é afetado
// e a mensagem já está salva no banco.
// ─────────────────────────────────────────────────────────────────────────────
@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final String para;
    private final String de;
    private final String host;
    private final String senha;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.mail.to}") String para,
                        @Value("${app.mail.from:}") String de,
                        @Value("${spring.mail.host:}") String host,
                        @Value("${spring.mail.password:}") String senha,
                        @Value("${spring.mail.username:}") String usuario) {
        this.mailSender = mailSender;
        this.para = para;
        this.de = (de == null || de.isBlank()) ? usuario : de;   // MAIL_FROM vazio → usa o usuário SMTP
        this.host = host;
        this.senha = senha;
    }

    private boolean configurado() {
        return !host.isBlank() && !senha.isBlank() && !de.isBlank() && !para.isBlank();
    }

    @Async
    public void avisarNovoContato(Contato c) {
        if (!configurado()) {
            log.warn("SMTP não configurado (MAIL_HOST/MAIL_USERNAME/MAIL_PASSWORD): contato #{} salvo, mas e-mail não enviado.", c.getId());
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, false, "UTF-8");
            h.setFrom(de, "Site Polisul");
            h.setTo(para);
            h.setReplyTo(c.getEmail());          // "Responder" vai direto para o visitante
            h.setSubject("Novo contato pelo site: " + limpaLinha(c.getNome()));
            h.setText(corpo(c), false);
            mailSender.send(msg);
            log.info("E-mail de contato #{} enviado para {}", c.getId(), para);
        } catch (Exception e) {
            log.error("Falha ao enviar e-mail do contato #{}: {}", c.getId(), e.getMessage());
        }
    }

    private static String limpaLinha(String s) {
        return s == null ? "" : s.replaceAll("[\\r\\n]+", " ").trim();
    }

    private static String corpo(Contato c) {
        return "Nova mensagem recebida pelo site da Polisul\n"
             + "------------------------------------------\n"
             + "Nome:      " + limpaLinha(c.getNome()) + "\n"
             + "E-mail:    " + c.getEmail() + "\n"
             + "Telefone:  " + vazio(c.getTelefone()) + "\n"
             + "Empresa:   " + vazio(c.getEmpresa()) + "\n"
             + "Data:      " + c.getCriadoEm() + "\n\n"
             + "Mensagem:\n" + c.getMensagem() + "\n\n"
             + "------------------------------------------\n"
             + "Responda este e-mail para falar direto com o cliente.\n";
    }

    private static String vazio(String s) {
        return (s == null || s.isBlank()) ? "(não informado)" : s;
    }
}
