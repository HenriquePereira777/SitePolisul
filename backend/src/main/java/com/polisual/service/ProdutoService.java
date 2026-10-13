package com.polisual.service;

import com.polisual.dto.ContatoDTO;
import com.polisual.model.Contato;
import com.polisual.model.Produto;
import com.polisual.repository.ContatoRepository;
import com.polisual.repository.ProdutoRepository;
import com.polisual.security.InputSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// ─────────────────────────────────────────────────────────────────────────────
// PRODUTO SERVICE
// ─────────────────────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@Slf4j
public class ProdutoService {

    private final ProdutoRepository repo;

    public List<Produto> listarTodos()                                      { return repo.findByAtivoTrue(); }
    public List<Produto> listarOrganicos()                                   { return repo.findByOrganicoTrueAndAtivoTrue(); }
    public List<Produto> listarDestaques()                                   { return repo.findByDestaqueTrueAndAtivoTrue(); }
    public Optional<Produto> buscarPorId(Long id)                           { return repo.findById(id); }

    public List<Produto> listarPorCategoria(String categoria) {
        try {
            return repo.findByCategoriaAndAtivoTrue(Produto.Categoria.valueOf(categoria.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    public Produto salvar(Produto produto) { return repo.save(produto); }

    public void deletar(Long id) {
        repo.findById(id).ifPresent(p -> { p.setAtivo(false); repo.save(p); });
    }
}

