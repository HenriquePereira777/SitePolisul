package com.polisual.controller;

import com.polisual.model.Banner;
import com.polisual.model.Publicacao;
import com.polisual.repository.BannerRepository;
import com.polisual.repository.PublicacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Leitura pública do conteúdo editável (site).
@RestController
@RequiredArgsConstructor
public class PublicoController {

    private final PublicacaoRepository publicacoes;
    private final BannerRepository banners;

    @GetMapping("/api/publicacoes")
    public List<Publicacao> publicacoes() { return publicacoes.findByPublicadoTrueOrderByDataPublicacaoDesc(); }

    @GetMapping("/api/banners")
    public List<Banner> banners() { return banners.findByAtivoTrueOrderByOrdemAscIdAsc(); }
}
