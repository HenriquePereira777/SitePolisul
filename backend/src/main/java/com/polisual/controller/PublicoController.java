package com.polisual.controller;

import com.polisual.model.Banner;
import com.polisual.model.Publicacao;
import com.polisual.repository.BannerRepository;
import com.polisual.repository.PublicacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

// Leitura pública do conteúdo editável (site).
@RestController
@RequiredArgsConstructor
public class PublicoController {

    private final PublicacaoRepository publicacoes;
    private final BannerRepository banners;

    @GetMapping("/api/publicacoes")
    public List<Publicacao> publicacoes() {
        // Só o que está publicado E ainda dentro do prazo (diasNoAr). Publicações vencidas somem do site, mas continuam no painel.
        LocalDateTime agora = LocalDateTime.now();
        return publicacoes.findByPublicadoTrueOrderByDataPublicacaoDesc().stream()
                .filter(p -> p.dentroDoPrazo(agora))
                .toList();
    }

    @GetMapping("/api/banners")
    public List<Banner> banners() { return banners.findByAtivoTrueOrderByOrdemAscIdAsc(); }
}
