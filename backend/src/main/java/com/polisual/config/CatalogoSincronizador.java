package com.polisual.config;

import com.polisual.model.Produto;
import com.polisual.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

// ─────────────────────────────────────────────────────────────────────────────
// Ao subir o backend, garante que os produtos com FOTO REAL existam no banco
// com a imagem, descrição e embalagem corretas. Procura pelo nome:
//   • se existe  → não altera (edições feitas no painel admin são preservadas);
//   • se não     → cria.
// Não apaga nada e não mexe nos demais produtos. Para trocar uma foto no futuro,
// é só alterar a linha correspondente abaixo e reiniciar o backend.
// ─────────────────────────────────────────────────────────────────────────────
@Component
@RequiredArgsConstructor
@Slf4j
public class CatalogoSincronizador implements CommandLineRunner {

    private final ProdutoRepository repo;

    private record Item(String nome, String descricao, String imagem, String embalagens, String atributos) {}

    private static final String P = "/images/produtos/";

    private static final List<Item> ITENS = List.of(
        new Item("Alteza Branco", "Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Alteza.", P + "alteza-branco.jpg", "1kg", "Tipo 1,Longo fino,Polido"),
        new Item("Alteza Branco 5kg", "Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Alteza, em pacote de 5kg.", P + "alteza-branco-5kg.jpg", "5kg", "Tipo 1,Longo fino,Polido"),
        new Item("Alteza Parboilizado", "Arroz parboilizado tipo 1, classe longo fino, da marca Alteza.", P + "alteza-parboilizado.jpg", "1kg", "Tipo 1,Longo fino,Parboilizado"),
        new Item("Alteza Parboilizado 5kg", "Arroz parboilizado tipo 1, classe longo fino, da marca Alteza, em pacote de 5kg.", P + "alteza-parboilizado-5kg.jpg", "5kg", "Tipo 1,Longo fino,Parboilizado"),
        new Item("Icapuí", "Arroz branco tipo 2, classe longo fino, subgrupo polido da marca Icapuí.", P + "icapui-branco.jpg", "1kg", "Tipo 2,Longo fino,Polido"),
        new Item("Icapuí 5kg", "Arroz branco tipo 2, classe longo fino, subgrupo polido da marca Icapuí, em pacote de 5kg.", P + "icapui-branco-5kg.jpg", "5kg", "Tipo 2,Longo fino,Polido"),
        new Item("Bom Mestre Branco", "Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Bom Mestre.", P + "bom-mestre-branco.jpg", "1kg", "Tipo 1,Longo fino,Polido"),
        new Item("Bom Mestre Branco 5kg", "Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Bom Mestre, em pacote de 5kg.", P + "bom-mestre-branco-5kg.jpg", "5kg", "Tipo 1,Longo fino,Polido"),
        new Item("Bom Mestre Parboilizado", "Arroz parboilizado tipo 1, classe longo fino, da marca Bom Mestre.", P + "bom-mestre-parboilizado.jpg", "1kg", "Tipo 1,Longo fino,Parboilizado"),
        new Item("Bom Mestre Parboilizado 5kg", "Arroz parboilizado tipo 1, classe longo fino, da marca Bom Mestre, em pacote de 5kg.", P + "bom-mestre-parboilizado-5kg.jpg", "5kg", "Tipo 1,Longo fino,Parboilizado"),
        new Item("Grão do Sul Branco", "Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Grão do Sul.", P + "grao-do-sul-branco.jpg", "1kg", "Tipo 1,Longo fino,Polido")
    );

    @Override
    public void run(String... args) {
        int criados = 0, atualizados = 0;
        for (Item i : ITENS) {
            // Já existe? Não mexe: o que foi editado no painel admin é respeitado.
            if (repo.findFirstByNome(i.nome()).isPresent()) { atualizados++; continue; }
            {
                Produto p = Produto.builder()
                        .nome(i.nome())
                        .categoria(Produto.Categoria.ARROZ)
                        .organico(false).destaque(false).ativo(true)
                        .criadoEm(LocalDateTime.now())
                        .build();
                p.setDescricao(i.descricao());
                p.setImagemUrl(i.imagem());
                p.setEmbalagens(i.embalagens());
                p.setAtributos(i.atributos());
                repo.save(p);
                criados++;
            }
        }
        log.info("Catálogo sincronizado: {} produto(s) criado(s), {} já existente(s) preservado(s).", criados, atualizados);
    }
}
