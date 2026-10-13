package com.polisual.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO
// ─────────────────────────────────────────────────────────────────────────────
@Entity @Table(name = "produto")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Produto {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "imagem_url")
    private String imagemUrl;

    private String embalagens;
    private String atributos;

    private Boolean organico  = false;
    private Boolean destaque  = false;
    private Boolean ativo     = true;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    public enum Categoria { ARROZ, SOJA }
}
