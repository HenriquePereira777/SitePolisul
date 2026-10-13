package com.polisual.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Notícia / publicação exibida na seção "Novidades" do site (editável no painel admin).
@Entity @Table(name = "publicacao")
@Data @NoArgsConstructor @AllArgsConstructor
public class Publicacao {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(length = 300)
    private String resumo;

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "imagem_url")
    private String imagemUrl;

    private Boolean publicado = true;

    @Column(name = "data_publicacao")
    private LocalDateTime dataPublicacao = LocalDateTime.now();

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}
