-- Atualiza fotos reais dos produtos e inclui Bom Mestre Parboilizado e Grão do Sul.
-- NÃO apaga nada: só altera/insere. Pode ser rodado uma vez no banco que já está no ar.
--   docker exec -i polisual-mysql mysql -u root -p"SUA_SENHA_ROOT" polisual_db < docker/atualizar_fotos_produtos.sql

USE polisual_db;
SET NAMES utf8mb4;

UPDATE produto SET imagem_url='/images/produtos/alteza-branco.jpg'        WHERE nome='Alteza Branco';
UPDATE produto SET imagem_url='/images/produtos/alteza-parboilizado.jpg'  WHERE nome='Alteza Parboilizado';
UPDATE produto SET imagem_url='/images/produtos/bom-mestre-branco.jpg'    WHERE nome='Bom Mestre Branco';
UPDATE produto SET imagem_url='/images/produtos/icapui-branco.jpg',
  descricao='Arroz branco tipo 2, classe longo fino, subgrupo polido da marca Icapuí.',
  atributos='Tipo 2,Longo fino,Polido'
  WHERE nome='Icapuí';

INSERT INTO produto (nome, categoria, descricao, imagem_url, embalagens, atributos, organico, destaque)
SELECT 'Bom Mestre Parboilizado','ARROZ','Arroz parboilizado tipo 1, classe longo fino, da marca Bom Mestre.','/images/produtos/bom-mestre-parboilizado.jpg','1kg','Tipo 1,Longo fino,Parboilizado',FALSE,FALSE
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome='Bom Mestre Parboilizado');

INSERT INTO produto (nome, categoria, descricao, imagem_url, embalagens, atributos, organico, destaque)
SELECT 'Grão do Sul Branco','ARROZ','Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Grão do Sul.','/images/produtos/grao-do-sul-branco.jpg','1kg','Tipo 1,Longo fino,Polido',FALSE,FALSE
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome='Grão do Sul Branco');

-- Versões de 5kg (mesma marca; foto com o peso alterado para 5kg)
UPDATE produto SET embalagens='1kg' WHERE nome IN ('Alteza Branco','Alteza Parboilizado','Icapuí','Bom Mestre Branco','Bom Mestre Parboilizado');

INSERT INTO produto (nome, categoria, descricao, imagem_url, embalagens, atributos, organico, destaque)
SELECT 'Alteza Branco 5kg','ARROZ','Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Alteza, em pacote de 5kg.','/images/produtos/alteza-branco-5kg.jpg','5kg','Tipo 1,Longo fino,Polido',FALSE,FALSE
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome='Alteza Branco 5kg');

INSERT INTO produto (nome, categoria, descricao, imagem_url, embalagens, atributos, organico, destaque)
SELECT 'Alteza Parboilizado 5kg','ARROZ','Arroz parboilizado tipo 1, classe longo fino, da marca Alteza, em pacote de 5kg.','/images/produtos/alteza-parboilizado-5kg.jpg','5kg','Tipo 1,Longo fino,Parboilizado',FALSE,FALSE
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome='Alteza Parboilizado 5kg');

INSERT INTO produto (nome, categoria, descricao, imagem_url, embalagens, atributos, organico, destaque)
SELECT 'Icapuí 5kg','ARROZ','Arroz branco tipo 2, classe longo fino, subgrupo polido da marca Icapuí, em pacote de 5kg.','/images/produtos/icapui-branco-5kg.jpg','5kg','Tipo 2,Longo fino,Polido',FALSE,FALSE
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome='Icapuí 5kg');

INSERT INTO produto (nome, categoria, descricao, imagem_url, embalagens, atributos, organico, destaque)
SELECT 'Bom Mestre Branco 5kg','ARROZ','Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Bom Mestre, em pacote de 5kg.','/images/produtos/bom-mestre-branco-5kg.jpg','5kg','Tipo 1,Longo fino,Polido',FALSE,FALSE
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome='Bom Mestre Branco 5kg');

INSERT INTO produto (nome, categoria, descricao, imagem_url, embalagens, atributos, organico, destaque)
SELECT 'Bom Mestre Parboilizado 5kg','ARROZ','Arroz parboilizado tipo 1, classe longo fino, da marca Bom Mestre, em pacote de 5kg.','/images/produtos/bom-mestre-parboilizado-5kg.jpg','5kg','Tipo 1,Longo fino,Parboilizado',FALSE,FALSE
WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome='Bom Mestre Parboilizado 5kg');

