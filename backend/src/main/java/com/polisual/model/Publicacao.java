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

    // Quantos dias a publicação fica no site, contados a partir de dataPublicacao. null = sem prazo (fica até ser ocultada/excluída).
    @Column(name = "dias_no_ar")
    private Integer diasNoAr;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    // Está dentro do prazo? (usado só no servidor; recebe o "agora" como parâmetro para não virar propriedade do JSON)
    public boolean dentroDoPrazo(LocalDateTime agora) {
        if (diasNoAr == null || dataPublicacao == null) return true;
        return dataPublicacao.plusDays(diasNoAr).isAfter(agora);
    }
}
