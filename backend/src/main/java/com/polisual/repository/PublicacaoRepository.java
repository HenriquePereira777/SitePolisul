package com.polisual.repository;

import com.polisual.model.Publicacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublicacaoRepository extends JpaRepository<Publicacao, Long> {
    List<Publicacao> findByPublicadoTrueOrderByDataPublicacaoDesc();
    List<Publicacao> findAllByOrderByDataPublicacaoDesc();
}
