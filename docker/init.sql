CREATE DATABASE IF NOT EXISTS polisual_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE polisual_db;

CREATE TABLE IF NOT EXISTS produto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria ENUM('ARROZ','SOJA') NOT NULL,
    descricao TEXT,
    imagem_url VARCHAR(255),
    embalagens VARCHAR(255),
    atributos VARCHAR(255),
    organico BOOLEAN DEFAULT FALSE,
    destaque BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contato (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    empresa VARCHAR(100),
    mensagem TEXT NOT NULL,
    ip_origem VARCHAR(45),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','EDITOR') DEFAULT 'ADMIN',
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- O administrador NÃO é criado aqui: o backend cria/atualiza o admin ao subir,
-- a partir de ADMIN_EMAIL e ADMIN_PASSWORD do .env (nenhuma senha fica no código).

-- Catálogo real (marcas revendidas) — atualizado a partir da planilha de estoque de 31/05/2026
INSERT INTO produto (nome, categoria, descricao, imagem_url, embalagens, atributos, organico, destaque) VALUES
('Alteza Branco','ARROZ','Arroz branco tipo 1 da marca Alteza. Grãos longos e finos, cozimento uniforme e sabor suave.','/images/produtos/alteza-branco.jpg','1kg','Grão longo,Sem glúten,Cozimento uniforme',FALSE,FALSE),
('Alteza Parboilizado','ARROZ','Arroz parboilizado da marca Alteza. Pré-cozido a vapor, retém mais nutrientes e fica soltinho.','/images/produtos/alteza-parboilizado.jpg','1kg','Pré-cozido a vapor,Grão solto,Alto valor nutricional',FALSE,FALSE),
('Alteza Integral','ARROZ','Arroz integral da marca Alteza. Mantém o farelo e o gérmen, rico em fibras.','/images/arroz-integral.jpg','1kg,5kg','Rico em fibras,Integral,Sem glúten',FALSE,FALSE),
('Alteza Premium','ARROZ','Arroz branco premium da marca Alteza. Seleção especial de grãos longos e finos.','/images/arroz-branco.jpg','1kg,5kg','Seleção premium,Grão longo e fino,Cozimento uniforme',FALSE,FALSE),
('Alteza Arbóreo','ARROZ','Arroz arbóreo da marca Alteza. Grão curto e redondo, ideal para risotos.','/images/arroz-branco.jpg','1kg,5kg','Grão curto,Ideal para risotos,Alta absorção',FALSE,FALSE),
('Uniforça Branco','ARROZ','Arroz branco tipo 1 da marca Uniforça. Grãos selecionados, cozimento uniforme.','/images/arroz-branco.jpg','1kg,5kg','Grão longo,Cozimento uniforme,Sabor suave',FALSE,FALSE),
('Uniforça Parboilizado','ARROZ','Arroz parboilizado da marca Uniforça. Pré-cozido a vapor, grãos soltinhos garantidos.','/images/arroz-parboilizado.jpg','1kg,5kg','Pré-cozido a vapor,Grão solto,Sem glúten',FALSE,FALSE),
('Uniforça Integral','ARROZ','Arroz integral da marca Uniforça. Rico em fibras e vitaminas do complexo B.','/images/arroz-integral.jpg','1kg,5kg','Rico em fibras,Integral,Vitaminas do complexo B',FALSE,FALSE),
('Imperato Branco','ARROZ','Arroz branco tipo 1 da marca Imperato. Grãos longos e finos, alto padrão de qualidade.','/images/arroz-branco.jpg','1kg,5kg','Grão longo,Alto padrão de qualidade,Sem glúten',FALSE,FALSE),
('Imperato Parboilizado','ARROZ','Arroz parboilizado da marca Imperato. Pré-cozido a vapor, alto valor nutricional.','/images/arroz-parboilizado.jpg','1kg,5kg','Pré-cozido a vapor,Alto valor nutricional,Grão solto',FALSE,FALSE),
('Imperato Integral','ARROZ','Arroz integral da marca Imperato. Mantém o farelo e o gérmen, rico em fibras.','/images/arroz-integral.jpg','1kg,5kg','Rico em fibras,Integral,Sem conservantes',FALSE,FALSE),
('Karajá Branco','ARROZ','Arroz branco tipo 1 da marca Karajá. Grãos selecionados, sabor suave.','/images/arroz-branco.jpg','1kg,5kg','Grão longo,Sabor suave,Cozimento uniforme',FALSE,FALSE),
('Karajá Parboilizado','ARROZ','Arroz parboilizado da marca Karajá. Pré-cozido a vapor, grão solto garantido.','/images/arroz-parboilizado.jpg','1kg,5kg','Pré-cozido a vapor,Grão solto,Alto valor nutricional',FALSE,FALSE),
('Cometa Branco','ARROZ','Arroz branco tipo 1 da marca Cometa. Grãos longos e finos, cozimento uniforme.','/images/arroz-branco.jpg','1kg,5kg','Grão longo,Cozimento uniforme,Sem glúten',FALSE,FALSE),
('Cometa Parboilizado','ARROZ','Arroz parboilizado da marca Cometa. Pré-cozido a vapor, retém mais nutrientes.','/images/arroz-parboilizado.jpg','1kg,5kg','Pré-cozido a vapor,Grão solto,Alto valor nutricional',FALSE,FALSE),
('Icapuí','ARROZ','Arroz branco tipo 2, classe longo fino, subgrupo polido da marca Icapuí.','/images/produtos/icapui-branco.jpg','1kg','Tipo 2,Longo fino,Polido',FALSE,FALSE),
('Bom Mestre Branco','ARROZ','Arroz branco tipo 1 da marca Bom Mestre. Grãos selecionados, ótimo custo-benefício.','/images/produtos/bom-mestre-branco.jpg','1kg','Grão longo,Ótimo custo-benefício,Cozimento uniforme',FALSE,FALSE),
('Bom Mestre Parboilizado','ARROZ','Arroz parboilizado tipo 1, classe longo fino, da marca Bom Mestre.','/images/produtos/bom-mestre-parboilizado.jpg','1kg','Tipo 1,Longo fino,Parboilizado',FALSE,FALSE),
('Grão do Sul Branco','ARROZ','Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Grão do Sul.','/images/produtos/grao-do-sul-branco.jpg','1kg','Tipo 1,Longo fino,Polido',FALSE,FALSE),
('Alteza Branco 5kg','ARROZ','Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Alteza, em pacote de 5kg.','/images/produtos/alteza-branco-5kg.jpg','5kg','Tipo 1,Longo fino,Polido',FALSE,FALSE),
('Alteza Parboilizado 5kg','ARROZ','Arroz parboilizado tipo 1, classe longo fino, da marca Alteza, em pacote de 5kg.','/images/produtos/alteza-parboilizado-5kg.jpg','5kg','Tipo 1,Longo fino,Parboilizado',FALSE,FALSE),
('Icapuí 5kg','ARROZ','Arroz branco tipo 2, classe longo fino, subgrupo polido da marca Icapuí, em pacote de 5kg.','/images/produtos/icapui-branco-5kg.jpg','5kg','Tipo 2,Longo fino,Polido',FALSE,FALSE),
('Bom Mestre Branco 5kg','ARROZ','Arroz branco tipo 1, classe longo fino, subgrupo polido da marca Bom Mestre, em pacote de 5kg.','/images/produtos/bom-mestre-branco-5kg.jpg','5kg','Tipo 1,Longo fino,Polido',FALSE,FALSE),
('Bom Mestre Parboilizado 5kg','ARROZ','Arroz parboilizado tipo 1, classe longo fino, da marca Bom Mestre, em pacote de 5kg.','/images/produtos/bom-mestre-parboilizado-5kg.jpg','5kg','Tipo 1,Longo fino,Parboilizado',FALSE,FALSE);
