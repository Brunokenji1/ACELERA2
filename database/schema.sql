
-- LIMPEZA 
DROP TABLE IF EXISTS tentativas CASCADE;
DROP TABLE IF EXISTS rodada_de_questoes CASCADE;
DROP TABLE IF EXISTS rodadas CASCADE;
DROP TABLE IF EXISTS usuario_partida CASCADE;
DROP TABLE IF EXISTS partidas CASCADE;
DROP TABLE IF EXISTS alternativas CASCADE;
DROP TABLE IF EXISTS questoes CASCADE;
DROP TABLE IF EXISTS materias CASCADE;
DROP TABLE IF EXISTS fontes CASCADE;
DROP TABLE IF EXISTS tipo_nivel CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- CATÁLOGO

CREATE TABLE tipo_nivel(
    id SERIAL PRIMARY KEY, 
    nome VARCHAR(200) UNIQUE NOT NULL 
);

CREATE TABLE fontes(
    id SERIAL PRIMARY KEY,
    id_tipo_nivel INTEGER NOT NULL,
    nome VARCHAR(200) UNIQUE NOT NULL
);

CREATE TABLE materias(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) UNIQUE NOT NULL
);

CREATE TABLE questoes(
    id SERIAL PRIMARY KEY,
    id_fonte INTEGER NOT NULL,
    id_materia INTEGER NOT NULL,
    enunciado TEXT NOT NULL,
    dificuldade VARCHAR(10) NOT NULL CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
    ano INTEGER CHECK (ano BETWEEN 1970 AND 2100),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE alternativas(
    id SERIAL PRIMARY KEY,
    id_questao INTEGER NOT NULL,
    ordem CHAR(1) NOT NULL CHECK (ordem IN ('A', 'B', 'C', 'D', 'E')),
    texto TEXT NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    explicacao TEXT NOT NULL,
    UNIQUE (id_questao, ordem)
);

-- USUÁRIOS

CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    data_nascimento DATE NOT NULL, 
    email VARCHAR(250) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'usuario' CHECK (tipo IN ('usuario', 'admin')),
    pontos_totais INTEGER NOT NULL DEFAULT 0 CHECK (pontos_totais >= 0),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE partidas(
    id SERIAL PRIMARY KEY,
    id_criador INTEGER NOT NULL,
    id_materia INTEGER,
    id_fonte INTEGER,
    quantidade_questoes INTEGER DEFAULT 11,
    dificuldade VARCHAR(10) CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
    status VARCHAR(20) NOT NULL DEFAULT 'aguardando' 
    	CHECK (status IN ('aguardando', 'em_andamento', 'finalizada')),
    criada_em TIMESTAMP NOT NULL DEFAULT NOW(),
    iniciada_em TIMESTAMP,
    finalizada_em TIMESTAMP
);

CREATE TABLE usuario_partida( 
    id_usuario INTEGER NOT NULL,
    id_partida INTEGER NOT NULL,
    botao_numero INTEGER NOT NULL CHECK (botao_numero BETWEEN 1 AND 8),
    pontos_partida INTEGER NOT NULL DEFAULT 0 CHECK (pontos_partida >= 0),
    ganhou BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_usuario, id_partida),
    UNIQUE (id_partida, botao_numero)
);

CREATE TABLE rodadas(
    id SERIAL PRIMARY KEY,
    id_partida INTEGER NOT NULL,
    nome VARCHAR(200),
    descricao VARCHAR(300),
    ordem INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'aguardando'
    	CHECK (status IN ('aguardando', 'em_andamento', 'finalizada')), 
    iniciado_em TIMESTAMP,
    finalizada_em TIMESTAMP,
    UNIQUE (id_partida, ordem)
);

CREATE TABLE rodada_de_questoes(
    id_rodada INTEGER NOT NULL,
    id_questao INTEGER NOT NULL,
    ordem INTEGER NOT NULL,
    id_participante_1 INTEGER NOT NULL,
    id_participante_2 INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'aguardando_buzz' 
    	CHECK (status IN ('aguardando_buzz', 'aguardando_resposta', 'finalizada')),
    iniciado_em TIMESTAMP,
    finalizada_em TIMESTAMP,
    PRIMARY KEY (id_rodada, id_questao),
    CHECK (id_participante_1 <> id_participante_2)
);

-- TENTATIVA UNIFICADA

CREATE TABLE tentativas(
    id SERIAL PRIMARY KEY,
    id_alternativa INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    id_rodada         INTEGER,
    modo VARCHAR(15) NOT NULL CHECK (modo IN ('solo', 'multiplayer')),
    acertou BOOLEAN NOT NULL,
    pontos_ganhos INTEGER NOT NULL DEFAULT 0 CHECK (pontos_ganhos >= 0),
    tempo_resposta_ms INTEGER NOT NULL CHECK (tempo_resposta_ms >= 0),
    respondido_em TIMESTAMP NOT NULL DEFAULT NOW(),
    ordem_tentativa   INTEGER CHECK (ordem_tentativa IN (1, 2)),
    tempo_buzz_ms     INTEGER CHECK (tempo_buzz_ms >= 0)
);

-- FOREIGN KEYS

ALTER TABLE fontes 
ADD CONSTRAINT fk_tiponivel_fonte FOREIGN KEY (id_tipo_nivel)
REFERENCES tipo_nivel(id);

ALTER TABLE questoes
ADD CONSTRAINT fk_fonte_questao FOREIGN KEY (id_fonte)
REFERENCES fontes(id);

ALTER TABLE questoes
ADD CONSTRAINT fk_materia_questao FOREIGN KEY (id_materia)
REFERENCES materias(id);

ALTER TABLE alternativas
ADD CONSTRAINT fk_questao_alternativa FOREIGN KEY (id_questao)
REFERENCES questoes(id) ON DELETE CASCADE;

ALTER TABLE partidas
ADD CONSTRAINT fk_criador_partida FOREIGN KEY (id_criador)
REFERENCES usuarios(id);

ALTER TABLE partidas
ADD CONSTRAINT fk_materia_partida FOREIGN KEY (id_materia)
REFERENCES materias(id) ON DELETE SET NULL;

ALTER TABLE partidas
ADD CONSTRAINT fk_fonte_partida FOREIGN KEY (id_fonte)
REFERENCES fontes(id) ON DELETE SET NULL;

ALTER TABLE usuario_partida
ADD CONSTRAINT fk_usuario_up FOREIGN KEY (id_usuario)
REFERENCES usuarios(id);

ALTER TABLE usuario_partida
ADD CONSTRAINT fk_partida_up FOREIGN KEY (id_partida)
REFERENCES partidas(id) ON DELETE CASCADE;

ALTER TABLE rodadas
ADD CONSTRAINT fk_partida_rodada FOREIGN KEY (id_partida)
REFERENCES partidas(id) ON DELETE CASCADE;

ALTER TABLE rodada_de_questoes
ADD CONSTRAINT fk_rodada_rq FOREIGN KEY (id_rodada)
REFERENCES rodadas(id) ON DELETE CASCADE;

ALTER TABLE rodada_de_questoes
ADD CONSTRAINT fk_questao_rq FOREIGN KEY (id_questao)
REFERENCES questoes(id);

ALTER TABLE rodada_de_questoes
ADD CONSTRAINT fk_participante_1_rq FOREIGN KEY (id_participante_1)
REFERENCES usuarios(id);

ALTER TABLE rodada_de_questoes
ADD CONSTRAINT fk_participante_2_rq FOREIGN KEY (id_participante_2)
REFERENCES usuarios(id);

ALTER TABLE tentativas
ADD CONSTRAINT fk_alternativa_tentativa FOREIGN KEY (id_alternativa)
REFERENCES alternativas(id);

ALTER TABLE tentativas
ADD CONSTRAINT fk_rodada_tentativa FOREIGN KEY (id_rodada)
REFERENCES rodadas(id) ON DELETE CASCADE;

ALTER TABLE tentativas
ADD CONSTRAINT fk_usuario_tentativa FOREIGN KEY (id_usuario)
REFERENCES usuarios(id);

-- ÍNDICES (performance)

CREATE INDEX idx_questoes_materia ON questoes(id_materia);
CREATE INDEX idx_questoes_fonte ON questoes(id_fonte);
CREATE INDEX idx_questoes_dificuldade ON questoes(dificuldade);
CREATE INDEX idx_alternativas_questao ON alternativas(id_questao);
CREATE UNIQUE INDEX idx_uma_correta_por_questao 
    ON alternativas(id_questao) WHERE correta = TRUE;
CREATE INDEX idx_tentativas_usuario ON tentativas(id_usuario);
CREATE INDEX idx_tentativas_modo ON tentativas(modo);
CREATE INDEX idx_usuarios_pontos ON usuarios(pontos_totais DESC);