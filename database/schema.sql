CREATE TABLE tipo_nivel(
	id SERIAL PRIMARY KEY, 
	nome VARCHAR(200) UNIQUE NOT NULL 
);

CREATE TABLE fonte(
	id SERIAL PRIMARY KEY,
	id_tipo_nivel INTEGER NOT NULL,
	nome varchar(200) UNIQUE NOT NULL
);

CREATE TABLE materia (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(200) UNIQUE NOT NULL
);

CREATE TABLE questao(
	id SERIAL PRIMARY KEY,
	id_fonte INTEGER NOT NULL,
	id_materia INTEGER NOT NULL,
	enunciado TEXT,
	dificuldade VARCHAR(1),
	ano VARCHAR(4),
	criado_em TIMESTAMP
);

CREATE TABLE alternativa(
	id SERIAL PRIMARY KEY,
	id_questao INTEGER NOT NULL,
	texto TEXT NOT NULL,
	correta BOOLEAN NOT NULL,
	explicacao TEXT NOT NULL
);

CREATE TABLE rodada(
	id SERIAL PRIMARY KEY,
	id_partida INTEGER NOT NULL,
	nome VARCHAR(200),
	descricao VARCHAR(300),
	iniciado_em TIMESTAMP,
	status VARCHAR(20)
);

CREATE TABLE rodada_de_questoes(
	id_rodada INTEGER NOT NULL,
	id_questao INTEGER NOT NULL,
	ordem INTEGER,
	iniciado_em TIMESTAMP,
	PRIMARY KEY(id_rodada, id_questao)
);

CREATE TABLE partida(
	id SERIAL PRIMARY KEY,
	criada_em TIMESTAMP,
	iniciada_em TIMESTAMP,
	finalizado_em TIMESTAMP,
	status VARCHAR(20)
);

CREATE TABLE usuario_partida( 
	id_usuario INTEGER NOT NULL,
	id_partida INTEGER NOT NULL,
	PRIMARY KEY(id_usuario, id_partida)
);

CREATE TABLE usuario(
	id SERIAL PRIMARY KEY,
	nome VARCHAR(200) NOT NULL,
	idade INTEGER NOT NULL, 
	email VARCHAR(250) NOT NULL,
	senha VARCHAR(255) NOT NULL,
	criado_em date 
);

CREATE TABLE tentativa(
	id SERIAL PRIMARY KEY,
	id_alternativa INTEGER NOT NULL,
	id_rodada INTEGER NOT NULL,
	id_usuario INTEGER NOT NULL,
	acertou BOOLEAN,
	pontos_ganhos INTEGER,
	respondido_em TIMESTAMP
);

ALTER TABLE fonte 
ADD CONSTRAINT fk_tiponivel_fonte FOREIGN KEY (id_tipo_nivel)
REFERENCES tipo_nivel(id);
	
ALTER TABLE questao
ADD CONSTRAINT fk_fonte_questao FOREIGN KEY (id_fonte)
REFERENCES fonte(id);

ALTER TABLE questao
ADD CONSTRAINT fk_materia_questao FOREIGN KEY (id_materia)
REFERENCES materia(id);

ALTER TABLE alternativa
ADD CONSTRAINT fk_questao_alternativa FOREIGN KEY (id_questao)
REFERENCES questao(id);

ALTER TABLE rodada
ADD CONSTRAINT fk_partida_rodada FOREIGN KEY (id_partida)
REFERENCES partida(id);

ALTER TABLE rodada_de_questoes
ADD CONSTRAINT fk_radada_rq FOREIGN KEY (id_rodada)
REFERENCES rodada(id);

ALTER TABLE rodada_de_questoes
ADD CONSTRAINT fk_questao_rq FOREIGN KEY (id_questao)
REFERENCES questao(id);

ALTER TABLE usuario_partida
ADD CONSTRAINT fk_usuario_up FOREIGN KEY (id_usuario)
REFERENCES usuario(id);

ALTER TABLE usuario_partida
ADD CONSTRAINT fk_partida_up FOREIGN KEY (id_partida)
REFERENCES partida(id);

ALTER TABLE tentativa
ADD CONSTRAINT fk_alternativa_tentaiva FOREIGN KEY (id_alternativa)
REFERENCES alternativa(id);

ALTER TABLE tentativa
ADD CONSTRAINT fk_rodada_tentativa FOREIGN KEY (id_rodada)
REFERENCES rodada(id);

ALTER TABLE tentativa
ADD CONSTRAINT fk_usuario_tentativa FOREIGN KEY (id_usuario)
REFERENCES usuario(id);
