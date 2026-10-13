package com.polisual.repository;

import com.polisual.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findFirstByNome(String nome);
    List<Produto> findByAtivoTrue();
    List<Produto> findByCategoriaAndAtivoTrue(Produto.Categoria categoria);
    List<Produto> findByOrganicoTrueAndAtivoTrue();
    List<Produto> findByDestaqueTrueAndAtivoTrue();
}
