package com.polisual.model;

import jakarta.persistence.*;
import lombok.*;

// Slide (foto + legenda) do carrossel da página inicial (editável no painel admin).
@Entity @Table(name = "banner")
@Data @NoArgsConstructor @AllArgsConstructor
public class Banner {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 60)
    private String tag;

    @Column(nullable = false, length = 120)
    private String titulo;

    @Column(length = 300)
    private String texto;

    @Column(name = "imagem_url", nullable = false)
    private String imagemUrl;

    private Integer ordem = 0;

    private Boolean ativo = true;
}
