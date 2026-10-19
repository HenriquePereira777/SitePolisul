package com.polisual.controller;

import com.polisual.model.Banner;
import com.polisual.model.Produto;
import com.polisual.model.Publicacao;
import com.polisual.repository.BannerRepository;
import com.polisual.repository.ProdutoRepository;
import com.polisual.repository.PublicacaoRepository;
import com.polisual.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

// ─────────────────────────────────────────────────────────────────────────────
// PAINEL ADMIN — tudo aqui exige login (ADMIN ou EDITOR)
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
@RequiredArgsConstructor
public class AdminController {

    private final ProdutoRepository produtos;
    private final PublicacaoRepository publicacoes;
    private final BannerRepository banners;
    private final UploadService upload;

    // ── Upload de foto ───────────────────────────────────────────────────────
    @PostMapping("/upload")
    public ResponseEntity<?> enviarFoto(@RequestParam("arquivo") MultipartFile arquivo) throws IOException {
        try {
            return ResponseEntity.ok(Map.of("url", upload.salvar(arquivo)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", e.getMessage()));
        }
    }

    // ── Produtos (inclui os desativados) ─────────────────────────────────────
    @GetMapping("/produtos")
    public List<Produto> listarProdutos() { return produtos.findAll(); }

    @DeleteMapping("/produtos/{id}/definitivo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluirProduto(@PathVariable Long id) {
        if (!produtos.existsById(id)) return ResponseEntity.notFound().build();
        produtos.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Publicações ──────────────────────────────────────────────────────────
    @GetMapping("/publicacoes")
    public List<Publicacao> listarPublicacoes() { return publicacoes.findAllByOrderByDataPublicacaoDesc(); }

    @PostMapping("/publicacoes")
    public ResponseEntity<?> criarPublicacao(@RequestBody Publicacao p) {
        String erro = validar(p);
        if (erro != null) return ResponseEntity.badRequest().body(Map.of("mensagem", erro));
        p.setId(null);
        if (p.getDataPublicacao() == null) p.setDataPublicacao(LocalDateTime.now());
        return ResponseEntity.ok(publicacoes.save(p));
    }

    @PutMapping("/publicacoes/{id}")
    public ResponseEntity<?> atualizarPublicacao(@PathVariable Long id, @RequestBody Publicacao p) {
        String erro = validar(p);
        if (erro != null) return ResponseEntity.badRequest().body(Map.of("mensagem", erro));
        return publicacoes.findById(id).<ResponseEntity<?>>map(atual -> {
            atual.setTitulo(p.getTitulo());
            atual.setResumo(p.getResumo());
            atual.setConteudo(p.getConteudo());
            atual.setImagemUrl(p.getImagemUrl());
            atual.setPublicado(p.getPublicado());
            if (p.getDataPublicacao() != null) atual.setDataPublicacao(p.getDataPublicacao());
            atual.setDiasNoAr(p.getDiasNoAr());   // null limpa o prazo
            return ResponseEntity.ok(publicacoes.save(atual));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/publicacoes/{id}")
    public ResponseEntity<Void> excluirPublicacao(@PathVariable Long id) {
        if (!publicacoes.existsById(id)) return ResponseEntity.notFound().build();
        publicacoes.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Fotos do carrossel ───────────────────────────────────────────────────
    @GetMapping("/banners")
    public List<Banner> listarBanners() { return banners.findAllByOrderByOrdemAscIdAsc(); }

    @PostMapping("/banners")
    public ResponseEntity<?> criarBanner(@RequestBody Banner b) {
        String erro = validar(b);
        if (erro != null) return ResponseEntity.badRequest().body(Map.of("mensagem", erro));
        b.setId(null);
        return ResponseEntity.ok(banners.save(b));
    }

    @PutMapping("/banners/{id}")
    public ResponseEntity<?> atualizarBanner(@PathVariable Long id, @RequestBody Banner b) {
        String erro = validar(b);
        if (erro != null) return ResponseEntity.badRequest().body(Map.of("mensagem", erro));
        return banners.findById(id).<ResponseEntity<?>>map(atual -> {
            atual.setTag(b.getTag());
            atual.setTitulo(b.getTitulo());
            atual.setTexto(b.getTexto());
            atual.setImagemUrl(b.getImagemUrl());
            atual.setOrdem(b.getOrdem() == null ? 0 : b.getOrdem());
            atual.setAtivo(b.getAtivo());
            return ResponseEntity.ok(banners.save(atual));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/banners/{id}")
    public ResponseEntity<Void> excluirBanner(@PathVariable Long id) {
        if (!banners.existsById(id)) return ResponseEntity.notFound().build();
        banners.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Validações simples ───────────────────────────────────────────────────
    private static String validar(Publicacao p) {
        if (vazio(p.getTitulo())) return "Informe o título.";
        if (p.getTitulo().length() > 150) return "Título muito longo (máx. 150).";
        if (p.getResumo() != null && p.getResumo().length() > 300) return "Resumo muito longo (máx. 300).";
        if (p.getDiasNoAr() != null && (p.getDiasNoAr() < 1 || p.getDiasNoAr() > 3650)) return "Dias no site deve ficar entre 1 e 3650 (ou vazio para não expirar).";
        if (p.getPublicado() == null) p.setPublicado(true);
        return null;
    }

    private static String validar(Banner b) {
        if (vazio(b.getTitulo())) return "Informe o título.";
        if (vazio(b.getImagemUrl())) return "Envie a foto do slide.";
        if (b.getTitulo().length() > 120) return "Título muito longo (máx. 120).";
        if (b.getTexto() != null && b.getTexto().length() > 300) return "Texto muito longo (máx. 300).";
        if (b.getTag() != null && b.getTag().length() > 60) return "Etiqueta muito longa (máx. 60).";
        if (b.getAtivo() == null) b.setAtivo(true);
        return null;
    }

    private static boolean vazio(String s) { return s == null || s.isBlank(); }
}
