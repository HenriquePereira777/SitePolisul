package com.polisual.controller;

import com.polisual.model.Produto;
import com.polisual.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    // Público — leitura livre
    @GetMapping
    public ResponseEntity<List<Produto>> listar(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Boolean organico,
            @RequestParam(required = false) Boolean destaque) {

        List<Produto> resultado;
        if (Boolean.TRUE.equals(organico))  resultado = produtoService.listarOrganicos();
        else if (Boolean.TRUE.equals(destaque)) resultado = produtoService.listarDestaques();
        else if (categoria != null)         resultado = produtoService.listarPorCategoria(categoria);
        else                                resultado = produtoService.listarTodos();

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscar(@PathVariable Long id) {
        return produtoService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Protegido — exige ADMIN ou EDITOR
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public ResponseEntity<Produto> criar(@Valid @RequestBody Produto produto) {
        return ResponseEntity.ok(produtoService.salvar(produto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EDITOR')")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @Valid @RequestBody Produto produto) {
        return produtoService.buscarPorId(id).map(p -> {
            produto.setId(id);
            return ResponseEntity.ok(produtoService.salvar(produto));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String,String>> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Produto desativado com sucesso"));
    }
}
