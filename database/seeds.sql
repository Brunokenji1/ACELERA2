
-- Tipo_nivel -- 
INSERT INTO tipo_nivel (nome) VALUES
	('ENSINO MEDIO'),
	('VESTIBULAR');
	
-- Fonte --
INSERT INTO fontes (id_tipo_nivel, nome) VALUES
	('2', 'ENEM');

-- Matérias iniciais
INSERT INTO materias (nome) VALUES
    ('Matematica'),
    ('Portugues'),
    ('Historia'),
    ('Geografia'),
    ('Fisica'),
    ('Quimica'),
    ('Biologia'),
    ('Filosofia'),
    ('Sociologia'),
    ('Ingles'),
    ('Literatura'),
    ('Redacao');

INSERT INTO usuarios
    (nome, data_nascimento, email, cpf, telefone, senha_hash)
VALUES
    ('Alex', NOW()::DATE, 'a@gmail.com', '11111111111', '111111111', '1')
