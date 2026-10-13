package com.polisual.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "contato")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Contato {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(length = 100)
    private String empresa;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    // IP do remetente — para auditoria e bloqueio
    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}
